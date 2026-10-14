"use client";

import { animate, motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { Stat } from "@/lib/types";

function CountUp({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, { duration: 2, ease: [0.22, 1, 0.36, 1], onUpdate: (v) => setDisplay(Math.round(v)) });
    return () => controls.stop();
  }, [inView, value]);

  return <span ref={ref}>{display.toLocaleString()}</span>;
}

export function Stats({ stats }: { stats: Stat[] }) {
  if (stats.length === 0) return null;
  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line lg:grid-cols-4">
      {stats.map((s, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="group relative bg-ink-2 p-8 sm:p-10"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-violet/10 to-cyan/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <p className="relative font-display text-5xl font-semibold tracking-tight sm:text-6xl">
            <CountUp value={s.value} />
            <span className="text-gradient">{s.suffix}</span>
          </p>
          <p className="relative mt-3 text-sm text-muted">{s.label}</p>
        </motion.div>
      ))}
    </div>
  );
}
