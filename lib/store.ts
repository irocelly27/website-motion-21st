import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { seedContent } from "./seed";
import type { Content } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const CONTENT_FILE = path.join(DATA_DIR, "content.json");

let writeQueue: Promise<unknown> = Promise.resolve();

export async function getContent(): Promise<Content> {
  try {
    const raw = await fs.readFile(CONTENT_FILE, "utf8");
    return JSON.parse(raw) as Content;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== "ENOENT") throw err;
    await saveContent(seedContent);
    return structuredClone(seedContent);
  }
}

async function saveContent(content: Content) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const tmp = `${CONTENT_FILE}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(content, null, 2));
  await fs.rename(tmp, CONTENT_FILE);
}

/** Serialises read-modify-write cycles so concurrent saves never clobber each other. */
export function updateContent(mutate: (content: Content) => void): Promise<void> {
  const run = writeQueue.then(async () => {
    const content = await getContent();
    mutate(content);
    await saveContent(content);
  });
  writeQueue = run.catch(() => {});
  return run;
}
