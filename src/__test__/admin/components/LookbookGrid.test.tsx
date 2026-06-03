import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { LookbookGrid } from "@/components/admin/LookbookGrid";
import { deleteLookbookPhoto } from "@/actions/lookbooks";
import { toast } from "sonner";

jest.mock("@/actions/lookbooks", () => ({
  deleteLookbookPhoto: jest.fn(),
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

const mockPhotos = [
  {
    id: "1",
    photoUrl: "https://example.com/photo1.jpg",
    category: "DAILY_CASUAL" as const,
    productId: "prod-1",
    product: { id: "prod-1", name: "Haraca Oversize Tee", slug: "oversize-tee" },
    modelSize: "L",
    modelStats: "TB 170cm / BB 62kg",
    order: 0,
  },
  {
    id: "2",
    photoUrl: "https://example.com/photo2.jpg",
    category: "OVERSIZE_STYLE" as const,
    productId: null,
    product: null,
    modelSize: "M",
    modelStats: "TB 165cm / BB 55kg",
    order: 1,
  },
];

describe("LookbookGrid", () => {
  beforeEach(() => jest.clearAllMocks());

  it("renders empty state when no photos", () => {
    render(<LookbookGrid photos={[]} />);
    expect(screen.getByText("No lookbook photos yet.")).toBeInTheDocument();
  });

  it("renders add photo link in empty state", () => {
    render(<LookbookGrid photos={[]} />);
    expect(screen.getByText("Add your first photo →")).toBeInTheDocument();
  });

  it("renders photo grid", () => {
    render(<LookbookGrid photos={mockPhotos} />);
    expect(screen.getByText("Daily Casual")).toBeInTheDocument();
    expect(screen.getByText("Oversize Style")).toBeInTheDocument();
  });

  it("renders model info", () => {
    render(<LookbookGrid photos={mockPhotos} />);
    expect(screen.getByText("L · TB 170cm / BB 62kg")).toBeInTheDocument();
    expect(screen.getByText("M · TB 165cm / BB 55kg")).toBeInTheDocument();
  });

  it("renders linked product name", () => {
    render(<LookbookGrid photos={mockPhotos} />);
    expect(screen.getByText("Haraca Oversize Tee")).toBeInTheDocument();
  });

  it("renders photo images", () => {
    render(<LookbookGrid photos={mockPhotos} />);
    const images = screen.getAllByRole("img");
    expect(images).toHaveLength(2);
    expect(images[0]).toHaveAttribute("src", "https://example.com/photo1.jpg");
  });

  it("shows confirm dialog when delete clicked", async () => {
    render(<LookbookGrid photos={mockPhotos} />);
    const deleteButtons = screen.getAllByText("Delete");
    fireEvent.click(deleteButtons[0]);
    expect(screen.getByText("Delete Photo")).toBeInTheDocument();
  });

  it("calls deleteLookbookPhoto after confirm", async () => {
    (deleteLookbookPhoto as jest.Mock).mockResolvedValue({ success: true });

    render(<LookbookGrid photos={mockPhotos} />);
    const deleteButtons = screen.getAllByText("Delete");
    fireEvent.click(deleteButtons[0]);
    fireEvent.click(screen.getByText("Confirm"));

    await waitFor(() => {
      expect(deleteLookbookPhoto).toHaveBeenCalledWith("1");
      expect(toast.success).toHaveBeenCalledWith("Photo deleted");
    });
  });

  it("does not call deleteLookbookPhoto when cancel clicked", async () => {
    render(<LookbookGrid photos={mockPhotos} />);
    const deleteButtons = screen.getAllByText("Delete");
    fireEvent.click(deleteButtons[0]);
    fireEvent.click(screen.getByText("Cancel"));

    await waitFor(() => {
      expect(deleteLookbookPhoto).not.toHaveBeenCalled();
    });
  });

  it("shows error toast when delete fails", async () => {
    (deleteLookbookPhoto as jest.Mock).mockResolvedValue({ success: false });

    render(<LookbookGrid photos={mockPhotos} />);
    const deleteButtons = screen.getAllByText("Delete");
    fireEvent.click(deleteButtons[0]);
    fireEvent.click(screen.getByText("Confirm"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Failed to delete photo");
    });
  });
});