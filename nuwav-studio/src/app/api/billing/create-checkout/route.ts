import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { profiles, organizations } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getStripe } from "@/lib/stripe/client";

export async function POST(request: NextRequest): Promise<Response> {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let priceId: string | null = null;
  try {
    const body = (await request.json()) as { priceId?: string };
    priceId = body.priceId ?? null;
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!priceId) {
    return Response.json({ error: "priceId is required" }, { status: 400 });
  }

  const [profile] = await db
    .select({ orgId: profiles.orgId })
    .from(profiles)
    .where(eq(profiles.id, session.user.id))
    .limit(1);

  if (!profile?.orgId) {
    return Response.json({ error: "Organization not found" }, { status: 404 });
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
    return Response.json({ error: "Organization not found" }, { status: 404 });
  }

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.APP_URL ??
    "http://localhost:3000";

  try {
    const stripe = getStripe();

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: session.user.email ?? undefined,
      customer: org.stripeCustomerId ?? undefined,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/settings/billing?success=true`,
      cancel_url: `${appUrl}/settings/billing`,
      metadata: { orgId: org.id },
    });

    return Response.json({ url: checkoutSession.url });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to create checkout session";
    console.error("Stripe create-checkout error:", message);
    return Response.json({ error: message }, { status: 500 });
  }
}
