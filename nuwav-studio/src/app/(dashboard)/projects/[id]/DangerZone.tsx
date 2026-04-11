"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronRight, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DangerZoneProps {
  projectId: string;
  projectTitle: string;
}

export function DangerZone({ projectId, projectTitle }: DangerZoneProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmValue, setConfirmValue] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const confirmed = confirmValue.trim() === projectTitle.trim();

  async function handleDelete() {
    if (!confirmed) return;
    setDeleting(true);
    setError(null);
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? "Failed to delete project");
      }
      router.push("/projects");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setDeleting(false);
    }
  }

  return (
    <div className="rounded-lg border border-destructive/30 bg-destructive/5">
      {/* Collapsible header */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <span className="text-sm font-semibold text-destructive">Danger Zone</span>
        {open ? (
          <ChevronDown className="h-4 w-4 text-destructive" />
        ) : (
          <ChevronRight className="h-4 w-4 text-destructive" />
        )}
      </button>

      {open && (
        <div className="border-t border-destructive/20 px-5 py-4 space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium">Delete this project</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Permanently removes all modules, lessons, and associated data.
                This action cannot be undone.
              </p>
            </div>

            <Dialog
              open={dialogOpen}
              onOpenChange={(v) => {
                setDialogOpen(v);
                if (!v) {
                  setConfirmValue("");
                  setError(null);
                }
              }}
            >
              <DialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="sm"
                  className="shrink-0 gap-1.5"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete Project
                </Button>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete &ldquo;{projectTitle}&rdquo;?</DialogTitle>
                  <DialogDescription>
                    This will permanently delete all modules, lessons, and data
                    for this project. There is no undo.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-2 py-2">
                  <Label htmlFor="confirm-title" className="text-sm">
                    Type <span className="font-semibold">{projectTitle}</span> to
                    confirm
                  </Label>
                  <Input
                    id="confirm-title"
                    value={confirmValue}
                    onChange={(e) => setConfirmValue(e.target.value)}
                    placeholder={projectTitle}
                    autoComplete="off"
                  />
                  {error && (
                    <p className="text-xs text-destructive">{error}</p>
                  )}
                </div>

                <DialogFooter>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDialogOpen(false)}
                    disabled={deleting}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={!confirmed || deleting}
                    onClick={handleDelete}
                  >
                    {deleting ? "Deleting…" : "Delete permanently"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      )}
    </div>
  );
}
