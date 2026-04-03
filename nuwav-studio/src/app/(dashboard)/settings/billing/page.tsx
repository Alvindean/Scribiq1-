import { createClient } from "@/lib/supabase/server";
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
import type { Organization } from "@/types/project";

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
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let org: Organization | null = null;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("org_id")
      .eq("id", user.id)
      .single();

    if (profile?.org_id) {
      const { data: orgData } = await supabase
        .from("organizations")
        .select("*")
        .eq("id", profile.org_id)
        .single();
      org = (orgData as Organization) ?? null;
    }
  }

  const currentPlanId = org?.plan ?? "starter";
  const currentPlan = PLANS.find((p) => p.id === currentPlanId) ?? PLANS[0];

  const { count: projectCount } = org
    ? await supabase
        .from("projects")
        .select("id", { count: "exact", head: true })
        .eq("org_id", org.id)
    : { count: 0 };

  const usagePercent =
    currentPlan.limits.projects === -1
      ? 0
      : Math.min(
          100,
          Math.round(((projectCount ?? 0) / currentPlan.limits.projects) * 100)
        );

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Billing</h1>
        <p className="text-muted-foreground mt-1">
          Manage your subscription and usage.
        </p>
      </div>

      {/* Current plan summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Current Plan</CardTitle>
            <Badge className="capitalize">{currentPlanId}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {(
              [
                {
                  label: "Projects",
                  used: projectCount ?? 0,
                  limit:
                    currentPlan.limits.projects === -1
                      ? "∞"
                      : currentPlan.limits.projects,
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
                  used: 0,
                  limit: `${currentPlan.limits.storage_gb} GB`,
                },
              ] as { label: string; used: number; limit: string | number }[]
            ).map(({ label, used, limit }) => (
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

      {/* Plan cards */}
      <div>
        <h2 className="text-xl font-semibold mb-6">Upgrade your plan</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {PLANS.map((plan) => (
            <PlanCard key={plan.id} plan={plan} currentPlanId={currentPlanId} />
          ))}
        </div>
      </div>

      {/* Enterprise / custom */}
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
