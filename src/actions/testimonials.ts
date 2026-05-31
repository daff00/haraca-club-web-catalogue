"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { TestimonialSchema, type TestimonialInput } from "@/lib/validations";
import { getSession } from "@/lib/auth";

async function requireAuth() {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
}

export async function createTestimonial(input: TestimonialInput) {
  await requireAuth();

  const validated = TestimonialSchema.parse(input);

  const testimonial = await prisma.testimonial.create({
    data: {
      ...validated,
      photoUrl: validated.photoUrl || null,
    },
  });

  revalidatePath("/admin/testimonials");
  revalidatePath("/");

  return { success: true, testimonial };
}

export async function getTestimonials(onlyActive = false) {
  return prisma.testimonial.findMany({
    where: { ...(onlyActive && { isActive: true }) },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateTestimonial(id: string, input: TestimonialInput) {
  await requireAuth();

  const validated = TestimonialSchema.parse(input);

  const testimonial = await prisma.testimonial.update({
    where: { id },
    data: {
      ...validated,
      photoUrl: validated.photoUrl || null,
    },
  });

  revalidatePath("/admin/testimonials");
  revalidatePath("/");

  return { success: true, testimonial };
}

export async function toggleTestimonialActive(id: string, isActive: boolean) {
  await requireAuth();

  await prisma.testimonial.update({
    where: { id },
    data: { isActive },
  });

  revalidatePath("/admin/testimonials");
  revalidatePath("/");

  return { success: true };
}

export async function deleteTestimonial(id: string) {
  await requireAuth();

  await prisma.testimonial.delete({ where: { id } });

  revalidatePath("/admin/testimonials");
  revalidatePath("/");

  return { success: true };
}