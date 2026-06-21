import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getProductBySlug } from "@/actions/products";
import { PhotoGallery } from "@/components/public/product/PhotoGallery";
import { ProductInfo } from "@/components/public/product/ProductInfo";
import { getContactInfo } from "@/actions/contact";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const [product, contact] = await Promise.all([
    getProductBySlug(slug),
    getContactInfo(),
  ]);

  if (!product) notFound();

  // Foto untuk "See It Styled" — pakai foto produk mulai index ke-3
  const styledPhotos = product.photos.slice(0, 3);

  return (
    <>
      <div className="content-wrapper pt-24 pb-16">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-sans text-[var(--color-text-muted)] mb-8">
          <Link href="/shop" className="hover:text-[var(--color-text)] transition-colors">
            Shop
          </Link>
          {/*
          <span>›</span>
          <span className="capitalize">
            {product.category.charAt(0) + product.category.slice(1).toLowerCase()}
          </span>
          <span>›</span>
          */}
          <span className="text-[var(--color-text)]">{product.name}</span>
        </div>

        {/* Main layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left — Photo Gallery */}
          <PhotoGallery photos={product.photos} productName={product.name} />

          {/* Right — Product Info */}
          <ProductInfo product={product} />
        </div>

      </div>

      {/* ── SEE IT STYLED ────────────────────────────────── */}
      {styledPhotos.length > 0 && (
        <section className="border-t border-[var(--color-border)] py-16">
          <div className="content-wrapper">
            <div className="flex items-end justify-between mb-10">
              <h2 className="font-display text-[40px] font-medium text-[var(--color-text)]">
                See It Styled
              </h2>
              {contact?.instagram && (
                <a
                  href={`https://instagram.com/${contact.instagram.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-xs uppercase tracking-widest text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
                >
                  Follow {contact.instagram}
                </a>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {styledPhotos.map((url, i) => (
                <div
                  key={i}
                  className="relative aspect-[3/4] bg-[var(--color-surface)] overflow-hidden"
                >
                  <Image
                    src={url}
                    alt={`${product.name} styled ${i + 1}`}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  return {
    title: product.name,
    description: product.description,
  };
}