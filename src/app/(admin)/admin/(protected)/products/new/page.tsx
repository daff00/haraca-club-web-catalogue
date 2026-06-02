import { AdminTopBar } from "@/components/admin/AdminTopBar";
import { ProductForm } from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <AdminTopBar title="Add Product" />
      <div className="p-6">
        <ProductForm />
      </div>
    </div>
  );
}