"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Props {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "default" | "danger";
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
  onConfirm,
  onCancel,
}: Props) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent
        className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-card)] shadow-xl p-0 max-w-md overflow-hidden"
        style={{ animation: "fadeIn 0.2s ease-out" }}
      >
        <AlertDialogHeader className="px-6 pt-6 pb-2">
          <AlertDialogTitle className="font-display text-lg font-medium text-[var(--color-text)]">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="font-sans text-sm text-[var(--color-text-muted)] mt-1.5">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-row justify-end gap-3 px-6 pb-6 pt-4 border-t border-[var(--color-border)]">
          <AlertDialogCancel
            onClick={onCancel}
            className="inline-flex items-center justify-center px-4 py-2 rounded-[var(--radius-btn)] text-sm font-medium font-sans bg-transparent border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-surface)] transition-colors focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
          >
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={`inline-flex items-center justify-center px-4 py-2 rounded-[var(--radius-btn)] text-sm font-medium font-sans transition-colors focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] ${
              variant === "danger"
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-[var(--color-text)] text-[var(--color-bg)] hover:bg-[var(--color-brown-dark)]"
            }`}
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}