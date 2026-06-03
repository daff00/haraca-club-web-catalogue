import {
  getLookbookPhotos,
  createLookbookPhoto,
  updateLookbookOrder,
  deleteLookbookPhoto,
} from "@/actions/lookbooks";
import { prisma } from "@/lib/prisma";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    lookbookPhoto: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
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

const mockPhoto = {
  id: "1",
  photoUrl: "https://example.com/photo.jpg",
  category: "DAILY_CASUAL" as const,
  productId: null,
  product: null,
  modelSize: "L",
  modelStats: "TB 170cm / BB 62kg",
  order: 0,
};

describe("Lookbook Actions", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("getLookbookPhotos", () => {
    it("returns all photos ordered by order field", async () => {
      (prisma.lookbookPhoto.findMany as jest.Mock).mockResolvedValue([
        mockPhoto,
      ]);

      const result = await getLookbookPhotos();

      expect(prisma.lookbookPhoto.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { order: "asc" },
        })
      );
      expect(result).toHaveLength(1);
    });

    it("filters by category", async () => {
      (prisma.lookbookPhoto.findMany as jest.Mock).mockResolvedValue([]);

      await getLookbookPhotos({ category: "DAILY_CASUAL" });

      expect(prisma.lookbookPhoto.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { category: "DAILY_CASUAL" },
        })
      );
    });
  });

  describe("createLookbookPhoto", () => {
    it("creates a lookbook photo", async () => {
      (prisma.lookbookPhoto.create as jest.Mock).mockResolvedValue(mockPhoto);

      const result = await createLookbookPhoto({
        photoUrl: "https://example.com/photo.jpg",
        category: "DAILY_CASUAL",
        productId: null,
        modelSize: "L",
        modelStats: "TB 170cm / BB 62kg",
        order: 0,
      });

      expect(result.success).toBe(true);
      expect(prisma.lookbookPhoto.create).toHaveBeenCalled();
    });

    it("throws when not authenticated", async () => {
      const { getSession } = require("@/lib/auth");
      getSession.mockResolvedValueOnce(null);

      await expect(
        createLookbookPhoto({
          photoUrl: "https://example.com/photo.jpg",
          category: "DAILY_CASUAL",
          productId: null,
          modelSize: "L",
          modelStats: "TB 170cm / BB 62kg",
          order: 0,
        })
      ).rejects.toThrow("Unauthorized");
    });
  });

  describe("updateLookbookOrder", () => {
    it("updates order for multiple photos", async () => {
      (prisma.lookbookPhoto.update as jest.Mock).mockResolvedValue(mockPhoto);

      const result = await updateLookbookOrder([
        { id: "1", order: 0 },
        { id: "2", order: 1 },
      ]);

      expect(result.success).toBe(true);
      expect(prisma.lookbookPhoto.update).toHaveBeenCalledTimes(2);
    });
  });

  describe("deleteLookbookPhoto", () => {
    it("deletes a photo", async () => {
      (prisma.lookbookPhoto.delete as jest.Mock).mockResolvedValue(mockPhoto);

      const result = await deleteLookbookPhoto("1");

      expect(result.success).toBe(true);
      expect(prisma.lookbookPhoto.delete).toHaveBeenCalledWith({
        where: { id: "1" },
      });
    });
  });
});