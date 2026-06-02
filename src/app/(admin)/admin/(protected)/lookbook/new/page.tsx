import { AdminTopBar } from "@/components/admin/AdminTopBar";
import { LookbookForm } from "@/components/admin/LookbookForm";
import { getProducts } from "@/actions/products";

export default async function NewLookbookPage() {
  const { products } = await getProducts({ isActive: true, limit: 100 });

  return (
    <div>
      <AdminTopBar title="Add Lookbook Photo" />
      <div className="p-6">
        <LookbookForm products={products} />
      </div>
    </div>
  );
}