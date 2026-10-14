"use client";

import Link from "next/link";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { useCallback, useRef, useState } from "react";
import type { Slide } from "@/lib/types";

const DURATION = 6;
const ease = [0.22, 1, 0.36, 1] as const;

export function HeroSlider({ slides, fallbackTitle }: { slides: Slide[]; fallbackTitle: string }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const count = slides.length;
  const go = useCallback((i: number) => count && setIndex(((i % count) + count) % count), [count]);

  if (count === 0) {
    return (
      <section className="relative flex h-[100svh] items-center justify-center px-6 text-center">
        <h1 className="text-gradient font-display text-5xl font-semibold tracking-tight sm:text-7xl">{fallbackTitle}</h1>
      </section>
    );
  }

  const slide = slides[index];

  return (
    <section
      ref={ref}
      className="relative h-[100svh] min-h-[640px] overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Images: crossfade + slow Ken Burns zoom, with scroll parallax */}
      <motion.div style={{ y: imageY }} className="absolute inset-0">
        <AnimatePresence initial={false}>
          <motion.div
            key={slide.id}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.18 }}
            animate={{ opacity: 1, scale: 1.04, transition: { opacity: { duration: 1.2, ease }, scale: { duration: DURATION + 2, ease: "linear" } } }}
            exit={{ opacity: 0, transition: { duration: 1.2 } }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={slide.image} alt="" className="h-full w-full object-cover" />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/20 to-transparent" />
      </motion.div>

      {/* Swipe layer */}
      <motion.div
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.15}
        onDragEnd={(_, info) => {
          if (info.offset.x < -80) go(index + 1);
          else if (info.offset.x > 80) go(index - 1);
        }}
      />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="pointer-events-none relative mx-auto flex h-full max-w-7xl flex-col justify-center px-6 pt-20 sm:px-10"
      >
        <AnimatePresence mode="wait">
          <motion.div key={slide.id} initial="hidden" animate="show" exit="exit" className="max-w-3xl">
            {slide.eyebrow && (
              <motion.p
                variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } }, exit: { opacity: 0, y: -10, transition: { duration: 0.3 } } }}
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-white/80 backdrop-blur"
              >
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan" />
                {slide.eyebrow}
              </motion.p>
            )}
            <h1 className="font-display text-5xl font-semibold leading-[1.02] tracking-tight sm:text-7xl lg:text-8xl">
              {slide.title.split(" ").map((word, i) => (
                <span key={i} className="mr-[0.25em] inline-block overflow-hidden pb-[0.08em] align-bottom">
                  <motion.span
                    className="inline-block"
                    variants={{
                      hidden: { y: "110%", rotate: 4 },
                      show: { y: "0%", rotate: 0, transition: { duration: 0.9, ease, delay: 0.1 + i * 0.06 } },
                      exit: { y: "-110%", transition: { duration: 0.4, ease, delay: i * 0.02 } },
                    }}
                  >
                    {word}
                  </motion.span>
                </span>
              ))}
            </h1>
            {slide.subtitle && (
              <motion.p
                variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease, delay: 0.45 } }, exit: { opacity: 0, transition: { duration: 0.25 } } }}
                className="mt-6 max-w-xl text-lg text-white/70 sm:text-xl"
              >
                {slide.subtitle}
              </motion.p>
            )}
            {slide.ctaLabel && (
              <motion.div
                variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease, delay: 0.6 } }, exit: { opacity: 0, transition: { duration: 0.25 } } }}
                className="pointer-events-auto mt-10 flex flex-wrap gap-3"
              >
                <Link
                  href={slide.ctaHref || "/products"}
                  className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 font-medium text-ink transition hover:shadow-[0_0_40px_rgba(167,139,250,0.55)]"
                >
                  {slide.ctaLabel}
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
                <Link
                  href="/products"
                  className="inline-flex items-center rounded-full border border-white/20 px-7 py-3.5 font-medium text-white backdrop-blur transition hover:bg-white/10"
                >
                  All products
                </Link>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Controls */}
      {count > 1 && (
        <div className="absolute inset-x-0 bottom-8 mx-auto flex max-w-7xl items-end justify-between gap-6 px-6 sm:px-10">
          <div className="flex flex-1 items-center gap-3">
            {slides.map((s, i) => (
              <button
                key={s.id}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => go(i)}
                className="group relative h-8 flex-1 max-w-28"
              >
                <span className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 overflow-hidden rounded-full bg-white/20 transition group-hover:bg-white/35">
                  {i === index ? (
                    <span
                      key={`${s.id}-${index}`}
                      className="slide-progress absolute inset-0 bg-white"
                      style={{ ["--duration" as string]: `${DURATION}s`, animationPlayState: paused ? "paused" : "running" }}
                      onAnimationEnd={() => go(index + 1)}
                    />
                  ) : (
                    i < index && <span className="absolute inset-0 bg-white/60" />
                  )}
                </span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden font-display text-sm tabular-nums text-white/60 sm:block">
              <span className="text-white">{String(index + 1).padStart(2, "0")}</span> / {String(count).padStart(2, "0")}
            </span>
            <button aria-label="Previous slide" onClick={() => go(index - 1)} className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 backdrop-blur transition hover:bg-white hover:text-ink">←</button>
            <button aria-label="Next slide" onClick={() => go(index + 1)} className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 backdrop-blur transition hover:bg-white hover:text-ink">→</button>
          </div>
        </div>
      )}
    </section>
  );
}
