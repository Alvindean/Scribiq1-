"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/shared/Logo";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        router.push("/login?reset=1");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [success, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (password.length > 128) {
      setError("Password must be 128 characters or fewer");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = (await res.json()) as { message?: string; error?: string };

      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      setSuccess(true);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <div className="flex items-start gap-2 text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2 transition-all duration-300">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>
            Invalid or missing reset token. Please request a new{" "}
            <Link href="/forgot-password" className="font-medium underline">
              password reset link
            </Link>
            .
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      {success ? (
        <div className="flex items-center gap-2 text-sm text-green-600 bg-green-500/10 rounded-md px-3 py-2 transition-all duration-300">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>Password updated! Redirecting...</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">New password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => { setError(null); setPassword(e.target.value); }}
              required
              autoComplete="new-password"
              maxLength={128}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => { setError(null); setConfirmPassword(e.target.value); }}
              required
              autoComplete="new-password"
              maxLength={128}
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2 transition-all duration-300">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-violet-600 hover:bg-violet-700"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Password"
            )}
          </Button>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-4">
          <Logo size="lg" />
          <div className="text-center">
            <h1 className="text-2xl font-bold">Set a new password</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Choose a strong password for your account
            </p>
          </div>
        </div>

        <Suspense
          fallback={
            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <p className="text-sm text-center text-muted-foreground py-2">
                Loading...
              </p>
            </div>
          }
        >
          <ResetPasswordForm />
        </Suspense>

        <p className="text-center text-sm text-muted-foreground">
          Remember your password?{" "}
          <Link href="/login" className="font-medium text-violet-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
