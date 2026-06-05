"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { BannerSchema, type BannerInput } from "@/lib/validations";
import { getSession } from "@/lib/auth";
import { deleteFromStorage } from "@/lib/supabase";

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

  return { success: true, banner };
}

export async function getBanners(page?: "HOME" | "SHOP") {
  return prisma.banner.findMany({
    where: { ...(page && { page }) },
    orderBy: { createdAt: "desc" },
  });
}

export async function getActiveBanner(page: "HOME" | "SHOP") {
  return prisma.banner.findFirst({
    where: { page, isActive: true },
  });
}

export async function updateBanner(id: string, input: BannerInput) {
  await requireAuth();

  const validated = BannerSchema.parse(input);

  // Get exiting banner
  const existing = await prisma.banner.findUnique({
    where: { id },
    select: {photoUrl: true},
  });

  // Kalau banner ini di-set active, nonaktifkan banner lain di halaman yang sama
  if (validated.isActive) {
    await prisma.banner.updateMany({
      where: { page: validated.page, id: { not: id } },
      data: { isActive: false },
    });
  }

  const banner = await prisma.banner.update({
    where: { id },
    data: validated,
  });

  // Delete old photo when updated
  if (existing?.photoUrl && existing.photoUrl !== validated.photoUrl) {
    await deleteFromStorage(existing.photoUrl);
  }

  revalidatePath("/admin/banners");
  revalidatePath("/");
  revalidatePath("/shop");

  return { success: true, banner };
}

export async function deleteBanner(id: string) {
  await requireAuth();

  // Get banner
  const banner = await prisma.banner.findUnique({
    where: { id },
    select: { photoUrl: true },
  });

  await prisma.banner.delete({ where: { id } });

  if (banner?.photoUrl) {
    await deleteFromStorage(banner.photoUrl);
  }

  revalidatePath("/admin/banners");
  revalidatePath("/");
  revalidatePath("/shop");

  return { success: true };
}