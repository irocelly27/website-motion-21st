"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";

export function ProductsGrid({ products }: { products: Product[] }) {
  const categories = ["All", ...Array.from(new Set(products.map((p) => p.category).filter(Boolean)))];
  const [active, setActive] = useState("All");
  const shown = active === "All" ? products : products.filter((p) => p.category === active);

  return (
    <>
      <div className="mb-12 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={`relative rounded-full px-5 py-2 text-sm transition-colors ${active === c ? "text-ink" : "text-muted hover:text-white"}`}
          >
            {active === c && (
              <motion.span layoutId="cat-pill" className="absolute inset-0 rounded-full bg-white" transition={{ type: "spring", stiffness: 400, damping: 32 }} />
            )}
            <span className="relative">{c}</span>
          </button>
        ))}
      </div>

      <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {shown.map((p) => (
            <motion.div
              key={p.id}
              layout
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <ProductCard product={p} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {shown.length === 0 && <p className="py-20 text-center text-muted">No products yet.</p>}
    </>
  );
}
