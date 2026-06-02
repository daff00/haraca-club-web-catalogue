import { AdminTopBar } from "@/components/admin/AdminTopBar";
import { ProductForm } from "@/components/admin/ProductForm";
import { getProductById } from "@/actions/products";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) notFound();

  return (
    <div>
      <AdminTopBar title="Edit Product" />
      <div className="p-6">
        <ProductForm product={product} />
      </div>
    </div>
  );
}