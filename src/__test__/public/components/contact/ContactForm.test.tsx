import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ContactForm } from "@/components/public/contact/ContactForm";

// Mock window.open
const mockWindowOpen = jest.fn();
global.open = mockWindowOpen;

describe("ContactForm", () => {
  beforeEach(() => jest.clearAllMocks());

  it("renders all form fields", () => {
    render(<ContactForm waNumber="628123456789" />);
    expect(screen.getByPlaceholderText("Your name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("08xxxxxxxxxx")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/mind/i)).toBeInTheDocument();
  });

  it("renders all topic options", () => {
    render(<ContactForm waNumber="628123456789" />);
    const select = screen.getByRole("combobox");
    expect(select).toBeInTheDocument();
    expect(screen.getByText("Ask about product")).toBeInTheDocument();
    expect(screen.getByText("Custom print")).toBeInTheDocument();
  });

  it("shows validation errors when submitting empty form", async () => {
    render(<ContactForm waNumber="628123456789" />);
    fireEvent.click(screen.getByText("Send via WhatsApp →"));

    await waitFor(() => {
      expect(screen.getByText("Name is required")).toBeInTheDocument();
      expect(screen.getByText("WhatsApp number is required")).toBeInTheDocument();
      expect(screen.getByText("Message is required")).toBeInTheDocument();
    });
  });

  it("does not open WhatsApp when form invalid", () => {
    render(<ContactForm waNumber="628123456789" />);
    fireEvent.click(screen.getByText("Send via WhatsApp →"));
    expect(mockWindowOpen).not.toHaveBeenCalled();
  });

  it("opens WhatsApp when form is valid", async () => {
    render(<ContactForm waNumber="628123456789" />);

    fireEvent.change(screen.getByPlaceholderText("Your name"), {
      target: { value: "Budi" },
    });
    fireEvent.change(screen.getByPlaceholderText("08xxxxxxxxxx"), {
      target: { value: "08123456789" },
    });
    fireEvent.change(screen.getByPlaceholderText(/mind/i), {
      target: { value: "I have a question" },
    });

    fireEvent.click(screen.getByText("Send via WhatsApp →"));

    await waitFor(() => {
      expect(mockWindowOpen).toHaveBeenCalledWith(
        expect.stringContaining("wa.me"),
        "_blank"
      );
    });
  });

  it("includes form data in WhatsApp URL", async () => {
    render(<ContactForm waNumber="628123456789" />);

    fireEvent.change(screen.getByPlaceholderText("Your name"), {
      target: { value: "Budi" },
    });
    fireEvent.change(screen.getByPlaceholderText("08xxxxxxxxxx"), {
      target: { value: "08123456789" },
    });
    fireEvent.change(screen.getByPlaceholderText(/mind/i), {
      target: { value: "Apakah ada stok?" },
    });

    fireEvent.click(screen.getByText("Send via WhatsApp →"));

    await waitFor(() => {
      const url = mockWindowOpen.mock.calls[0][0] as string;
      expect(url).toContain("Budi");
      expect(url).toContain("08123456789");
      expect(url).toContain("Apakah");
    });
  });
});