"use client";

import { useEffect, useState } from "react";

export function ImageField({ name, current, label, wide }: { name: string; current?: string; label: string; wide?: boolean }) {
  const [preview, setPreview] = useState<string | undefined>(current);

  useEffect(() => () => {
    if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
  }, [preview]);

  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium text-white/80">{label}</span>
      <input type="hidden" name={`${name}Current`} value={current ?? ""} />
      <label className={`group relative flex cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-dashed border-white/15 bg-white/[0.02] transition hover:border-white/40 ${wide ? "aspect-[16/7]" : "aspect-[4/3]"}`}>
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="text-sm text-white/40">Click to upload an image</span>
        )}
        {preview && (
          <span className="absolute inset-0 flex items-center justify-center bg-ink/60 text-sm opacity-0 transition group-hover:opacity-100">Replace image</span>
        )}
        <input
          type="file"
          name={name}
          accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
          className="sr-only"
          onChange={(e) => {
            const f = e.target.files?.[0];
            setPreview(f ? URL.createObjectURL(f) : current);
          }}
        />
      </label>
      <span className="mt-1 block text-xs text-white/40">JPG, PNG, WebP, GIF or AVIF, up to 8 MB.</span>
    </div>
  );
}
