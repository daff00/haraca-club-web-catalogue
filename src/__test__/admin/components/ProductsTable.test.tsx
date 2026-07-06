import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ProductsTable } from "@/components/admin/ProductsTable";
import { toggleProductActive, deleteProduct } from "@/actions/products";
import { toast } from "sonner";

jest.mock("@/actions/products", () => ({
  bulkDeleteProducts: jest.fn(),
  bulkUpdateProducts: jest.fn(),
  toggleProductActive: jest.fn(),
  deleteProduct: jest.fn(),
}));

jest.mock("sonner", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), refresh: jest.fn() }),
  useSearchParams: () => ({ get: jest.fn(() => null) }),
}));

// Fix: mock ConfirmDialog supaya tidak pakai portal
jest.mock("@/components/ui/ConfirmDialog", () => ({
  ConfirmDialog: ({ open, onConfirm, onCancel, title }: any) =>
    open ? (
      <div>
        <p>{title}</p>
        <button onClick={onConfirm}>Confirm</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    ) : null,
}));

const mockProducts = [
  {
    id: "1",
    name: "Haraca Oversize Tee",
    slug: "oversize-tee",
    price: 129000,
    category: "OVERSIZE" as const,
    sizes: ["S", "M", "L"],
    colors: [{ name: "Black", hex: "#000000" }],
    photos: [],
    description: "A great tee",
    material: "Cotton",
    labels: ["BEST_SELLER"] as any,
    linkShopee: null,
    linkTiktok: null,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

describe("ProductsTable", () => {
  beforeEach(() => jest.clearAllMocks());

  it("renders empty state when no products", () => {
    render(<ProductsTable products={[]} />);
    // Sesuaikan dengan teks yang sebenarnya di komponen kamu
    expect(screen.getByText("No products yet")).toBeInTheDocument();
  });

  it("renders product list", () => {
    render(<ProductsTable products={mockProducts} />);
    expect(screen.getByText("Haraca Oversize Tee")).toBeInTheDocument();
  });

  it("renders Best Seller badge", () => {
    render(<ProductsTable products={mockProducts} />);
    expect(screen.getByText("Best Seller")).toBeInTheDocument();
  });

  it("renders formatted price", () => {
    render(<ProductsTable products={mockProducts} />);
    expect(screen.getByText(/129\.000/)).toBeInTheDocument();
  });

  it("calls toggleProductActive when toggle clicked", async () => {
    (toggleProductActive as jest.Mock).mockResolvedValue({ success: true });
    render(<ProductsTable products={mockProducts} />);

    const toggleBtn = screen.getByRole("button", { name: "" });
    fireEvent.click(toggleBtn);

    await waitFor(() => {
      expect(toggleProductActive).toHaveBeenCalledWith("1", false);
    });
  });

  it("shows confirm dialog when delete clicked", () => {
    render(<ProductsTable products={mockProducts} />);
    fireEvent.click(screen.getByText("Delete"));
    expect(screen.getByText("Delete Product")).toBeInTheDocument();
  });

  it("calls deleteProduct after confirm", async () => {
    (deleteProduct as jest.Mock).mockResolvedValue({ success: true });
    render(<ProductsTable products={mockProducts} />);

    fireEvent.click(screen.getByText("Delete"));
    fireEvent.click(screen.getByText("Confirm"));

    await waitFor(() => {
      expect(deleteProduct).toHaveBeenCalledWith("1");
      expect(toast.success).toHaveBeenCalledWith("Product deleted");
    });
  });

  it("does not call deleteProduct when cancel clicked", async () => {
    render(<ProductsTable products={mockProducts} />);
    fireEvent.click(screen.getByText("Delete"));
    fireEvent.click(screen.getByText("Cancel"));

    await waitFor(() => {
      expect(deleteProduct).not.toHaveBeenCalled();
    });
  });
});