"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { BrandContentSchema, type BrandContentInput } from "@/lib/validations";
import { getSession } from "@/lib/auth";

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

  revalidatePath("/admin/brand");
  revalidatePath("/about");

  return { success: true, content };
}