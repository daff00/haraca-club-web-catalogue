import {
  buildWaUrl,
  buildProductMessage,
  buildContactFormMessage,
  buildCustomSablonMessage,
} from "@/lib/wa";

// Mock env variable
process.env.NEXT_PUBLIC_WHATSAPP_NUMBER = "628123456789";

describe("buildWaUrl", () => {
  it("builds a valid WhatsApp URL", () => {
    const url = buildWaUrl("Hello Haraca");
    expect(url).toContain("wa.me/628123456789");
    expect(url).toContain("Hello%20Haraca");
  });

  it("trims whitespace from message", () => {
    const url = buildWaUrl("  Hello  ");
    expect(url).toContain("Hello");
  });
});

describe("buildProductMessage", () => {
  it("builds a product inquiry message", () => {
    const message = buildProductMessage({
      productName: "Haraca Oversize Tee",
      size: "L",
      color: "Black",
      quantity: 2,
    });

    expect(message).toContain("Haraca Oversize Tee");
    expect(message).toContain("L");
    expect(message).toContain("Black");
    expect(message).toContain("2");
  });
});

describe("buildContactFormMessage", () => {
  it("builds a contact form message", () => {
    const message = buildContactFormMessage({
      name: "Budi",
      phone: "08123456789",
      topic: "Tanya produk",
      message: "Apakah ada stok ukuran XL?",
    });

    expect(message).toContain("Budi");
    expect(message).toContain("08123456789");
    expect(message).toContain("Tanya produk");
    expect(message).toContain("Apakah ada stok ukuran XL?");
  });
});

describe("buildCustomSablonMessage", () => {
  it("builds a custom sablon message", () => {
    const message = buildCustomSablonMessage();
    expect(message).toContain("Custom Sablon");
    expect(message.length).toBeGreaterThan(0);
  });
});