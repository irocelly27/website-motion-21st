export function Marquee({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  const row = [...items, ...items];
  return (
    <div className="mask-x relative overflow-hidden border-y border-line py-6">
      <div className="marquee-track flex w-max gap-12">
        {[0, 1].map((copy) => (
          <div key={copy} aria-hidden={copy === 1} className="flex gap-12">
            {row.map((item, i) => (
              <span key={i} className="flex items-center gap-12 whitespace-nowrap font-display text-2xl font-medium text-white/50 sm:text-3xl">
                {item}
                <span className="text-lg text-violet">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
