import { AdminTopBar } from "@/components/admin/AdminTopBar";
import { getProducts } from "@/actions/products";
import { getLookbookPhotos } from "@/actions/lookbooks";
import { getTestimonials } from "@/actions/testimonials";
import { getBanners } from "@/actions/banners";
import {
  ShoppingBag,
  Camera,
  Star,
  Image as ImageIcon,
  Plus,
  ArrowRight,
} from "lucide-react";
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
      icon: ImageIcon,
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <AdminTopBar title="Dashboard" />

      <div className="p-6 md:p-8 max-w-7xl mx-auto flex flex-col gap-8">
        {/* Page Header */}
        <div>
          <label className="text-xl font-sans font-medium text-[var(--color-text)]">
            Overview
          </label>
          <p className="text-[var(--color-text-muted)] text-sm mt-1">
            Here is what is happening with your store today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card
                key={stat.label}
                className="shadow-sm border-[var(--color-border)] transition-all duration-300 hover:scale-[1.02] hover:shadow-md"
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-sans font-medium text-[var(--color-text-muted)]">
                    {stat.label}
                  </CardTitle>
                  <div className="p-2 bg-[var(--color-surface)] rounded-md">
                    <Icon size={16} className="text-[var(--color-text)]" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-sans font-bold text-[var(--color-text)] tracking-tight">
                    {stat.value}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Recent Products (Spans 2 columns on large screens) */}
          <Card className="lg:col-span-2 shadow-sm border-[var(--color-border)] flex flex-col">
            <CardHeader className="border-b border-[var(--color-border)] pb-4">
              <CardTitle className="text-lg font-sans font-semibold text-[var(--color-text)]">
                Recent Products
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 flex-1">
              <RecentProducts />
            </CardContent>
          </Card>

          {/* Quick Actions (Sidebar style) */}
          <Card className="shadow-sm border-[var(--color-border)] h-fit">
            <CardHeader className="border-b border-[var(--color-border)] pb-4">
              <CardTitle className="text-lg font-sans font-semibold text-[var(--color-text)]">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 flex flex-col gap-3">
              <a
                href="/admin/products/new"
                className="flex items-center justify-center gap-2 bg-[var(--color-text)] text-[var(--color-bg)] px-4 py-2.5 rounded-btn text-sm font-sans font-medium hover:opacity-90 transition-opacity w-full"
              >
                <Plus size={16} /> Add Product
              </a>
              <a
                href="/admin/lookbook"
                className="flex items-center justify-center gap-2 border border-[var(--color-border)] text-[var(--color-text)] px-4 py-2.5 rounded-btn text-sm font-sans font-medium hover:bg-[var(--color-surface)] transition-colors w-full"
              >
                <Camera size={16} /> Add Lookbook Photo
              </a>
              <a
                href="/admin/banners"
                className="flex items-center justify-center gap-2 border border-[var(--color-border)] text-[var(--color-text)] px-4 py-2.5 rounded-btn text-sm font-sans font-medium hover:bg-[var(--color-surface)] transition-colors w-full"
              >
                <ImageIcon size={16} /> Update Banner
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

async function RecentProducts() {
  const { products } = await getProducts({ limit: 5 });

  if (products.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center">
        <p className="text-sm text-[var(--color-text-muted)] font-sans">
          No products found.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-[var(--color-text-muted)] border-b border-[var(--color-border)]">
            <th className="pb-2 font-medium">Product</th>
            <th className="pb-2 font-medium hidden sm:table-cell">Category</th>
            <th className="pb-2 font-medium hidden sm:table-cell">Price</th>
            <th className="pb-2 font-medium">Status</th>
            <th className="pb-2 font-medium text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, idx) => (
            <tr
              key={product.id}
              className={`border-b border-[var(--color-border)] last:border-0 ${
                idx % 2 === 0
                  ? "bg-[var(--color-bg)]"
                  : "bg-[var(--color-surface)]"
              }`}
            >
              <td className="py-3 pr-4 font-medium text-[var(--color-text)]">
                {product.name}
              </td>
              <td className="py-3 pr-4 text-[var(--color-text-muted)] hidden sm:table-cell">
                {product.category}
              </td>
              <td className="py-3 pr-4 text-[var(--color-text)] hidden sm:table-cell">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                }).format(product.price)}
              </td>
              <td className="py-3 pr-4">
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-medium border ${
                    product.isActive
                      ? "bg-[var(--color-accent)]/10 text-[var(--color-accent)] border-[var(--color-accent)]/20"
                      : "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700"
                  }`}
                >
                  {product.isActive ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="py-3 text-right">
                <a
                  href={`/admin/products/${product.id}`}
                  className="inline-flex items-center gap-1 text-sm font-sans font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
                >
                  Edit <ArrowRight size={14} />
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}