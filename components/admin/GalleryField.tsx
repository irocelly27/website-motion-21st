"use client";

import { useState } from "react";

export function GalleryField({ existing }: { existing: string[] }) {
  const [kept, setKept] = useState(existing);
  const [added, setAdded] = useState<string[]>([]);

  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium text-white/80">Gallery images</span>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {kept.map((src, i) => (
          <div key={src + i} className="group relative aspect-square overflow-hidden rounded-xl border border-line">
            <input type="hidden" name="gallery" value={src} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => setKept((k) => k.filter((_, j) => j !== i))}
              className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-ink/80 text-xs opacity-0 transition group-hover:opacity-100"
              aria-label="Remove image"
            >
              ✕
            </button>
          </div>
        ))}
        {added.map((src) => (
          <div key={src} className="relative aspect-square overflow-hidden rounded-xl border border-cyan/40">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" className="h-full w-full object-cover" />
            <span className="absolute bottom-1.5 left-1.5 rounded bg-cyan/80 px-1.5 text-[10px] text-ink">new</span>
          </div>
        ))}
        <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-white/15 text-xs text-white/50 transition hover:border-white/40">
          <span className="text-2xl">+</span>
          Add images
          <input
            type="file"
            name="galleryNew"
            multiple
            accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
            className="sr-only"
            onChange={(e) => setAdded(Array.from(e.target.files ?? []).map((f) => URL.createObjectURL(f)))}
          />
        </label>
      </div>
      <span className="mt-1 block text-xs text-white/40">Hover an image to remove it. If the gallery is empty, the cover image is shown.</span>
    </div>
  );
}
