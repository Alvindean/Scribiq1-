import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const user = session.user as {
    id?: string;
    email?: string | null;
    name?: string | null;
    isAdmin?: boolean;
  };

  // Primary check: isAdmin flag on the session
  const isAdminByFlag = user.isAdmin === true;

  // Fallback: match against ADMIN_EMAIL env var when isAdmin field is absent
  const adminEmail = process.env.ADMIN_EMAIL;
  const isAdminByEmail =
    !isAdminByFlag && adminEmail
      ? user.email?.toLowerCase() === adminEmail.toLowerCase()
      : false;

  if (!isAdminByFlag && !isAdminByEmail) {
    redirect("/dashboard?error=not_authorized");
  }

  return <>{children}</>;
}
