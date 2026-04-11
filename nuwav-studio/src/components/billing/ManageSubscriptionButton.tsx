"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  isPaidPlan: boolean;
  upgradeHref?: string;
}

export function ManageSubscriptionButton({ isPaidPlan, upgradeHref = "/settings/billing" }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleManage() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/billing/portal", { method: "POST" });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        throw new Error(data.error ?? "Could not open billing portal");
      }
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  if (!isPaidPlan) {
    return (
      <a href={upgradeHref}>
        <Button>Upgrade to Pro</Button>
      </a>
    );
  }

  return (
    <div className="space-y-2">
      <Button onClick={handleManage} disabled={loading} variant="outline">
        {loading ? "Opening portal…" : "Manage Subscription"}
      </Button>
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}
