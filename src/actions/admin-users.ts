"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { z } from "zod";

async function requireAuth() {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  return session;
}

// ─── Get all admin users ───────────────────────────────
export async function getAdminUsers() {
  await requireAuth();

  return prisma.adminUser.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
    },
    orderBy: { createdAt: "asc" },
  });
}

// ─── Create new admin ──────────────────────────────────
const CreateAdminSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function createAdminUser(input: {
  name: string;
  email: string;
  password: string;
}) {
  await requireAuth();

  const validated = CreateAdminSchema.parse(input);

  const existing = await prisma.adminUser.findUnique({
    where: { email: validated.email },
  });

  if (existing) throw new Error("Email already in use");

  const passwordHash = await bcrypt.hash(validated.password, 12);

  const admin = await prisma.adminUser.create({
    data: {
      email: validated.email,
      name: validated.name,
      passwordHash,
    },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
    },
  });

  return { success: true, admin };
}

// ─── Change own password ───────────────────────────────
const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export async function changePassword(input: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}) {
  const session = await requireAuth();

  const validated = ChangePasswordSchema.parse(input);

  const admin = await prisma.adminUser.findUnique({
    where: { email: session.user?.email ?? "" },
  });

  if (!admin) throw new Error("Admin not found");

  const isValid = await bcrypt.compare(
    validated.currentPassword,
    admin.passwordHash
  );

  if (!isValid) throw new Error("Current password is incorrect");

  const passwordHash = await bcrypt.hash(validated.newPassword, 12);

  await prisma.adminUser.update({
    where: { id: admin.id },
    data: { passwordHash },
  });

  return { success: true };
}

// ─── Delete admin ──────────────────────────────────────
export async function deleteAdminUser(id: string) {
  const session = await requireAuth();

  // Prevent deleting own account
  const current = await prisma.adminUser.findUnique({
    where: { email: session.user?.email ?? "" },
  });

  if (current?.id === id) {
    throw new Error("You cannot delete your own account");
  }

  await prisma.adminUser.delete({ where: { id } });

  return { success: true };
}