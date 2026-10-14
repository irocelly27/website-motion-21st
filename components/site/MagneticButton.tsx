"use client";

import { motion, useMotionValue, useSpring } from "motion/react";

export function MagneticButton({ href, children }: { href: string; children: React.ReactNode }) {
  const x = useSpring(useMotionValue(0), { stiffness: 250, damping: 15 });
  const y = useSpring(useMotionValue(0), { stiffness: 250, damping: 15 });

  return (
    <motion.a
      href={href}
      style={{ x, y }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * 0.35);
        y.set((e.clientY - r.top - r.height / 2) * 0.35);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-white px-9 py-5 text-lg font-medium text-ink"
    >
      <span className="absolute inset-0 translate-y-full rounded-full bg-gradient-to-r from-violet via-cyan to-pink transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" />
      <span className="relative transition-colors duration-500 group-hover:text-white">{children}</span>
    </motion.a>
  );
}
