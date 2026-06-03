import { getProducts, getProductBySlug, getProductById } from "@/actions/products";
import { prisma } from "@/lib/prisma";

// Mock Prisma
jest.mock("@/lib/prisma", () => ({
  prisma: {
    product: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  },
}));

// Mock next/cache
jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

// Mock auth
jest.mock("@/lib/auth", () => ({
  getSession: jest.fn(() => Promise.resolve({ user: { email: "admin@haraca.id" } })),
}));

const mockProduct = {
  id: "1",
  name: "Haraca Oversize Tee",
  slug: "oversize-tee",
  price: 129000,
  category: "OVERSIZE",
  sizes: ["S", "M", "L"],
  colors: [{ name: "Black", hex: "#000000" }],
  photos: [],
  description: "A great tee",
  material: "Cotton",
  labels: ["BEST_SELLER"],
  linkShopee: null,
  linkTiktok: null,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("Product Actions", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("getProducts", () => {
    it("returns products and total count", async () => {
      (prisma.product.findMany as jest.Mock).mockResolvedValue([mockProduct]);
      (prisma.product.count as jest.Mock).mockResolvedValue(1);

      const result = await getProducts();

      expect(result.products).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.totalPages).toBe(1);
    });

    it("applies category filter", async () => {
      (prisma.product.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.product.count as jest.Mock).mockResolvedValue(0);

      await getProducts({ category: "OVERSIZE" });

      expect(prisma.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ category: "OVERSIZE" }),
        })
      );
    });

    it("applies search filter", async () => {
      (prisma.product.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.product.count as jest.Mock).mockResolvedValue(0);

      await getProducts({ search: "oversize" });

      expect(prisma.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            name: { contains: "oversize", mode: "insensitive" },
          }),
        })
      );
    });

    it("applies pagination correctly", async () => {
      (prisma.product.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.product.count as jest.Mock).mockResolvedValue(50);

      const result = await getProducts({ page: 2, limit: 20 });

      expect(prisma.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 20, take: 20 })
      );
      expect(result.totalPages).toBe(3);
    });

    it("filters by isActive", async () => {
      (prisma.product.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.product.count as jest.Mock).mockResolvedValue(0);

      await getProducts({ isActive: true });

      expect(prisma.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ isActive: true }),
        })
      );
    });
  });

  describe("getProductBySlug", () => {
    it("returns product with lookbook photos", async () => {
      (prisma.product.findUnique as jest.Mock).mockResolvedValue({
        ...mockProduct,
        lookbookPhotos: [],
      });

      const result = await getProductBySlug("oversize-tee");

      expect(prisma.product.findUnique).toHaveBeenCalledWith({
        where: { slug: "oversize-tee" },
        include: expect.objectContaining({
          lookbookPhotos: expect.any(Object),
        }),
      });
      expect(result?.slug).toBe("oversize-tee");
    });

    it("returns null for non-existent slug", async () => {
      (prisma.product.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await getProductBySlug("non-existent");
      expect(result).toBeNull();
    });
  });

  describe("getProductById", () => {
    it("returns product by id", async () => {
      (prisma.product.findUnique as jest.Mock).mockResolvedValue(mockProduct);

      const result = await getProductById("1");

      expect(prisma.product.findUnique).toHaveBeenCalledWith({
        where: { id: "1" },
      });
      expect(result?.id).toBe("1");
    });

    it("returns null for non-existent id", async () => {
      (prisma.product.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await getProductById("999");
      expect(result).toBeNull();
    });
  });
});