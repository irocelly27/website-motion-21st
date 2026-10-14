import type { Metadata } from "next";
import { connection } from "next/server";
import { Aurora } from "@/components/site/Aurora";
import { Footer } from "@/components/site/Footer";
import { Navbar } from "@/components/site/Navbar";
import { MotionProvider } from "@/components/site/Reveal";
import { getContent } from "@/lib/store";

export async function generateMetadata(): Promise<Metadata> {
  await connection();
  const { settings } = await getContent();
  return {
    title: { default: `${settings.companyName} — ${settings.tagline}`, template: `%s · ${settings.companyName}` },
    description: settings.aboutText.slice(0, 160),
  };
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  await connection();
  const { settings } = await getContent();
  return (
    <MotionProvider>
      <Aurora />
      <Navbar companyName={settings.companyName} />
      <main>{children}</main>
      <Footer settings={settings} />
    </MotionProvider>
  );
}
