import { NextRequest } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe/client";
import { createAdminClient } from "@/lib/supabase/admin";

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

function mapStatusToPlan(status: SubscriptionStatus, priceId: string | null): DbPlan {
  // Active subscriptions map by price ID; fallback to starter
  if (status !== "active" && status !== "trialing") return "starter";
  if (priceId === process.env.STRIPE_AGENCY_PRICE_ID) return "agency";
  if (priceId === process.env.STRIPE_PRO_PRICE_ID) return "pro";
  return "starter";
}

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
    const supabase = createAdminClient();

    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId =
          typeof subscription.customer === "string"
            ? subscription.customer
            : subscription.customer.id;

        const priceId = subscription.items.data[0]?.price?.id ?? null;
        const plan = mapStatusToPlan(
          subscription.status as SubscriptionStatus,
          priceId
        );

        await supabase
          .from("organizations")
          .update({
            plan,
            stripe_customer_id: customerId,
          })
          .eq("stripe_customer_id", customerId);

        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId =
          typeof subscription.customer === "string"
            ? subscription.customer
            : subscription.customer.id;

        await supabase
          .from("organizations")
          .update({ plan: "starter" })
          .eq("stripe_customer_id", customerId);

        break;
      }

      default:
        // Unhandled event — return 200 so Stripe doesn't retry
        break;
    }

    return Response.json({ received: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    console.error("Stripe webhook handler error:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
