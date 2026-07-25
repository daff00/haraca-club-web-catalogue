"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { BrandContentSchema, type BrandContentInput } from "@/lib/validations";
import { getSession } from "@/lib/auth";
import { deleteMultipleFromStorage } from "@/lib/supabase";

async function requireAuth() {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
}

export async function getBrandContent() {
  return prisma.brandContent.findFirst();
}

export async function updateBrandContent(input: BrandContentInput) {
  await requireAuth();

  const validated = BrandContentSchema.parse(input);

  const existing = await prisma.brandContent.findFirst();

  const content = existing
    ? await prisma.brandContent.update({
      where: { id: existing.id },
      data: validated,
    })
    : await prisma.brandContent.create({ data: validated });

  // Delete behind the brand photo if it gets deleted by user
  if (existing) {
    const oldPhotos = (existing.behindPhotos as { url: string }[]) ?? [];;
    const newPhotos = validated.behindPhotos as { url: string }[];
    const newUrls = newPhotos.map((p) => p.url);

    const removedPhotos = oldPhotos
      .map((p) => p.url)
      .filter((url) => !newUrls.includes(url));

    if (removedPhotos.length > 0) {
      await deleteMultipleFromStorage(removedPhotos);
    }
  }

  revalidatePath("/admin/brand");
  revalidatePath("/about");

  return { success: true, content };
}