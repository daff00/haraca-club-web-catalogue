import { AdminTopBar } from "@/components/admin/AdminTopBar";
import { getProducts } from "@/actions/products";
import { getLookbookPhotos } from "@/actions/lookbooks";
import { getTestimonials } from "@/actions/testimonials";
import { getBanners } from "@/actions/banners";
import { ShoppingBag, Camera, Star, Image } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DashboardPage() {
  const [{ total: totalProducts }, lookbook, testimonials, banners] =
    await Promise.all([
      getProducts({ isActive: true }),
      getLookbookPhotos(),
      getTestimonials(),
      getBanners(),
    ]);

  const activeTestimonials = testimonials.filter((t) => t.isActive).length;
  const activeBanners = banners.filter((b) => b.isActive).length;

  const stats = [
    {
      label: "Active Products",
      value: totalProducts,
      icon: ShoppingBag,
    },
    {
      label: "Lookbook Photos",
      value: lookbook.length,
      icon: Camera,
    },
    {
      label: "Active Testimonials",
      value: activeTestimonials,
      icon: Star,
    },
    {
      label: "Active Banners",
      value: activeBanners,
      icon: Image,
    },
  ];

  return (
    <div>
      <AdminTopBar title="Dashboard" />

      <div className="p-6 flex flex-col gap-6">

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-sans font-medium text-[var(--color-text-muted)]">
                    {stat.label}
                  </CardTitle>
                  <Icon size={16} className="text-[var(--color-accent)]" />
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-sans font-semibold text-[var(--color-text)]">
                    {stat.value}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Products */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-sans font-medium text-[var(--color-text)]">
              Recent Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RecentProducts />
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-sans font-medium text-[var(--color-text)]">
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="flex gap-3">
            <a
              href="/admin/products/new"
              className="bg-[var(--color-text)] text-[var(--color-bg)] px-4 py-2 rounded-btn text-sm font-sans font-medium hover:bg-[var(--color-brown-dark)] transition-colors"
            >
              + Add Product
            </a>
            <a
              href="/admin/lookbook"
              className="border border-[var(--color-text)] text-[var(--color-text)] px-4 py-2 rounded-btn text-sm font-sans font-medium hover:bg-[var(--color-surface)] transition-colors"
            >
              + Add Lookbook Photo
            </a>
            <a
              href="/admin/banners"
              className="border border-[var(--color-text)] text-[var(--color-text)] px-4 py-2 rounded-btn text-sm font-sans font-medium hover:bg-[var(--color-surface)] transition-colors"
            >
              Update Banner
            </a>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}

async function RecentProducts() {
  const { products } = await getProducts({ limit: 5 });

  if (products.length === 0) {
    return (
      <p className="text-sm text-[var(--color-text-muted)] font-sans">
        No products yet.
      </p>
    );
  }

  return (
    <div className="flex flex-col divide-y divide-[var(--color-border)]">
      {products.map((product) => (
        <div
          key={product.id}
          className="flex items-center justify-between py-3"
        >
          <div className="flex flex-col gap-0.5">
            <p className="text-sm font-sans font-medium text-[var(--color-text)]">
              {product.name}
            </p>
            <p className="text-xs font-sans text-[var(--color-text-muted)]">
              {product.category} ·{" "}
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
              }).format(product.price)}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`text-xs font-sans px-2 py-0.5 rounded-badge ${
                product.isActive
                  ? "bg-green-100 text-green-700"
                  : "bg-[var(--color-border)] text-[var(--color-text-muted)]"
              }`}
            >
              {product.isActive ? "Active" : "Inactive"}
            </span>
            <a
              href={`/admin/products/${product.id}`}
              className="text-xs font-sans text-[var(--color-accent)] hover:underline"
            >
              Edit →
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}