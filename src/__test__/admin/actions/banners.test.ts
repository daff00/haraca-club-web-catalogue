import * as banners from "@/actions/banners";
import { prisma } from "@/lib/prisma";
import * as supabaseLib from "@/lib/supabase";

// Mock Supabase
jest.mock("@/lib/supabase", () => ({
  deleteFromStorage: jest.fn(),
  deleteMultipleFromStorage: jest.fn(),
  supabaseAdmin: {},
  STORAGE_BUCKET: "haraca-media",
}));

// Mock Prisma (lengkapi dengan findUnique)
jest.mock("@/lib/prisma", () => ({
  prisma: {
    banner: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

jest.mock("next/cache", () => ({ revalidatePath: jest.fn() }));
jest.mock("@/lib/auth", () => ({
  getSession: jest.fn(() => Promise.resolve({ user: { email: "admin@haraca.id" } })),
}));

const mockBanner = {
  id: "1",
  page: "HOME" as const,
  photoUrl: "https://example.com/banner.jpg",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("Banner Actions", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("getBanners", () => {
    it("returns all banners", async () => {
      (prisma.banner.findMany as jest.Mock).mockResolvedValue([mockBanner]);
      const result = await banners.getBanners();
      expect(result).toHaveLength(1);
    });

    it("filters by page", async () => {
      (prisma.banner.findMany as jest.Mock).mockResolvedValue([mockBanner]);
      await banners.getBanners("HOME");
      expect(prisma.banner.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { page: "HOME" } })
      );
    });
  });

  describe("getActiveBanner", () => {
    it("returns active banner for a page", async () => {
      (prisma.banner.findFirst as jest.Mock).mockResolvedValue(mockBanner);
      const result = await banners.getActiveBanner("HOME");
      expect(prisma.banner.findFirst).toHaveBeenCalledWith({
        where: { page: "HOME", isActive: true },
      });
      expect(result?.isActive).toBe(true);
    });

    it("returns null when no active banner", async () => {
      (prisma.banner.findFirst as jest.Mock).mockResolvedValue(null);
      const result = await banners.getActiveBanner("SHOP");
      expect(result).toBeNull();
    });
  });

  describe("createBanner", () => {
    it("creates a banner successfully", async () => {
      (prisma.banner.create as jest.Mock).mockResolvedValue(mockBanner);
      const result = await banners.createBanner({
        page: "HOME",
        photoUrl: "https://example.com/banner.jpg",
        isActive: false,
      });
      expect(result.success).toBe(true);
      expect(prisma.banner.create).toHaveBeenCalled();
    });
  });

  describe("updateBanner", () => {
    it("deactivates other banners when setting active", async () => {
      (prisma.banner.findUnique as jest.Mock).mockResolvedValue(mockBanner);
      (prisma.banner.update as jest.Mock).mockResolvedValue(mockBanner);
      (prisma.banner.updateMany as jest.Mock).mockResolvedValue({ count: 1 });

      await banners.updateBanner("1", {
        page: "HOME",
        photoUrl: "https://example.com/banner.jpg",
        isActive: true,
      });

      expect(prisma.banner.updateMany).toHaveBeenCalledWith({
        where: { page: "HOME", id: { not: "1" } },
        data: { isActive: false },
      });
    });

    it("does not call updateMany when setting inactive", async () => {
      (prisma.banner.findUnique as jest.Mock).mockResolvedValue({
        ...mockBanner,
        isActive: false,
      });
      (prisma.banner.update as jest.Mock).mockResolvedValue({
        ...mockBanner,
        isActive: false,
      });

      await banners.updateBanner("1", {
        page: "HOME",
        photoUrl: "https://example.com/banner.jpg",
        isActive: false,
      });

      expect(prisma.banner.updateMany).not.toHaveBeenCalled();
    });

    it("deletes old photo from storage when photo changed", async () => {
      const oldUrl = "https://xxx.supabase.co/storage/v1/object/public/haraca-media/old-banner.jpg";
      const newUrl = "https://xxx.supabase.co/storage/v1/object/public/haraca-media/new-banner.jpg";
      (prisma.banner.findUnique as jest.Mock).mockResolvedValue({
        ...mockBanner,
        photoUrl: oldUrl,
      });
      (prisma.banner.update as jest.Mock).mockResolvedValue(mockBanner);
      (prisma.banner.updateMany as jest.Mock).mockResolvedValue({ count: 0 });

      await banners.updateBanner("1", {
        page: "HOME",
        photoUrl: newUrl,
        isActive: false,
      });

      expect(supabaseLib.deleteFromStorage).toHaveBeenCalledWith(oldUrl);
    });

    it("does not delete storage when photo unchanged", async () => {
      const sameUrl = "https://xxx.supabase.co/storage/v1/object/public/haraca-media/same.jpg";
      (prisma.banner.findUnique as jest.Mock).mockResolvedValue({
        ...mockBanner,
        photoUrl: sameUrl,
      });
      (prisma.banner.update as jest.Mock).mockResolvedValue(mockBanner);
      (prisma.banner.updateMany as jest.Mock).mockResolvedValue({ count: 0 });

      await banners.updateBanner("1", {
        page: "HOME",
        photoUrl: sameUrl,
        isActive: false,
      });

      expect(supabaseLib.deleteFromStorage).not.toHaveBeenCalled();
    });
  });

  describe("deleteBanner", () => {
    it("deletes a banner", async () => {
      (prisma.banner.findUnique as jest.Mock).mockResolvedValue(mockBanner);
      (prisma.banner.delete as jest.Mock).mockResolvedValue(mockBanner);

      const result = await banners.deleteBanner("1");
      expect(result.success).toBe(true);
      expect(prisma.banner.delete).toHaveBeenCalledWith({ where: { id: "1" } });
    });

    it("deletes banner photo from storage", async () => {
      (prisma.banner.findUnique as jest.Mock).mockResolvedValue(mockBanner);
      (prisma.banner.delete as jest.Mock).mockResolvedValue(mockBanner);

      await banners.deleteBanner("1");
      expect(supabaseLib.deleteFromStorage).toHaveBeenCalledWith(mockBanner.photoUrl);
    });
  });
});