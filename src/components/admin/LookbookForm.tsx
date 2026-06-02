"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createLookbookPhoto, updateLookbookPhoto } from "@/actions/lookbooks";
import type { LookbookPhoto, Product } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const CATEGORIES = [
  { value: "DAILY_CASUAL", label: "Daily Casual" },
  { value: "OVERSIZE_STYLE", label: "Oversize Style" },
  { value: "COUPLE_GROUP", label: "Couple & Group" },
];

interface Props {
  photo?: LookbookPhoto;
  products: Product[];
}

export function LookbookForm({ photo, products }: Props) {
  const router = useRouter();
  const isEdit = !!photo;

  const [photoUrl, setPhotoUrl] = useState(photo?.photoUrl ?? "");
  const [category, setCategory] = useState(photo?.category ?? "DAILY_CASUAL");
  const [productId, setProductId] = useState(photo?.productId ?? "");
  const [modelSize, setModelSize] = useState(photo?.modelSize ?? "");
  const [modelStats, setModelStats] = useState(photo?.modelStats ?? "");
  const [order, setOrder] = useState(photo?.order?.toString() ?? "0");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.url) {
        setPhotoUrl(data.url);
        toast.success("Photo uploaded");
      } else {
        toast.error("Upload failed");
      }
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!photoUrl) {
      toast.error("Please upload a photo first");
      return;
    }

    setSaving(true);
    try {
      const input = {
        photoUrl,
        category: category as any,
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
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-xl">

      {/* Breadcrumb */}
      <p className="text-sm font-sans text-[var(--color-text-muted)]">
        <a href="/admin/lookbook" className="hover:underline">Lookbook</a>
        {" "}&rsaquo;{" "}
        {isEdit ? "Edit Photo" : "Add Photo"}
      </p>

      {/* Photo Upload */}
      <div className="bg-white border border-[var(--color-border)] rounded-card p-5 flex flex-col gap-4">
        <h2 className="text-sm font-sans font-medium text-[var(--color-text)]">
          Photo
        </h2>

        {photoUrl ? (
          <div className="relative w-48">
            <img
              src={photoUrl}
              alt="Lookbook"
              className="w-full aspect-[3/4] object-cover rounded-card"
            />
            <button
              type="button"
              onClick={() => setPhotoUrl("")}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 text-sm flex items-center justify-center hover:bg-red-600"
            >
              ×
            </button>
          </div>
        ) : (
          <label className="border-2 border-dashed border-[var(--color-border)] rounded-card p-8 text-center cursor-pointer hover:border-[var(--color-accent)] transition-colors w-48 aspect-[3/4] flex flex-col items-center justify-center">
            <p className="text-sm font-sans text-[var(--color-text-muted)]">
              {uploading ? "Uploading..." : "Click to upload"}
            </p>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
              disabled={uploading}
            />
          </label>
        )}
      </div>

      {/* Details */}
      <div className="bg-white border border-[var(--color-border)] rounded-card p-5 flex flex-col gap-4">
        <h2 className="text-sm font-sans font-medium text-[var(--color-text)]">
          Details
        </h2>

        {/* Category */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-sans font-medium text-[var(--color-text)]">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border border-[var(--color-border)] rounded-input px-3 py-2 text-sm font-sans bg-[var(--color-bg)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-text)]"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* Linked Product */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-sans font-medium text-[var(--color-text)]">
            Linked Product{" "}
            <span className="text-[var(--color-text-muted)] font-normal">
              (optional)
            </span>
          </label>
          <select
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className="border border-[var(--color-border)] rounded-input px-3 py-2 text-sm font-sans bg-[var(--color-bg)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-text)]"
          >
            <option value="">— No product linked —</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Model Size"
          value={modelSize}
          onChange={(e) => setModelSize(e.target.value)}
          placeholder="e.g. L"
          required
        />
        <Input
          label="Model Stats"
          value={modelStats}
          onChange={(e) => setModelStats(e.target.value)}
          placeholder="e.g. TB 170cm / BB 62kg"
          required
        />
        <Input
          label="Display Order"
          type="number"
          value={order}
          onChange={(e) => setOrder(e.target.value)}
          hint="Lower number = appears first"
        />
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between py-4 border-t border-[var(--color-border)]">
        <a
          href="/admin/lookbook"
          className="text-sm font-sans text-[var(--color-text-muted)] hover:underline"
        >
          ← Back to Lookbook
        </a>
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/lookbook")}
          >
            Discard
          </Button>
          <Button type="submit" disabled={saving || uploading}>
            {saving ? "Saving..." : isEdit ? "Save Changes" : "Add Photo"}
          </Button>
        </div>
      </div>

    </form>
  );
}