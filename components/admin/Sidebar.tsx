"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { logoutAction } from "@/app/admin/actions";

const nav = [
  { href: "/admin", label: "Dashboard", icon: "◎" },
  { href: "/admin/slides", label: "Hero slides", icon: "▤" },
  { href: "/admin/products", label: "Products", icon: "◇" },
  { href: "/admin/settings", label: "Site content", icon: "✎" },
];

export function Sidebar({ companyName }: { companyName: string }) {
  const pathname = usePathname();
  return (
    <aside className="border-b border-line bg-ink-2 md:sticky md:top-0 md:flex md:h-screen md:w-64 md:shrink-0 md:flex-col md:border-b-0 md:border-r">
      <div className="flex items-center justify-between px-5 py-5">
        <div>
          <p className="font-display font-semibold">{companyName}</p>
          <p className="text-xs text-white/40">Admin panel</p>
        </div>
      </div>
      <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-1 md:flex-col md:pb-0">
        {nav.map((n) => {
          const active = n.href === "/admin" ? pathname === "/admin" : pathname.startsWith(n.href);
          return (
            <Link key={n.href} href={n.href} className={`relative flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${active ? "text-white" : "text-white/55 hover:text-white"}`}>
              {active && <motion.span layoutId="admin-nav" className="absolute inset-0 rounded-xl bg-white/[0.07]" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
              <span className="relative w-4 text-center">{n.icon}</span>
              <span className="relative">{n.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="hidden gap-1 border-t border-line p-3 md:flex md:flex-col">
        <a href="/" target="_blank" className="rounded-xl px-3 py-2.5 text-sm text-white/55 transition hover:text-white">↗ View website</a>
        <form action={logoutAction}>
          <button className="w-full rounded-xl px-3 py-2.5 text-left text-sm text-white/55 transition hover:text-white">⎋ Log out</button>
        </form>
      </div>
    </aside>
  );
}
