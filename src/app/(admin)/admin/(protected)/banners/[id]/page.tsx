import { AdminTopBar } from "@/components/admin/AdminTopBar";
import { BannerForm } from "@/components/admin/BannerForm";
import { getBanners } from "@/actions/banners";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditBannerPage({ params }: Props) {
  const { id } = await params;
  const banners = await getBanners();
  const banner = banners.find((b) => b.id === id);

  if (!banner) notFound();

  return (
    <div>
      <AdminTopBar title="Edit Banner" />
      <div className="p-6">
        <BannerForm banner={banner} />
      </div>
    </div>
  );
}