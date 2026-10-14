import Link from "next/link";
import type { Settings } from "@/lib/types";

export function Footer({ settings }: { settings: Settings }) {
  return (
    <footer className="relative overflow-hidden border-t border-line pt-20">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 sm:grid-cols-3 sm:px-10">
        <div>
          <p className="font-display text-xl font-semibold">{settings.companyName}</p>
          <p className="mt-3 max-w-xs text-muted">{settings.tagline}</p>
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-white/40">Explore</p>
          <ul className="mt-4 space-y-2 text-white/80">
            <li><Link href="/" className="hover:text-white">Home</Link></li>
            <li><Link href="/products" className="hover:text-white">Products</Link></li>
            <li><Link href="/#about" className="hover:text-white">About</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-white/40">Contact</p>
          <ul className="mt-4 space-y-2 text-white/80">
            {settings.email && <li><a href={`mailto:${settings.email}`} className="hover:text-white">{settings.email}</a></li>}
            {settings.phone && <li>{settings.phone}</li>}
            {settings.address && <li>{settings.address}</li>}
          </ul>
        </div>
      </div>
      <p aria-hidden className="text-outline mt-16 select-none text-center font-display text-[22vw] font-bold leading-[0.8] tracking-tighter">
        {settings.companyName}
      </p>
      <p className="border-t border-line py-6 text-center text-sm text-white/40">
        © {new Date().getFullYear()} {settings.companyName}. All rights reserved.
      </p>
    </footer>
  );
}
