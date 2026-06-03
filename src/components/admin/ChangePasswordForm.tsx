"use client";

import { useState } from "react";
import { toast } from "sonner";
import { changePassword } from "@/actions/admin-users";
import { Button } from "@/components/ui/button";
import { Lock, Save } from "lucide-react";

export function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      if (res.success) {
        toast.success("Password changed successfully");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(res.error || "Failed to change password");
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-5 space-y-5">
      {/* Current Password */}
      <div>
        <label className="block text-xs font-medium text-[var(--color-text)] mb-1.5">
          Current Password <span className="text-red-500">*</span>
        </label>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="w-full rounded-[var(--radius-input)] border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
          required
        />
      </div>

      {/* New Password */}
      <div>
        <label className="block text-xs font-medium text-[var(--color-text)] mb-1.5">
          New Password <span className="text-red-500">*</span>
        </label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full rounded-[var(--radius-input)] border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
          required
        />
        <p className="text-xs text-[var(--color-text-muted)] mt-1">
          Minimum 8 characters
        </p>
      </div>

      {/* Confirm New Password */}
      <div>
        <label className="block text-xs font-medium text-[var(--color-text)] mb-1.5">
          Confirm New Password <span className="text-red-500">*</span>
        </label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full rounded-[var(--radius-input)] border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
          required
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end pt-2 border-t border-[var(--color-border)]">
        <Button
          type="submit"
          disabled={saving}
          className="bg-[var(--color-text)] text-[var(--color-bg)] hover:opacity-90 px-5 inline-flex items-center gap-2"
        >
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-[var(--color-bg)] border-t-transparent rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save size={16} />
              Change Password
            </>
          )}
        </Button>
      </div>
    </form>
  );
}