"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createLookbookPhoto, updateLookbookPhoto } from "@/actions/lookbooks";
import type { LookbookPhoto, Product, LookbookCategory } from "@/types";
import { Button } from "@/components/ui/button";
import { ImageIcon, Upload, X, ArrowLeft, Save, Info } from "lucide-react";

const CATEGORIES = [
  { value: "DAILY_CASUAL", label: "Daily Casual" },
  { value: "OVERSIZE_STYLE", label: "Oversize Style" },
  { value: "COUPLE_GROUP", label: "Couple & Group" },
];


const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

interface Props {
  photo?: LookbookPhoto;
  products: Product[];
}

export function LookbookForm({ photo, products }: Props) {
  const router = useRouter();
  const isEdit = !!photo;

  const [photoUrl, setPhotoUrl] = useState(photo?.photoUrl ?? "");
  const [category, setCategory] = useState<LookbookCategory>(photo?.category ?? "DAILY_CASUAL");
  const [productId, setProductId] = useState(photo?.productId ?? "");
  const [modelSize, setModelSize] = useState(photo?.modelSize ?? "");
  const [modelStats, setModelStats] = useState(photo?.modelStats ?? "");
  const [order, setOrder] = useState(photo?.order?.toString() ?? "0");
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
      toast.error("Please upload a photo first");
      return;
    }

    setSaving(true);
    try {
      const input = {
        photoUrl,
        category,
        productId: productId || null,
        modelSize,
        modelStats,
        order: Number(order),
      };

      const res = isEdit
        ? await updateLookbookPhoto(photo.id, input)
        : await createLookbookPhoto(input);

      if (res.success) {
        toast.success(isEdit ? "Photo updated" : "Photo added");
        router.push("/admin/lookbook");
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto pb-24">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-6">
        <a
          href="/admin/lookbook"
          className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
        >
          Lookbook
        </a>
        <span className="text-[var(--color-text-muted)]">/</span>
        <span className="text-[var(--color-text)] font-medium">
          {isEdit ? "Edit Photo" : "Add New Photo"}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - Photo Upload */}
        <div>
          <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-card)] shadow-sm overflow-hidden">
            <div className="border-b border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-3">
              <h2 className="text-sm font-semibold text-[var(--color-text)] flex items-center gap-2">
                <ImageIcon size={16} className="text-[var(--color-text-muted)]" />
                Photo
              </h2>
            </div>
            <div className="p-5">
              {photoUrl ? (
                <div className="relative group">
                  <div className="relative aspect-[3/4] rounded-[var(--radius-card)] overflow-hidden bg-[var(--color-surface)] border border-[var(--color-border)]">
                    <img
                      src={photoUrl}
                      alt="Lookbook preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
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
                    Hover to remove • This photo will be displayed on the website
                  </p>
                </div>
              ) : (
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`
                    border-2 border-dashed rounded-[var(--radius-card)] p-6 text-center cursor-pointer
                    transition-all duration-200 aspect-[3/4] flex flex-col items-center justify-center gap-3
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
                      <Upload size={32} className="text-[var(--color-text-muted)]" />
                      <div>
                        <p className="text-sm font-medium text-[var(--color-text)]">
                          Click or drag to upload
                        </p>
                        <p className="text-xs text-[var(--color-text-muted)] mt-1">
                          JPEG, PNG, WEBP • Max 2MB
                        </p>
                      </div>
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
          </div>
        </div>

        {/* Right Column - Details */}
        <div>
          <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-card)] shadow-sm overflow-hidden">
            <div className="border-b border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-3">
              <h2 className="text-sm font-semibold text-[var(--color-text)] flex items-center gap-2">
                <Info size={16} className="text-[var(--color-text-muted)]" />
                Details
              </h2>
            </div>
            <div className="p-5 space-y-4">
              {/* Category */}
              <div>
                <label className="block text-xs font-medium text-[var(--color-text)] mb-1.5">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as LookbookCategory)}
                  className="w-full rounded-[var(--radius-input)] border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Linked Product */}
              <div>
                <label className="block text-xs font-medium text-[var(--color-text)] mb-1.5">
                  Linked Product <span className="text-[var(--color-text-muted)] font-normal">(optional)</span>
                </label>
                <select
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  className="w-full rounded-[var(--radius-input)] border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                >
                  <option value="">— No product linked —</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Model Size */}
              <div>
                <label className="block text-xs font-medium text-[var(--color-text)] mb-1.5">
                  Model Size <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={modelSize}
                  onChange={(e) => setModelSize(e.target.value)}
                  placeholder="e.g. L"
                  className="w-full rounded-[var(--radius-input)] border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                  required
                />
              </div>

              {/* Model Stats */}
              <div>
                <label className="block text-xs font-medium text-[var(--color-text)] mb-1.5">
                  Model Stats <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={modelStats}
                  onChange={(e) => setModelStats(e.target.value)}
                  placeholder="e.g. TB 170cm / BB 62kg"
                  className="w-full rounded-[var(--radius-input)] border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                  required
                />
              </div>

              {/* Display Order */}
              <div>
                <label className="block text-xs font-medium text-[var(--color-text)] mb-1.5">
                  Display Order
                </label>
                <input
                  type="number"
                  value={order}
                  onChange={(e) => setOrder(e.target.value)}
                  placeholder="0"
                  className="w-full rounded-[var(--radius-input)] border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                />
                <p className="text-xs text-[var(--color-text-muted)] mt-1">
                  Lower numbers appear first
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-[var(--color-bg)] border-t border-[var(--color-border)] py-4 px-6 z-10 shadow-[0_-2px_8px_rgba(0,0,0,0.04)] md:relative md:shadow-none md:mt-6">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <a
            href="/admin/lookbook"
            className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Lookbook
          </a>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/lookbook")}
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
                  {isEdit ? "Save Changes" : "Add Photo"}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}