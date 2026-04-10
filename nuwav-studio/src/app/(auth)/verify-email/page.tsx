"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/Logo";

const COOLDOWN_SECONDS = 60;

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [status, setStatus] = useState<"idle" | "sent" | "sending">("idle");
  const [cooldown, setCooldown] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Clear interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  function startCooldown() {
    setCooldown(COOLDOWN_SECONDS);
    intervalRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          if (intervalRef.current !== null) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  async function handleResend() {
    if (cooldown > 0 || status === "sending") return;

    setStatus("sending");
    try {
      await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch {
      // Silently ignore — we always show "Sent!" regardless
    }

    setStatus("sent");
    startCooldown();

    // Reset "Sent!" label back to normal after 3s
    setTimeout(() => {
      setStatus("idle");
    }, 3000);
  }

  const buttonDisabled = cooldown > 0 || status === "sending";
  const buttonLabel =
    status === "sending"
      ? "Sending..."
      : status === "sent"
        ? "Sent!"
        : cooldown > 0
          ? `Resend in ${cooldown}s`
          : "Resend verification email";

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-4">
          <Logo size="lg" />
          <div className="text-center">
            <h1 className="text-2xl font-bold">Verify your email</h1>
            <p className="text-sm text-muted-foreground mt-1">
              We sent a verification link to{" "}
              {email ? (
                <span className="font-medium text-foreground">{email}</span>
              ) : (
                "your email address"
              )}
            </p>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
          <p className="text-sm text-muted-foreground">
            Click the link in the email to activate your account. If you
            don&apos;t see it, check your spam folder.
          </p>

          <Button
            type="button"
            className="w-full bg-violet-600 hover:bg-violet-700"
            disabled={buttonDisabled}
            onClick={handleResend}
          >
            {buttonLabel}
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          <Link href="/login" className="font-medium text-violet-600 hover:underline">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}
