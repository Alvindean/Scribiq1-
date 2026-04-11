import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { profiles, organizations } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getStripe } from "@/lib/stripe/client";
import { PLANS } from "@/lib/stripe/plans";

export async function POST(request: NextRequest): Promise<Response> {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Support both form submissions (application/x-www-form-urlencoded) and JSON
  const contentType = request.headers.get("content-type") ?? "";
  let priceId: string | null = null;
  let planId: string | null = null;

  if (contentType.includes("application/x-www-form-urlencoded")) {
    const text = await request.text();
    const params = new URLSearchParams(text);
    priceId = params.get("priceId");
    planId = params.get("planId");
  } else {
    const body = (await request.json()) as { priceId?: string; planId?: string };
    priceId = body.priceId ?? null;
    planId = body.planId ?? null;
  }

  if (!priceId || !planId) {
    return new Response(JSON.stringify({ error: "priceId and planId are required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Validate planId is a known plan
  const plan = PLANS.find((p) => p.id === planId);
  if (!plan) {
    return new Response(JSON.stringify({ error: "Unknown plan" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const [profile] = await db
    .select({ orgId: profiles.orgId })
    .from(profiles)
    .where(eq(profiles.id, session.user.id))
    .limit(1);

  if (!profile?.orgId) {
    return new Response(JSON.stringify({ error: "Organization not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  const [org] = await db
    .select({
      id: organizations.id,
      stripeCustomerId: organizations.stripeCustomerId,
    })
    .from(organizations)
    .where(eq(organizations.id, profile.orgId))
    .limit(1);

  if (!org) {
    return new Response(JSON.stringify({ error: "Organization not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.APP_URL ??
    "http://localhost:3000";

  try {
    const stripe = getStripe();

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      ...(org.stripeCustomerId ? { customer: org.stripeCustomerId } : {}),
      metadata: { orgId: org.id },
      success_url: `${appUrl}/settings/billing?checkout=success`,
      cancel_url: `${appUrl}/settings/billing?checkout=canceled`,
    });

    // For form POSTs (no JS), redirect directly to Stripe checkout
    if (contentType.includes("application/x-www-form-urlencoded")) {
      return new Response(null, {
        status: 303,
        headers: { Location: checkoutSession.url ?? `${appUrl}/settings/billing` },
      });
    }

    return Response.json({ url: checkoutSession.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create checkout session";
    console.error("Stripe checkout error:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
