import { render, screen, fireEvent } from "@testing-library/react";
import { LookbookModal } from "@/components/public/lookbook/LookbookModal";
import type { LookbookPhoto } from "@/types";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

const mockPhoto: LookbookPhoto = {
  id: "1",
  photoUrl: "https://example.com/photo.jpg",
  category: "DAILY_CASUAL",
  productId: "prod-1",
  product: { id: "prod-1", name: "Haraca Oversize Tee", slug: "oversize-tee" },
  modelSize: "L",
  modelStats: "TB 170cm / BB 62kg",
  order: 0,
};

describe("LookbookModal", () => {
  it("renders photo", () => {
    render(<LookbookModal photo={mockPhoto} onClose={jest.fn()} />);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", expect.stringContaining("photo"));
  });

  it("renders category label", () => {
    render(<LookbookModal photo={mockPhoto} onClose={jest.fn()} />);
    expect(screen.getByText("Daily Casual")).toBeInTheDocument();
  });

  it("renders product name", () => {
    render(<LookbookModal photo={mockPhoto} onClose={jest.fn()} />);
    expect(screen.getByText("Haraca Oversize Tee")).toBeInTheDocument();
  });

  it("renders model stats", () => {
    render(<LookbookModal photo={mockPhoto} onClose={jest.fn()} />);
    expect(screen.getByText(/L/)).toBeInTheDocument();
    expect(screen.getByText(/170cm/)).toBeInTheDocument();
  });

  it("renders View Product link", () => {
    render(<LookbookModal photo={mockPhoto} onClose={jest.fn()} />);
    const link = screen.getByText("View This Product →");
    expect(link).toHaveAttribute("href", "/shop/oversize-tee");
  });

  it("calls onClose when X button clicked", () => {
    const onClose = jest.fn();
    render(<LookbookModal photo={mockPhoto} onClose={onClose} />);
    fireEvent.click(screen.getByRole("button"));
    expect(onClose).toHaveBeenCalled();
  });

  it("calls onClose when backdrop clicked", () => {
    const onClose = jest.fn();
    render(<LookbookModal photo={mockPhoto} onClose={onClose} />);
    // Gunakan queryByRole (tidak throw) lalu fallback ke selector class
    const backdrop = screen.queryByRole("dialog") ?? document.querySelector(".fixed.inset-0");
    expect(backdrop).toBeTruthy(); // Pastikan ditemukan
    fireEvent.click(backdrop!);
    expect(onClose).toHaveBeenCalled();
  });

  it("calls onClose when Escape pressed", () => {
    const onClose = jest.fn();
    render(<LookbookModal photo={mockPhoto} onClose={onClose} />);
    fireEvent.keyDown(window, { key: "Escape" });
    expect(onClose).toHaveBeenCalled();
  });
});