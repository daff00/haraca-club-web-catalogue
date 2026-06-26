"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { BannerSchema, type BannerInput } from "@/lib/validations";
import { getSession } from "@/lib/auth";
import { deleteFromStorage, deleteMultipleFromStorage } from "@/lib/supabase";
import type { BannerPage } from "@/types";

async function requireAuth() {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
}

export async function createBanner(input: BannerInput) {
  await requireAuth();

  const validated = BannerSchema.parse(input);

  const banner = await prisma.banner.create({ data: validated });

  revalidatePath("/admin/banners");
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/about");

  return { success: true, banner };
}

export async function getBanners(page?: BannerPage) {
  return prisma.banner.findMany({
    where: { ...(page && { page }) },
    orderBy: { createdAt: "desc" },
  });
}

export async function getActiveBanner(page: BannerPage) {
  return prisma.banner.findFirst({
    where: { page, isActive: true },
  });
}

export async function getActiveBanners(page: BannerPage) {
  return prisma.banner.findMany({
    where: { page, isActive: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateBanner(id: string, input: BannerInput) {
  await requireAuth();

  const validated = BannerSchema.parse(input);

  const existing = await prisma.banner.findUnique({
    where: { id },
    select: { photoUrl: true, photoUrlMobile: true },
  });

  if (validated.isActive) {
    await prisma.banner.updateMany({
      where: { page: validated.page, id: { not: id } },
      data: { isActive: false },
    });
  }

  const banner = await prisma.banner.update({
    where: { id },
    data: {
      ...validated,
      photoUrlMobile: validated.photoUrlMobile || null,
    },
  });

  // Hapus foto lama dari storage kalau diganti
  const urlsToDelete: string[] = [];
  if (existing?.photoUrl && existing.photoUrl !== validated.photoUrl) {
    urlsToDelete.push(existing.photoUrl);
  }
  if (existing?.photoUrlMobile && existing.photoUrlMobile !== validated.photoUrlMobile) {
    urlsToDelete.push(existing.photoUrlMobile);
  }
  if (urlsToDelete.length > 0) {
    await deleteMultipleFromStorage(urlsToDelete);
  }

  revalidatePath("/admin/banners");
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/lookbook");

  return { success: true, banner };
}

export async function deleteBanner(id: string) {
  await requireAuth();

  const banner = await prisma.banner.findUnique({
    where: { id },
    select: { photoUrl: true, photoUrlMobile: true },
  });

  await prisma.banner.delete({ where: { id } });

  const urlsToDelete = [
    banner?.photoUrl,
    banner?.photoUrlMobile,
  ].filter(Boolean) as string[];

  if (urlsToDelete.length > 0) {
    await deleteMultipleFromStorage(urlsToDelete);
  }

  revalidatePath("/admin/banners");
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/lookbook");

  return { success: true };
}