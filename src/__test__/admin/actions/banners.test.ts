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

// Mock Prisma
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

    it("filters by HOME page", async () => {
      (prisma.banner.findMany as jest.Mock).mockResolvedValue([mockBanner]);
      await banners.getBanners("HOME");
      expect(prisma.banner.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { page: "HOME" } })
      );
    });

    // --- NEW: LOOKBOOK page filter ---
    it("filters by LOOKBOOK page", async () => {
      (prisma.banner.findMany as jest.Mock).mockResolvedValue([]);
      await banners.getBanners("LOOKBOOK");
      expect(prisma.banner.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { page: "LOOKBOOK" } })
      );
    });

    // --- NEW: ABOUT page filter ---
    it("filters by ABOUT page", async () => {
      (prisma.banner.findMany as jest.Mock).mockResolvedValue([]);
      await banners.getBanners("ABOUT");
      expect(prisma.banner.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { page: "ABOUT" } })
      );
    });
  });

  describe("getActiveBanner", () => {
    it("returns active banner for HOME page", async () => {
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

    // --- NEW: LOOKBOOK active banner ---
    it("returns active banner for LOOKBOOK page", async () => {
      const lookbookBanner = { ...mockBanner, page: "LOOKBOOK" as const };
      (prisma.banner.findFirst as jest.Mock).mockResolvedValue(lookbookBanner);
      const result = await banners.getActiveBanner("LOOKBOOK");
      expect(prisma.banner.findFirst).toHaveBeenCalledWith({
        where: { page: "LOOKBOOK", isActive: true },
      });
      expect(result?.page).toBe("LOOKBOOK");
    });

    // --- NEW: ABOUT active banner ---
    it("returns active banner for ABOUT page", async () => {
      const aboutBanner = { ...mockBanner, page: "ABOUT" as const };
      (prisma.banner.findFirst as jest.Mock).mockResolvedValue(aboutBanner);
      const result = await banners.getActiveBanner("ABOUT");
      expect(prisma.banner.findFirst).toHaveBeenCalledWith({
        where: { page: "ABOUT", isActive: true },
      });
      expect(result?.page).toBe("ABOUT");
    });
  });

  describe("createBanner", () => {
    it("creates a HOME banner successfully", async () => {
      (prisma.banner.create as jest.Mock).mockResolvedValue(mockBanner);
      const result = await banners.createBanner({
        page: "HOME",
        photoUrl: "https://example.com/banner.jpg",
        isActive: false,
      });
      expect(result.success).toBe(true);
      expect(prisma.banner.create).toHaveBeenCalled();
    });

    // --- NEW: LOOKBOOK creation ---
    it("creates a LOOKBOOK banner", async () => {
      const lookbookBanner = { ...mockBanner, page: "LOOKBOOK" as const };
      (prisma.banner.create as jest.Mock).mockResolvedValue(lookbookBanner);
      const result = await banners.createBanner({
        page: "LOOKBOOK",
        photoUrl: "https://example.com/lookbook-banner.jpg",
        isActive: false,
      });
      expect(result.success).toBe(true);
      expect(prisma.banner.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ page: "LOOKBOOK" }),
        })
      );
    });

    // --- NEW: ABOUT creation ---
    it("creates an ABOUT banner", async () => {
      const aboutBanner = { ...mockBanner, page: "ABOUT" as const };
      (prisma.banner.create as jest.Mock).mockResolvedValue(aboutBanner);
      const result = await banners.createBanner({
        page: "ABOUT",
        photoUrl: "https://example.com/about-banner.jpg",
        isActive: false,
      });
      expect(result.success).toBe(true);
      expect(prisma.banner.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ page: "ABOUT" }),
        })
      );
    });
  });

  describe("updateBanner", () => {
    it("deactivates other banners when setting active (HOME)", async () => {
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

    // --- NEW: LOOKBOOK deactivates others ---
    it("deactivates other LOOKBOOK banners when setting active", async () => {
      (prisma.banner.findUnique as jest.Mock).mockResolvedValue({
        ...mockBanner,
        page: "LOOKBOOK",
      });
      (prisma.banner.update as jest.Mock).mockResolvedValue({
        ...mockBanner,
        page: "LOOKBOOK",
      });
      (prisma.banner.updateMany as jest.Mock).mockResolvedValue({ count: 1 });

      await banners.updateBanner("1", {
        page: "LOOKBOOK",
        photoUrl: "https://example.com/lookbook-banner.jpg",
        isActive: true,
      });

      expect(prisma.banner.updateMany).toHaveBeenCalledWith({
        where: { page: "LOOKBOOK", id: { not: "1" } },
        data: { isActive: false },
      });
    });

    // --- NEW: ABOUT deactivates others ---
    it("deactivates other ABOUT banners when setting active", async () => {
      (prisma.banner.findUnique as jest.Mock).mockResolvedValue({
        ...mockBanner,
        page: "ABOUT",
      });
      (prisma.banner.update as jest.Mock).mockResolvedValue({
        ...mockBanner,
        page: "ABOUT",
      });
      (prisma.banner.updateMany as jest.Mock).mockResolvedValue({ count: 1 });

      await banners.updateBanner("1", {
        page: "ABOUT",
        photoUrl: "https://example.com/about-banner.jpg",
        isActive: true,
      });

      expect(prisma.banner.updateMany).toHaveBeenCalledWith({
        where: { page: "ABOUT", id: { not: "1" } },
        data: { isActive: false },
      });
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