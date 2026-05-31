import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-[var(--admin-content-bg)]">
      {/* TODO: Add AdminSidebar and AdminTopBar components */}
      <div className="p-8">{children}</div>
    </div>
  );
}
