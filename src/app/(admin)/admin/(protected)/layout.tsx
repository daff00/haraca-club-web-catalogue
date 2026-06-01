import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminContentWrapper } from "@/components/admin/AdminContentWrapper";
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
      <AdminContentWrapper>
        {children}
      </AdminContentWrapper>
      <Toaster position="bottom-right" />
    </div>
  );
}