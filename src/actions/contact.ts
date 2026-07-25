"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { ContactInfoSchema, type ContactInfoInput } from "@/lib/validations";
import { getSession } from "@/lib/auth";

async function requireAuth() {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
}

export async function getContactInfo() {
  return prisma.contactInfo.findFirst();
}

export async function updateContactInfo(input: ContactInfoInput) {
  await requireAuth();

  const validated = ContactInfoSchema.parse(input);

  const existing = await prisma.contactInfo.findFirst();

  const contact = existing
    ? await prisma.contactInfo.update({
        where: { id: existing.id },
        data: validated,
      })
    : await prisma.contactInfo.create({ data: validated });

  revalidatePath("/admin/settings");
  revalidatePath("/contact");
  revalidatePath("/"); // footer juga pakai contact info

  return { success: true, contact };
}