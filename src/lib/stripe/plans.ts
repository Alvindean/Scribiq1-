export interface Plan {
  id: "starter" | "pro" | "agency" | "enterprise";
  name: string;
  price: number;
  priceId: string;
  features: string[];
  limits: {
    projects: number;
    renders_per_month: number;
    ai_generations_per_month: number;
    storage_gb: number;
    team_members: number;
  };
}

export const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    price: 49,
    priceId: process.env.STRIPE_STARTER_PRICE_ID ?? "",
    features: [
      "3 projects",
      "10 video renders/month",
      "50 AI generations/month",
      "5 GB storage",
      "1 team member",
      "Course portal",
      "Email support",
    ],
    limits: {
      projects: 3,
      renders_per_month: 10,
      ai_generations_per_month: 50,
      storage_gb: 5,
      team_members: 1,
    },
  },
  {
    id: "pro",
    name: "Pro",
    price: 149,
    priceId: process.env.STRIPE_PRO_PRICE_ID ?? "",
    features: [
      "25 projects",
      "100 video renders/month",
      "500 AI generations/month",
      "50 GB storage",
      "5 team members",
      "VSL builder",
      "Custom domain",
      "Priority support",
    ],
    limits: {
      projects: 25,
      renders_per_month: 100,
      ai_generations_per_month: 500,
      storage_gb: 50,
      team_members: 5,
    },
  },
  {
    id: "agency",
    name: "Agency",
    price: 399,
    priceId: process.env.STRIPE_AGENCY_PRICE_ID ?? "",
    features: [
      "Unlimited projects",
      "500 video renders/month",
      "2000 AI generations/month",
      "200 GB storage",
      "25 team members",
      "White-label",
      "Client portals",
      "Dedicated support",
    ],
    limits: {
      projects: -1,
      renders_per_month: 500,
      ai_generations_per_month: 2000,
      storage_gb: 200,
      team_members: 25,
    },
  },
];

export function getPlan(planId: string): Plan | undefined {
  return PLANS.find((p) => p.id === planId);
}

export function canPerformAction(
  plan: Plan,
  action: keyof Plan["limits"],
  currentUsage: number
): boolean {
  const limit = plan.limits[action];
  if (limit === -1) return true;
  return currentUsage < limit;
}
