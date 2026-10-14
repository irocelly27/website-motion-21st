import type { Metadata } from "next";
import { Sidebar } from "@/components/admin/Sidebar";
import { requireAdmin } from "@/lib/auth";
import { getContent } from "@/lib/store";

export const metadata: Metadata = { title: "Admin", robots: { index: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  const { settings } = await getContent();
  return (
    <div className="min-h-screen bg-ink md:flex">
      <Sidebar companyName={settings.companyName} />
      <div className="flex-1 px-5 py-8 sm:px-10 sm:py-10">
        <div className="mx-auto max-w-5xl">{children}</div>
      </div>
    </div>
  );
}
