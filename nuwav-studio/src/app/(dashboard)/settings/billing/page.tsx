import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { profiles, organizations, projects } from "@/lib/db/schema";
import { eq, count } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PLANS } from "@/lib/stripe/plans";
import type { Plan } from "@/lib/stripe/plans";
import { ManageSubscriptionButton } from "@/components/billing/ManageSubscriptionButton";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function statusVariant(
  status: string | null
): "default" | "secondary" | "destructive" | "outline" {
  if (!status || status === "active" || status === "trialing") return "default";
  if (status === "past_due" || status === "unpaid") return "destructive";
  if (status === "canceled" || status === "incomplete_expired") return "secondary";
  return "outline";
}

function statusLabel(status: string | null, plan: string): string {
  if (plan === "starter" && !status) return "Free";
  if (!status) return "—";
  return status.replace(/_/g, " ");
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso));
}

// ─── Plan card ────────────────────────────────────────────────────────────────

function PlanCard({
  plan,
  currentPlanId,
}: {
  plan: Plan;
  currentPlanId: string;
}) {
  const isCurrent = plan.id === currentPlanId;

  return (
    <Card
      className={`flex flex-col ${
        isCurrent ? "border-primary ring-2 ring-primary/30" : ""
      }`}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{plan.name}</CardTitle>
          {isCurrent && (
            <Badge variant="default" className="text-xs">
              Current
            </Badge>
          )}
        </div>
        <div className="mt-2">
          <span className="text-3xl font-bold">${plan.price}</span>
          <span className="text-muted-foreground text-sm">/month</span>
        </div>
        <CardDescription className="mt-1">
          {plan.limits.projects === -1
            ? "Unlimited projects"
            : `Up to ${plan.limits.projects} projects`}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-between gap-6">
        <ul className="space-y-2">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-sm">
              <span className="text-primary">✓</span>
              {feature}
            </li>
          ))}
        </ul>
        <form action="/api/stripe/checkout" method="POST">
          <input type="hidden" name="priceId" value={plan.priceId} />
          <input type="hidden" name="planId" value={plan.id} />
          <Button
            type="submit"
            className="w-full"
            variant={isCurrent ? "outline" : "default"}
            disabled={isCurrent}
          >
            {isCurrent ? "Current Plan" : `Upgrade to ${plan.name}`}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function BillingPage() {
  const session = await auth();
  const userId = session?.user?.id;

  let org: {
    id: string;
    plan: string;
    subscriptionStatus: string | null;
    stripeCustomerId: string | null;
    stripeSubscriptionId: string | null;
  } | null = null;
  let projectCount = 0;

  if (userId) {
    const [profile] = await db
      .select({ orgId: profiles.orgId })
      .from(profiles)
      .where(eq(profiles.id, userId))
      .limit(1);

    if (profile?.orgId) {
      const [orgData] = await db
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

      if (orgData) {
        org = {
          ...orgData,
          subscriptionStatus: orgData.subscriptionStatus ?? null,
          stripeCustomerId: orgData.stripeCustomerId ?? null,
          stripeSubscriptionId: orgData.stripeSubscriptionId ?? null,
        };

        const [countResult] = await db
          .select({ value: count() })
          .from(projects)
          .where(eq(projects.orgId, orgData.id));

        projectCount = countResult?.value ?? 0;
      }
    }
  }

  const currentPlanId = org?.plan ?? "starter";
  const currentPlan = PLANS.find((p) => p.id === currentPlanId) ?? PLANS[0];
  const isPaidPlan = currentPlanId !== "starter";

  const usagePercent =
    currentPlan.limits.projects === -1
      ? 0
      : Math.min(
          100,
          Math.round((projectCount / currentPlan.limits.projects) * 100)
        );

  // Fetch renewal date from Stripe if available (best-effort, non-blocking)
  let renewalDate: string | null = null;
  if (org?.stripeSubscriptionId) {
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

  const usageRows: { label: string; used: number | string; limit: string | number }[] = [
    {
      label: "Projects",
      used: projectCount,
      limit:
        currentPlan.limits.projects === -1 ? "∞" : currentPlan.limits.projects,
    },
    {
      label: "Renders / mo",
      used: 0,
      limit: currentPlan.limits.renders_per_month,
    },
    {
      label: "AI Generations / mo",
      used: 0,
      limit: currentPlan.limits.ai_generations_per_month,
    },
    {
      label: "Storage",
      used: "0 GB",
      limit: `${currentPlan.limits.storage_gb} GB`,
    },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Billing</h1>
        <p className="text-muted-foreground mt-1">
          Manage your subscription and usage.
        </p>
      </div>

      {/* ── 1. Current Plan card ─────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle className="text-base">Current Plan</CardTitle>
            <div className="flex items-center gap-2">
              <Badge className="capitalize text-sm px-3">{currentPlan.name}</Badge>
              <Badge
                variant={statusVariant(org?.subscriptionStatus ?? null)}
                className="capitalize text-xs"
              >
                {statusLabel(org?.subscriptionStatus ?? null, currentPlanId)}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Plan meta row */}
          <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-sm">
            <div>
              <span className="text-muted-foreground">Price: </span>
              <span className="font-medium">${currentPlan.price}/mo</span>
            </div>
            {renewalDate && (
              <div>
                <span className="text-muted-foreground">Next renewal: </span>
                <span className="font-medium">{formatDate(renewalDate)}</span>
              </div>
            )}
            {!renewalDate && isPaidPlan && (
              <div>
                <span className="text-muted-foreground">Renewal date: </span>
                <span className="font-medium text-muted-foreground">—</span>
              </div>
            )}
          </div>

          {/* Upgrade / Manage button */}
          <ManageSubscriptionButton isPaidPlan={isPaidPlan} upgradeHref="#plans" />
        </CardContent>
      </Card>

      {/* ── 2. Usage card ────────────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Usage</CardTitle>
          <CardDescription>
            Your current usage for this billing period.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {usageRows.map(({ label, used, limit }) => (
              <div key={label} className="space-y-1">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-base font-semibold">
                  {used}{" "}
                  <span className="text-muted-foreground font-normal text-sm">
                    / {limit}
                  </span>
                </p>
              </div>
            ))}
          </div>

          {/* Project usage bar */}
          {currentPlan.limits.projects !== -1 && (
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Projects used</span>
                <span>{usagePercent}%</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${usagePercent}%` }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── 3. Plan upgrade cards ─────────────────────────────────────────── */}
      <div id="plans">
        <h2 className="text-xl font-semibold mb-6">
          {isPaidPlan ? "Available Plans" : "Upgrade your plan"}
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {PLANS.map((plan) => (
            <PlanCard key={plan.id} plan={plan} currentPlanId={currentPlanId} />
          ))}
        </div>
      </div>

      {/* ── 4. Invoice history ───────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Invoice History</CardTitle>
          <CardDescription>Past invoices and payment receipts.</CardDescription>
        </CardHeader>
        <CardContent>
          {isPaidPlan ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              Invoice history will appear here once your first billing cycle completes.
            </p>
          ) : (
            <p className="text-sm text-muted-foreground py-4 text-center">
              Invoice history will appear here after you upgrade to a paid plan.
            </p>
          )}
        </CardContent>
      </Card>

      {/* ── Enterprise / custom ──────────────────────────────────────────── */}
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center gap-4 py-8 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <p className="font-semibold">Need something bigger?</p>
            <p className="text-sm text-muted-foreground mt-0.5">
              Custom enterprise plans with SSO, dedicated support, and SLA
              guarantees. Contact us to discuss your requirements.
            </p>
          </div>
          <Button variant="outline" className="shrink-0" asChild>
            <a href="mailto:support@nuwavstudio.com">Contact Sales</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
