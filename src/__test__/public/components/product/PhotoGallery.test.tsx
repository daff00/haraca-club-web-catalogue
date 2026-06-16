import { render, screen, fireEvent } from "@testing-library/react";
import { PhotoGallery } from "@/components/public/product/PhotoGallery";

const mockPhotos = [
  "https://example.com/photo1.jpg",
  "https://example.com/photo2.jpg",
  "https://example.com/photo3.jpg",
];

describe("PhotoGallery", () => {
  it("renders placeholder when no photos", () => {
    render(<PhotoGallery photos={[]} productName="Test Product" />);
    expect(screen.getByText("H")).toBeInTheDocument();
  });

  it("renders main photo", () => {
    render(<PhotoGallery photos={mockPhotos} productName="Test Product" />);
    const images = screen.getAllByRole("img");
    expect(images[0]).toHaveAttribute("src", expect.stringContaining("photo1"));
  });

  it("does not render thumbnails when only one photo", () => {
    render(
      <PhotoGallery
        photos={["https://example.com/photo1.jpg"]}
        productName="Test Product"
      />
    );
    const images = screen.getAllByRole("img");
    expect(images).toHaveLength(1);
  });

  it("renders thumbnails when multiple photos", () => {
    render(<PhotoGallery photos={mockPhotos} productName="Test Product" />);
    const thumbnails = screen.getAllByRole("button");
    expect(thumbnails).toHaveLength(mockPhotos.length);
  });

  it("changes main photo when thumbnail clicked", () => {
    render(<PhotoGallery photos={mockPhotos} productName="Test Product" />);
    const thumbnails = screen.getAllByRole("button");
    fireEvent.click(thumbnails[1]);

    const images = screen.getAllByRole("img");
    expect(images[0]).toHaveAttribute("src", expect.stringContaining("photo2"));
  });
});