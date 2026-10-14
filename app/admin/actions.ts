"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checkPassword, createSession, destroySession, requireAdmin } from "@/lib/auth";
import { getContent, updateContent } from "@/lib/store";
import type { Product, Slide, Stat } from "@/lib/types";
import { saveImage, saveImages } from "@/lib/uploads";

export type FormState = { error?: string; ok?: string };

const str = (fd: FormData, key: string) => String(fd.get(key) ?? "").trim();
const lines = (value: string) => value.split(/\r?\n|,/).map((s) => s.trim()).filter(Boolean);
const newId = () => randomUUID().slice(0, 8);

function slugify(s: string) {
  return s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);
}

/** Only allow site-relative, anchor, mailto/tel or http(s) links — never javascript: URLs. */
function safeHref(href: string) {
  if (!href) return "";
  if (/^(\/|#)/.test(href) || /^(https?:|mailto:|tel:)/i.test(href)) return href;
  throw new Error("Button link must start with /, #, https://, mailto: or tel:");
}

function refresh() {
  revalidatePath("/", "layout");
}

function move<T extends { id: string }>(list: T[], id: string, dir: number) {
  const i = list.findIndex((x) => x.id === id);
  const j = i + dir;
  if (i < 0 || j < 0 || j >= list.length) return;
  [list[i], list[j]] = [list[j], list[i]];
}

/* ---------- Auth ---------- */

export async function loginAction(_prev: FormState, fd: FormData): Promise<FormState> {
  if (!process.env.ADMIN_PASSWORD) return { error: "ADMIN_PASSWORD is not set in .env.local." };
  if (!checkPassword(str(fd, "password"))) {
    await new Promise((r) => setTimeout(r, 600)); // slow down guessing
    return { error: "Incorrect password." };
  }
  await createSession();
  redirect("/admin");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}

/* ---------- Slides ---------- */

export async function saveSlide(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  try {
    const id = str(fd, "id");
    const image = (await saveImage(fd.get("image"))) ?? str(fd, "imageCurrent");
    if (!image) return { error: "Please choose a slide image." };
    const title = str(fd, "title");
    if (!title) return { error: "Title is required." };

    const slide: Slide = {
      id: id || newId(),
      image,
      eyebrow: str(fd, "eyebrow"),
      title,
      subtitle: str(fd, "subtitle"),
      ctaLabel: str(fd, "ctaLabel"),
      ctaHref: safeHref(str(fd, "ctaHref")),
      active: fd.get("active") === "on",
    };

    await updateContent((c) => {
      const i = c.slides.findIndex((s) => s.id === slide.id);
      if (i >= 0) c.slides[i] = slide;
      else c.slides.push(slide);
    });
  } catch (e) {
    return { error: (e as Error).message };
  }
  refresh();
  redirect("/admin/slides?saved=1");
}

export async function deleteSlide(fd: FormData) {
  await requireAdmin();
  const id = str(fd, "id");
  await updateContent((c) => {
    c.slides = c.slides.filter((s) => s.id !== id);
  });
  refresh();
}

export async function moveSlide(fd: FormData) {
  await requireAdmin();
  await updateContent((c) => move(c.slides, str(fd, "id"), Number(fd.get("dir"))));
  refresh();
}

export async function toggleSlide(fd: FormData) {
  await requireAdmin();
  const id = str(fd, "id");
  await updateContent((c) => {
    const s = c.slides.find((x) => x.id === id);
    if (s) s.active = !s.active;
  });
  refresh();
}

/* ---------- Products ---------- */

export async function saveProduct(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  try {
    const id = str(fd, "id") || newId();
    const name = str(fd, "name");
    if (!name) return { error: "Product name is required." };
    const slug = slugify(str(fd, "slug") || name);
    if (!slug) return { error: "Slug must contain letters or numbers." };

    const { products } = await getContent();
    if (products.some((p) => p.slug === slug && p.id !== id)) {
      return { error: `Another product already uses the URL "/products/${slug}".` };
    }

    const cover = (await saveImage(fd.get("cover"))) ?? str(fd, "coverCurrent");
    if (!cover) return { error: "Please choose a cover image." };
    const kept = fd.getAll("gallery").map(String).filter(Boolean);
    const added = await saveImages(fd.getAll("galleryNew"));

    const product: Product = {
      id,
      slug,
      name,
      tagline: str(fd, "tagline"),
      description: str(fd, "description"),
      category: str(fd, "category") || "General",
      price: str(fd, "price"),
      cover,
      gallery: [...kept, ...added],
      features: str(fd, "features").split(/\r?\n/).map((s) => s.trim()).filter(Boolean),
      featured: fd.get("featured") === "on",
    };

    await updateContent((c) => {
      const i = c.products.findIndex((p) => p.id === id);
      if (i >= 0) c.products[i] = product;
      else c.products.push(product);
    });
  } catch (e) {
    return { error: (e as Error).message };
  }
  refresh();
  redirect("/admin/products?saved=1");
}

export async function deleteProduct(fd: FormData) {
  await requireAdmin();
  const id = str(fd, "id");
  await updateContent((c) => {
    c.products = c.products.filter((p) => p.id !== id);
  });
  refresh();
}

export async function moveProduct(fd: FormData) {
  await requireAdmin();
  await updateContent((c) => move(c.products, str(fd, "id"), Number(fd.get("dir"))));
  refresh();
}

/* ---------- Site settings ---------- */

export async function saveSettings(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const companyName = str(fd, "companyName");
  if (!companyName) return { error: "Company name is required." };

  const stats: Stat[] = [];
  for (let i = 0; i < 4; i++) {
    const label = str(fd, `stat${i}Label`);
    const raw = str(fd, `stat${i}Value`);
    if (!label || raw === "") continue;
    const value = Number(raw);
    if (!Number.isFinite(value)) return { error: `Stat "${label}" needs a number.` };
    stats.push({ value, suffix: str(fd, `stat${i}Suffix`), label });
  }

  await updateContent((c) => {
    c.settings = {
      companyName,
      tagline: str(fd, "tagline"),
      marquee: lines(str(fd, "marquee")),
      aboutTitle: str(fd, "aboutTitle"),
      aboutText: str(fd, "aboutText"),
      stats,
      ctaTitle: str(fd, "ctaTitle"),
      ctaText: str(fd, "ctaText"),
      email: str(fd, "email"),
      phone: str(fd, "phone"),
      address: str(fd, "address"),
    };
  });
  refresh();
  return { ok: "Site content saved." };
}
