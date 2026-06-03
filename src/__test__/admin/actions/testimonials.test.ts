import {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  toggleTestimonialActive,
  deleteTestimonial,
} from "@/actions/testimonials";
import { prisma } from "@/lib/prisma";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    testimonial: {
      findMany: jest.fn(),
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

const mockTestimonial = {
  id: "1",
  customerName: "Anisa R.",
  photoUrl: null,
  rating: 5,
  text: "Amazing quality!",
  isActive: true,
};

describe("Testimonial Actions", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("getTestimonials", () => {
    it("returns all testimonials by default", async () => {
      (prisma.testimonial.findMany as jest.Mock).mockResolvedValue([
        mockTestimonial,
      ]);

      const result = await getTestimonials();

      expect(prisma.testimonial.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: {} })
      );
      expect(result).toHaveLength(1);
    });

    it("filters active only when onlyActive is true", async () => {
      (prisma.testimonial.findMany as jest.Mock).mockResolvedValue([]);

      await getTestimonials(true);

      expect(prisma.testimonial.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { isActive: true },
        })
      );
    });
  });

  describe("createTestimonial", () => {
    it("creates a testimonial successfully", async () => {
      (prisma.testimonial.create as jest.Mock).mockResolvedValue(
        mockTestimonial
      );

      const result = await createTestimonial({
        customerName: "Anisa R.",
        rating: 5,
        text: "Amazing quality!",
        isActive: true,
        photoUrl: "",
      });

      expect(result.success).toBe(true);
      expect(prisma.testimonial.create).toHaveBeenCalled();
    });

    it("throws when not authenticated", async () => {
      const { getSession } = require("@/lib/auth");
      getSession.mockResolvedValueOnce(null);

      await expect(
        createTestimonial({
          customerName: "Test",
          rating: 5,
          text: "Test",
          isActive: true,
          photoUrl: "",
        })
      ).rejects.toThrow("Unauthorized");
    });
  });

  describe("toggleTestimonialActive", () => {
    it("toggles testimonial active status", async () => {
      (prisma.testimonial.update as jest.Mock).mockResolvedValue({
        ...mockTestimonial,
        isActive: false,
      });

      const result = await toggleTestimonialActive("1", false);

      expect(result.success).toBe(true);
      expect(prisma.testimonial.update).toHaveBeenCalledWith({
        where: { id: "1" },
        data: { isActive: false },
      });
    });
  });

  describe("deleteTestimonial", () => {
    it("deletes a testimonial", async () => {
      (prisma.testimonial.delete as jest.Mock).mockResolvedValue(
        mockTestimonial
      );

      const result = await deleteTestimonial("1");

      expect(result.success).toBe(true);
      expect(prisma.testimonial.delete).toHaveBeenCalledWith({
        where: { id: "1" },
      });
    });
  });
});