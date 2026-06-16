import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ShopFilterBar } from "@/components/public/shop/ShopFilterBar";

const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => "/shop",
  useSearchParams: () => new URLSearchParams(),
}));

describe("ShopFilterBar", () => {
  beforeEach(() => jest.clearAllMocks());

  it("renders all size buttons", () => {
    render(<ShopFilterBar selectedSizes={[]} selectedSort="" />);
    ["XS", "S", "M", "L", "XL", "XXL"].forEach((size) => {
      expect(screen.getByText(size)).toBeInTheDocument();
    });
  });

  it("renders sort dropdown", () => {
    render(<ShopFilterBar selectedSizes={[]} selectedSort="" />);
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("highlights selected sizes", () => {
    render(<ShopFilterBar selectedSizes={["L"]} selectedSort="" />);
    const sizeL = screen.getByText("L");
    expect(sizeL.className).toContain("bg-[var(--color-text)]");
  });

  it("toggles size on click", () => {
    render(<ShopFilterBar selectedSizes={[]} selectedSort="" />);
    fireEvent.click(screen.getByText("M"));
    expect(mockPush).toHaveBeenCalledWith("/shop?sizes=M");
  });

  it("deselects size when clicked again", () => {
    render(<ShopFilterBar selectedSizes={["M"]} selectedSort="" />);
    fireEvent.click(screen.getByText("M"));
    expect(mockPush).toHaveBeenCalledWith("/shop");
  });

  it("updates sort when dropdown changed", () => {
    render(<ShopFilterBar selectedSizes={[]} selectedSort="" />);
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "price_asc" },
    });
    expect(mockPush).toHaveBeenCalledWith("/shop?sort=price_asc");
  });
});