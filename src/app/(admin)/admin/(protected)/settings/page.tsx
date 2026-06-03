import { AdminTopBar } from "@/components/admin/AdminTopBar";
import { ContactInfoForm } from "@/components/admin/ContactInfoForm";
import { ChangePasswordForm } from "@/components/admin/ChangePasswordForm";
import { AdminUsersTable } from "@/components/admin/AdminUsersTable";
import { getContactInfo } from "@/actions/contact";
import { getAdminUsers } from "@/actions/admin-users";
import { Settings, User, Shield, Mail } from "lucide-react";

export default async function SettingsPage() {
  const [contactInfo, adminUsers] = await Promise.all([
    getContactInfo(),
    getAdminUsers(),
  ]);

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <AdminTopBar title="Settings" />

      <div className="p-6 md:p-8 max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Settings size={20} className="text-[var(--color-accent)]" />
            <h1 className="text-2xl font-display font-medium text-[var(--color-text)]">
              Settings
            </h1>
          </div>
          <p className="text-sm text-[var(--color-text-muted)]">
            Manage contact information, password, and admin user access.
          </p>
        </div>

        {/* Contact Info Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Mail size={16} className="text-[var(--color-accent)]" />
            <h2 className="text-base font-semibold text-[var(--color-text)]">
              Contact Info
            </h2>
          </div>
          <p className="text-xs text-[var(--color-text-muted)] mb-4">
            Used across the website — WhatsApp buttons, footer, Contact page.
          </p>
          <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-card)] shadow-sm overflow-hidden">
            <ContactInfoForm contact={contactInfo} />
          </div>
        </div>

        {/* Change Password Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <User size={16} className="text-[var(--color-accent)]" />
            <h2 className="text-base font-semibold text-[var(--color-text)]">
              Change Password
            </h2>
          </div>
          <p className="text-xs text-[var(--color-text-muted)] mb-4">
            Update your own admin password.
          </p>
          <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-card)] shadow-sm overflow-hidden">
            <ChangePasswordForm />
          </div>
        </div>

        {/* Admin Users Section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Shield size={16} className="text-[var(--color-accent)]" />
            <h2 className="text-base font-semibold text-[var(--color-text)]">
              Admin Users
            </h2>
          </div>
          <p className="text-xs text-[var(--color-text-muted)] mb-4">
            Manage who has access to this admin panel.
          </p>
          <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-card)] shadow-sm overflow-hidden">
            <AdminUsersTable users={adminUsers} />
          </div>
        </div>
      </div>
    </div>
  );
}