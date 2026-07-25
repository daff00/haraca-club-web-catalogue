/**
 * Shared TypeScript types for Haraca
 */

export type Category = "TANKTOP" | "OVERSIZE" | "REGULAR" | "SABLON";
export type ProductLabel = "BEST_SELLER" | "NEW_ARRIVAL";
export type LookbookCategory = "DAILY_CASUAL" | "OVERSIZE_STYLE" | "COUPLE_GROUP";
export type BannerPage = "HOME" | "SHOP" | "LOOKBOOK" | "ABOUT";

export interface ProductColor {
  name: string;
  hex: string;
}

export interface BrandValue {
  icon: string;
  title: string;
  description: string;
}

export interface BehindPhoto {
  url: string;
  caption: string;
}

export interface OperatingHours {
  weekdays: string;
  weekend: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  category: Category;
  sizes: string[];
  colors: ProductColor[];
  photos: string[];
  description: string;
  material: string;
  labels: ProductLabel[];
  linkShopee: string | null;
  linkTiktok: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lookbookPhotos?: LookbookPhoto[];
}

export interface LookbookPhoto {
  id: string;
  photoUrl: string;
  category: LookbookCategory;
  productId: string | null;
  product?: Pick<Product, "id" | "name" | "slug"> | null;
  modelSize: string;
  modelStats: string;
  order: number;
}

export interface Testimonial {
  id: string;
  customerName: string;
  photoUrl: string | null;
  rating: number;
  text: string;
  isActive: boolean;
}

export interface Banner {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  page: BannerPage;
  photoUrl: string;
  desktopPhotoUrl: string | null;
  mobilePhotoUrl: string | null;
  isActive: boolean;
}
