"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Member {
  id: string;
  email: string;
  name: string | null;
  role: string;
  avatarUrl: string | null;
  createdAt: string | null;
}

interface PendingInvite {
  id: string;
  email: string;
  role: string;
  expiresAt: string;
  createdAt: string | null;
}

interface TeamData {
  members: Member[];
  pendingInvitations: PendingInvite[];
  orgName: string | null;
  currentUserId: string;
  currentUserRole: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function roleBadgeVariant(role: string): "default" | "secondary" | "outline" {
  if (role === "owner") return "default";
  if (role === "admin") return "secondary";
  return "outline";
}

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function Avatar({
  name,
  email,
  avatarUrl,
}: {
  name: string | null;
  email: string;
  avatarUrl: string | null;
}) {
  const initials = (name || email).charAt(0).toUpperCase();
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name ?? email}
        className="h-9 w-9 rounded-full object-cover shrink-0"
      />
    );
  }
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-600/20 text-sm font-semibold text-violet-400">
      {initials}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TeamSettingsPage() {
  const [data, setData] = useState<TeamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);

  // Invite form state
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"member" | "admin">("member");
  const [inviting, setInviting] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [inviteSuccess, setInviteSuccess] = useState<string | null>(null);

  // Cancel state
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      const res = await fetch("/api/team/members");
      if (!res.ok) {
        const d = (await res.json()) as { error?: string };
        setPageError(d.error ?? "Failed to load team data");
        return;
      }
      const d = (await res.json()) as TeamData;
      setData(d);
    } catch {
      setPageError("Failed to load team data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    setInviteError(null);
    setInviteSuccess(null);
    setInviting(true);

    try {
      const res = await fetch("/api/team/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: inviteEmail.trim().toLowerCase(),
          role: inviteRole,
        }),
      });

      const d = (await res.json()) as { success?: boolean; error?: string };

      if (!res.ok) {
        setInviteError(d.error ?? "Failed to send invitation");
        return;
      }

      setInviteSuccess(`Invitation sent to ${inviteEmail}`);
      setInviteEmail("");
      setInviteRole("member");
      await loadData();
    } catch {
      setInviteError("Something went wrong. Please try again.");
    } finally {
      setInviting(false);
    }
  }

  async function handleCancel(inviteId: string) {
    setCancellingId(inviteId);
    try {
      const res = await fetch(`/api/team/invite/${inviteId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const d = (await res.json()) as { error?: string };
        alert(d.error ?? "Failed to cancel invitation");
        return;
      }

      await loadData();
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setCancellingId(null);
    }
  }

  // ─── Loading ────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="flex items-center justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-600 border-t-transparent" />
        </div>
      </div>
    );
  }

  if (pageError) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <p className="text-sm text-destructive">{pageError}</p>
      </div>
    );
  }

  if (!data) return null;

  const isAdmin =
    data.currentUserRole === "admin" || data.currentUserRole === "owner";

  // Non-admins: read-only view
  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Team</h1>
          <p className="text-muted-foreground mt-1">
            Members of{" "}
            <span className="text-foreground font-medium">
              {data.orgName ?? "your organization"}
            </span>
          </p>
        </div>
        <MemberList
          members={data.members}
          currentUserId={data.currentUserId}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Team</h1>
        <p className="text-muted-foreground mt-1">
          Manage members of{" "}
          <span className="text-foreground font-medium">
            {data.orgName ?? "your organization"}
          </span>
        </p>
      </div>

      {/* Invite form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Invite a Teammate</CardTitle>
          <CardDescription>
            They will receive an email with a 7-day invitation link.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleInvite} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 space-y-2">
                <Label htmlFor="invite-email">Email address</Label>
                <Input
                  id="invite-email"
                  type="email"
                  placeholder="teammate@example.com"
                  value={inviteEmail}
                  onChange={(e) => {
                    setInviteEmail(e.target.value);
                    if (inviteError) setInviteError(null);
                    if (inviteSuccess) setInviteSuccess(null);
                  }}
                  required
                  autoComplete="off"
                />
              </div>

              <div className="w-full sm:w-36 space-y-2">
                <Label htmlFor="invite-role">Role</Label>
                <Select
                  value={inviteRole}
                  onValueChange={(v) =>
                    setInviteRole(v as "member" | "admin")
                  }
                >
                  <SelectTrigger id="invite-role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {inviteError && (
              <p className="rounded-md bg-destructive/10 px-4 py-2 text-sm text-destructive">
                {inviteError}
              </p>
            )}
            {inviteSuccess && (
              <p className="rounded-md bg-violet-600/10 px-4 py-2 text-sm text-violet-400">
                {inviteSuccess}
              </p>
            )}

            <Button
              type="submit"
              className="bg-violet-600 hover:bg-violet-700"
              disabled={inviting}
            >
              {inviting ? "Sending…" : "Send Invite"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Current members */}
      <MemberList members={data.members} currentUserId={data.currentUserId} />

      {/* Pending invitations */}
      {data.pendingInvitations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pending Invitations</CardTitle>
            <CardDescription>
              These invitations have been sent but not yet accepted.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-border">
              {data.pendingInvitations.map((inv) => (
                <li
                  key={inv.id}
                  className="flex items-center justify-between gap-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{inv.email}</p>
                    <p className="text-xs text-muted-foreground">
                      Invited {formatDate(inv.createdAt)} &middot; expires{" "}
                      {formatDate(inv.expiresAt)}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <Badge
                      variant={roleBadgeVariant(inv.role)}
                      className="capitalize"
                    >
                      {inv.role}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-destructive"
                      disabled={cancellingId === inv.id}
                      onClick={() => handleCancel(inv.id)}
                    >
                      {cancellingId === inv.id ? "Cancelling…" : "Cancel"}
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ─── Member list sub-component ────────────────────────────────────────────────

function MemberList({
  members,
  currentUserId,
}: {
  members: Member[];
  currentUserId: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          Team Members{" "}
          <span className="ml-1 text-muted-foreground font-normal text-sm">
            ({members.length})
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y divide-border">
          {members.map((member) => (
            <li key={member.id} className="flex items-center gap-4 px-6 py-4">
              <Avatar
                name={member.name}
                email={member.email}
                avatarUrl={member.avatarUrl}
              />

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-medium">
                    {member.name ?? member.email}
                  </p>
                  {member.id === currentUserId && (
                    <span className="text-xs text-muted-foreground">(you)</span>
                  )}
                </div>
                {member.name && (
                  <p className="truncate text-xs text-muted-foreground">
                    {member.email}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Joined {formatDate(member.createdAt)}
                </p>
              </div>

              <Badge
                variant={roleBadgeVariant(member.role)}
                className="capitalize shrink-0"
              >
                {member.role}
              </Badge>
            </li>
          ))}

          {members.length === 0 && (
            <li className="px-6 py-8 text-center text-sm text-muted-foreground">
              No team members yet.
            </li>
          )}
        </ul>
      </CardContent>
    </Card>
  );
}
