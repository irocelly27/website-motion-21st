import { promises as fs } from "fs";
import path from "path";
import { MIME, UPLOAD_DIR } from "@/lib/uploads";

export async function GET(_req: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  // Only allow the file names saveImage() generates — no path traversal.
  if (!/^[a-z0-9]+-[a-f0-9]+\.[a-z]+$/.test(name)) return new Response("Not found", { status: 404 });
  const type = MIME[name.split(".").pop()!];
  if (!type) return new Response("Not found", { status: 404 });
  try {
    const file = await fs.readFile(path.join(UPLOAD_DIR, name));
    return new Response(file, {
      headers: {
        "Content-Type": type,
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
