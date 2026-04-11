import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { MobileSidebarWrapper } from "@/components/dashboard/MobileSidebarWrapper";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <MobileSidebarWrapper />
      {/*
        On mobile: full-width (no sidebar offset).
        On desktop (md+): content sits next to the fixed sidebar — no extra
        margin needed because MobileSidebarWrapper renders a shrink-0 flex
        child that naturally pushes the main area over.
      */}
      <main className="flex-1 overflow-y-auto bg-background pt-14 md:pt-0">
        {children}
      </main>
    </div>
  );
}
