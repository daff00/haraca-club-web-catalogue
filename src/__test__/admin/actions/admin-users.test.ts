import {
  getAdminUsers,
  createAdminUser,
  changePassword,
  deleteAdminUser,
} from "@/actions/admin-users";
import { prisma } from "@/lib/prisma";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    adminUser: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

jest.mock("next/cache", () => ({ revalidatePath: jest.fn() }));
jest.mock("bcryptjs", () => ({
  hash: jest.fn(() => Promise.resolve("hashed_password")),
  compare: jest.fn(() => Promise.resolve(true)),
}));
jest.mock("@/lib/auth", () => ({
  getSession: jest.fn(() =>
    Promise.resolve({ user: { email: "admin@haraca.id", id: "1" } })
  ),
}));

const mockAdmin = {
  id: "1",
  email: "admin@haraca.id",
  name: "Haraca Admin",
  passwordHash: "hashed_password",
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("Admin Users Actions", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("getAdminUsers", () => {
    it("returns list of admin users", async () => {
      (prisma.adminUser.findMany as jest.Mock).mockResolvedValue([
        { id: "1", email: "admin@haraca.id", name: "Haraca Admin", createdAt: new Date() },
      ]);

      const result = await getAdminUsers();
      expect(result).toHaveLength(1);
      expect(result[0].email).toBe("admin@haraca.id");
    });

    it("throws when not authenticated", async () => {
      const { getSession } = require("@/lib/auth");
      getSession.mockResolvedValueOnce(null);

      await expect(getAdminUsers()).rejects.toThrow("Unauthorized");
    });
  });

  describe("createAdminUser", () => {
    it("creates a new admin user", async () => {
      (prisma.adminUser.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.adminUser.create as jest.Mock).mockResolvedValue({
        id: "2",
        email: "new@haraca.id",
        name: "New Admin",
        createdAt: new Date(),
      });

      const result = await createAdminUser({
        name: "New Admin",
        email: "new@haraca.id",
        password: "password123",
      });

      expect(result.success).toBe(true);
      expect(result.admin.email).toBe("new@haraca.id");
    });

    it("throws when email already exists", async () => {
      (prisma.adminUser.findUnique as jest.Mock).mockResolvedValue(mockAdmin);

      await expect(
        createAdminUser({
          name: "Another Admin",
          email: "admin@haraca.id",
          password: "password123",
        })
      ).rejects.toThrow("Email already in use");
    });

    it("throws when password is too short", async () => {
      (prisma.adminUser.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        createAdminUser({
          name: "Test",
          email: "test@haraca.id",
          password: "short",
        })
      ).rejects.toThrow();
    });

    it("hashes the password before saving", async () => {
      const bcrypt = require("bcryptjs");
      (prisma.adminUser.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.adminUser.create as jest.Mock).mockResolvedValue({
        id: "2",
        email: "new@haraca.id",
        name: "New Admin",
        createdAt: new Date(),
      });

      await createAdminUser({
        name: "New Admin",
        email: "new@haraca.id",
        password: "password123",
      });

      expect(bcrypt.hash).toHaveBeenCalledWith("password123", 12);
    });
  });

  describe("changePassword", () => {
    it("changes password when current password is correct", async () => {
      const bcrypt = require("bcryptjs");
      (prisma.adminUser.findUnique as jest.Mock).mockResolvedValue(mockAdmin);
      (prisma.adminUser.update as jest.Mock).mockResolvedValue(mockAdmin);

      const result = await changePassword({
        currentPassword: "oldpassword",
        newPassword: "newpassword123",
        confirmPassword: "newpassword123",
      });

      expect(result.success).toBe(true);
      expect(bcrypt.compare).toHaveBeenCalledWith("oldpassword", "hashed_password");
      expect(bcrypt.hash).toHaveBeenCalledWith("newpassword123", 12);
    });

    it("throws when current password is incorrect", async () => {
      const bcrypt = require("bcryptjs");
      bcrypt.compare.mockResolvedValueOnce(false);
      (prisma.adminUser.findUnique as jest.Mock).mockResolvedValue(mockAdmin);

      await expect(
        changePassword({
          currentPassword: "wrongpassword",
          newPassword: "newpassword123",
          confirmPassword: "newpassword123",
        })
      ).rejects.toThrow("Current password is incorrect");
    });

    it("throws when passwords do not match", async () => {
      await expect(
        changePassword({
          currentPassword: "oldpassword",
          newPassword: "newpassword123",
          confirmPassword: "differentpassword",
        })
      ).rejects.toThrow();
    });

    it("throws when new password is too short", async () => {
      await expect(
        changePassword({
          currentPassword: "oldpassword",
          newPassword: "short",
          confirmPassword: "short",
        })
      ).rejects.toThrow();
    });
  });

  describe("deleteAdminUser", () => {
    it("deletes an admin user", async () => {
      (prisma.adminUser.findUnique as jest.Mock).mockResolvedValue({
        ...mockAdmin,
        id: "99",
      });
      (prisma.adminUser.delete as jest.Mock).mockResolvedValue(mockAdmin);

      const result = await deleteAdminUser("2");
      expect(result.success).toBe(true);
    });

    it("throws when trying to delete own account", async () => {
      (prisma.adminUser.findUnique as jest.Mock).mockResolvedValue(mockAdmin);

      await expect(deleteAdminUser("1")).rejects.toThrow(
        "You cannot delete your own account"
      );
    });
  });
});