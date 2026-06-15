import { z } from "zod";

export const ProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  price: z.coerce.number().min(1, "Price must be greater than 0"),
  category: z.enum(["TANKTOP", "OVERSIZE", "REGULAR", "SABLON"]),
  sizes: z.array(z.string()).min(1, "At least one size required"),
  colors: z.array(
    z.object({
      name: z.string(),
      hex: z.string(),
    }),
  ),
  photos: z.array(z.string()),
  description: z.string().min(1, "Description is required"),
  material: z.string().min(1, "Material is required"),
  labels: z.array(z.enum(["BEST_SELLER", "NEW_ARRIVAL"])),
  linkShopee: z.string().url().optional().or(z.literal("")),
  linkTiktok: z.string().url().optional().or(z.literal("")),
  isActive: z.boolean().default(true),
});

export const LookbookPhotoSchema = z.object({
  photoUrl: z.string().url(),
  category: z.enum(["DAILY_CASUAL", "OVERSIZE_STYLE", "COUPLE_GROUP"]),
  productId: z.string().optional().nullable(),
  modelSize: z.string().min(1),
  modelStats: z.string().min(1),
  order: z.coerce.number().default(0),
});

export const TestimonialSchema = z.object({
  customerName: z.string().min(1),
  photoUrl: z.string().url().optional().or(z.literal("")),
  rating: z.coerce.number().min(1).max(5),
  text: z.string().min(1),
  isActive: z.boolean().default(true),
});

export const BannerSchema = z.object({
  page: z.enum(["HOME", "SHOP", "LOOKBOOK", "ABOUT"]),
  photoUrl: z.string().url(),
  isActive: z.boolean().default(false),
});

export const BrandContentSchema = z.object({
  brandStory: z.string().min(1),
  brandValues: z.array(
    z.object({
      icon: z.string(),
      title: z.string(),
      description: z.string(),
    }),
  ),
  behindPhotos: z.array(
    z.object({
      url: z.string(),
      caption: z.string(),
    }),
  ),
});

export const ContactInfoSchema = z.object({
  whatsapp: z.string().min(1),
  instagram: z.string().min(1),
  tiktok: z.string().min(1),
  shopee: z.string().url(),
  tokopedia: z.string().url(),
  email: z.string().email().optional().or(z.literal("")),
  operatingHours: z.object({
    weekdays: z.string(),
    weekend: z.string(),
  }),
});

// Type exports, will be used later in Server Actions
export type ProductInput = z.infer<typeof ProductSchema>;
export type LookbookPhotoInput = z.infer<typeof LookbookPhotoSchema>;
export type TestimonialInput = z.infer<typeof TestimonialSchema>;
export type BannerInput = z.infer<typeof BannerSchema>;
export type BrandContentInput = z.infer<typeof BrandContentSchema>;
export type ContactInfoInput = z.infer<typeof ContactInfoSchema>;
