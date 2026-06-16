import { render, screen, fireEvent } from "@testing-library/react";
import { VariantSelector } from "@/components/public/product/VariantSelector";
import type { ProductColor } from "@/types";

const mockColors: ProductColor[] = [
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#FFFFFF" },
];

const mockSizes = ["S", "M", "L", "XL"];

describe("VariantSelector", () => {
  it("renders all sizes", () => {
    render(
      <VariantSelector
        sizes={mockSizes}
        colors={mockColors}
        onSizeChange={jest.fn()}
        onColorChange={jest.fn()}
      />
    );
    mockSizes.forEach((size) => {
      expect(screen.getByText(size)).toBeInTheDocument();
    });
  });

  it("renders all color swatches", () => {
    render(
      <VariantSelector
        sizes={mockSizes}
        colors={mockColors}
        onSizeChange={jest.fn()}
        onColorChange={jest.fn()}
      />
    );
    expect(screen.getByTitle("Black")).toBeInTheDocument();
    expect(screen.getByTitle("White")).toBeInTheDocument();
  });

  it("shows selected color name", () => {
    render(
      <VariantSelector
        sizes={mockSizes}
        colors={mockColors}
        onSizeChange={jest.fn()}
        onColorChange={jest.fn()}
      />
    );
    expect(screen.getByText("Black")).toBeInTheDocument();
  });

  it("calls onSizeChange when size clicked", () => {
    const onSizeChange = jest.fn();
    render(
      <VariantSelector
        sizes={mockSizes}
        colors={mockColors}
        onSizeChange={onSizeChange}
        onColorChange={jest.fn()}
      />
    );
    fireEvent.click(screen.getByText("M"));
    expect(onSizeChange).toHaveBeenCalledWith("M");
  });

  it("calls onColorChange when color swatch clicked", () => {
    const onColorChange = jest.fn();
    render(
      <VariantSelector
        sizes={mockSizes}
        colors={mockColors}
        onSizeChange={jest.fn()}
        onColorChange={onColorChange}
      />
    );
    fireEvent.click(screen.getByTitle("White"));
    expect(onColorChange).toHaveBeenCalledWith({ name: "White", hex: "#FFFFFF" });
  });

  it("highlights selected size", () => {
    render(
      <VariantSelector
        sizes={mockSizes}
        colors={mockColors}
        onSizeChange={jest.fn()}
        onColorChange={jest.fn()}
      />
    );
    fireEvent.click(screen.getByText("L"));
    const sizeL = screen.getByText("L");
    expect(sizeL.className).toContain("bg-[var(--color-text)]");
  });
});