/**
 * Prisma seed script
 * Run: npx ts-node prisma/seed.ts
 * Or add to package.json: "prisma": { "seed": "ts-node prisma/seed.ts" }
 */

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ─── Admin User ───────────────────────────────────────
  const passwordHash = await bcrypt.hash("haraca2024!", 12);
  const admin = await prisma.adminUser.upsert({
    where: { email: "admin@haraca.id" },
    update: {},
    create: {
      email: "admin@haraca.id",
      passwordHash,
      name: "Haraca Admin",
    },
  });
  console.log("✓ Admin user:", admin.email);
  console.log("  Password: haraca2024! (change this immediately after first login)");

  // ─── Contact Info ─────────────────────────────────────
  await prisma.contactInfo.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      whatsapp: "628XXXXXXXXXX",
      instagram: "@haraca",
      tiktok: "@haraca",
      shopee: "https://shopee.co.id/haraca",
      tokopedia: "https://tokopedia.com/haraca",
      email: null,
      operatingHours: {
        weekdays: "Monday – Saturday: 09.00 – 18.00 WIB",
        weekend: "Sunday & Public Holidays: Slow response",
      },
    },
  });
  console.log("✓ Contact info seeded");

  // ─── Brand Content ────────────────────────────────────
  await prisma.brandContent.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      brandStory:
        "Haraca was born from a simple belief: everyday clothes should feel as good as they look. We started making tees that people actually want to wear — not just own.",
      brandValues: [
        { icon: "comfort", title: "Comfortable Always", description: "Designed for all-day wear without compromise." },
        { icon: "design", title: "Simple by Design", description: "Minimal aesthetics that never go out of style." },
        { icon: "price", title: "Honest Pricing", description: "Quality you can feel, at a price that makes sense." },
        { icon: "daily", title: "Made for Daily Wear", description: "Versatile pieces that work for any occasion." },
        { icon: "custom", title: "Open to Custom", description: "Want something unique? We can make it happen." },
      ],
      behindPhotos: [],
    },
  });
  console.log("✓ Brand content seeded");

  // ─── Sample Products ──────────────────────────────────
  const products = [
    {
      name: "Haraca Oversize Tee — Black",
      slug: "oversize-tee-black",
      price: 129000,
      category: "OVERSIZE" as const,
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: [{ name: "Black", hex: "#1A1714" }, { name: "White", hex: "#FAF7F2" }],
      photos: [],
      description: "Our signature oversized tee. Dropped shoulders, relaxed fit — wear it as a statement or keep it simple.",
      material: "Cotton 100% Combed 30s",
      labels: ["BEST_SELLER"] as const,
      linkShopee: null,
      linkTiktok: null,
      isActive: true,
    },
    {
      name: "Haraca Tanktop — Cream",
      slug: "tanktop-cream",
      price: 89000,
      category: "TANKTOP" as const,
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: [{ name: "Cream", hex: "#F0EBE0" }, { name: "Black", hex: "#1A1714" }],
      photos: [],
      description: "A minimal tanktop for daily wear. Clean cut, breathable fabric — your everyday essential.",
      material: "Cotton Bamboo 40s",
      labels: ["NEW_ARRIVAL"] as const,
      linkShopee: null,
      linkTiktok: null,
      isActive: true,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
  }
  console.log("✓ Sample products seeded");

  // ─── Sample Testimonials ──────────────────────────────
  const testimonials = [
    { customerName: "Anisa R.", rating: 5, text: "Quality is amazing for the price. The oversize tee fits perfectly and the fabric is so soft.", isActive: true },
    { customerName: "Budi S.", rating: 5, text: "Ordered the tanktop and it became my daily go-to. Simple, clean, comfortable.", isActive: true },
    { customerName: "Citra M.", rating: 4, text: "Love the aesthetic. Very consistent with what I saw on their lookbook.", isActive: true },
  ];

  for (const t of testimonials) {
    await prisma.testimonial.create({ data: t }).catch(() => {});
  }
  console.log("✓ Testimonials seeded");

  console.log("\n✅ Seed complete!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
