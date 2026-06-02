export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  return <main className="p-8"><h1 className="font-display text-4xl">Product: {params.slug}</h1></main>;
}
