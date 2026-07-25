import { getBrandContent, updateBrandContent } from "@/actions/brand";
import { prisma } from "@/lib/prisma";
import * as supabaseLib from "@/lib/supabase";

// Mock Supabase
jest.mock("@/lib/supabase", () => ({
  deleteFromStorage: jest.fn(),
  deleteMultipleFromStorage: jest.fn(),
  supabaseAdmin: {},
  STORAGE_BUCKET: "haraca-media",
}));

jest.mock("@/lib/prisma", () => ({
  prisma: {
    brandContent: {
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  },
}));

jest.mock("next/cache", () => ({ revalidatePath: jest.fn() }));
jest.mock("@/lib/auth", () => ({
  getSession: jest.fn(() =>
    Promise.resolve({ user: { email: "admin@haraca.id" } })
  ),
}));

const mockContent = {
  id: "singleton",
  brandStory: "Haraca was born from a simple belief.",
  brandValues: [
    { icon: "comfort", title: "Comfortable Always", description: "All-day wear." },
  ],
  behindPhotos: [],
};

const validInput = {
  brandStory: "Haraca was born from a simple belief.",
  brandValues: [
    { icon: "comfort", title: "Comfortable Always", description: "All-day wear." },
  ],
  behindPhotos: [],
};

describe("Brand Actions", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("getBrandContent", () => {
    it("returns brand content", async () => {
      (prisma.brandContent.findFirst as jest.Mock).mockResolvedValue(
        mockContent
      );

      const result = await getBrandContent();
      expect(result?.brandStory).toContain("Haraca");
    });

    it("returns null when no content exists", async () => {
      (prisma.brandContent.findFirst as jest.Mock).mockResolvedValue(null);

      const result = await getBrandContent();
      expect(result).toBeNull();
    });
  });

  describe("updateBrandContent", () => {
    it("creates content when none exists", async () => {
      (prisma.brandContent.findFirst as jest.Mock).mockResolvedValue(null);
      (prisma.brandContent.create as jest.Mock).mockResolvedValue(mockContent);

      const result = await updateBrandContent(validInput);

      expect(result.success).toBe(true);
      expect(prisma.brandContent.create).toHaveBeenCalled();
    });

    it("updates content when it exists", async () => {
      (prisma.brandContent.findFirst as jest.Mock).mockResolvedValue(
        mockContent
      );
      (prisma.brandContent.update as jest.Mock).mockResolvedValue(mockContent);

      const result = await updateBrandContent(validInput);

      expect(result.success).toBe(true);
      expect(prisma.brandContent.update).toHaveBeenCalled();
    });

    it("throws when not authenticated", async () => {
      const { getSession } = require("@/lib/auth");
      getSession.mockResolvedValueOnce(null);

      await expect(updateBrandContent(validInput)).rejects.toThrow(
        "Unauthorized"
      );
    });

    it("throws when brandStory is empty", async () => {
      await expect(
        updateBrandContent({ ...validInput, brandStory: "" })
      ).rejects.toThrow();
    });

    // Storage tests
    it("deletes removed behind photos from storage", async () => {
      (prisma.brandContent.findFirst as jest.Mock).mockResolvedValue({
        ...mockContent,
        behindPhotos: [
          { url: "https://xxx.supabase.co/storage/v1/object/public/haraca-media/old.jpg", caption: "Old" },
          { url: "https://xxx.supabase.co/storage/v1/object/public/haraca-media/keep.jpg", caption: "Keep" },
        ],
      });
      (prisma.brandContent.update as jest.Mock).mockResolvedValue(mockContent);

      await updateBrandContent({
        ...validInput,
        behindPhotos: [
          { url: "https://xxx.supabase.co/storage/v1/object/public/haraca-media/keep.jpg", caption: "Keep" },
        ],
      });

      expect(supabaseLib.deleteMultipleFromStorage).toHaveBeenCalledWith([
        "https://xxx.supabase.co/storage/v1/object/public/haraca-media/old.jpg",
      ]);
    });

    it("does not delete storage when no photos removed", async () => {
      const photos = [{ url: "https://xxx.supabase.co/storage/v1/object/public/haraca-media/keep.jpg", caption: "Keep" }];
      (prisma.brandContent.findFirst as jest.Mock).mockResolvedValue({
        ...mockContent,
        behindPhotos: photos,
      });
      (prisma.brandContent.update as jest.Mock).mockResolvedValue(mockContent);

      await updateBrandContent({ ...validInput, behindPhotos: photos });

      expect(supabaseLib.deleteMultipleFromStorage).not.toHaveBeenCalled();
    });
  });
});