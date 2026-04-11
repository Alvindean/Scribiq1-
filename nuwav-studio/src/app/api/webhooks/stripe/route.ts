import { NextRequest } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe/client";
import { db } from "@/lib/db";
import { organizations } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

type SubscriptionStatus =
  | "active"
  | "trialing"
  | "past_due"
  | "canceled"
  | "incomplete"
  | "incomplete_expired"
  | "paused"
  | "unpaid";

type DbPlan = "starter" | "pro" | "agency" | "enterprise";

function mapPriceIdToPlan(priceId: string | null): DbPlan {
  if (priceId === process.env.STRIPE_AGENCY_PRICE_ID) return "agency";
  if (priceId === process.env.STRIPE_PRO_PRICE_ID) return "pro";
  if (priceId === process.env.STRIPE_STARTER_PRICE_ID) return "starter";
  return "starter";
}

function mapStatusToPlan(status: SubscriptionStatus, priceId: string | null): DbPlan {
  if (status !== "active" && status !== "trialing") return "starter";
  return mapPriceIdToPlan(priceId);
}

// Disable Next.js body parsing — Stripe requires the raw body for signature verification
export const config = {
  api: { bodyParser: false },
};

export async function POST(request: NextRequest): Promise<Response> {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not set");
    return new Response("Webhook secret not configured", { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return new Response("Missing stripe-signature header", { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const rawBody = await request.text();
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Stripe webhook signature verification failed:", message);
    return new Response(`Webhook Error: ${message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      // ------------------------------------------------------------------ //
      // checkout.session.completed
      // Link stripeCustomerId to the org, activate subscription, set plan.
      // The session metadata must contain { orgId } set during checkout creation.
      // ------------------------------------------------------------------ //
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        const customerId =
          typeof session.customer === "string"
            ? session.customer
            : session.customer?.id ?? null;

        const subscriptionId =
          typeof session.subscription === "string"
            ? session.subscription
            : session.subscription?.id ?? null;

        const orgId = session.metadata?.orgId ?? null;

        if (!customerId) {
          console.warn("checkout.session.completed: no customerId on session", session.id);
          break;
        }

        // Retrieve the subscription to get the price and status
        let priceId: string | null = null;
        let status: SubscriptionStatus = "active";

        if (subscriptionId) {
          try {
            const subscription = await stripe.subscriptions.retrieve(subscriptionId);
            priceId = subscription.items.data[0]?.price?.id ?? null;
            status = subscription.status as SubscriptionStatus;
          } catch (err) {
            console.error("Failed to retrieve subscription during checkout.session.completed:", err);
          }
        }

        const plan = mapStatusToPlan(status, priceId);

        // Update by orgId when available (most reliable), otherwise fall back
        // to matching by stripeCustomerId for repeat purchases.
        if (orgId) {
          await db
            .update(organizations)
            .set({
              stripeCustomerId: customerId,
              stripeSubscriptionId: subscriptionId,
              stripePriceId: priceId,
              subscriptionStatus: status,
              plan,
              updatedAt: new Date(),
            })
            .where(eq(organizations.id, orgId));
        } else {
          // Fallback: match by customerId (handles re-subscriptions)
          await db
            .update(organizations)
            .set({
              stripeSubscriptionId: subscriptionId,
              stripePriceId: priceId,
              subscriptionStatus: status,
              plan,
              updatedAt: new Date(),
            })
            .where(eq(organizations.stripeCustomerId, customerId));
        }

        console.log(`checkout.session.completed: org=${orgId ?? "(by customerId)"} plan=${plan}`);
        break;
      }

      // ------------------------------------------------------------------ //
      // customer.subscription.updated
      // Update plan tier and subscription status.
      // ------------------------------------------------------------------ //
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId =
          typeof subscription.customer === "string"
            ? subscription.customer
            : subscription.customer.id;

        const priceId = subscription.items.data[0]?.price?.id ?? null;
        const status = subscription.status as SubscriptionStatus;
        const plan = mapStatusToPlan(status, priceId);

        await db
          .update(organizations)
          .set({
            stripeSubscriptionId: subscription.id,
            stripePriceId: priceId,
            subscriptionStatus: status,
            plan,
            updatedAt: new Date(),
          })
          .where(eq(organizations.stripeCustomerId, customerId));

        console.log(`customer.subscription.updated: customer=${customerId} plan=${plan} status=${status}`);
        break;
      }

      // ------------------------------------------------------------------ //
      // customer.subscription.deleted
      // Downgrade to free/starter plan and mark as canceled.
      // ------------------------------------------------------------------ //
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId =
          typeof subscription.customer === "string"
            ? subscription.customer
            : subscription.customer.id;

        await db
          .update(organizations)
          .set({
            stripeSubscriptionId: null,
            stripePriceId: null,
            subscriptionStatus: "canceled",
            plan: "starter",
            updatedAt: new Date(),
          })
          .where(eq(organizations.stripeCustomerId, customerId));

        console.log(`customer.subscription.deleted: customer=${customerId} downgraded to starter`);
        break;
      }

      // ------------------------------------------------------------------ //
      // invoice.payment_failed
      // Mark subscription as past_due.
      // ------------------------------------------------------------------ //
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId =
          typeof invoice.customer === "string"
            ? invoice.customer
            : invoice.customer?.id ?? null;

        if (!customerId) {
          console.warn("invoice.payment_failed: no customerId on invoice", invoice.id);
          break;
        }

        await db
          .update(organizations)
          .set({
            subscriptionStatus: "past_due",
            updatedAt: new Date(),
          })
          .where(eq(organizations.stripeCustomerId, customerId));

        console.log(`invoice.payment_failed: customer=${customerId} marked past_due`);
        break;
      }

      default:
        // Return 200 for all unhandled events to prevent Stripe from retrying
        console.log(`Unhandled Stripe event type: ${event.type}`);
        break;
    }

    return Response.json({ received: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    console.error("Stripe webhook handler error:", message, err);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
