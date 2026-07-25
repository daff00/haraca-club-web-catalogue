"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { ProductSchema, type ProductInput } from "@/lib/validations";
import type { Product, ProductColor } from "@/types";
import slugify from "slugify";
import { deleteMultipleFromStorage } from "@/lib/supabase";

// Helper - Get Admin Session
import { getSession } from "@/lib/auth";

async function requireAuth() {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
}

type ProductFilters = {
  category?: string;
  isActive?: boolean;
  label?: string;
  search?: string;
  sizes?: string;
};

function buildProductWhere(filters?: ProductFilters) {
  return {
    ...(filters?.category && { category: filters.category as any }),
    ...(filters?.isActive !== undefined && { isActive: filters.isActive }),
    ...(filters?.label && { labels: { has: filters.label as any } }),
    ...(filters?.search && {
      name: { contains: filters.search, mode: "insensitive" as any },
    }),
    ...(filters?.sizes && {
      sizes: { hasSome: filters.sizes.split(",") },
    }),
  };
}

// CREATE
export async function createProduct(input: ProductInput) {
  await requireAuth();

  const validated = ProductSchema.parse(input);

  const slug = slugify(validated.slug, {
    lower: true,
    strict: true,
  });

  const product = await prisma.product.create({
    data: {
      ...validated,
      slug,
      linkShopee: validated.linkShopee || null,
      linkTiktok: validated.linkTiktok || null,
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/shop");

  return { success: true, product };
}

// ─── READ ALL ─────────────────────────────────────────
export async function getProducts(filters?: {
  category?: string;
  isActive?: boolean;
  label?: string;
  search?: string;
  sizes?: string;
  sort?: string;
  page?: number;
  limit?: number;
}): Promise<{ products: Product[]; total: number; page: number; totalPages: number }> {
  const page = filters?.page ?? 1;
  const limit = filters?.limit ?? 20;
  const skip = (page - 1) * limit;

  // Sort product
  const orderBy = (() => {
    switch (filters?.sort) {
      case "price_asc": return { price: "asc" as const };
      case "price_desc": return { price: "desc" as const };
      case "newest": return { createdAt: "desc" as const };
      default: return { createdAt: "desc" as const };
    }
  })();

  const where = buildProductWhere(filters);

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  const normalizedProducts = products.map((product) => ({
    ...product,
    colors: (product.colors ?? []) as unknown as Product["colors"],
    linkShopee: product.linkShopee ?? "",
    linkTiktok: product.linkTiktok ?? "",
  }));

  return {
    products: normalizedProducts,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

export async function bulkUpdateProducts({
  ids,
  filters,
  selectAllMatching,
  updates,
}: {
  ids?: string[];
  filters?: ProductFilters;
  selectAllMatching?: boolean;
  updates: {
    price?: number;
    isActive?: boolean;
    labels?: string[];
    sizes?: string[];
    linkShopee?: string;
    linkTiktok?: string;
  };
}) {
  await requireAuth();

  const where = selectAllMatching
    ? buildProductWhere(filters)
    : ids && ids.length > 0
    ? { id: { in: ids } }
    : undefined;

  if (!where) {
    return { success: false, message: "No products selected." };
  }

  const data: Record<string, unknown> = {};

  if (updates.price !== undefined) data.price = updates.price;
  if (updates.isActive !== undefined) data.isActive = updates.isActive;
  if (updates.labels && updates.labels.length > 0) data.labels = updates.labels;
  if (updates.sizes && updates.sizes.length > 0) data.sizes = updates.sizes;
  if (updates.linkShopee !== undefined) data.linkShopee = updates.linkShopee;
  if (updates.linkTiktok !== undefined) data.linkTiktok = updates.linkTiktok;

  if (Object.keys(data).length === 0) {
    return { success: false, message: "No changes provided." };
  }

  await prisma.product.updateMany({ where, data });

  revalidatePath("/admin/products");
  revalidatePath("/shop");

  return { success: true };
}

export async function bulkDeleteProducts({
  ids,
  filters,
  selectAllMatching,
}: {
  ids?: string[];
  filters?: ProductFilters;
  selectAllMatching?: boolean;
}) {
  await requireAuth();

  const where = selectAllMatching
    ? buildProductWhere(filters)
    : ids && ids.length > 0
    ? { id: { in: ids } }
    : undefined;

  if (!where) {
    return { success: false, message: "No products selected." };
  }

  const products = await prisma.product.findMany({
    where,
    select: { id: true, photos: true },
  });

  const idsToDelete = products.map((product) => product.id);
  const photoUrls = products.flatMap((product) => product.photos || []);

  if (idsToDelete.length > 0) {
    await prisma.product.deleteMany({ where: { id: { in: idsToDelete } } });
  }

  if (photoUrls.length > 0) {
    await deleteMultipleFromStorage(photoUrls);
  }

  revalidatePath("/admin/products");
  revalidatePath("/shop");

  return { success: true, deletedCount: idsToDelete.length };
}

// ─── READ ONE ─────────────────────────────────────────
export async function getProductBySlug(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      lookbookPhotos: {
        orderBy: { order: "asc" },
        take: 6,
      },
    },
  });

  if (!product) return null;

  return {
    ...product,
    colors: (product.colors ?? []) as unknown as ProductColor[],
  };
}

export async function getProductById(id: string) {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return null;
  
  return {
    ...product,
    colors: (product.colors ?? []) as unknown as ProductColor[],
  };
}

// ─── UPDATE ───────────────────────────────────────────
export async function updateProduct(id: string, input: ProductInput) {
  await requireAuth();

  const validated = ProductSchema.parse(input);

  const slug = slugify(validated.slug, {
    lower: true,
    strict: true,
  });

  // Get old photo
  const existing = await prisma.product.findUnique({
    where: { id },
    select: { photos: true },
  });

  const product = await prisma.product.update({
    where: { id },
    data: {
      ...validated,
      slug,
      linkShopee: validated.linkShopee || null,
      linkTiktok: validated.linkTiktok || null,
    },
  });

  // Validasi foto
  if (existing?.photos) {
    const removedPhotos = existing.photos.filter(
      (url) => !validated.photos.includes(url)
    );
    if (removedPhotos.length > 0) {
      await deleteMultipleFromStorage(removedPhotos);
    }
  }

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}`);
  revalidatePath("/shop");
  revalidatePath(`/shop/${slug}`);

  return { success: true, product };
}

// ─── TOGGLE ACTIVE ────────────────────────────────────
export async function toggleProductActive(id: string, isActive: boolean) {
  await requireAuth();

  await prisma.product.update({
    where: { id },
    data: { isActive },
  });

  revalidatePath("/admin/products");
  revalidatePath("/shop");

  return { success: true };
}

// ─── DELETE ───────────────────────────────────────────
export async function deleteProduct(id: string) {
  await requireAuth();

  // Get produxt photo before it gets deleted
  const product = await prisma.product.findUnique({
    where: { id },
    select: { photos: true },
  });

  // Delete from database
  await prisma.product.delete({ where: { id } });

  // Delete photo from storage
  if (product?.photos?.length) {
    await deleteMultipleFromStorage(product.photos);
  }

  revalidatePath("/admin/products");
  revalidatePath("/shop");

  return { success: true };
}

// ─── GET BEST SELLERS & NEW ARRIVALS (untuk Home) ─────
export async function getFeaturedProducts() {
  const [bestSellers, newArrivals] = await Promise.all([
    prisma.product.findMany({
      where: { isActive: true, labels: { has: "BEST_SELLER" } },
      take: 8,
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.findMany({
      where: { isActive: true, labels: { has: "NEW_ARRIVAL" } },
      take: 8,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const normalizeProducts = (products: typeof bestSellers) =>
    products.map((product) => ({
      ...product,
      colors: (product.colors ?? []) as unknown as ProductColor[],
    }));

  return {
    bestSellers: normalizeProducts(bestSellers),
    newArrivals: normalizeProducts(newArrivals),
  };
}