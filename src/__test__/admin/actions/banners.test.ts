import {
  getBanners,
  getActiveBanner,
  createBanner,
  updateBanner,
  deleteBanner,
} from "@/actions/banners";
import { prisma } from "@/lib/prisma";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    banner: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

jest.mock("next/cache", () => ({ revalidatePath: jest.fn() }));
jest.mock("@/lib/auth", () => ({
  getSession: jest.fn(() =>
    Promise.resolve({ user: { email: "admin@haraca.id" } })
  ),
}));

const mockBanner = {
  id: "1",
  page: "HOME" as const,
  photoUrl: "https://example.com/banner.jpg",
  isActive: true,
};

describe("Banner Actions", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("getBanners", () => {
    it("returns all banners", async () => {
      (prisma.banner.findMany as jest.Mock).mockResolvedValue([mockBanner]);

      const result = await getBanners();
      expect(result).toHaveLength(1);
    });

    it("filters by page", async () => {
      (prisma.banner.findMany as jest.Mock).mockResolvedValue([mockBanner]);

      await getBanners("HOME");

      expect(prisma.banner.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { page: "HOME" },
        })
      );
    });
  });

  describe("getActiveBanner", () => {
    it("returns active banner for a page", async () => {
      (prisma.banner.findFirst as jest.Mock).mockResolvedValue(mockBanner);

      const result = await getActiveBanner("HOME");

      expect(prisma.banner.findFirst).toHaveBeenCalledWith({
        where: { page: "HOME", isActive: true },
      });
      expect(result?.isActive).toBe(true);
    });

    it("returns null when no active banner", async () => {
      (prisma.banner.findFirst as jest.Mock).mockResolvedValue(null);

      const result = await getActiveBanner("SHOP");
      expect(result).toBeNull();
    });
  });

  describe("createBanner", () => {
    it("creates a banner successfully", async () => {
      (prisma.banner.create as jest.Mock).mockResolvedValue(mockBanner);

      const result = await createBanner({
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
      (prisma.banner.update as jest.Mock).mockResolvedValue(mockBanner);
      (prisma.banner.updateMany as jest.Mock).mockResolvedValue({ count: 1 });

      await updateBanner("1", {
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
      (prisma.banner.update as jest.Mock).mockResolvedValue({
        ...mockBanner,
        isActive: false,
      });

      await updateBanner("1", {
        page: "HOME",
        photoUrl: "https://example.com/banner.jpg",
        isActive: false,
      });

      expect(prisma.banner.updateMany).not.toHaveBeenCalled();
    });
  });

  describe("deleteBanner", () => {
    it("deletes a banner", async () => {
      (prisma.banner.delete as jest.Mock).mockResolvedValue(mockBanner);

      const result = await deleteBanner("1");

      expect(result.success).toBe(true);
      expect(prisma.banner.delete).toHaveBeenCalledWith({ where: { id: "1" } });
    });
  });
});