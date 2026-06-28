import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ResponsiveBanner } from "@/components/public/ResponsiveBanner";

describe("ResponsiveBanner", () => {
  const banner = {
    id: "1",
    page: "HOME" as const,
    photoUrl: "https://example.com/default.jpg",
    desktopPhotoUrl: "https://example.com/desktop.jpg",
    mobilePhotoUrl: "https://example.com/mobile.jpg",
    isActive: true,
  };

  it("renders desktop image by default", () => {
    render(<ResponsiveBanner banner={banner} alt="Banner" />);
    expect(screen.getByRole("img")).toHaveAttribute("src", "https://example.com/desktop.jpg");
  });

  it("renders mobile image on mobile viewport", () => {
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: query.includes("max-width: 768px"),
      media: query,
      onchange: null,
      addEventListener: jest.fn((_, listener) => listener()),
      removeEventListener: jest.fn(),
    }));

    render(<ResponsiveBanner banner={banner} alt="Banner" />);
    expect(screen.getByRole("img")).toHaveAttribute("src", "https://example.com/mobile.jpg");
  });

  it("renders desktop image on desktop viewport", () => {
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: jest.fn((_, listener) => listener()),
      removeEventListener: jest.fn(),
    }));

    render(<ResponsiveBanner banner={banner} alt="Banner" />);
    expect(screen.getByRole("img")).toHaveAttribute("src", "https://example.com/desktop.jpg");
  });

  it("uses contain style on tablet viewport", () => {
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: query.includes("min-width: 769px") && query.includes("max-width: 1280px"),
      media: query,
      onchange: null,
      addEventListener: jest.fn((_, listener) => listener()),
      removeEventListener: jest.fn(),
    }));

    render(<ResponsiveBanner banner={banner} alt="Banner" />);
    const img = screen.getByRole("img");
    expect(img).toHaveStyle({ objectFit: "contain" });
  });
});