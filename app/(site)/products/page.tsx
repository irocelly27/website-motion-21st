import type { Metadata } from "next";
import { connection } from "next/server";
import { ProductsGrid } from "@/components/site/ProductsGrid";
import { Reveal } from "@/components/site/Reveal";
import { getContent } from "@/lib/store";

export const metadata: Metadata = { title: "Products" };

export default async function ProductsPage() {
  await connection();
  const { products } = await getContent();

  return (
    <section className="mx-auto max-w-7xl px-6 pb-32 pt-40 sm:px-10">
      <Reveal className="mb-16">
        <p className="text-sm uppercase tracking-[0.25em] text-cyan">Our products</p>
        <h1 className="mt-4 max-w-3xl font-display text-5xl font-semibold tracking-tight sm:text-7xl">
          Everything we <span className="text-gradient">make</span>.
        </h1>
      </Reveal>
      <ProductsGrid products={products} />
    </section>
  );
}
