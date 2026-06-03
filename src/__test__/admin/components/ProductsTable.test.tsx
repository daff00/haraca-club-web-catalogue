import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ProductsTable } from "@/components/admin/ProductsTable";
import { toggleProductActive, deleteProduct } from "@/actions/products";
import { toast } from "sonner";

// Mock server actions
jest.mock("@/actions/products", () => ({
  toggleProductActive: jest.fn(),
  deleteProduct: jest.fn(),
}));

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), refresh: jest.fn() }),
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
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders empty state when no products", () => {
    render(<ProductsTable products={[]} />);
    expect(screen.getByText("No products found.")).toBeInTheDocument();
  });

  it("renders product list", () => {
    render(<ProductsTable products={mockProducts} />);
    expect(screen.getByText("Haraca Oversize Tee")).toBeInTheDocument();
    expect(screen.getByText("/oversize-tee")).toBeInTheDocument();
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

    const toggle = screen.getByRole("button", { name: "" });
    fireEvent.click(toggle);

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