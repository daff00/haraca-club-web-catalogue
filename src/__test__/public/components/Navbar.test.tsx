import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Navbar } from "@/components/public/Navbar";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(() => "/"),
}));

describe("Navbar", () => {
  beforeEach(() => jest.clearAllMocks());

  it("renders logo", () => {
    render(<Navbar />);
    expect(screen.getByText("Haraca")).toBeInTheDocument();
  });

  it("renders all nav links", () => {
    render(<Navbar />);
    // Karena ada duplikat (desktop + mobile), gunakan getAllByText
    expect(screen.getAllByText("Home").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Shop").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Lookbook").length).toBeGreaterThan(0);
    expect(screen.getAllByText("About").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Contact").length).toBeGreaterThan(0);
  });

  it("opens mobile menu when hamburger clicked", () => {
    render(<Navbar />);
    const hamburger = screen.getByLabelText("Toggle menu");
    fireEvent.click(hamburger);
    // Menu sekarang terlihat, cek bahwa setidaknya ada dua elemen "Home"
    const homeLinks = screen.getAllByText("Home");
    expect(homeLinks.length).toBeGreaterThan(1);
  });

  it("is transparent on hero pages at top", () => {
    render(<Navbar />);
    const header = screen.getByRole("banner");
    expect(header.className).toContain("bg-transparent");
  });

  it("becomes solid after scroll", async () => {
    render(<Navbar />);

    // Simulate scroll
    Object.defineProperty(window, "scrollY", { value: 100, writable: true });
    fireEvent.scroll(window);

    await waitFor(() => {
      const header = screen.getByRole("banner");
      expect(header.className).toContain("bg-[var(--color-bg)]");
    });
  });
});