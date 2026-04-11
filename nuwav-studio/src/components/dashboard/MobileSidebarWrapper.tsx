"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Sidebar } from "./Sidebar";

export function MobileSidebarWrapper() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Hamburger button — mobile only */}
      <button
        aria-label="Open navigation menu"
        onClick={() => setOpen(true)}
        className="fixed top-3 left-3 z-40 flex h-10 w-10 items-center justify-center rounded-lg bg-background border shadow-sm md:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Backdrop — mobile only, visible when sidebar is open */}
      {open && (
        <div
          aria-hidden="true"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
        />
      )}

      {/* Sidebar — slide-over on mobile, fixed column on desktop */}
      <div
        className={[
          // Mobile: fixed overlay, slide in/out
          "fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out md:hidden",
          open ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        <Sidebar onClose={() => setOpen(false)} />
      </div>

      {/* Desktop: static sidebar — always visible, not an overlay */}
      <div className="hidden md:flex md:h-full md:shrink-0">
        <Sidebar />
      </div>
    </>
  );
}
