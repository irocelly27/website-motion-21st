import Link from "next/link";
import { connection } from "next/server";
import { AboutReveal } from "@/components/site/AboutReveal";
import { HeroSlider } from "@/components/site/HeroSlider";
import { MagneticButton } from "@/components/site/MagneticButton";
import { Marquee } from "@/components/site/Marquee";
import { ProductCard } from "@/components/site/ProductCard";
import { Reveal } from "@/components/site/Reveal";
import { Stats } from "@/components/site/Stats";
import { getContent } from "@/lib/store";

export default async function HomePage() {
  await connection();
  const { settings, slides, products } = await getContent();
  const featured = products.filter((p) => p.featured);
  const showcase = (featured.length ? featured : products).slice(0, 3);

  return (
    <>
      <HeroSlider slides={slides.filter((s) => s.active)} fallbackTitle={settings.companyName} />

      <Marquee items={settings.marquee} />

      <section id="about" className="mx-auto max-w-7xl scroll-mt-24 px-6 py-28 sm:px-10 sm:py-40">
        <div className="grid gap-12 lg:grid-cols-[1fr_2fr]">
          <Reveal>
            <p className="text-sm uppercase tracking-[0.25em] text-violet">About us</p>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-white/90 sm:text-4xl">{settings.aboutTitle}</h2>
          </Reveal>
          <AboutReveal text={settings.aboutText} />
        </div>
        <div className="mt-20">
          <Stats stats={settings.stats} />
        </div>
      </section>

      {showcase.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 pb-28 sm:px-10 sm:pb-40">
          <Reveal className="mb-14 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-cyan">Products</p>
              <h2 className="mt-4 max-w-xl font-display text-4xl font-semibold tracking-tight sm:text-6xl">
                Made to be <span className="text-gradient">loved</span>.
              </h2>
            </div>
            <Link href="/products" className="group inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm transition hover:bg-white hover:text-ink">
              View all products <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </Reveal>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {showcase.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.12} className="h-full">
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <section id="contact" className="relative scroll-mt-24 overflow-hidden px-6 pb-28 sm:px-10 sm:pb-40">
        <Reveal className="relative mx-auto max-w-5xl overflow-hidden rounded-[2.5rem] border border-line bg-ink-2 px-6 py-20 text-center sm:px-16 sm:py-28">
          <div aria-hidden className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-violet/30 blur-[100px]" />
          <div aria-hidden className="absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-cyan/25 blur-[110px]" />
          <h2 className="relative mx-auto max-w-3xl font-display text-4xl font-semibold tracking-tight sm:text-6xl">{settings.ctaTitle}</h2>
          <p className="relative mx-auto mt-6 max-w-xl text-lg text-muted">{settings.ctaText}</p>
          {settings.email && (
            <div className="relative mt-12">
              <MagneticButton href={`mailto:${settings.email}`}>Start a conversation →</MagneticButton>
            </div>
          )}
          <div className="relative mt-14 flex flex-wrap justify-center gap-x-10 gap-y-3 text-sm text-white/60">
            {settings.email && <span>{settings.email}</span>}
            {settings.phone && <span>{settings.phone}</span>}
            {settings.address && <span>{settings.address}</span>}
          </div>
        </Reveal>
      </section>
    </>
  );
}
