"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createBanner, updateBanner } from "@/actions/banners";
import type { Banner } from "@/types";
import { Button } from "@/components/ui/button";
import { ImageIcon, Upload, X, ArrowLeft, Save, Layout, AlertCircle } from "lucide-react";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

interface Props {
  banner?: Banner;
}

export function BannerForm({ banner }: Props) {
  const router = useRouter();
  const isEdit = !!banner;

  const [page, setPage] = useState<"HOME" | "SHOP">(banner?.page ?? "HOME");
  const [photoUrl, setPhotoUrl] = useState(banner?.photoUrl ?? "");
  const [isActive, setIsActive] = useState(banner?.isActive ?? false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    if (file.size > MAX_FILE_SIZE) {
      toast.error(`File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit`);
      return false;
    }
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error("Only JPEG, PNG, or WEBP images are allowed");
      return false;
    }
    return true;
  };

  const uploadFile = async (file: File) => {
    if (!validateFile(file)) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (data.url) {
        setPhotoUrl(data.url);
        toast.success("Photo uploaded successfully");
      } else {
        toast.error(data.error || "Upload failed");
      }
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  }, []);

  const removePhoto = () => {
    setPhotoUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoUrl) {
      toast.error("Please upload a banner photo first");
      return;
    }

    setSaving(true);
    try {
      const input = { page, photoUrl, isActive };

      const res = isEdit
        ? await updateBanner(banner.id, input)
        : await createBanner(input);

      if (res.success) {
        toast.success(isEdit ? "Banner updated" : "Banner created");
        router.push("/admin/banners");
      } else {
        toast.error(res.error || "Something went wrong");
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto pb-24">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-6">
        <a
          href="/admin/banners"
          className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
        >
          Banners
        </a>
        <span className="text-[var(--color-text-muted)]">/</span>
        <span className="text-[var(--color-text)] font-medium">
          {isEdit ? "Edit Banner" : "Add New Banner"}
        </span>
      </div>

      <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-card)] shadow-sm overflow-hidden">
        <div className="border-b border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-3">
          <h2 className="text-sm font-semibold text-[var(--color-text)] flex items-center gap-2">
            <ImageIcon size={16} className="text-[var(--color-text-muted)]" />
            Banner Details
          </h2>
        </div>

        <div className="p-5 space-y-5">
          {/* Page selector */}
          <div>
            <label className="block text-xs font-medium text-[var(--color-text)] mb-1.5">
              Page <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-3">
              {(["HOME", "SHOP"] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPage(p)}
                  className={`
                    px-4 py-2 rounded-[var(--radius-btn)] text-sm font-medium transition-all
                    ${
                      page === p
                        ? "bg-[var(--color-text)] text-[var(--color-bg)] shadow-sm"
                        : "bg-[var(--color-bg)] text-[var(--color-text)] border border-[var(--color-border)] hover:bg-[var(--color-surface)]"
                    }
                  `}
                >
                  {p === "HOME" ? "Home Page" : "Shop Page"}
                </button>
              ))}
            </div>
          </div>

          {/* Photo upload */}
          <div>
            <label className="block text-xs font-medium text-[var(--color-text)] mb-1.5">
              Banner Photo <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-[var(--color-text-muted)] mb-3 flex items-center gap-1">
              <Layout size={12} />
              Recommended ratio: 16:5 (e.g. 1280×400px)
            </p>

            {photoUrl ? (
              <div className="relative group">
                <div className="relative rounded-[var(--radius-card)] overflow-hidden bg-[var(--color-surface)] border border-[var(--color-border)]">
                  <img
                    src={photoUrl}
                    alt="Banner preview"
                    className="w-full aspect-[16/5] object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={removePhoto}
                      className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors shadow-sm"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-[var(--color-text-muted)] mt-2 text-center">
                  Hover to remove • This banner will be displayed on the selected page
                </p>
              </div>
            ) : (
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`
                  border-2 border-dashed rounded-[var(--radius-card)] p-8 text-center cursor-pointer
                  transition-all duration-200
                  ${dragActive
                    ? "border-[var(--color-accent)] bg-[var(--color-surface-alt)]"
                    : "border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-accent)]"
                  }
                  ${uploading ? "opacity-60 pointer-events-none" : ""}
                `}
                onClick={() => fileInputRef.current?.click()}
              >
                {uploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-[var(--color-text)]">Uploading...</p>
                  </div>
                ) : (
                  <>
                    <Upload size={32} className="mx-auto text-[var(--color-text-muted)]" />
                    <p className="text-sm text-[var(--color-text)] mt-2">
                      Click or drag to upload banner photo
                    </p>
                    <p className="text-xs text-[var(--color-text-muted)] mt-1">
                      JPEG, PNG, WEBP • Max 2MB • Recommended 1280×400px
                    </p>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={uploading}
                />
              </div>
            )}
          </div>

          {/* Active toggle */}
          <div className="flex items-center justify-between pt-2 border-t border-[var(--color-border)]">
            <div>
              <p className="text-sm font-medium text-[var(--color-text)]">
                Set as Active
              </p>
              <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                This will automatically deactivate other banners on the same page
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsActive((prev) => !prev)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                isActive ? "bg-green-500" : "bg-[var(--color-border)]"
              }`}
            >
              <span
                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                  isActive ? "translate-x-4" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-[var(--color-bg)] border-t border-[var(--color-border)] py-4 px-6 z-10 shadow-[0_-2px_8px_rgba(0,0,0,0.04)] md:relative md:shadow-none md:mt-6">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <a
            href="/admin/banners"
            className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Banners
          </a>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/banners")}
              className="border border-[var(--color-border)] text-[var(--color-text)] bg-transparent hover:bg-[var(--color-surface)]"
            >
              Discard
            </Button>
            <Button
              type="submit"
              disabled={saving || uploading}
              className="bg-[var(--color-text)] text-[var(--color-bg)] hover:opacity-90 px-5 disabled:opacity-50 inline-flex items-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-[var(--color-bg)] border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  {isEdit ? "Save Changes" : "Add Banner"}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}