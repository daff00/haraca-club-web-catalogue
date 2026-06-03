import { AdminTopBar } from "@/components/admin/AdminTopBar";
import { BannerForm } from "@/components/admin/BannerForm";

export default function NewBannerPage() {
  return (
    <div>
      <AdminTopBar title="Add Banner" />
      <div className="p-6">
        <BannerForm />
      </div>
    </div>
  );
}