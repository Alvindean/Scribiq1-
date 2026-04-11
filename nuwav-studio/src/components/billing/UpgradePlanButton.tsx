"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  priceId: string;
  planName: string;
  isCurrent: boolean;
}

export function UpgradePlanButton({ priceId, planName, isCurrent }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUpgrade() {
    if (isCurrent || loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/billing/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        throw new Error(data.error ?? "Could not start checkout");
      }
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <Button
        onClick={handleUpgrade}
        disabled={isCurrent || loading}
        variant={isCurrent ? "outline" : "default"}
        className="w-full"
      >
        {loading
          ? "Redirecting…"
          : isCurrent
          ? "Current Plan"
          : `Upgrade to ${planName}`}
      </Button>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
