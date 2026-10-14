import Link from "next/link";
import { getContent } from "@/lib/store";

export default async function Dashboard() {
  const { slides, products, settings } = await getContent();
  const cards = [
    { href: "/admin/slides", label: "Hero slides", value: slides.length, sub: `${slides.filter((s) => s.active).length} visible on the homepage` },
    { href: "/admin/products", label: "Products", value: products.length, sub: `${products.filter((p) => p.featured).length} featured on the homepage` },
    { href: "/admin/settings", label: "Site content", value: settings.stats.length, sub: "Stats, about text and contact details" },
  ];

  return (
    <>
      <h1 className="font-display text-3xl font-semibold tracking-tight">Welcome back</h1>
      <p className="mt-2 text-white/50">Manage everything visitors see on {settings.companyName}.</p>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <Link key={c.href} href={c.href} className="group rounded-2xl border border-line bg-ink-2 p-6 transition hover:border-white/20">
            <p className="text-sm text-white/50">{c.label}</p>
            <p className="mt-2 font-display text-4xl font-semibold">{c.value}</p>
            <p className="mt-2 text-xs text-white/40">{c.sub}</p>
            <p className="mt-6 text-sm text-white/70 transition group-hover:text-white">Manage →</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/admin/slides/new" className="rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-ink">+ New slide</Link>
        <Link href="/admin/products/new" className="rounded-xl border border-line px-4 py-2.5 text-sm hover:bg-white/5">+ New product</Link>
        <a href="/" target="_blank" className="rounded-xl border border-line px-4 py-2.5 text-sm hover:bg-white/5">↗ View website</a>
      </div>
    </>
  );
}
