import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { ProductCard } from "@/components/site/ProductCard";
import { ProductGallery } from "@/components/site/ProductGallery";
import { Reveal } from "@/components/site/Reveal";
import { getContent } from "@/lib/store";

type Props = { params: Promise<{ slug: string }> };

async function findProduct(slug: string) {
  await connection();
  const { products, settings } = await getContent();
  return { product: products.find((p) => p.slug === slug), products, settings };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { product } = await findProduct((await params).slug);
  return product ? { title: product.name, description: product.tagline } : {};
}

export default async function ProductPage({ params }: Props) {
  const { product, products, settings } = await findProduct((await params).slug);
  if (!product) notFound();

  const images = product.gallery.length ? product.gallery : [product.cover];
  const related = products.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <>
      <section className="mx-auto max-w-7xl px-6 pb-24 pt-32 sm:px-10 sm:pt-40">
        <Reveal>
          <Link href="/products" className="mb-10 inline-flex items-center gap-2 text-sm text-muted transition hover:text-white">
            ← All products
          </Link>
        </Reveal>
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <ProductGallery images={images} name={product.name} />
          </Reveal>
          <div className="lg:sticky lg:top-32">
            <Reveal delay={0.1}>
              <p className="text-sm uppercase tracking-[0.25em] text-cyan">{product.category}</p>
              <h1 className="mt-4 font-display text-5xl font-semibold tracking-tight sm:text-6xl">{product.name}</h1>
              <p className="mt-4 text-xl text-white/80">{product.tagline}</p>
              <p className="mt-8 text-3xl font-display font-semibold text-gradient">{product.price}</p>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-8 whitespace-pre-line leading-relaxed text-muted">{product.description}</p>
            </Reveal>
            {product.features.length > 0 && (
              <Reveal delay={0.3}>
                <ul className="mt-10 grid gap-3 sm:grid-cols-2">
                  {product.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 rounded-2xl border border-line bg-ink-2/70 px-4 py-3 text-sm">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet to-cyan text-xs">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}
            {settings.email && (
              <Reveal delay={0.4}>
                <a
                  href={`mailto:${settings.email}?subject=${encodeURIComponent(`Enquiry about ${product.name}`)}`}
                  className="mt-10 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 font-medium text-ink transition hover:shadow-[0_0_40px_rgba(167,139,250,0.55)]"
                >
                  Enquire about {product.name} →
                </a>
              </Reveal>
            )}
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 pb-32 sm:px-10">
          <Reveal>
            <h2 className="mb-10 font-display text-3xl font-semibold tracking-tight sm:text-4xl">You might also like</h2>
          </Reveal>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {related.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.1} className="h-full">
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
