"use client";

import Link from "next/link";
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "motion/react";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const spring = { stiffness: 200, damping: 20 };
  const rotateX = useSpring(useTransform(my, [0, 1], [8, -8]), spring);
  const rotateY = useSpring(useTransform(mx, [0, 1], [-8, 8]), spring);
  const spotX = useTransform(mx, (v) => `${v * 100}%`);
  const spotY = useTransform(my, (v) => `${v * 100}%`);
  const spotlight = useMotionTemplate`radial-gradient(500px circle at ${spotX} ${spotY}, rgba(167,139,250,0.18), transparent 45%)`;

  return (
    <motion.div style={{ perspective: 1000 }} className="h-full">
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          mx.set((e.clientX - r.left) / r.width);
          my.set((e.clientY - r.top) / r.height);
        }}
        onMouseLeave={() => {
          mx.set(0.5);
          my.set(0.5);
        }}
        className="group relative h-full overflow-hidden rounded-3xl border border-line bg-ink-2"
      >
        <Link href={`/products/${product.slug}`} className="flex h-full flex-col">
          <div className="relative aspect-[4/3] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.cover}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-2 via-transparent to-transparent" />
            <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-ink/50 px-3 py-1 text-xs text-white/80 backdrop-blur">
              {product.category}
            </span>
          </div>
          <div className="flex flex-1 flex-col p-6" style={{ transform: "translateZ(30px)" }}>
            <div className="flex items-start justify-between gap-4">
              <h3 className="font-display text-2xl font-semibold tracking-tight">{product.name}</h3>
              <span className="shrink-0 rounded-full bg-white/5 px-3 py-1 text-sm text-white/80">{product.price}</span>
            </div>
            <p className="mt-2 flex-1 text-muted">{product.tagline}</p>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-white/80 transition group-hover:text-white">
              Discover
              <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/15 transition-all duration-300 group-hover:translate-x-1 group-hover:border-white group-hover:bg-white group-hover:text-ink">
                →
              </span>
            </span>
          </div>
        </Link>
        <motion.div aria-hidden className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: spotlight }} />
      </motion.div>
    </motion.div>
  );
}
