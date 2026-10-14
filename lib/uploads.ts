import "server-only";
import { randomBytes } from "crypto";
import { promises as fs } from "fs";
import path from "path";

export const UPLOAD_DIR = path.join(process.cwd(), "data", "uploads");
const MAX_BYTES = 8 * 1024 * 1024;

export const MIME: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  avif: "image/avif",
};

function isFile(v: FormDataEntryValue | null): v is File {
  return typeof v === "object" && v !== null && "arrayBuffer" in v && v.size > 0;
}

/** Saves an uploaded image and returns its public URL, or null if no file was chosen. */
export async function saveImage(entry: FormDataEntryValue | null): Promise<string | null> {
  if (!isFile(entry)) return null;
  const ext = entry.name.split(".").pop()?.toLowerCase() ?? "";
  if (!MIME[ext]) throw new Error(`Unsupported image type ".${ext}". Use JPG, PNG, WebP, GIF or AVIF.`);
  if (entry.size > MAX_BYTES) throw new Error("Images must be 8 MB or smaller.");
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  const name = `${Date.now().toString(36)}-${randomBytes(6).toString("hex")}.${ext}`;
  await fs.writeFile(path.join(UPLOAD_DIR, name), Buffer.from(await entry.arrayBuffer()));
  return `/api/uploads/${name}`;
}

export async function saveImages(entries: FormDataEntryValue[]): Promise<string[]> {
  const urls: string[] = [];
  for (const e of entries) {
    const url = await saveImage(e);
    if (url) urls.push(url);
  }
  return urls;
}
