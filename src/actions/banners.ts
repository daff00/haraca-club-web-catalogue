"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { BannerSchema, type BannerInput } from "@/lib/validations";
import { getSession } from "@/lib/auth";

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

  revalidatePath("/admin/banners");
  revalidatePath("/");
  revalidatePath("/shop");

  return { success: true, banner };
}

export async function deleteBanner(id: string) {
  await requireAuth();

  await prisma.banner.delete({ where: { id } });

  revalidatePath("/admin/banners");
  revalidatePath("/");
  revalidatePath("/shop");

  return { success: true };
}