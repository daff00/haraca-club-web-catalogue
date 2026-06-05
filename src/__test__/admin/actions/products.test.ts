// products.test.ts
import {
  getProducts,
  getProductBySlug,
  getProductById,
  deleteProduct,
  updateProduct,
} from "@/actions/products";
import { prisma } from "@/lib/prisma";
import * as supabaseLib from "@/lib/supabase";

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

// Mock Supabase
jest.mock("@/lib/supabase", () => ({
  deleteFromStorage: jest.fn(),
  deleteMultipleFromStorage: jest.fn(),
  supabaseAdmin: {},
  STORAGE_BUCKET: "haraca-media",
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
  linkShopee: "",   // was null
  linkTiktok: "",   // was null
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

  describe("deleteProduct", () => {
    it("deletes product from database", async () => {
      (prisma.product.findUnique as jest.Mock).mockResolvedValue(mockProduct);
      (prisma.product.delete as jest.Mock).mockResolvedValue(mockProduct);

      const result = await deleteProduct("1");
      expect(result.success).toBe(true);
      expect(prisma.product.delete).toHaveBeenCalledWith({ where: { id: "1" } });
    });

    it("deletes product photos from storage", async () => {
      (prisma.product.findUnique as jest.Mock).mockResolvedValue({
        ...mockProduct,
        photos: [
          "https://xxx.supabase.co/storage/v1/object/public/haraca-media/products/foto.jpg",
        ],
      });
      (prisma.product.delete as jest.Mock).mockResolvedValue(mockProduct);

      await deleteProduct("1");

      expect(supabaseLib.deleteMultipleFromStorage).toHaveBeenCalledWith([
        "https://xxx.supabase.co/storage/v1/object/public/haraca-media/products/foto.jpg",
      ]);
    });

    it("does not call deleteMultipleFromStorage when product has no photos", async () => {
      (prisma.product.findUnique as jest.Mock).mockResolvedValue({
        ...mockProduct,
        photos: [],
      });
      (prisma.product.delete as jest.Mock).mockResolvedValue(mockProduct);

      await deleteProduct("1");

      expect(supabaseLib.deleteMultipleFromStorage).not.toHaveBeenCalled();
    });
  });

  describe("updateProduct", () => {
    it("deletes removed photos from storage on update", async () => {
      const oldPhotos = [
        "https://xxx.supabase.co/storage/v1/object/public/haraca-media/products/old.jpg",
        "https://xxx.supabase.co/storage/v1/object/public/haraca-media/products/keep.jpg",
      ];
      (prisma.product.findUnique as jest.Mock).mockResolvedValue({
        ...mockProduct,
        photos: oldPhotos,
      });
      (prisma.product.update as jest.Mock).mockResolvedValue(mockProduct);

      const updateData = {
        name: "Haraca Oversize Tee",
        slug: "oversize-tee",
        price: 129000,
        category: "OVERSIZE" as const,
        sizes: ["S", "M", "L"],
        colors: [{ name: "Black", hex: "#000000" }],
        description: "A great tee",
        material: "Cotton",
        labels: ["BEST_SELLER"],
        linkShopee: "",   // string kosong, bukan null
        linkTiktok: "",   // string kosong
        isActive: true,
        photos: ["https://xxx.supabase.co/storage/v1/object/public/haraca-media/products/keep.jpg"],
      };

      await updateProduct("1", updateData);
      expect(supabaseLib.deleteMultipleFromStorage).toHaveBeenCalledWith([
        "https://xxx.supabase.co/storage/v1/object/public/haraca-media/products/old.jpg",
      ]);
    });

    it("does not delete storage when no photos removed", async () => {
      const photos = ["https://xxx.supabase.co/storage/v1/object/public/haraca-media/products/keep.jpg"];
      (prisma.product.findUnique as jest.Mock).mockResolvedValue({
        ...mockProduct,
        photos,
      });
      (prisma.product.update as jest.Mock).mockResolvedValue(mockProduct);

      const updateData = {
        name: "Haraca Oversize Tee",
        slug: "oversize-tee",
        price: 129000,
        category: "OVERSIZE" as const,
        sizes: ["S", "M", "L"],
        colors: [{ name: "Black", hex: "#000000" }],
        description: "A great tee",
        material: "Cotton",
        labels: ["BEST_SELLER"],
        linkShopee: "",
        linkTiktok: "",
        isActive: true,
        photos: photos,
      };

      await updateProduct("1", updateData);
      expect(supabaseLib.deleteMultipleFromStorage).not.toHaveBeenCalled();
    });
  });
});