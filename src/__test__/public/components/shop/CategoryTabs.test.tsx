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

  it("navigates when tab clicked", () => {
    render(<CategoryTabs selected="" />);
    fireEvent.click(screen.getByText("Tanktop"));
    expect(mockPush).toHaveBeenCalledWith("/shop?category=TANKTOP");
  });

  it("clears category when All Products clicked", () => {
    render(<CategoryTabs selected="TANKTOP" />);
    fireEvent.click(screen.getByText("All Products"));
    expect(mockPush).toHaveBeenCalledWith("/shop");
  });
});