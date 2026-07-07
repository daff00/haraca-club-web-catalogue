import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BannerForm } from "@/components/admin/BannerForm";
import { createBanner, updateBanner } from "@/actions/banners";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

jest.mock("@/actions/banners", () => ({
  createBanner: jest.fn(),
  updateBanner: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock("sonner", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

const defaultBanner = {
  id: "1",
  page: "HOME" as const,
  photoUrl: "https://example.com/desktop.jpg",
  desktopPhotoUrl: "https://example.com/desktop.jpg",
  mobilePhotoUrl: "https://example.com/mobile.jpg",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("BannerForm", () => {
  beforeEach(() => jest.clearAllMocks());

  it("renders desktop and mobile upload sections", () => {
    render(<BannerForm />);
    expect(screen.getByText("Desktop Banner")).toBeInTheDocument();
    expect(screen.getByText("Mobile Banner")).toBeInTheDocument();
  });

  it("calls updateBanner when editing existing banner", async () => {
    (updateBanner as jest.Mock).mockResolvedValue({ success: true });
    render(<BannerForm banner={defaultBanner} />);

    fireEvent.click(screen.getByText("Save Changes"));
    await waitFor(() => {
      expect(updateBanner).toHaveBeenCalledWith("1", {
        page: "HOME",
        photoUrl: defaultBanner.desktopPhotoUrl,
        desktopPhotoUrl: defaultBanner.desktopPhotoUrl,
        mobilePhotoUrl: defaultBanner.mobilePhotoUrl,
        isActive: true,
      });
    });
  });

  it("shows error when desktop photo missing", async () => {
    render(<BannerForm />);

    fireEvent.click(screen.getByText("Add Banner"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Please upload a desktop banner photo first");
    });
  });

  it("renders existing banner values when editing", () => {
    render(<BannerForm banner={defaultBanner} />);
    expect(screen.getByAltText("Desktop banner preview")).toHaveAttribute("src", defaultBanner.desktopPhotoUrl);
    expect(screen.getByAltText("Mobile banner preview")).toHaveAttribute("src", defaultBanner.mobilePhotoUrl);
  });
});