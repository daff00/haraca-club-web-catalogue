"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createProduct, updateProduct } from "@/actions/products";
import type { Product, ProductColor } from "@/types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import slugify from "slugify";

// ─── Constants ─────────────────────────────────────────
const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const CATEGORIES = [
  { value: "TANKTOP", label: "Tanktop" },
  { value: "OVERSIZE", label: "Oversize" },
  { value: "REGULAR", label: "Regular" },
  { value: "SABLON", label: "Sablon" },
];
const MAX_PHOTOS = 9;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// ─── Helper ────────────────────────────────────────────
const Required = () => <span className="text-red-500 ml-0.5">*</span>;

// ─── Props ─────────────────────────────────────────────
interface Props {
  product?: Product;
}

export function ProductForm({ product }: Props) {
  const router = useRouter();
  const isEdit = !!product;

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

  const [colorName, setColorName] = useState("");
  const [colorHex, setColorHex] = useState("#000000");

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ─── Handlers ─────────────────────────────────────────
  const handleNameChange = useCallback((val: string) => {
    setName(val);
    if (!isEdit) {
      setSlug(slugify(val, { lower: true, strict: true }));
    }
    setErrors((prev) => ({ ...prev, name: "" }));
  }, [isEdit]);

  const toggleSize = (size: string) => {
    setSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
    setErrors((prev) => ({ ...prev, sizes: "" }));
  };

  const toggleLabel = (label: string) => {
    setLabels((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  const addColor = () => {
    if (!colorName.trim()) {
      setErrors((prev) => ({ ...prev, color: "Color name is required." }));
      return;
    }
    if (colors.some((c) => c.name.toLowerCase() === colorName.trim().toLowerCase())) {
      setErrors((prev) => ({ ...prev, color: "Color already added." }));
      return;
    }
    setColors((prev) => [...prev, { name: colorName.trim(), hex: colorHex }]);
    setColorName("");
    setColorHex("#000000");
    setErrors((prev) => ({ ...prev, color: "" }));
  };

  const removeColor = (index: number) => {
    setColors((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = useCallback(async (files: FileList) => {
    const fileArray = Array.from(files);
    if (fileArray.some((f) => f.size > MAX_FILE_SIZE)) {
      toast.error("Some files exceed 5 MB limit.");
      return;
    }
    if (photos.length + fileArray.length > MAX_PHOTOS) {
      toast.error(`Maximum ${MAX_PHOTOS} photos allowed.`);
      return;
    }

    setUploading(true);
    setUploadProgress({ current: 0, total: fileArray.length });
    setErrors((prev) => ({ ...prev, photos: "" }));

    try {
      const uploadedUrls: string[] = [];
      let completed = 0;

      for (const file of fileArray) {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (data.url) uploadedUrls.push(data.url);
        else toast.error(`Failed to upload ${file.name}`);

        completed++;
        setUploadProgress({ current: completed, total: fileArray.length });
      }

      setPhotos((prev) => [...prev, ...uploadedUrls]);
      if (uploadedUrls.length) toast.success(`${uploadedUrls.length} photo(s) uploaded`);
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
      setUploadProgress({ current: 0, total: 0 });
    }
  }, [photos.length]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) uploadFiles(e.target.files);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files) uploadFiles(e.dataTransfer.files);
  }, [uploadFiles]);

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Product name is required.";
    if (!slug.trim()) newErrors.slug = "Slug is required.";
    if (!price || isNaN(Number(price)) || Number(price) <= 0) newErrors.price = "Enter a valid price.";
    if (!description.trim()) newErrors.description = "Description is required.";
    if (!material.trim()) newErrors.material = "Material is required.";
    if (photos.length === 0) newErrors.photos = "At least one photo is required.";
    if (sizes.length === 0) newErrors.sizes = "Select at least one size.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix the errors below.");
      return;
    }

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
  };

  // ─── Render ───────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-4xl mx-auto pb-24">
      <p className="text-sm font-sans text-[var(--color-text-muted)]">
        <a href="/admin/products" className="hover:underline">Products</a>{" "}
        › {isEdit ? "Edit Product" : "Add New Product"}
      </p>

      <div className="grid grid-cols-3 gap-6">
        {/* LEFT COLUMN */}
        <div className="col-span-2 flex flex-col gap-6">
          {/* Basic Info */}
          <div className="bg-white border border-[var(--color-border)] rounded-card p-5 flex flex-col gap-4">
            <label className="text-md font-sans font-medium text-[var(--color-text)]">
              Basic Information
              <span className="block text-xs font-normal text-[var(--color-text-muted)] mt-0.5">
                Name, slug, price, description and material are required.
              </span>
            </label>

            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-sans font-medium text-[var(--color-text)]">
                Product Name <Required />
              </label>
              <Input
                placeholder="e.g. Essential Cotton Tanktop"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-xs text-red-500 font-sans">{errors.name}</p>}
            </div>

            {/* Slug (read‑only) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-sans font-medium text-[var(--color-text)]">
                Slug <Required />
              </label>
              <Input
                value={slug}
                readOnly
                hint={isEdit ? "Slug cannot be changed." : "Auto‑generated from name."}
                className={`bg-[var(--color-surface)] text-[var(--color-text)] ${errors.slug ? "border-red-500" : ""}`}
              />
              {errors.slug && <p className="text-xs text-red-500 font-sans">{errors.slug}</p>}
            </div>

            {/* Price & Category */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-sans font-medium text-[var(--color-text)]">
                  Price (Rp) <Required />
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[var(--color-text-muted)] font-sans">
                    Rp
                  </span>
                  <Input
                    type="number"
                    placeholder="0"
                    value={price}
                    onChange={(e) => { setPrice(e.target.value); setErrors((prev) => ({ ...prev, price: "" })); }}
                    className={`pl-8 ${errors.price ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.price && <p className="text-xs text-red-500 font-sans">{errors.price}</p>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-sans font-medium text-[var(--color-text)]">
                  Category <Required />
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="border border-[var(--color-border)] rounded-input px-3 py-2 text-sm font-sans bg-[var(--color-bg)] focus:outline-none focus:border-[var(--color-text)]"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-sans font-medium text-[var(--color-text)]">
                Description <Required />
              </label>
              <Textarea
                placeholder="Product description..."
                value={description}
                onChange={(e) => { setDescription(e.target.value); setErrors((prev) => ({ ...prev, description: "" })); }}
                rows={4}
                className={errors.description ? "border-red-500" : ""}
              />
              {errors.description && <p className="text-xs text-red-500 font-sans">{errors.description}</p>}
            </div>

            {/* Material */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-sans font-medium text-[var(--color-text)]">
                Material <Required />
              </label>
              <Input
                placeholder="e.g. 100% Cotton Combed 30s"
                value={material}
                onChange={(e) => { setMaterial(e.target.value); setErrors((prev) => ({ ...prev, material: "" })); }}
                className={errors.material ? "border-red-500" : ""}
              />
              {errors.material && <p className="text-xs text-red-500 font-sans">{errors.material}</p>}
            </div>
          </div>

          {/* Photos */}
          <div className="bg-white border border-[var(--color-border)] rounded-card p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-sans font-medium text-[var(--color-text)]">
                Product Photos <Required />
                <span className="block text-xs font-normal text-[var(--color-text-muted)] mt-0.5">
                  First photo becomes the main image.
                </span>
              </label>
              <span className="text-xs text-[var(--color-text-muted)] font-sans">
                {photos.length}/{MAX_PHOTOS}
              </span>
            </div>

            {photos.length < MAX_PHOTOS && (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className={`border-2 border-dashed rounded-card p-6 text-center cursor-pointer transition-colors ${
                  uploading
                    ? "border-[var(--color-accent)] bg-[var(--color-surface)]"
                    : "border-[var(--color-border)] hover:border-[var(--color-accent)]"
                }`}
              >
                <label className="cursor-pointer">
                  {uploading ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
                      <p className="text-sm font-sans text-[var(--color-text)]">
                        Uploading {uploadProgress.current}/{uploadProgress.total}
                      </p>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm font-sans text-[var(--color-text-muted)]">
                        Drag & drop photos here, or click to browse
                      </p>
                      <p className="text-xs font-sans text-[var(--color-text-muted)] mt-1">
                        PNG, JPG up to 5MB · Max 9 photos
                      </p>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={uploading}
                  />
                </label>
              </div>
            )}

            {errors.photos && <p className="text-xs text-red-500 font-sans">{errors.photos}</p>}

            {photos.length > 0 && (
              <div className="grid grid-cols-5 gap-2">
                {photos.map((url, i) => (
                  <div key={i} className="relative group">
                    <img
                      src={url}
                      alt={`Photo ${i + 1}`}
                      className="w-full aspect-square object-cover rounded-card border border-[var(--color-border)]"
                    />
                    {i === 0 && (
                      <span className="absolute top-1 left-1 bg-[var(--color-text)] text-[var(--color-bg)] text-xs font-sans px-1.5 py-0.5 rounded">
                        Main
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => removePhoto(i)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center shadow-sm md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                      aria-label={`Remove photo ${i + 1}`}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Links */}
          <div className="bg-white border border-[var(--color-border)] rounded-card p-5 flex flex-col gap-4">
            <label className="text-sm font-sans font-medium text-[var(--color-text)]">
              Purchase Links{" "}
              <span className="text-[var(--color-text-muted)] font-normal text-xs">(optional)</span>
            </label>
            <Input label="Shopee Link" type="url" value={linkShopee} onChange={(e) => setLinkShopee(e.target.value)} placeholder="https://shopee.co.id/..." />
            <Input label="TikTok Shop Link" type="url" value={linkTiktok} onChange={(e) => setLinkTiktok(e.target.value)} placeholder="https://www.tiktok.com/..." />
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-col gap-6">
          {/* Status */}
          <div className="bg-white border border-[var(--color-border)] rounded-card p-5 flex flex-col gap-3">
            <label className="text-sm font-sans font-medium text-[var(--color-text)]">Status</label>
            <div className="flex items-center justify-between">
              <span className="text-sm font-sans text-[var(--color-text)]">{isActive ? "Active" : "Inactive"}</span>
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
            <label className="text-sm font-sans font-medium text-[var(--color-text)]">Labels</label>
            {[
              { value: "BEST_SELLER", label: "Best Seller" },
              { value: "NEW_ARRIVAL", label: "New Arrival" },
            ].map((item) => (
              <div key={item.value} className="flex items-center justify-between">
                <span className="text-sm font-sans text-[var(--color-text)]">{item.label}</span>
                <button
                  type="button"
                  onClick={() => toggleLabel(item.value)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    labels.includes(item.value) ? "bg-[var(--color-text)]" : "bg-[var(--color-border)]"
                  }`}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                      labels.includes(item.value) ? "translate-x-4" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>

          {/* Sizes */}
          <div className="bg-white border border-[var(--color-border)] rounded-card p-5 flex flex-col gap-3">
            <label className="text-sm font-sans font-medium text-[var(--color-text)]">
              Sizes Available <Required />
            </label>
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
            {errors.sizes && <p className="text-xs text-red-500 font-sans">{errors.sizes}</p>}
            {sizes.length === 0 && !errors.sizes && (
              <p className="text-xs text-[var(--color-text-muted)] font-sans">Select at least one size.</p>
            )}
          </div>

          {/* Colors */}
          <div className="bg-white border border-[var(--color-border)] rounded-card p-5 flex flex-col gap-3">
            <label className="text-sm font-sans font-medium text-[var(--color-text)]">
              Colors
              <span className="block text-xs font-normal text-[var(--color-text-muted)] mt-0.5">
                Optional – add available colors and hex codes.
              </span>
            </label>

            {colors.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {colors.map((color, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-full px-2.5 py-1 text-xs font-sans"
                  >
                    <span
                      className="w-3 h-3 rounded-full border border-gray-300"
                      style={{ backgroundColor: color.hex }}
                    />
                    {color.name}
                    <button
                      type="button"
                      onClick={() => removeColor(i)}
                      className="text-[var(--color-text-muted)] hover:text-red-500 ml-0.5"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div className="flex flex-col gap-2 pt-2 border-t border-[var(--color-border)]">
              <input
                type="text"
                value={colorName}
                onChange={(e) => { setColorName(e.target.value); setErrors((prev) => ({ ...prev, color: "" })); }}
                placeholder="Color name (e.g. Black)"
                className="border border-[var(--color-border)] rounded-input px-3 py-1.5 text-sm font-sans bg-[var(--color-bg)] focus:outline-none focus:border-[var(--color-text)]"
              />
              {errors.color && <p className="text-xs text-red-500 font-sans">{errors.color}</p>}
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={colorHex}
                  onChange={(e) => setColorHex(e.target.value)}
                  className="w-9 h-9 rounded cursor-pointer border border-[var(--color-border)] p-0.5"
                />
                <span className="text-xs font-sans text-[var(--color-text-muted)]">{colorHex}</span>
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

      {/* Sticky action bar */}
      <div className="sticky bottom-0 bg-white border-t border-[var(--color-border)] py-4 flex items-center justify-between z-10 shadow-[0_-2px_8px_rgba(0,0,0,0.04)] -mx-6 px-6">
        <a href="/admin/products" className="text-sm font-sans text-[var(--color-text-muted)] hover:underline">
          ← Back to Products
        </a>
        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={() => router.push("/admin/products")}>
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