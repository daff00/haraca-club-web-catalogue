"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createProduct, updateProduct } from "@/actions/products";
import type { Product, ProductColor } from "@/types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import slugify from "slugify";

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const CATEGORIES = [
  { value: "TANKTOP", label: "Tanktop" },
  { value: "OVERSIZE", label: "Oversize" },
  { value: "REGULAR", label: "Regular" },
  { value: "SABLON", label: "Sablon" },
];

interface Props {
  product?: Product;
}

export function ProductForm({ product }: Props) {
  const router = useRouter();
  const isEdit = !!product;

  // ─── Form State ───────────────────────────────────────
  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [price, setPrice] = useState(product?.price?.toString() ?? "");
  const [category, setCategory] = useState(product?.category ?? "TANKTOP");
  const [description, setDescription] = useState(product?.description ?? "");
  const [material, setMaterial] = useState(product?.material ?? "");
  const [sizes, setSizes] = useState<string[]>(product?.sizes ?? []);
  const [colors, setColors] = useState<ProductColor[]>(
    (product?.colors as ProductColor[]) ?? []
  );
  const [photos, setPhotos] = useState<string[]>(product?.photos ?? []);
  const [labels, setLabels] = useState<string[]>(
    (product?.labels as string[]) ?? []
  );
  const [linkShopee, setLinkShopee] = useState(product?.linkShopee ?? "");
  const [linkTiktok, setLinkTiktok] = useState(product?.linkTiktok ?? "");
  const [isActive, setIsActive] = useState(product?.isActive ?? true);

  // ─── Color input state ────────────────────────────────
  const [colorName, setColorName] = useState("");
  const [colorHex, setColorHex] = useState("#000000");

  // ─── Upload state ─────────────────────────────────────
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  // ─── Handlers ─────────────────────────────────────────
  function handleNameChange(val: string) {
    setName(val);
    if (!isEdit) {
      setSlug(slugify(val, { lower: true, strict: true }));
    }
  }

  function toggleSize(size: string) {
    setSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  }

  function toggleLabel(label: string) {
    setLabels((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  }

  function addColor() {
    if (!colorName.trim()) return;
    setColors((prev) => [...prev, { name: colorName.trim(), hex: colorHex }]);
    setColorName("");
    setColorHex("#000000");
  }

  function removeColor(index: number) {
    setColors((prev) => prev.filter((_, i) => i !== index));
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (photos.length + files.length > 9) {
      toast.error("Maximum 9 photos allowed");
      return;
    }

    setUploading(true);

    try {
      const uploadedUrls: string[] = [];

      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (data.url) uploadedUrls.push(data.url);
        else toast.error(`Failed to upload ${file.name}`);
      }

      setPhotos((prev) => [...prev, ...uploadedUrls]);
      toast.success(`${uploadedUrls.length} photo(s) uploaded`);
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function removePhoto(index: number) {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const input = {
        name,
        slug,
        price: Number(price),
        category: category as any,
        sizes,
        colors,
        photos,
        description,
        material,
        labels: labels as any,
        linkShopee: linkShopee || "",
        linkTiktok: linkTiktok || "",
        isActive,
      };

      const res = isEdit
        ? await updateProduct(product.id, input)
        : await createProduct(input);

      if (res.success) {
        toast.success(isEdit ? "Product updated" : "Product created");
        router.push("/admin/products");
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  // ─── Render ───────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-4xl">

      {/* Breadcrumb */}
      <p className="text-sm font-sans text-[var(--color-text-muted)]">
        <a href="/admin/products" className="hover:underline">Products</a>
        {" "}&rsaquo;{" "}
        {isEdit ? "Edit Product" : "Add New Product"}
      </p>

      <div className="grid grid-cols-3 gap-6">

        {/* ── LEFT COLUMN (2/3) ── */}
        <div className="col-span-2 flex flex-col gap-4">

          {/* Basic Info */}
          <div className="bg-white border border-[var(--color-border)] rounded-card p-5 flex flex-col gap-4">
            <h2 className="text-sm font-sans font-medium text-[var(--color-text)]">
              Basic Information
            </h2>
            <Input
              label="Product Name"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              required
            />
            <Input
              label="Slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              hint="Auto-generated from name. Used in URL: /shop/[slug]"
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Price (Rp)"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-sans font-medium text-[var(--color-text)]">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="border border-[var(--color-border)] rounded-input px-3 py-2 text-sm font-sans bg-[var(--color-bg)] focus:outline-none focus:border-[var(--color-text)]"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <Textarea
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
            />
            <Input
              label="Material"
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              required
            />
          </div>

          {/* Photos */}
          <div className="bg-white border border-[var(--color-border)] rounded-card p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-sans font-medium text-[var(--color-text)]">
                Product Photos
              </h2>
              <span className="text-xs text-[var(--color-text-muted)] font-sans">
                {photos.length}/9
              </span>
            </div>

            {/* Upload zone */}
            {photos.length < 9 && (
              <label className="border-2 border-dashed border-[var(--color-border)] rounded-card p-6 text-center cursor-pointer hover:border-[var(--color-accent)] transition-colors">
                <p className="text-sm font-sans text-[var(--color-text-muted)]">
                  {uploading ? "Uploading..." : "Click to upload photos"}
                </p>
                <p className="text-xs font-sans text-[var(--color-text-muted)] mt-1">
                  PNG, JPG up to 5MB · Max 9 photos
                </p>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handlePhotoUpload}
                  disabled={uploading}
                />
              </label>
            )}

            {/* Photo grid */}
            {photos.length > 0 && (
              <div className="grid grid-cols-5 gap-2">
                {photos.map((url, i) => (
                  <div key={i} className="relative group">
                    <img
                      src={url}
                      alt={`Photo ${i + 1}`}
                      className="w-full aspect-square object-cover rounded-card"
                    />
                    {i === 0 && (
                      <span className="absolute top-1 left-1 bg-[var(--color-text)] text-[var(--color-bg)] text-[10px] font-sans px-1.5 py-0.5 rounded">
                        Main
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => removePhoto(i)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Purchase Links */}
          <div className="bg-white border border-[var(--color-border)] rounded-card p-5 flex flex-col gap-4">
            <h2 className="text-sm font-sans font-medium text-[var(--color-text)]">
              Purchase Links{" "}
              <span className="text-[var(--color-text-muted)] font-normal">
                (optional)
              </span>
            </h2>
            <Input
              label="Shopee Link"
              type="url"
              value={linkShopee}
              onChange={(e) => setLinkShopee(e.target.value)}
              placeholder="https://shopee.co.id/..."
            />
            <Input
              label="TikTok Shop Link"
              type="url"
              value={linkTiktok}
              onChange={(e) => setLinkTiktok(e.target.value)}
              placeholder="https://www.tiktok.com/..."
            />
          </div>

        </div>

        {/* ── RIGHT COLUMN (1/3) ── */}
        <div className="flex flex-col gap-4">

          {/* Status */}
          <div className="bg-white border border-[var(--color-border)] rounded-card p-5 flex flex-col gap-3">
            <h2 className="text-sm font-sans font-medium text-[var(--color-text)]">
              Status
            </h2>
            <div className="flex items-center justify-between">
              <span className="text-sm font-sans text-[var(--color-text)]">
                {isActive ? "Active" : "Inactive"}
              </span>
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

          {/* Labels */}
          <div className="bg-white border border-[var(--color-border)] rounded-card p-5 flex flex-col gap-3">
            <h2 className="text-sm font-sans font-medium text-[var(--color-text)]">
              Labels
            </h2>
            {["BEST_SELLER", "NEW_ARRIVAL"].map((label) => (
              <label
                key={label}
                className="flex items-center gap-2.5 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={labels.includes(label)}
                  onChange={() => toggleLabel(label)}
                  className="rounded"
                />
                <span className="text-sm font-sans text-[var(--color-text)]">
                  {label === "BEST_SELLER" ? "Best Seller" : "New Arrival"}
                </span>
              </label>
            ))}
          </div>

          {/* Sizes */}
          <div className="bg-white border border-[var(--color-border)] rounded-card p-5 flex flex-col gap-3">
            <h2 className="text-sm font-sans font-medium text-[var(--color-text)]">
              Sizes Available
            </h2>
            <div className="flex flex-wrap gap-2">
              {SIZES.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleSize(size)}
                  className={`px-3 py-1.5 rounded-btn text-xs font-sans font-medium border transition-colors ${
                    sizes.includes(size)
                      ? "bg-[var(--color-text)] text-[var(--color-bg)] border-[var(--color-text)]"
                      : "border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-surface)]"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div className="bg-white border border-[var(--color-border)] rounded-card p-5 flex flex-col gap-3">
            <h2 className="text-sm font-sans font-medium text-[var(--color-text)]">
              Colors
            </h2>

            {/* Added colors */}
            {colors.length > 0 && (
              <div className="flex flex-col gap-2">
                {colors.map((color, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-1"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-5 h-5 rounded-full border border-[var(--color-border)]"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span className="text-sm font-sans text-[var(--color-text)]">
                        {color.name}
                      </span>
                      <span className="text-xs font-sans text-[var(--color-text-muted)]">
                        {color.hex}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeColor(i)}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add color */}
            <div className="flex flex-col gap-2 pt-2 border-t border-[var(--color-border)]">
              <input
                type="text"
                value={colorName}
                onChange={(e) => setColorName(e.target.value)}
                placeholder="Color name (e.g. Black)"
                className="border border-[var(--color-border)] rounded-input px-3 py-1.5 text-sm font-sans bg-[var(--color-bg)] focus:outline-none focus:border-[var(--color-text)]"
              />
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={colorHex}
                  onChange={(e) => setColorHex(e.target.value)}
                  className="w-9 h-9 rounded cursor-pointer border border-[var(--color-border)] p-0.5"
                />
                <button
                  type="button"
                  onClick={addColor}
                  className="flex-1 border border-[var(--color-text)] text-[var(--color-text)] py-1.5 rounded-btn text-xs font-sans font-medium hover:bg-[var(--color-surface)] transition-colors"
                >
                  + Add Color
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between py-4 border-t border-[var(--color-border)]">
        <a
          href="/admin/products"
          className="text-sm font-sans text-[var(--color-text-muted)] hover:underline"
        >
          ← Back to Products
        </a>
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/products")}
          >
            Discard
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : isEdit ? "Save Changes" : "Create Product"}
          </Button>
        </div>
      </div>

    </form>
  );
}