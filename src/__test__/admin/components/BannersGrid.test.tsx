import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BannersGrid } from "@/components/admin/BannersGrid";
import { updateBanner, deleteBanner } from "@/actions/banners";
import { toast } from "sonner";

jest.mock("@/actions/banners", () => ({
  updateBanner: jest.fn(),
  deleteBanner: jest.fn(),
}));

jest.mock("sonner", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), refresh: jest.fn() }),
}));

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

const mockBanners = [
  {
    id: "1",
    page: "HOME" as const,
    photoUrl: "https://example.com/banner-home.jpg",
    isActive: true,
  },
  {
    id: "2",
    page: "SHOP" as const,
    photoUrl: "https://example.com/banner-shop.jpg",
    isActive: false,
  },
];

describe("BannersGrid", () => {
  beforeEach(() => jest.clearAllMocks());

  it("renders empty state when no banners", () => {
    render(<BannersGrid banners={[]} />);
    expect(screen.getByText("No banners yet.")).toBeInTheDocument();
  });

  it("renders add banner link in empty state", () => {
    render(<BannersGrid banners={[]} />);
    expect(screen.getByText("Add your first banner →")).toBeInTheDocument();
  });

  it("renders banners grouped by page", () => {
    render(<BannersGrid banners={mockBanners} />);
    expect(screen.getByText("Home Page")).toBeInTheDocument();
    expect(screen.getByText("Shop Page")).toBeInTheDocument();
  });

  it("renders active badge on active banner", () => {
    render(<BannersGrid banners={mockBanners} />);
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("renders banner images", () => {
    render(<BannersGrid banners={mockBanners} />);
    const images = screen.getAllByRole("img");
    expect(images[0]).toHaveAttribute("src", "https://example.com/banner-home.jpg");
  });

  it("renders edit links", () => {
    render(<BannersGrid banners={mockBanners} />);
    const editLinks = screen.getAllByText("Edit");
    expect(editLinks).toHaveLength(2);
    expect(editLinks[0]).toHaveAttribute("href", "/admin/banners/1");
  });

  it("calls updateBanner when toggle clicked", async () => {
    (updateBanner as jest.Mock).mockResolvedValue({ success: true });

    render(<BannersGrid banners={mockBanners} />);
    const toggles = screen.getAllByRole("button", { name: "" });
    fireEvent.click(toggles[0]);

    await waitFor(() => {
      expect(updateBanner).toHaveBeenCalledWith("1", {
        page: "HOME",
        photoUrl: "https://example.com/banner-home.jpg",
        isActive: false,
      });
      expect(toast.success).toHaveBeenCalledWith("Banner deactivated");
    });
  });

  it("shows confirm dialog when delete clicked", () => {
    render(<BannersGrid banners={mockBanners} />);
    const deleteButtons = screen.getAllByText("Delete");
    fireEvent.click(deleteButtons[0]);
    expect(screen.getByText("Delete Banner")).toBeInTheDocument();
  });

  it("calls deleteBanner after confirm", async () => {
    (deleteBanner as jest.Mock).mockResolvedValue({ success: true });

    render(<BannersGrid banners={mockBanners} />);
    const deleteButtons = screen.getAllByText("Delete");
    fireEvent.click(deleteButtons[0]);
    fireEvent.click(screen.getByText("Confirm"));

    await waitFor(() => {
      expect(deleteBanner).toHaveBeenCalledWith("1");
      expect(toast.success).toHaveBeenCalledWith("Banner deleted");
    });
  });

  it("does not call deleteBanner when cancel clicked", async () => {
    render(<BannersGrid banners={mockBanners} />);
    const deleteButtons = screen.getAllByText("Delete");
    fireEvent.click(deleteButtons[0]);
    fireEvent.click(screen.getByText("Cancel"));

    await waitFor(() => {
      expect(deleteBanner).not.toHaveBeenCalled();
    });
  });

  it("reverts toggle on update failure", async () => {
    (updateBanner as jest.Mock).mockResolvedValue({ success: false });

    render(<BannersGrid banners={mockBanners} />);
    const toggles = screen.getAllByRole("button", { name: "" });
    fireEvent.click(toggles[0]);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Failed to update banner");
    });
  });
});