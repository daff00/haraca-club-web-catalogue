"use client";

import { useState } from "react";
import { toast } from "sonner";
import { createAdminUser, deleteAdminUser } from "@/actions/admin-users";
import { useRouter } from "next/navigation";
import { Trash2, UserPlus, Plus, X, Save } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

interface AdminUser {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

interface Props {
  users: AdminUser[];
}

export function AdminUsersTable({ users }: Props) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);

  // Confirm dialog state for delete
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await createAdminUser({ name, email, password });
      if (res.success) {
        toast.success(`Admin "${res.admin.name}" created`);
        setName("");
        setEmail("");
        setPassword("");
        setShowForm(false);
        router.refresh();
      } else {
        toast.error(res.error || "Failed to create admin");
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to create admin");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!selectedUser) return;

    try {
      const res = await deleteAdminUser(selectedUser.id);
      if (res.success) {
        toast.success("Admin deleted");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to delete admin");
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to delete admin");
    } finally {
      setShowConfirm(false);
      setSelectedUser(null);
    }
  }

  return (
    <>
      <ConfirmDialog
        open={showConfirm}
        title="Delete Admin"
        description={`Are you sure you want to delete "${selectedUser?.name}"? They will lose access immediately.`}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => {
          setShowConfirm(false);
          setSelectedUser(null);
        }}
      />

      <div className="flex flex-col gap-5">
        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface)]/40">
                <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                  Added
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, idx) => (
                <tr
                  key={user.id}
                  className={`border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-surface)]/30 transition-colors ${
                    idx % 2 === 0 ? "bg-white" : "bg-[var(--color-surface-alt)]/20"
                  }`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[var(--color-accent)] flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-semibold text-white">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-[var(--color-text)]">
                        {user.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-[var(--color-text-muted)]">
                      {user.email}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-[var(--color-text-muted)]">
                      {new Date(user.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {users.length > 1 && (
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowConfirm(true);
                        }}
                        className="text-[var(--color-text-muted)] hover:text-red-500 transition-colors"
                        title="Delete admin"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Admin Form (inline card) */}
        {showForm ? (
          <div className="border border-[var(--color-border)] rounded-[var(--radius-card)] bg-[var(--color-bg)] shadow-sm overflow-hidden">
            <div className="border-b border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserPlus size={16} className="text-[var(--color-text-muted)]" />
                  <h3 className="text-sm font-semibold text-[var(--color-text)]">
                    Add New Admin
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
            <form onSubmit={handleCreate} className="p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[var(--color-text)] mb-1.5">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-[var(--radius-input)] border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--color-text)] mb-1.5">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-[var(--radius-input)] border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--color-text)] mb-1.5">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-[var(--radius-input)] border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                  required
                />
                <p className="text-xs text-[var(--color-text-muted)] mt-1">
                  Minimum 8 characters
                </p>
              </div>
              <div className="flex justify-end gap-3 pt-2 border-t border-[var(--color-border)]">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="inline-flex items-center justify-center px-4 py-2 rounded-[var(--radius-btn)] text-sm font-medium font-sans bg-transparent border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-surface)] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 bg-[var(--color-text)] text-[var(--color-bg)] px-5 py-2 rounded-[var(--radius-btn)] text-sm font-medium hover:bg-[var(--color-brown-dark)] transition-colors disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-[var(--color-bg)] border-t-transparent rounded-full animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Create Admin
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 w-fit px-4 py-2 rounded-[var(--radius-btn)] text-sm font-medium border border-[var(--color-border)] text-[var(--color-text)] bg-transparent hover:bg-[var(--color-surface)] transition-colors ml-3 mb-3"
          >
            <Plus size={16} />
            Add New Admin
          </button>
        )}
      </div>
    </>
  );
}