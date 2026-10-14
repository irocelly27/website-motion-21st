import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Aurora } from "@/components/site/Aurora";
import { isAdmin } from "@/lib/auth";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Admin login", robots: { index: false } };

export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin");
  return (
    <div className="flex min-h-screen items-center justify-center px-5">
      <Aurora />
      <div className="w-full max-w-sm rounded-3xl border border-line bg-ink-2/80 p-8 backdrop-blur-xl">
        <h1 className="font-display text-2xl font-semibold tracking-tight">Admin login</h1>
        <p className="mb-8 mt-1 text-sm text-white/50">Sign in to manage your website.</p>
        <LoginForm />
      </div>
    </div>
  );
}
