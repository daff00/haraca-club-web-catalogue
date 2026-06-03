import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ProductForm } from "@/components/admin/ProductForm";
import { createProduct, updateProduct } from "@/actions/products";
import { toast } from "sonner";

jest.mock("@/actions/products", () => ({
  createProduct: jest.fn(),
  updateProduct: jest.fn(),
}));

jest.mock("sonner", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), refresh: jest.fn() }),
}));

// Mock fetch untuk upload
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ url: "https://example.com/photo.jpg" }),
  }),
) as jest.Mock;

const mockProduct = {
  id: "1",
  name: "Haraca Oversize Tee",
  slug: "oversize-tee",
  price: 129000,
  category: "OVERSIZE" as const,
  sizes: ["M", "L"],
  colors: [{ name: "Black", hex: "#000000" }],
  photos: ["https://example.com/photo.jpg"],
  description: "A great tee",
  material: "Cotton 100%",
  labels: ["BEST_SELLER"] as any,
  linkShopee: null,
  linkTiktok: null,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("ProductForm", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("Add mode (no product prop)", () => {
    it("renders add form correctly", () => {
      render(<ProductForm />);
      expect(screen.getByText("Add New Product")).toBeInTheDocument();
    });

    it("renders all required fields", () => {
      render(<ProductForm />);
      expect(screen.getByText("Basic Information")).toBeInTheDocument();
      expect(screen.getByText("Product Photos")).toBeInTheDocument();
      expect(screen.getByText("Sizes Available")).toBeInTheDocument();
      expect(screen.getByText("Colors")).toBeInTheDocument();
      expect(screen.getByText("Labels")).toBeInTheDocument();
      expect(screen.getByText("Status")).toBeInTheDocument();
    });

    it("renders all size buttons", () => {
      render(<ProductForm />);
      ["XS", "S", "M", "L", "XL", "XXL"].forEach((size) => {
        expect(screen.getByText(size)).toBeInTheDocument();
      });
    });

    it("auto-generates slug from name", () => {
      render(<ProductForm />);
      const nameInput = screen.getByLabelText(/product name/i);
      fireEvent.change(nameInput, { target: { value: "Haraca New Tee" } });

      const slugInput = screen.getByLabelText(/slug/i);
      expect(slugInput).toHaveValue("haraca-new-tee");
    });

    it("toggles size selection", () => {
      render(<ProductForm />);
      const sizeL = screen.getByText("L");
      fireEvent.click(sizeL);
      expect(sizeL.className).toContain("bg-[var(--color-text)]");

      fireEvent.click(sizeL);
      expect(sizeL.className).not.toContain("bg-[var(--color-text)]");
    });

    it("toggles label Best Seller", () => {
      render(<ProductForm />);
      const bestSellerLabel = screen.getByText("Best Seller");
      fireEvent.click(bestSellerLabel);
      const activeToggle = document.querySelector(
        ".bg-\\[var\\(--color-text\\)\\]",
      );
      expect(activeToggle).toBeInTheDocument();
    });

    it("adds a color", () => {
      render(<ProductForm />);
      const colorNameInput = screen.getByPlaceholderText(
        "Color name (e.g. Black)",
      );
      fireEvent.change(colorNameInput, { target: { value: "Red" } });
      fireEvent.click(screen.getByRole("button", { name: "Add Color" }));
      expect(screen.getByText("Red")).toBeInTheDocument();
    });

    it("removes a color", () => {
      render(<ProductForm />);
      const colorNameInput = screen.getByPlaceholderText(
        "Color name (e.g. Black)",
      );
      fireEvent.change(colorNameInput, { target: { value: "Red" } });
      fireEvent.click(screen.getByRole("button", { name: "Add Color" }));
      expect(screen.getByText("Red")).toBeInTheDocument();

      fireEvent.click(screen.getByRole("button", { name: "×" }));
      expect(screen.queryByText("Red")).not.toBeInTheDocument();
    });

    it("toggles active status", () => {
      render(<ProductForm />);
      const statusText = screen.getByText("Active");
      expect(statusText).toBeInTheDocument();

      // Toggle off
      const toggleBtn = statusText.nextElementSibling as HTMLElement;
      fireEvent.click(toggleBtn);
      expect(screen.getByText("Inactive")).toBeInTheDocument();
    });

    it("calls createProduct on submit", async () => {
      (createProduct as jest.Mock).mockResolvedValue({ success: true });
      render(<ProductForm />);

      // Isi field
      fireEvent.change(screen.getByLabelText(/product name/i), {
        target: { value: "Test Product" },
      });
      fireEvent.change(screen.getByLabelText(/price/i), {
        target: { value: "99000" },
      });
      fireEvent.change(screen.getByLabelText(/description/i), {
        target: { value: "Test description" },
      });
      fireEvent.change(screen.getByLabelText(/material/i), {
        target: { value: "Cotton" },
      });

      // Pilih size M
      fireEvent.click(screen.getByRole("button", { name: "M" }));

      // Mock fetch upload
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ url: "https://example.com/test-photo.jpg" }),
      });

      // Upload foto
      const fileInput = document.querySelector(
        'input[type="file"]',
      ) as HTMLInputElement;
      const file = new File(["dummy"], "photo.jpg", { type: "image/jpeg" });
      fireEvent.change(fileInput, { target: { files: [file] } });

      // Tunggu hingga preview gambar muncul (tanda upload selesai)
      await screen.findByAltText(/product 1/i);

      // Klik submit
      fireEvent.click(screen.getByRole("button", { name: /create product/i }));

      // Verifikasi createProduct dipanggil
      await waitFor(() => {
        expect(createProduct).toHaveBeenCalled();
      });
    });

    it("shows validation error toast on empty submit", async () => {
      render(<ProductForm />);
      fireEvent.click(screen.getByRole("button", { name: "Create Product" }));

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          "Please fix the errors below.",
        );
      });
    });

    describe("Edit mode (with product prop)", () => {
      it("renders edit form correctly", () => {
        render(<ProductForm product={mockProduct} />);
        expect(screen.getByText("Edit Product")).toBeInTheDocument();
      });

      it("prefills form with product data", () => {
        render(<ProductForm product={mockProduct} />);
        expect(
          screen.getByDisplayValue("Haraca Oversize Tee"),
        ).toBeInTheDocument();
        expect(screen.getByDisplayValue("oversize-tee")).toBeInTheDocument();
        expect(screen.getByDisplayValue("129000")).toBeInTheDocument();
      });

      it("prefills selected sizes", () => {
        render(<ProductForm product={mockProduct} />);
        const sizeM = screen.getByText("M");
        const sizeL = screen.getByText("L");
        expect(sizeM.className).toContain("bg-[var(--color-text)]");
        expect(sizeL.className).toContain("bg-[var(--color-text)]");
      });

      it("prefills existing colors", () => {
        render(<ProductForm product={mockProduct} />);
        expect(screen.getByText("Black")).toBeInTheDocument();
      });

      it("prefills labels — Best Seller toggle is active", () => {
        render(<ProductForm product={mockProduct} />);
        // Best Seller label ada di DOM
        expect(screen.getByText("Best Seller")).toBeInTheDocument();
        // Toggle Best Seller harusnya active (bg charcoal)
        // Cari semua toggle dan pastikan ada yang active
        const activeToggles = document.querySelectorAll(
          "button.bg-\\[var\\(--color-text\\)\\]",
        );
        expect(activeToggles.length).toBeGreaterThan(0);
      });

      it("shows existing photos", () => {
        render(<ProductForm product={mockProduct} />);
        const images = screen.getAllByRole("img");
        expect(images[0]).toHaveAttribute(
          "src",
          "https://example.com/photo.jpg",
        );
      });

      it("shows Main badge on first photo", () => {
        render(<ProductForm product={mockProduct} />);
        expect(screen.getByText("Main")).toBeInTheDocument();
      });

      it("calls updateProduct on submit", async () => {
        (updateProduct as jest.Mock).mockResolvedValue({ success: true });

        render(<ProductForm product={mockProduct} />);
        fireEvent.click(screen.getByText("Save Changes"));

        await waitFor(() => {
          expect(updateProduct).toHaveBeenCalledWith("1", expect.any(Object));
        });
      });

      it("does not auto-generate slug in edit mode", () => {
        render(<ProductForm product={mockProduct} />);
        const nameInput = screen.getByDisplayValue("Haraca Oversize Tee");
        fireEvent.change(nameInput, { target: { value: "New Name" } });

        const slugInput = screen.getByDisplayValue("oversize-tee");
        expect(slugInput).toHaveValue("oversize-tee");
      });
    });
  });
});
