import { render, screen, fireEvent } from "@testing-library/react";
import { CategoryTabs } from "@/components/public/shop/CategoryTabs";

const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => "/shop",
  useSearchParams: () => new URLSearchParams(),
}));

describe("CategoryTabs", () => {
  beforeEach(() => jest.clearAllMocks());

  it("renders all tabs", () => {
    render(<CategoryTabs selected="" />);
    expect(screen.getByText("All Products")).toBeInTheDocument();
    expect(screen.getByText("Tanktop")).toBeInTheDocument();
    expect(screen.getByText("Oversize")).toBeInTheDocument();
    expect(screen.getByText("Regular")).toBeInTheDocument();
  });

  it("highlights active tab", () => {
    render(<CategoryTabs selected="TANKTOP" />);
    const activeTab = screen.getByText("Tanktop");
    expect(activeTab.className).toContain("text-[var(--color-text)]");
  });

  it("creates correct tab link href", () => {
    render(<CategoryTabs selected="" />);
    const tanktopTab = screen.getByRole("link", { name: "Tanktop" });
    expect(tanktopTab).toHaveAttribute("href", "/shop?category=TANKTOP");
  });

  it("creates correct all products link href", () => {
    render(<CategoryTabs selected="TANKTOP" />);
    const allProductsTab = screen.getByRole("link", { name: "All Products" });
    expect(allProductsTab).toHaveAttribute("href", "/shop");
  });
});