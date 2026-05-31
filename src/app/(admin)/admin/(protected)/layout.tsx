import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Toaster } from "@/components/ui/sonner";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-[var(--admin-content-bg)]">
      <AdminSidebar />
      <div className="ml-60">
        {children}
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
}
