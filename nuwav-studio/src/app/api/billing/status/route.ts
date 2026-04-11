import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { profiles, organizations, projects } from "@/lib/db/schema";
import { eq, count } from "drizzle-orm";
import { PLANS } from "@/lib/stripe/plans";

export async function GET(): Promise<Response> {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const [profile] = await db
    .select({ orgId: profiles.orgId })
    .from(profiles)
    .where(eq(profiles.id, session.user.id))
    .limit(1);

  if (!profile?.orgId) {
    return Response.json({
      plan: "starter",
      planName: "Starter",
      status: null,
      renewalDate: null,
      projectCount: 0,
      projectLimit: PLANS[0].limits.projects,
      stripeCustomerId: null,
      stripeSubscriptionId: null,
    });
  }

  const [org] = await db
    .select({
      id: organizations.id,
      plan: organizations.plan,
      subscriptionStatus: organizations.subscriptionStatus,
      stripeCustomerId: organizations.stripeCustomerId,
      stripeSubscriptionId: organizations.stripeSubscriptionId,
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

  const [countResult] = await db
    .select({ value: count() })
    .from(projects)
    .where(eq(projects.orgId, org.id));

  const projectCount = countResult?.value ?? 0;
  const planDef = PLANS.find((p) => p.id === org.plan) ?? PLANS[0];

  // Fetch renewal date from Stripe if we have a subscription ID
  let renewalDate: string | null = null;
  if (org.stripeSubscriptionId) {
    try {
      const { getStripe } = await import("@/lib/stripe/client");
      const stripe = getStripe();
      const sub = await stripe.subscriptions.retrieve(org.stripeSubscriptionId);
      if (sub.current_period_end) {
        renewalDate = new Date(sub.current_period_end * 1000).toISOString();
      }
    } catch {
      // Non-fatal: Stripe may not be configured in all environments
    }
  }

  return Response.json({
    plan: org.plan,
    planName: planDef.name,
    planPrice: planDef.price,
    status: org.subscriptionStatus ?? null,
    renewalDate,
    projectCount,
    projectLimit: planDef.limits.projects,
    limits: planDef.limits,
    stripeCustomerId: org.stripeCustomerId ?? null,
    stripeSubscriptionId: org.stripeSubscriptionId ?? null,
  });
}
