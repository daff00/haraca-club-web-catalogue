import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-bg text-center px-6">
      <p className="text-sm font-sans uppercase tracking-widest text-accent mb-4">
        Page not found
      </p>
      <h1 className="font-display text-[120px] leading-none font-medium text-border mb-2">
        404
      </h1>
      <h2 className="font-display text-3xl font-medium text-brand mb-3">
        Looks like this page got lost.
      </h2>
      <p className="text-muted font-sans mb-8">
        Let&apos;s get you back to something good.
      </p>
      <div className="flex gap-3">
        <Link
          href="/"
          className="bg-brand text-bg px-7 py-3 text-sm font-sans font-medium rounded-btn hover:bg-brown-dark transition-colors"
        >
          Go to Home
        </Link>
        <Link
          href="/shop"
          className="border border-brand text-brand px-7 py-3 text-sm font-sans font-medium rounded-btn hover:bg-surface transition-colors"
        >
          Browse Shop
        </Link>
      </div>
      <Link
        href="/lookbook"
        className="mt-5 text-xs text-accent font-sans hover:underline"
      >
        Or check out our Lookbook →
      </Link>
    </main>
  );
}
