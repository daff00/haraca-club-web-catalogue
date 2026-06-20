"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createProduct, updateProduct } from "@/actions/products";
import type { Product, ProductColor } from "@/types";
import { Button } from "@/components/ui/button";
import slugify from "slugify";
import {
  Upload,
  X,
  ImageIcon,
  Plus,
  ArrowLeft,
  Save,
  Tag,
  Ruler,
  Palette,
  Link as LinkIcon,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// ─── Constants ─────────────────────────────────────────
const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const CATEGORIES = [
  { value: "TANKTOP", label: "Tanktop" },
  { value: "OVERSIZE", label: "Oversize" },
  { value: "REGULAR", label: "Regular" },
  { value: "SABLON", label: "Sablon" },
];
const MAX_PHOTOS = 9;
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

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
    (product?.colors as ProductColor[]) ?? [],
  );
  const [photos, setPhotos] = useState<string[]>(product?.photos ?? []);
  const [labels, setLabels] = useState<string[]>(
    (product?.labels as string[]) ?? [],
  );
  const [linkShopee, setLinkShopee] = useState(product?.linkShopee ?? "");
  const [linkTiktok, setLinkTiktok] = useState(product?.linkTiktok ?? "");
  const [isActive, setIsActive] = useState(product?.isActive ?? true);

  const [colorName, setColorName] = useState("");
  const [colorHex, setColorHex] = useState("#000000");
  const [hexInputValue, setHexInputValue] = useState("#000000");

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({
    current: 0,
    total: 0,
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ─── Handlers ─────────────────────────────────────────
  const handleNameChange = useCallback(
    (val: string) => {
      setName(val);
      if (!isEdit) {
        setSlug(slugify(val, { lower: true, strict: true }));
      }
      setErrors((prev) => ({ ...prev, name: "" }));
    },
    [isEdit],
  );

  const toggleSize = (size: string) => {
    setSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
    );
    setErrors((prev) => ({ ...prev, sizes: "" }));
  };

  const toggleLabel = (label: string) => {
    setLabels((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label],
    );
  };

  const addColor = () => {
    if (!colorName.trim()) {
      setErrors((prev) => ({ ...prev, color: "Color name is required." }));
      return;
    }
    if (
      colors.some(
        (c) => c.name.toLowerCase() === colorName.trim().toLowerCase(),
      )
    ) {
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

  const validateFile = (file: File): boolean => {
    if (file.size > MAX_FILE_SIZE) {
      toast.error(`File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit`);
      return false;
    }
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPEG, PNG, or WEBP images are allowed");
      return false;
    }
    return true;
  };

  const uploadFiles = useCallback(
    async (files: FileList) => {
      const fileArray = Array.from(files);
      for (const file of fileArray) {
        if (!validateFile(file)) return;
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

          const res = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });
          const data = await res.json();
          if (data.url) uploadedUrls.push(data.url);
          else toast.error(`Failed to upload ${file.name}`);

          completed++;
          setUploadProgress({ current: completed, total: fileArray.length });
        }

        setPhotos((prev) => [...prev, ...uploadedUrls]);
        if (uploadedUrls.length)
          toast.success(`${uploadedUrls.length} photo(s) uploaded`);
      } catch {
        toast.error("Upload failed");
      } finally {
        setUploading(false);
        setUploadProgress({ current: 0, total: 0 });
      }
    },
    [photos.length],
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) uploadFiles(e.target.files);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      if (e.dataTransfer.files) uploadFiles(e.dataTransfer.files);
    },
    [uploadFiles],
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Product name is required.";
    if (!slug.trim()) newErrors.slug = "Slug is required.";
    if (!price || isNaN(Number(price)) || Number(price) <= 0)
      newErrors.price = "Enter a valid price.";
    if (!description.trim()) newErrors.description = "Description is required.";
    if (!material.trim()) newErrors.material = "Material is required.";
    if (photos.length === 0)
      newErrors.photos = "At least one photo is required.";
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
      } else {
        toast.error(res.error || "Something went wrong");
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  // ─── Render ───────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} className="max-w-6xl mx-auto pb-24">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-6">
        <Link
          href="/admin/products"
          className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
        >
          Products
        </Link>
        <span className="text-[var(--color-text-muted)]">/</span>
        <span className="text-[var(--color-text)] font-medium">
          {isEdit ? "Edit Product" : "Add New Product"}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN (2/3 on large) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-card)] shadow-sm overflow-hidden">
            <div className="border-b border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-3">
              <h2 className="text-sm font-semibold text-[var(--color-text)] flex items-center gap-2">
                <Tag size={16} className="text-[var(--color-text-muted)]" />
                Basic Information
              </h2>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label
                  htmlFor="product-name"
                  className="block text-xs font-medium text-[var(--color-text)] mb-1.5"
                >
                  Product Name <Required />
                </label>
                <input
                  id="product-name"
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Essential Cotton Tanktop"
                  className={`w-full rounded-[var(--radius-input)] border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] ${
                    errors.name ? "border-red-500" : ""
                  }`}
                />
                {errors.name && (
                  <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="slug"
                  className="block text-xs font-medium text-[var(--color-text)] mb-1.5"
                >
                  Slug <Required />
                </label>
                <input
                  id="slug"
                  type="text"
                  value={slug}
                  readOnly
                  className={`w-full rounded-[var(--radius-input)] border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-3 py-2 text-sm text-[var(--color-text-muted)] ${
                    errors.slug ? "border-red-500" : ""
                  }`}
                />
                {errors.slug && (
                  <p className="text-xs text-red-500 mt-1">{errors.slug}</p>
                )}
                <p className="text-xs text-[var(--color-text-muted)] mt-1">
                  {isEdit
                    ? "Slug cannot be changed."
                    : "Auto‑generated from name."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="price"
                    className="block text-xs font-medium text-[var(--color-text)] mb-1.5"
                  >
                    Price (Rp) <Required />
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[var(--color-text-muted)]">
                      Rp
                    </span>
                    <input
                      id="price"
                      type="number"
                      value={price}
                      onChange={(e) => {
                        setPrice(e.target.value);
                        setErrors((prev) => ({ ...prev, price: "" }));
                      }}
                      placeholder="0"
                      className={`w-full rounded-[var(--radius-input)] border border-[var(--color-border)] bg-[var(--color-bg)] pl-8 pr-3 py-2 text-sm text-[var(--color-text)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] ${
                        errors.price ? "border-red-500" : ""
                      }`}
                    />
                  </div>
                  {errors.price && (
                    <p className="text-xs text-red-500 mt-1">{errors.price}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="category"
                    className="block text-xs font-medium text-[var(--color-text)] mb-1.5"
                  >
                    Category <Required />
                  </label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-[var(--radius-input)] border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-xs font-medium text-[var(--color-text)] mb-1.5"
                >
                  Description <Required />
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    setErrors((prev) => ({ ...prev, description: "" }));
                  }}
                  rows={4}
                  placeholder="Product description..."
                  className={`w-full rounded-[var(--radius-input)] border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] ${
                    errors.description ? "border-red-500" : ""
                  }`}
                />
                {errors.description && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.description}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="material"
                  className="block text-xs font-medium text-[var(--color-text)] mb-1.5"
                >
                  Material <Required />
                </label>
                <input
                  id="material"
                  type="text"
                  value={material}
                  onChange={(e) => {
                    setMaterial(e.target.value);
                    setErrors((prev) => ({ ...prev, material: "" }));
                  }}
                  placeholder="e.g. 100% Cotton Combed 30s"
                  className={`w-full rounded-[var(--radius-input)] border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] ${
                    errors.material ? "border-red-500" : ""
                  }`}
                />
                {errors.material && (
                  <p className="text-xs text-red-500 mt-1">{errors.material}</p>
                )}
              </div>
            </div>
          </div>

          {/* Product Photos */}
          <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-card)] shadow-sm overflow-hidden">
            <div className="border-b border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-3 flex justify-between items-center">
              <h2 className="text-sm font-semibold text-[var(--color-text)] flex items-center gap-2">
                <ImageIcon
                  size={16}
                  className="text-[var(--color-text-muted)]"
                />
                Product Photos <Required />
              </h2>
              <span className="text-xs text-[var(--color-text-muted)]">
                {photos.length}/{MAX_PHOTOS}
              </span>
            </div>
            <div className="p-5 space-y-4">
              {photos.length < MAX_PHOTOS && (
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`
                    border-2 border-dashed rounded-[var(--radius-card)] p-6 text-center cursor-pointer
                    transition-all duration-200
                    ${
                      dragActive
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
                      <p className="text-sm text-[var(--color-text)]">
                        Uploading {uploadProgress.current}/
                        {uploadProgress.total}
                      </p>
                    </div>
                  ) : (
                    <>
                      <Upload
                        size={32}
                        className="mx-auto text-[var(--color-text-muted)]"
                      />
                      <p className="text-sm text-[var(--color-text)] mt-2">
                        Drag & drop photos here, or click to browse
                      </p>
                      <p className="text-xs text-[var(--color-text-muted)] mt-1">
                        JPEG, PNG, WEBP up to 2MB · Max 9 photos
                      </p>
                    </>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={uploading}
                  />
                </div>
              )}

              {errors.photos && (
                <p className="text-xs text-red-500">{errors.photos}</p>
              )}

              {photos.length > 0 && (
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                  {photos.map((url, i) => (
                    <div key={i} className="relative group">
                      <div className="relative aspect-square rounded-[var(--radius-card)] overflow-hidden bg-[var(--color-surface)] border border-[var(--color-border)]">
                        <Image
                          fill
                          src={url}
                          alt={`Product ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {i === 0 && (
                          <span className="absolute top-1 left-1 bg-[var(--color-text)] text-[var(--color-bg)] text-xs px-1.5 py-0.5 rounded-[var(--radius-badge)]">
                            Main
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => removePhoto(i)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                          aria-label="Remove photo"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Purchase Links */}
          <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-card)] shadow-sm overflow-hidden">
            <div className="border-b border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-3">
              <h2 className="text-sm font-semibold text-[var(--color-text)] flex items-center gap-2">
                <LinkIcon
                  size={16}
                  className="text-[var(--color-text-muted)]"
                />
                Purchase Links
                <span className="text-xs font-normal text-[var(--color-text-muted)] ml-1">
                  (optional)
                </span>
              </h2>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label
                  htmlFor="shopee-link"
                  className="block text-xs font-medium text-[var(--color-text)] mb-1.5"
                >
                  Shopee Link
                </label>
                <input
                  id="shopee-link"
                  type="url"
                  value={linkShopee}
                  onChange={(e) => setLinkShopee(e.target.value)}
                  placeholder="https://shopee.co.id/..."
                  className="w-full rounded-[var(--radius-input)] border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                />
              </div>
              <div>
                <label
                  htmlFor="tiktok-shop-link"
                  className="block text-xs font-medium text-[var(--color-text)] mb-1.5"
                >
                  TikTok Shop Link
                </label>
                <input
                  id="tiktok-shop-link"
                  type="url"
                  value={linkTiktok}
                  onChange={(e) => setLinkTiktok(e.target.value)}
                  placeholder="https://www.tiktok.com/..."
                  className="w-full rounded-[var(--radius-input)] border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (1/3) */}
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-card)] shadow-sm overflow-hidden">
            <div className="border-b border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-3">
              <h2 className="text-sm font-semibold text-[var(--color-text)]">
                Status
              </h2>
            </div>
            <div className="p-5 flex items-center justify-between">
              <span className="text-sm text-[var(--color-text)]">
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
          <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-card)] shadow-sm overflow-hidden">
            <div className="border-b border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-3">
              <h2 className="text-sm font-semibold text-[var(--color-text)]">
                Labels
              </h2>
            </div>
            <div className="p-5 space-y-3">
              {[
                { value: "BEST_SELLER", label: "Best Seller" },
                { value: "NEW_ARRIVAL", label: "New Arrival" },
              ].map((item) => (
                <div
                  key={item.value}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm text-[var(--color-text)]">
                    {item.label}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleLabel(item.value)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      labels.includes(item.value)
                        ? "bg-[var(--color-text)]"
                        : "bg-[var(--color-border)]"
                    }`}
                  >
                    <span
                      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                        labels.includes(item.value)
                          ? "translate-x-4"
                          : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-card)] shadow-sm overflow-hidden">
            <div className="border-b border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-3">
              <h2 className="text-sm font-semibold text-[var(--color-text)] flex items-center gap-2">
                <Ruler size={16} className="text-[var(--color-text-muted)]" />
                Sizes Available <Required />
              </h2>
            </div>
            <div className="p-5">
              <div className="flex flex-wrap gap-2">
                {SIZES.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleSize(size)}
                    className={`
                      px-3 py-1.5 rounded-[var(--radius-btn)] text-xs font-medium transition-all
                      ${
                        sizes.includes(size)
                          ? "bg-[var(--color-text)] text-[var(--color-bg)] border border-[var(--color-text)]"
                          : "bg-[var(--color-bg)] text-[var(--color-text)] border border-[var(--color-border)] hover:bg-[var(--color-surface)]"
                      }
                    `}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {errors.sizes && (
                <p className="text-xs text-red-500 mt-2">{errors.sizes}</p>
              )}
              {sizes.length === 0 && !errors.sizes && (
                <p className="text-xs text-[var(--color-text-muted)] mt-2">
                  Select at least one size.
                </p>
              )}
            </div>
          </div>

          {/* Colors */}
          <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-card)] shadow-sm overflow-hidden">
            <div className="border-b border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-3">
              <h2 className="text-sm font-semibold text-[var(--color-text)] flex items-center gap-2">
                <Palette size={16} className="text-[var(--color-text-muted)]" />
                Colors
                <span className="text-xs font-normal text-[var(--color-text-muted)] ml-1">
                  (optional)
                </span>
              </h2>
            </div>
            <div className="p-5 space-y-4">
              {colors.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {colors.map((color, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-full px-2.5 py-1 text-xs text-[var(--color-text)]"
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

              <div className="space-y-2 pt-2 border-t border-[var(--color-border)]">
                <input
                  id="color-name"
                  type="text"
                  value={colorName}
                  onChange={(e) => {
                    setColorName(e.target.value);
                    setErrors((prev) => ({ ...prev, color: "" }));
                  }}
                  placeholder="Color name (e.g. Black)"
                  className="w-full rounded-[var(--radius-input)] border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-1.5 text-sm text-[var(--color-text)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                />
                {errors.color && (
                  <p className="text-xs text-red-500">{errors.color}</p>
                )}

                {/* --- BARIS PICKER + HEX INPUT + TOMBOL --- */}
                <div className="flex gap-2 items-center">
                  {/* Color Picker */}
                  <input
                    type="color"
                    value={colorHex}
                    onChange={(e) => {
                      setColorHex(e.target.value);
                      setHexInputValue(e.target.value);
                    }}
                    className="w-10 h-10 rounded cursor-pointer border border-[var(--color-border)] p-0.5 shrink-0"
                  />

                  {/* Hex Input — BISA DIKETIK LANGSUNG */}
                  <input
                    type="text"
                    value={hexInputValue}
                    onChange={(e) => {
                      const raw = e.target.value;
                      setHexInputValue(raw);

                      // Auto-format saat mengetik
                      let cleaned = raw.trim();
                      if (cleaned === "" || cleaned === "#") {
                        // Biarkan kosong / hanya #
                        return;
                      }

                      // Tambahkan # jika tidak ada
                      if (!cleaned.startsWith("#")) {
                        cleaned = "#" + cleaned;
                      }

                      // Validasi 3 atau 6 digit hex
                      if (/^#[0-9A-Fa-f]{6}$/i.test(cleaned)) {
                        setColorHex(cleaned.toLowerCase());
                      } else if (/^#[0-9A-Fa-f]{3}$/i.test(cleaned)) {
                        // Expand 3-digit ke 6-digit: #f00 → #ff0000
                        const expanded =
                          "#" +
                          cleaned[1] +
                          cleaned[1] +
                          cleaned[2] +
                          cleaned[2] +
                          cleaned[3] +
                          cleaned[3];
                        setColorHex(expanded.toLowerCase());
                      }
                      // Selain itu: belum valid, tidak update colorHex (tetap tampilkan yang diketik)
                    }}
                    onBlur={() => {
                      // Finalisasi saat keluar dari input
                      let val = hexInputValue.trim();
                      if (val === "" || val === "#") {
                        setHexInputValue(colorHex);
                        return;
                      }
                      if (!val.startsWith("#")) {
                        val = "#" + val;
                      }
                      // Expand 3-digit
                      if (/^#[0-9A-Fa-f]{3}$/i.test(val)) {
                        val =
                          "#" +
                          val[1] +
                          val[1] +
                          val[2] +
                          val[2] +
                          val[3] +
                          val[3];
                      }
                      if (/^#[0-9A-Fa-f]{6}$/i.test(val)) {
                        setColorHex(val.toLowerCase());
                        setHexInputValue(val.toLowerCase());
                      } else {
                        // Invalid → revert ke value terakhir yang valid
                        setHexInputValue(colorHex);
                      }
                    }}
                    placeholder="#000000"
                    className="flex-1 min-w-[80px] rounded-[var(--radius-input)] border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-1.5 text-sm text-[var(--color-text)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] font-mono"
                  />

                  {/* Tombol Add */}
                  <button
                    type="button"
                    onClick={() => {
                      // Pastikan hex valid sebelum add
                      if (!/^#[0-9A-Fa-f]{6}$/i.test(colorHex)) {
                        setErrors((prev) => ({
                          ...prev,
                          color: "Invalid hex code",
                        }));
                        return;
                      }
                      addColor();
                    }}
                    className="border border-[var(--color-border)] text-[var(--color-text)] py-1.5 px-4 rounded-[var(--radius-btn)] text-xs font-medium hover:bg-[var(--color-surface)] transition-colors flex items-center gap-1 shrink-0"
                  >
                    <Plus size={12} /> Add
                  </button>
                </div>
                {/* --- END BARIS --- */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-[var(--color-bg)] border-t border-[var(--color-border)] py-4 px-6 z-10 shadow-[0_-2px_8px_rgba(0,0,0,0.04)] md:relative md:shadow-none md:mt-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Products
          </Link>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/products")}
              className="border border-[var(--color-border)] text-[var(--color-text)] bg-transparent hover:bg-[var(--color-surface)]"
            >
              Discard
            </Button>
            <Button
              type="submit"
              disabled={saving || uploading}
              className="bg-[var(--color-text)] text-[var(--color-bg)] hover:opacity-90 px-5 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-[var(--color-bg)] border-t-transparent rounded-full animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} className="mr-2" />
                  {isEdit ? "Save Changes" : "Create Product"}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
