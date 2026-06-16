import { render, screen } from "@testing-library/react";
import { ProductCard } from "@/components/public/ProductCard";
import type { Product } from "@/types";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

const mockProduct: Product = {
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
  labels: [],
  linkShopee: null,
  linkTiktok: null,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("ProductCard", () => {
  it("renders product name", () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText("Haraca Oversize Tee")).toBeInTheDocument();
  });

  it("renders formatted price", () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText(/129\.000/)).toBeInTheDocument();
  });

  it("renders category", () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText("Oversize")).toBeInTheDocument();
  });

  it("renders placeholder when no photos", () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText("H")).toBeInTheDocument();
  });

  it("renders NEW badge when label is NEW_ARRIVAL", () => {
    render(<ProductCard product={{ ...mockProduct, labels: ["NEW_ARRIVAL"] as any }} />);
    expect(screen.getByText("NEW")).toBeInTheDocument();
  });

  it("renders BEST SELLER badge when label is BEST_SELLER", () => {
    render(<ProductCard product={{ ...mockProduct, labels: ["BEST_SELLER"] as any }} />);
    expect(screen.getByText("BEST SELLER")).toBeInTheDocument();
  });

  it("links to correct product page", () => {
    render(<ProductCard product={mockProduct} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/shop/oversize-tee");
  });
});