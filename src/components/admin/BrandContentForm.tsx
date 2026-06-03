"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateBrandContent } from "@/actions/brand";
import type { BrandValue, BehindPhoto } from "@/types";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Sparkles,
  ImageIcon,
  Upload,
  X,
  Plus,
  Trash2,
  Save,
} from "lucide-react";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

interface Props {
  content: {
    id: string;
    brandStory: string;
    brandValues: unknown;
    behindPhotos: unknown;
  } | null;
}

export function BrandContentForm({ content }: Props) {
  const router = useRouter();

  // ─── Brand Story ──────────────────────────────────────
  const [brandStory, setBrandStory] = useState(content?.brandStory ?? "");

  // ─── Brand Values ─────────────────────────────────────
  const [brandValues, setBrandValues] = useState<BrandValue[]>(
    (content?.brandValues as BrandValue[]) ?? [
      {
        icon: "comfort",
        title: "Comfortable Always",
        description: "Designed for all-day wear without compromise.",
      },
      {
        icon: "design",
        title: "Simple by Design",
        description: "Minimal aesthetics that never go out of style.",
      },
      {
        icon: "price",
        title: "Honest Pricing",
        description: "Quality you can feel, at a price that makes sense.",
      },
      {
        icon: "daily",
        title: "Made for Daily Wear",
        description: "Versatile pieces that work for any occasion.",
      },
      {
        icon: "custom",
        title: "Open to Custom",
        description: "Want something unique? We can make it happen.",
      },
    ]
  );

  // ─── Behind Photos ────────────────────────────────────
  const [behindPhotos, setBehindPhotos] = useState<BehindPhoto[]>(
    (content?.behindPhotos as BehindPhoto[]) ?? []
  );

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ─── File validation ──────────────────────────────────
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

  // ─── Behind Photos Upload (with drag & drop) ──────────
  const uploadFiles = useCallback(
    async (files: FileList) => {
      const fileArray = Array.from(files);
      for (const file of fileArray) {
        if (!validateFile(file)) return;
      }

      setUploading(true);
      try {
        const uploaded: BehindPhoto[] = [];
        for (const file of fileArray) {
          const formData = new FormData();
          formData.append("file", file);
          const res = await fetch("/api/upload", { method: "POST", body: formData });
          const data = await res.json();
          if (data.url) {
            uploaded.push({ url: data.url, caption: "" });
          } else {
            toast.error(`Failed to upload ${file.name}`);
          }
        }
        setBehindPhotos((prev) => [...prev, ...uploaded]);
        if (uploaded.length) toast.success(`${uploaded.length} photo(s) uploaded`);
      } catch {
        toast.error("Upload failed");
      } finally {
        setUploading(false);
      }
    },
    []
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
    [uploadFiles]
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
    setBehindPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const updateCaption = (index: number, caption: string) => {
    setBehindPhotos((prev) =>
      prev.map((p, i) => (i === index ? { ...p, caption } : p))
    );
  };

  // ─── Brand Values Handlers ────────────────────────────
  const updateValue = (index: number, field: keyof BrandValue, val: string) => {
    setBrandValues((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [field]: val } : v))
    );
  };

  const addValue = () => {
    setBrandValues((prev) => [
      ...prev,
      { icon: "", title: "", description: "" },
    ]);
  };

  const removeValue = (index: number) => {
    setBrandValues((prev) => prev.filter((_, i) => i !== index));
  };

  // ─── Submit ───────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await updateBrandContent({
        brandStory,
        brandValues,
        behindPhotos,
      });
      if (res.success) {
        toast.success("Brand content saved");
        router.refresh();
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
    <form onSubmit={handleSubmit} className="pb-24">
      {/* Brand Story Card */}
      <div className="border border-[var(--color-border)] rounded-[var(--radius-card)] shadow-sm overflow-hidden mb-6">
        <div className="border-b border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-3">
          <div className="flex items-center gap-2">
            <BookOpen size={16} className="text-[var(--color-text-muted)]" />
            <h2 className="text-sm font-semibold text-[var(--color-text)]">
              Brand Story
            </h2>
          </div>
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
            Shown on the About page. Tell the story behind Haraca.
          </p>
        </div>
        <div className="p-5">
          <textarea
            value={brandStory}
            onChange={(e) => setBrandStory(e.target.value)}
            rows={6}
            placeholder="Haraca was born from..."
            className="w-full rounded-[var(--radius-input)] border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] resize-vertical"
            required
          />
        </div>
      </div>

      {/* Brand Values Card */}
      <div className="border border-[var(--color-border)] rounded-[var(--radius-card)] shadow-sm overflow-hidden mb-6">
        <div className="border-b border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-[var(--color-text-muted)]" />
                <h2 className="text-sm font-semibold text-[var(--color-text)]">
                  Brand Values
                </h2>
              </div>
              <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                Shown as cards on the About page.
              </p>
            </div>
            <button
              type="button"
              onClick={addValue}
              className="inline-flex items-center gap-1 text-xs font-medium text-[var(--color-accent)] hover:underline"
            >
              <Plus size={12} /> Add Value
            </button>
          </div>
        </div>
        <div className="p-5 space-y-4">
          {brandValues.map((value, i) => (
            <div
              key={i}
              className="border border-[var(--color-border)] rounded-[var(--radius-card)] bg-[var(--color-surface-alt)]/20 p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[var(--color-text-muted)]">
                  Value {i + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeValue(i)}
                  className="text-xs text-red-500 hover:underline flex items-center gap-1"
                >
                  <Trash2 size={12} /> Remove
                </button>
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--color-text)] mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={value.title}
                  onChange={(e) => updateValue(i, "title", e.target.value)}
                  placeholder="e.g. Comfortable Always"
                  className="w-full rounded-[var(--radius-input)] border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--color-text)] mb-1">
                  Description
                </label>
                <textarea
                  value={value.description}
                  onChange={(e) => updateValue(i, "description", e.target.value)}
                  placeholder="Short description..."
                  rows={2}
                  className="w-full rounded-[var(--radius-input)] border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] resize-vertical"
                  required
                />
              </div>
            </div>
          ))}
          {brandValues.length === 0 && (
            <p className="text-sm text-[var(--color-text-muted)] text-center py-4">
              No brand values added. Click "Add Value" to start.
            </p>
          )}
        </div>
      </div>

      {/* Behind The Brand Photos Card */}
      <div className="border border-[var(--color-border)] rounded-[var(--radius-card)] shadow-sm overflow-hidden">
        <div className="border-b border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-3">
          <div className="flex items-center gap-2">
            <ImageIcon size={16} className="text-[var(--color-text-muted)]" />
            <h2 className="text-sm font-semibold text-[var(--color-text)]">
              Behind The Brand Photos
            </h2>
          </div>
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
            Photos of your team, production process, packaging, etc.
          </p>
        </div>
        <div className="p-5 space-y-5">
          {/* Drag & Drop Upload Area */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`
              border-2 border-dashed rounded-[var(--radius-card)] p-6 text-center cursor-pointer
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
                  Click or drag to upload photos
                </p>
                <p className="text-xs text-[var(--color-text-muted)] mt-1">
                  JPEG, PNG, WEBP · Max 2MB per file
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

          {/* Photo List with Captions */}
          {behindPhotos.length > 0 && (
            <div className="space-y-3">
              {behindPhotos.map((photo, i) => (
                <div
                  key={i}
                  className="flex gap-3 items-start border border-[var(--color-border)] rounded-[var(--radius-card)] p-3 bg-[var(--color-surface-alt)]/20"
                >
                  <img
                    src={photo.url}
                    alt={`Behind photo ${i + 1}`}
                    className="w-20 h-20 object-cover rounded-[var(--radius-card)] flex-shrink-0 border border-[var(--color-border)]"
                  />
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={photo.caption}
                      onChange={(e) => updateCaption(i, e.target.value)}
                      placeholder="Add a caption (optional)"
                      className="w-full rounded-[var(--radius-input)] border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-1.5 text-sm text-[var(--color-text)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(i)}
                      className="text-xs text-red-500 hover:underline flex items-center gap-1"
                    >
                      <Trash2 size={12} /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-[var(--color-bg)] border-t border-[var(--color-border)] py-4 px-6 z-10 shadow-[0_-2px_8px_rgba(0,0,0,0.04)] md:relative md:shadow-none md:mt-6">
        <div className="max-w-4xl mx-auto flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.refresh()}
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
                Save Brand Content
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}