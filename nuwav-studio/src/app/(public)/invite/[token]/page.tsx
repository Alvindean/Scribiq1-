"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface InviteInfo {
  email: string;
  orgName: string;
  role: string;
  isNewUser: boolean;
  expired?: boolean;
  accepted?: boolean;
  invalid?: boolean;
}

export default function AcceptInvitePage() {
  const params = useParams<{ token: string }>();
  const router = useRouter();
  const token = params.token ?? "";

  const [info, setInfo] = useState<InviteInfo | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!token) return;

    const load = async () => {
      try {
        const res = await fetch(`/api/team/invite-info?token=${encodeURIComponent(token)}`);
        const data = (await res.json()) as InviteInfo & { error?: string };

        if (!res.ok) {
          setLoadError(data.error ?? "Failed to load invitation");
          return;
        }

        setInfo(data);
        if (data.email) setName(data.email.split("@")[0]);
      } catch {
        setLoadError("Failed to load invitation details");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [token]);

  async function handleAccept(e: React.FormEvent) {
    e.preventDefault();
    if (!info) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/team/accept-invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          name: name.trim() || undefined,
          password: info.isNewUser ? password : undefined,
        }),
      });

      const data = (await res.json()) as { success?: boolean; error?: string };

      if (!res.ok) {
        setSubmitError(data.error ?? "Failed to accept invitation");
        return;
      }

      setDone(true);
      // Redirect to login after short delay
      setTimeout(() => router.push("/login"), 2000);
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-600 border-t-transparent" />
      </div>
    );
  }

  if (loadError || !info) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Invalid Invitation</CardTitle>
            <CardDescription className="text-destructive">
              {loadError ?? "This invitation link is not valid."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/login">
              <Button variant="outline" className="w-full">
                Go to Sign In
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (info.expired) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Invitation Expired</CardTitle>
            <CardDescription>
              This invitation has expired. Please ask your team admin to send a
              new invitation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/login">
              <Button variant="outline" className="w-full">
                Go to Sign In
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (info.accepted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Already Accepted</CardTitle>
            <CardDescription>
              This invitation has already been accepted.{" "}
              <Link href="/login" className="text-violet-600 hover:underline">
                Sign in
              </Link>{" "}
              to access your account.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Welcome aboard!</CardTitle>
            <CardDescription>
              You&apos;ve joined <strong>{info.orgName}</strong>. Redirecting to
              sign in&hellip;
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-sm space-y-6">
        {/* Header */}
        <div className="text-center space-y-1">
          <div className="text-xl font-bold text-violet-600 tracking-tight">
            NuWav Studio
          </div>
          <h1 className="text-2xl font-bold">You&apos;ve been invited</h1>
          <p className="text-sm text-muted-foreground">
            Join <strong>{info.orgName}</strong> as a{" "}
            <span className="capitalize">{info.role}</span>
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Accept Invitation</CardTitle>
            <CardDescription>
              {info.isNewUser
                ? "Create your account to join the team."
                : "Confirm your details to join the team."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAccept} className="space-y-4">
              {/* Pre-filled email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={info.email}
                  readOnly
                  disabled
                  className="bg-muted cursor-not-allowed"
                />
              </div>

              {/* Name — shown for new users */}
              {info.isNewUser && (
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                  />
                </div>
              )}

              {/* Password — only required for new users */}
              {info.isNewUser && (
                <div className="space-y-2">
                  <Label htmlFor="password">Create Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="At least 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    autoComplete="new-password"
                  />
                </div>
              )}

              {submitError && (
                <p className="rounded-md bg-destructive/10 px-4 py-2 text-sm text-destructive">
                  {submitError}
                </p>
              )}

              <Button
                type="submit"
                className="w-full bg-violet-600 hover:bg-violet-700"
                disabled={submitting}
              >
                {submitting ? "Accepting…" : "Accept Invitation"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-violet-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
