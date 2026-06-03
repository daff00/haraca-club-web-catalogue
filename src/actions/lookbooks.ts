"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { LookbookPhotoSchema, type LookbookPhotoInput } from "@/lib/validations";
import { getSession } from "@/lib/auth";

async function requireAuth() {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
}

// ─── CREATE ───────────────────────────────────────────
export async function createLookbookPhoto(input: LookbookPhotoInput) {
  await requireAuth();

  const validated = LookbookPhotoSchema.parse(input);

  const photo = await prisma.lookbookPhoto.create({
    data: {
      ...validated,
      productId: validated.productId || null,
    },
  });

  revalidatePath("/admin/lookbook");
  revalidatePath("/lookbook");

  return { success: true, photo };
}

// ─── READ ALL ─────────────────────────────────────────
export async function getLookbookPhotos(filters?: {
  category?: string;
}) {
  return prisma.lookbookPhoto.findMany({
    where: {
      ...(filters?.category && { category: filters.category as any }),
    },
    include: {
      product: {
        select: { id: true, name: true, slug: true },
      },
    },
    orderBy: { order: "asc" },
  });
}

// ─── READ ONE ─────────────────────────────────────────
export async function getLookbookPhotoById(id: string) {
  return prisma.lookbookPhoto.findUnique({
    where: { id },
    include: {
      product: {
        select: { id: true, name: true, slug: true },
      },
    },
  });
}

// ─── UPDATE ───────────────────────────────────────────
export async function updateLookbookPhoto(id: string, input: LookbookPhotoInput) {
  await requireAuth();

  const validated = LookbookPhotoSchema.parse(input);

  const photo = await prisma.lookbookPhoto.update({
    where: { id },
    data: {
      ...validated,
      productId: validated.productId || null,
    },
  });

  revalidatePath("/admin/lookbook");
  revalidatePath("/lookbook");

  return { success: true, photo };
}

// ─── UPDATE ORDER (drag & drop reorder) ───────────────
export async function updateLookbookOrder(
  items: { id: string; order: number }[]
) {
  await requireAuth();

  await Promise.all(
    items.map((item) =>
      prisma.lookbookPhoto.update({
        where: { id: item.id },
        data: { order: item.order },
      })
    )
  );

  revalidatePath("/admin/lookbook");
  revalidatePath("/lookbook");

  return { success: true };
}

// ─── DELETE ───────────────────────────────────────────
export async function deleteLookbookPhoto(id: string) {
  await requireAuth();

  await prisma.lookbookPhoto.delete({ where: { id } });

  revalidatePath("/admin/lookbook");
  revalidatePath("/lookbook");

  return { success: true };
}