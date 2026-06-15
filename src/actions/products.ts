"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { ProductSchema, type ProductInput } from "@/lib/validations";
import slugify from "slugify";
import { deleteMultipleFromStorage } from "@/lib/supabase";

// Helper - Get Admin Session
import { getSession } from "@/lib/auth";

async function requireAuth() {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
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
}) {
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

  const where = {
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

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
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

  return product;
}

export async function getProductById(id: string) {
  return prisma.product.findUnique({ where: { id } });
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

  return { bestSellers, newArrivals };
}