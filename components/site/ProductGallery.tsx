"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [current, setCurrent] = useState(0);
  const src = images[current];

  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-line bg-ink-2">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.img
            key={src}
            src={src}
            alt={name}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </AnimatePresence>
      </div>
      {images.length > 1 && (
        <div className="mt-4 flex gap-3">
          {images.map((img, i) => (
            <button
              key={img + i}
              onClick={() => setCurrent(i)}
              aria-label={`Show image ${i + 1}`}
              className="relative h-20 w-24 overflow-hidden rounded-xl"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt="" className={`h-full w-full object-cover transition ${i === current ? "opacity-100" : "opacity-50 hover:opacity-80"}`} />
              {i === current && <motion.span layoutId="thumb-ring" className="absolute inset-0 rounded-xl ring-2 ring-white" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
