import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { TestimonialsTable } from "@/components/admin/TestimonialsTable";
import {
  toggleTestimonialActive,
  deleteTestimonial,
} from "@/actions/testimonials";
import { toast } from "sonner";

jest.mock("@/actions/testimonials", () => ({
  toggleTestimonialActive: jest.fn(),
  deleteTestimonial: jest.fn(),
}));

jest.mock("sonner", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), refresh: jest.fn() }),
}));

// Fix: mock ConfirmDialog supaya tidak pakai portal
jest.mock("@/components/ui/ConfirmDialog", () => ({
  ConfirmDialog: ({ open, onConfirm, onCancel, title, description }: any) =>
    open ? (
      <div>
        <p>{title}</p>
        <p>{description}</p>
        <button onClick={onConfirm}>Confirm</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    ) : null,
}));

const mockTestimonials = [
  {
    id: "1",
    customerName: "Anisa R.",
    photoUrl: null,
    rating: 5,
    text: "Amazing quality!",
    isActive: true,
  },
  {
    id: "2",
    customerName: "Budi S.",
    photoUrl: null,
    rating: 4,
    text: "Very comfortable.",
    isActive: false,
  },
];

describe("TestimonialsTable", () => {
  beforeEach(() => jest.clearAllMocks());

  it("renders empty state when no testimonials", () => {
    render(<TestimonialsTable testimonials={[]} />);
    // Sesuaikan dengan teks yang sebenarnya di komponen kamu
    expect(screen.getByText("No testimonials yet")).toBeInTheDocument();
  });

  it("renders testimonial list", () => {
    render(<TestimonialsTable testimonials={mockTestimonials} />);
    expect(screen.getByText("Anisa R.")).toBeInTheDocument();
    expect(screen.getByText("Amazing quality!")).toBeInTheDocument();
  });

  it("renders customer initials when no photo", () => {
    render(<TestimonialsTable testimonials={mockTestimonials} />);
    expect(screen.getByText("A")).toBeInTheDocument();
  });

  it("shows confirm dialog when delete clicked", () => {
    render(<TestimonialsTable testimonials={mockTestimonials} />);
    const deleteButtons = screen.getAllByTitle("Delete testimonial");
    fireEvent.click(deleteButtons[0]);
    expect(screen.getByText("Delete Testimonial")).toBeInTheDocument();
  });

  it("calls deleteTestimonial after confirm", async () => {
    (deleteTestimonial as jest.Mock).mockResolvedValue({ success: true });
    render(<TestimonialsTable testimonials={mockTestimonials} />);

    const deleteButtons = screen.getAllByTitle("Delete testimonial");
    fireEvent.click(deleteButtons[0]);
    fireEvent.click(screen.getByText("Confirm"));

    await waitFor(() => {
      expect(deleteTestimonial).toHaveBeenCalledWith("1");
      expect(toast.success).toHaveBeenCalledWith("Testimonial deleted");
    });
  });

  it("does not call deleteTestimonial when cancel clicked", async () => {
    render(<TestimonialsTable testimonials={mockTestimonials} />);

    const deleteButtons = screen.getAllByTitle("Delete testimonial");
    fireEvent.click(deleteButtons[0]);
    fireEvent.click(screen.getByText("Cancel"));

    await waitFor(() => {
      expect(deleteTestimonial).not.toHaveBeenCalled();
    });
  });

  it("calls toggleTestimonialActive when toggle clicked", async () => {
    (toggleTestimonialActive as jest.Mock).mockResolvedValue({ success: true });
    render(<TestimonialsTable testimonials={mockTestimonials} />);

    const toggles = screen.getAllByRole("button", { name: "" });
    fireEvent.click(toggles[0]);

    await waitFor(() => {
      expect(toggleTestimonialActive).toHaveBeenCalledWith("1", false);
    });
  });
});
