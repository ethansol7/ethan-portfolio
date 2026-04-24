import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const REVIEW_DIR = path.join(process.cwd(), "src", "assets", "generated", "review");
const MANIFEST_FILE = path.join(process.cwd(), "asset-manifest.json");
const REVIEW_QUEUE_FILE = path.join(REVIEW_DIR, "krea-review-queue.json");

const PROMPT_BASE = [
  "Premium industrial design portfolio image.",
  "Minimal Frutiger Aero and Apple glass inspired environment.",
  "Soft translucent surfaces.",
  "Clean white and light gray background.",
  "Subtle reflections.",
  "Calm daylight.",
  "Precise product geometry.",
  "Preserve scale and proportions.",
  "No fake logos.",
  "No extra text.",
  "No distorted objects.",
  "No random props.",
  "Do not redesign the product.",
].join(" ");

async function readManifest() {
  try {
    return JSON.parse(await readFile(MANIFEST_FILE, "utf8"));
  } catch {
    return { projects: [] };
  }
}

async function downloadImage(url, outputPath) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Image download failed with status ${response.status}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  await writeFile(outputPath, bytes);
}

function extractImageUrl(payload) {
  return (
    payload?.image_url ||
    payload?.imageUrl ||
    payload?.url ||
    payload?.data?.image_url ||
    payload?.data?.imageUrl ||
    payload?.data?.url ||
    payload?.images?.[0]?.url ||
    payload?.result?.images?.[0]?.url ||
    ""
  );
}

const apiKey = process.env.KREA_API_KEY;
const apiUrl = process.env.KREA_API_URL;
const manifest = await readManifest();

await mkdir(REVIEW_DIR, { recursive: true });

const queue = manifest.projects.map((project) => ({
  projectName: project.projectName,
  originalPageUrl: project.originalPageUrl,
  prompt: `${PROMPT_BASE} Project: ${project.projectName}.`,
  status: "review-only",
}));

if (!apiKey || !apiUrl) {
  await writeFile(REVIEW_QUEUE_FILE, JSON.stringify({ createdAt: new Date().toISOString(), queue }, null, 2));
  console.log(`Prepared review queue at ${REVIEW_QUEUE_FILE}`);
  process.exit(0);
}

const generatedAssets = [];

for (const item of queue.slice(0, Number(process.env.KREA_LIMIT || 0))) {
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({ prompt: item.prompt }),
  });

  if (!response.ok) {
    generatedAssets.push({ ...item, status: "failed", reason: `Request failed with status ${response.status}` });
    continue;
  }

  const payload = await response.json();
  const imageUrl = extractImageUrl(payload);
  if (!imageUrl) {
    generatedAssets.push({ ...item, status: "failed", reason: "No image URL returned" });
    continue;
  }

  const safeName = item.projectName.replace(/[^a-z0-9]+/gi, "-").replace(/^-+|-+$/g, "").toLowerCase();
  const outputPath = path.join(REVIEW_DIR, `${safeName}-${Date.now()}.png`);
  await downloadImage(imageUrl, outputPath);
  generatedAssets.push({
    ...item,
    status: "review-only",
    path: outputPath.replace(process.cwd() + path.sep, "").split(path.sep).join("/"),
  });
}

await writeFile(
  REVIEW_QUEUE_FILE,
  JSON.stringify({ createdAt: new Date().toISOString(), generatedAssets }, null, 2),
);

console.log(`Wrote review-only output metadata to ${REVIEW_QUEUE_FILE}`);
