import Link from "next/link";
import { deleteSlide, moveSlide, toggleSlide } from "@/app/admin/actions";
import { DeleteButton } from "@/components/admin/ui";
import { getContent } from "@/lib/store";

export default async function SlidesPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const { slides } = await getContent();
  const { saved } = await searchParams;

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">Hero slides</h1>
          <p className="mt-2 text-white/50">The full-screen slider at the top of your homepage. Drag order with the arrows.</p>
        </div>
        <Link href="/admin/slides/new" className="rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-ink">+ New slide</Link>
      </div>

      {saved && <p className="mt-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">Slide saved.</p>}

      <ul className="mt-8 space-y-3">
        {slides.map((s, i) => (
          <li key={s.id} className="flex flex-col gap-4 rounded-2xl border border-line bg-ink-2 p-3 sm:flex-row sm:items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.image} alt="" className={`aspect-[16/9] w-full rounded-xl object-cover sm:w-44 ${s.active ? "" : "opacity-40 grayscale"}`} />
            <div className="min-w-0 flex-1">
              <p className="text-xs uppercase tracking-widest text-white/40">{s.eyebrow || "—"}</p>
              <p className="truncate font-medium">{s.title}</p>
              <p className="truncate text-sm text-white/50">{s.subtitle}</p>
            </div>
            <div className="flex flex-wrap items-center gap-1">
              <form action={toggleSlide}>
                <input type="hidden" name="id" value={s.id} />
                <button className={`rounded-lg px-3 py-1.5 text-xs ${s.active ? "bg-emerald-500/15 text-emerald-300" : "bg-white/5 text-white/50"}`}>
                  {s.active ? "● Visible" : "○ Hidden"}
                </button>
              </form>
              <form action={moveSlide}>
                <input type="hidden" name="id" value={s.id} />
                <input type="hidden" name="dir" value="-1" />
                <button disabled={i === 0} aria-label="Move up" className="rounded-lg px-2.5 py-1.5 text-xs hover:bg-white/5 disabled:opacity-25">↑</button>
              </form>
              <form action={moveSlide}>
                <input type="hidden" name="id" value={s.id} />
                <input type="hidden" name="dir" value="1" />
                <button disabled={i === slides.length - 1} aria-label="Move down" className="rounded-lg px-2.5 py-1.5 text-xs hover:bg-white/5 disabled:opacity-25">↓</button>
              </form>
              <Link href={`/admin/slides/${s.id}`} className="rounded-lg px-3 py-1.5 text-xs hover:bg-white/5">Edit</Link>
              <DeleteButton action={deleteSlide} id={s.id} />
            </div>
          </li>
        ))}
      </ul>
      {slides.length === 0 && <p className="mt-10 text-center text-white/40">No slides yet. Add your first one.</p>}
    </>
  );
}
