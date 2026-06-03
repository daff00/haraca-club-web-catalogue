import { getBrandContent, updateBrandContent } from "@/actions/brand";
import { prisma } from "@/lib/prisma";

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
  });
});