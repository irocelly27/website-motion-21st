import Link from "next/link";
import { deleteProduct, moveProduct } from "@/app/admin/actions";
import { DeleteButton } from "@/components/admin/ui";
import { getContent } from "@/lib/store";

export default async function ProductsAdminPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const { products } = await getContent();
  const { saved } = await searchParams;

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">Products</h1>
          <p className="mt-2 text-white/50">Featured products also appear on the homepage.</p>
        </div>
        <Link href="/admin/products/new" className="rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-ink">+ New product</Link>
      </div>

      {saved && <p className="mt-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">Product saved.</p>}

      <ul className="mt-8 space-y-3">
        {products.map((p, i) => (
          <li key={p.id} className="flex flex-col gap-4 rounded-2xl border border-line bg-ink-2 p-3 sm:flex-row sm:items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.cover} alt="" className="aspect-[4/3] w-full rounded-xl object-cover sm:w-28" />
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-2 font-medium">
                {p.name}
                {p.featured && <span className="rounded-full bg-violet/20 px-2 py-0.5 text-[10px] uppercase tracking-wider text-violet-300">Featured</span>}
              </p>
              <p className="truncate text-sm text-white/50">{p.category} · {p.price} · /products/{p.slug}</p>
            </div>
            <div className="flex flex-wrap items-center gap-1">
              <form action={moveProduct}>
                <input type="hidden" name="id" value={p.id} />
                <input type="hidden" name="dir" value="-1" />
                <button disabled={i === 0} aria-label="Move up" className="rounded-lg px-2.5 py-1.5 text-xs hover:bg-white/5 disabled:opacity-25">↑</button>
              </form>
              <form action={moveProduct}>
                <input type="hidden" name="id" value={p.id} />
                <input type="hidden" name="dir" value="1" />
                <button disabled={i === products.length - 1} aria-label="Move down" className="rounded-lg px-2.5 py-1.5 text-xs hover:bg-white/5 disabled:opacity-25">↓</button>
              </form>
              <a href={`/products/${p.slug}`} target="_blank" className="rounded-lg px-3 py-1.5 text-xs hover:bg-white/5">View ↗</a>
              <Link href={`/admin/products/${p.id}`} className="rounded-lg px-3 py-1.5 text-xs hover:bg-white/5">Edit</Link>
              <DeleteButton action={deleteProduct} id={p.id} />
            </div>
          </li>
        ))}
      </ul>
      {products.length === 0 && <p className="mt-10 text-center text-white/40">No products yet. Add your first one.</p>}
    </>
  );
}
