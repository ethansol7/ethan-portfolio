import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const SITE_ORIGIN = "https://www.ethansolodukhin.com";
const SITEMAP_URL = `${SITE_ORIGIN}/sitemap.xml`;
const OUTPUT_DIR = path.join(process.cwd(), "source-data");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "crawl-site-assets.json");

const ASSET_PATTERNS = [
  /https:\/\/images\.squarespace-cdn\.com\/[^"'\\\s<>)]*?\.(?:png|jpe?g|gif|webp|svg)(?:\?[^"'\\\s<>)]*)?/gi,
  /https:\/\/static1\.squarespace\.com\/[^"'\\\s<>)]*?\.(?:png|jpe?g|gif|webp|svg)(?:\?[^"'\\\s<>)]*)?/gi,
  /https?:\/\/[^"'\\\s<>)]*?\.(?:mp4|mov|webm|json|lottie|glb|gltf|stl|obj|fbx)(?:\?[^"'\\\s<>)]*)?/gi,
];

function cleanText(value = "") {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function slugFromUrl(url) {
  const pathname = new URL(url).pathname.replace(/\/$/, "");
  return (pathname || "/")
    .replace(/^\//, "")
    .replace(/\/+/g, "-")
    .replace(/[^a-zA-Z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase() || "home";
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      "user-agent": "Mozilla/5.0 PortfolioAssetCrawler/1.0",
      accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    },
  });

  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return response.text();
}

function parseSitemap(xml) {
  const pages = [];
  for (const match of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
    const block = match[1];
    const url = cleanText(block.match(/<loc>([\s\S]*?)<\/loc>/)?.[1] || "");
    if (!url) continue;

    const sitemapAssets = [...block.matchAll(/<image:loc>([\s\S]*?)<\/image:loc>/g)].map((assetMatch) =>
      cleanText(assetMatch[1]),
    );

    pages.push({
      slug: slugFromUrl(url),
      url,
      sitemapAssets,
    });
  }
  return pages;
}

function extractAssets(html) {
  const assets = new Set();
  for (const pattern of ASSET_PATTERNS) {
    for (const match of html.matchAll(pattern)) {
      assets.add(cleanText(match[0]).replace(/\\u0026/g, "&"));
    }
  }
  return [...assets].sort();
}

const sitemap = await fetchText(SITEMAP_URL);
const pages = parseSitemap(sitemap);
const results = [];
const missing = [];

for (const page of pages) {
  try {
    const html = await fetchText(page.url);
    const htmlAssets = extractAssets(html);
    results.push({
      projectName: page.slug,
      originalPageUrl: page.url,
      websiteAssetsFound: [...new Set([...page.sitemapAssets, ...htmlAssets])].sort(),
    });
  } catch (error) {
    missing.push({ originalPageUrl: page.url, reason: error.message });
  }
}

await mkdir(OUTPUT_DIR, { recursive: true });
await writeFile(
  OUTPUT_FILE,
  JSON.stringify(
    {
      crawledAt: new Date().toISOString(),
      source: SITE_ORIGIN,
      pageCount: results.length,
      assetCount: results.reduce((sum, page) => sum + page.websiteAssetsFound.length, 0),
      pages: results,
      missingAssets: missing,
    },
    null,
    2,
  ),
);

console.log(`Crawled ${results.length} pages and wrote ${OUTPUT_FILE}`);
