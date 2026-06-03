import {
  ProductSchema,
  LookbookPhotoSchema,
  TestimonialSchema,
  BannerSchema,
  BrandContentSchema,
  ContactInfoSchema,
} from "@/lib/validations";

describe("ProductSchema", () => {
  const validProduct = {
    name: "Haraca Oversize Tee",
    slug: "oversize-tee-black",
    price: 129000,
    category: "OVERSIZE" as const,
    sizes: ["S", "M", "L"],
    colors: [{ name: "Black", hex: "#000000" }],
    photos: [],
    description: "A great tee",
    material: "Cotton 100%",
    labels: [],
    linkShopee: "",
    linkTiktok: "",
    isActive: true,
  };

  it("validates a valid product", () => {
    expect(() => ProductSchema.parse(validProduct)).not.toThrow();
  });

  it("fails when name is empty", () => {
    expect(() =>
      ProductSchema.parse({ ...validProduct, name: "" })
    ).toThrow();
  });

  it("fails when price is 0", () => {
    expect(() =>
      ProductSchema.parse({ ...validProduct, price: 0 })
    ).toThrow();
  });

  it("fails when sizes is empty", () => {
    expect(() =>
      ProductSchema.parse({ ...validProduct, sizes: [] })
    ).toThrow();
  });

  it("fails with invalid category", () => {
    expect(() =>
      ProductSchema.parse({ ...validProduct, category: "INVALID" as any })
    ).toThrow();
  });

  it("accepts valid labels", () => {
    const result = ProductSchema.parse({
      ...validProduct,
      labels: ["BEST_SELLER", "NEW_ARRIVAL"],
    });
    expect(result.labels).toEqual(["BEST_SELLER", "NEW_ARRIVAL"]);
  });

  it("accepts optional shopee link", () => {
    const result = ProductSchema.parse({
      ...validProduct,
      linkShopee: "https://shopee.co.id/product",
    });
    expect(result.linkShopee).toBe("https://shopee.co.id/product");
  });
});

describe("LookbookPhotoSchema", () => {
  const validPhoto = {
    photoUrl: "https://example.com/photo.jpg",
    category: "DAILY_CASUAL" as const,
    productId: null,
    modelSize: "L",
    modelStats: "TB 170cm / BB 62kg",
    order: 0,
  };

  it("validates a valid lookbook photo", () => {
    expect(() => LookbookPhotoSchema.parse(validPhoto)).not.toThrow();
  });

  it("fails when photoUrl is not a URL", () => {
    expect(() =>
      LookbookPhotoSchema.parse({ ...validPhoto, photoUrl: "not-a-url" })
    ).toThrow();
  });

  it("fails with invalid category", () => {
    expect(() =>
      LookbookPhotoSchema.parse({ ...validPhoto, category: "INVALID" as any })
    ).toThrow();
  });

  it("accepts null productId", () => {
    const result = LookbookPhotoSchema.parse({ ...validPhoto, productId: null });
    expect(result.productId).toBeNull();
  });
});

describe("TestimonialSchema", () => {
  const validTestimonial = {
    customerName: "Anisa R.",
    rating: 5,
    text: "Great product!",
    isActive: true,
    photoUrl: "",
  };

  it("validates a valid testimonial", () => {
    expect(() => TestimonialSchema.parse(validTestimonial)).not.toThrow();
  });

  it("fails when customerName is empty", () => {
    expect(() =>
      TestimonialSchema.parse({ ...validTestimonial, customerName: "" })
    ).toThrow();
  });

  it("fails when rating is below 1", () => {
    expect(() =>
      TestimonialSchema.parse({ ...validTestimonial, rating: 0 })
    ).toThrow();
  });

  it("fails when rating is above 5", () => {
    expect(() =>
      TestimonialSchema.parse({ ...validTestimonial, rating: 6 })
    ).toThrow();
  });
});

describe("BannerSchema", () => {
  const validBanner = {
    page: "HOME" as const,
    photoUrl: "https://example.com/banner.jpg",
    isActive: false,
  };

  it("validates a valid banner", () => {
    expect(() => BannerSchema.parse(validBanner)).not.toThrow();
  });

  it("fails with invalid page", () => {
    expect(() =>
      BannerSchema.parse({ ...validBanner, page: "INVALID" as any })
    ).toThrow();
  });

  it("accepts SHOP page", () => {
    const result = BannerSchema.parse({ ...validBanner, page: "SHOP" });
    expect(result.page).toBe("SHOP");
  });
});

describe("ContactInfoSchema", () => {
  const validContact = {
    whatsapp: "628123456789",
    instagram: "@haraca",
    tiktok: "@haraca",
    shopee: "https://shopee.co.id/haraca",
    tokopedia: "https://tokopedia.com/haraca",
    email: "",
    operatingHours: {
      weekdays: "Monday – Saturday: 09.00 – 18.00",
      weekend: "Sunday: Slow response",
    },
  };

  it("validates valid contact info", () => {
    expect(() => ContactInfoSchema.parse(validContact)).not.toThrow();
  });

  it("fails when whatsapp is empty", () => {
    expect(() =>
      ContactInfoSchema.parse({ ...validContact, whatsapp: "" })
    ).toThrow();
  });

  it("fails when shopee is not a URL", () => {
    expect(() =>
      ContactInfoSchema.parse({ ...validContact, shopee: "not-a-url" })
    ).toThrow();
  });
});