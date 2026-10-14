"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

export function Navbar({ companyName }: { companyName: string }) {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 40));

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4"
      >
        <motion.nav
          animate={{
            maxWidth: scrolled ? 860 : 1280,
            backgroundColor: scrolled ? "rgba(13,13,20,0.7)" : "rgba(13,13,20,0)",
            borderColor: scrolled ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0)",
          }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex w-full items-center justify-between rounded-full border px-4 py-2.5 backdrop-blur-xl sm:px-6"
        >
          <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight">
            <span className="relative flex h-6 w-6 items-center justify-center">
              <span className="absolute inset-0 rounded-full bg-gradient-to-br from-violet via-cyan to-pink blur-[6px]" />
              <span className="relative h-3 w-3 rounded-full bg-white" />
            </span>
            {companyName}
          </Link>

          <ul className="hidden items-center gap-1 md:flex" onMouseLeave={() => setHovered(null)}>
            {links.map((l) => {
              const active = l.href === pathname || (l.href === "/products" && pathname.startsWith("/products"));
              return (
                <li key={l.href} className="relative">
                  <Link
                    href={l.href}
                    onMouseEnter={() => setHovered(l.href)}
                    className={`relative z-10 block px-4 py-2 text-sm transition-colors ${active ? "text-white" : "text-muted hover:text-white"}`}
                  >
                    {l.label}
                  </Link>
                  {hovered === l.href && (
                    <motion.span
                      layoutId="nav-hover"
                      className="absolute inset-0 rounded-full bg-white/[0.07]"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                </li>
              );
            })}
          </ul>

          <Link
            href="/#contact"
            className="hidden rounded-full bg-white px-4 py-2 text-sm font-medium text-ink transition hover:scale-[1.04] hover:bg-white/90 md:block"
          >
            Get in touch
          </Link>

          <button
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
            className="relative z-50 flex h-10 w-10 items-center justify-center md:hidden"
          >
            <motion.span animate={open ? { rotate: 45, y: 0 } : { rotate: 0, y: -4 }} className="absolute h-px w-5 bg-white" />
            <motion.span animate={open ? { rotate: -45, y: 0 } : { rotate: 0, y: 4 }} className="absolute h-px w-5 bg-white" />
          </button>
        </motion.nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "circle(0% at 92% 6%)" }}
            animate={{ clipPath: "circle(150% at 92% 6%)" }}
            exit={{ clipPath: "circle(0% at 92% 6%)" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 flex flex-col justify-center bg-ink-2 px-8 md:hidden"
          >
            {links.map((l, i) => (
              <motion.div
                key={l.href}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.07 }}
              >
                <Link href={l.href} onClick={() => setOpen(false)} className="block py-3 font-display text-4xl font-semibold">
                  {l.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
