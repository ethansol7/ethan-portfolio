import { copyFile, mkdir, open, readdir, readFile, stat, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";

export const ROOT = process.cwd();
export const SITE_ORIGIN = "https://www.ethansolodukhin.com";
export const DATA_DIR = path.join(ROOT, "data");
export const SOURCE_PAGES_FILE = path.join(ROOT, "src", "data", "sourcePages.js");
export const ORGANIZED_ASSET_DIR = path.join(ROOT, "src", "assets", "portfolio-organized");

export const LOCAL_ROOTS = [
  "D:\\4th Year College",
  "D:\\3rd Year College",
  "D:\\Downloads",
];

export const LOCAL_EXTENSIONS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".gif",
  ".mp4",
  ".mov",
  ".webm",
  ".json",
  ".lottie",
  ".glb",
  ".gltf",
  ".obj",
  ".fbx",
  ".stl",
  ".blend",
  ".f3d",
  ".step",
  ".stp",
  ".psd",
  ".ai",
  ".pdf",
  ".key",
  ".ksp",
]);

export const IGNORE_DIRS = new Set([".git", "node_modules", "$recycle.bin", "__macosx"]);

export const PROJECT_MATCHERS = [
  ["SOL Lamp System", "s01", ["sol lamp", "sol x", "s01", "s02", "s03", "s04", "lamp"]],
  ["Sol Seven Studios", "sol-seven-studios", ["sol seven", "solseven", "sol seven studios"]],
  ["PlastiVista / Revo", "3d-printing-service", ["plastivista", "plasti vista", "revo", "recycled plastic"]],
  ["Sol Wheel", "sol-wheel", ["sol wheel", "solwheel", "steam deck", "steering wheel"]],
  ["Autodesk Origin", "autodesk-origin", ["autodesk origin", "origin", "au2025", "autodesk"]],
  ["ShelfMate", "shelf-mate-2024", ["shelf mate", "shelfmate"]],
  ["Bungis Chair", "denmark-summer-2024", ["bungis", "denmark", "danish institute"]],
  ["Airo", "airo", ["airo", "dehumidifier", "defogger"]],
  ["Nomad Nest", "nomad", ["nomad", "t-minus", "t minus"]],
  ["ET-03", "et-03", ["et-03", "et03", "et01"]],
  ["The 9INE Light", "the-9ine-light", ["9ine", "nine light"]],
  ["Arizona Can Redesign", "arizonaconcept", ["arizona", "cmyk"]],
  ["Furniture Collection", "furniture", ["furniture", "furnature", "chair", "stool", "bench", "lamp"]],
  ["Logo Development", "logo-development", ["logo", "brand", "identity"]],
  ["Spotify Mini Speaker Concept", "spotify-concept", ["spotify", "speaker"]],
];

export const EXCLUDED_UTILITY_SLUGS = new Set([
  "cart",
  "layout-test",
  "test",
  "test2",
  "home-2",
  "home-3",
  "for-pdf-layout",
  "resume-1",
  "ux-ui-resume",
]);

export const OWNER_SUPPORT_ROUTES = new Set(["s01", "sol-seven-studios"]);

export function dataPath(fileName) {
  return path.join(DATA_DIR, fileName);
}

export async function ensureDir(dir) {
  await mkdir(dir, { recursive: true });
}

export async function readJson(filePath, fallback = null) {
  try {
    return JSON.parse(await readFile(filePath, "utf8"));
  } catch (error) {
    if (fallback !== null) return fallback;
    throw error;
  }
}

export async function writeJson(filePath, value) {
  await ensureDir(path.dirname(filePath));
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

export function cleanText(value = "") {
  return String(value)
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

export function slugify(value = "", fallback = "asset") {
  const slug = cleanText(value)
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 84);
  return slug || fallback;
}

export function pageUrlForSlug(slug) {
  return slug === "home" ? SITE_ORIGIN : `${SITE_ORIGIN}/${slug}`;
}

export function slugFromUrl(url) {
  const parsed = new URL(url, SITE_ORIGIN);
  const pathname = parsed.pathname.replace(/\/$/, "");
  return (
    pathname
      .replace(/^\//, "")
      .replace(/\/+/g, "-")
      .replace(/[^a-zA-Z0-9-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .toLowerCase() || "home"
  );
}

export function publicPathFromLocalPath(localPath = "") {
  if (!localPath) return "";
  return localPath.startsWith("/") ? localPath : `/${localPath.replace(/\\/g, "/")}`;
}

export function absolutePublicAssetPath(localPath = "") {
  return localPath ? path.join(ROOT, "public", localPath) : "";
}

export function kindForExtension(ext = "") {
  const lower = ext.toLowerCase();
  if ([".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(lower)) return "image";
  if ([".mp4", ".mov", ".webm"].includes(lower)) return "video";
  if ([".json", ".lottie"].includes(lower)) return "animation";
  if ([".glb", ".gltf", ".obj", ".fbx", ".stl", ".blend", ".f3d", ".step", ".stp", ".ksp"].includes(lower)) {
    return "model";
  }
  if ([".psd", ".ai", ".pdf", ".key"].includes(lower)) return "document";
  return "asset";
}

export async function loadRawSourcePages() {
  const source = await readFile(SOURCE_PAGES_FILE, "utf8");
  const executable = source
    .replace(
      'const asset = (path) => `${import.meta.env.BASE_URL}${path}`;',
      "const asset = (path) => path;",
    )
    .replace("const rawSourcePages =", "globalThis.__rawSourcePages =")
    .replace(/export const sourcePages[\s\S]*$/m, "");
  Function(executable)();
  return globalThis.__rawSourcePages;
}

export async function fetchHtml(url) {
  const response = await fetch(url, {
    headers: {
      "user-agent": "Mozilla/5.0 PortfolioAssetIntelligence/1.0",
      accept: "text/html,application/xhtml+xml",
    },
  });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return response.text();
}

export function extractMeta(html = "") {
  const meta = {};
  for (const match of html.matchAll(/<meta\b([^>]*)>/gi)) {
    const attrs = match[1] || "";
    const key =
      attrs.match(/\bproperty=(?:"([^"]+)"|'([^']+)'|([^\s>]+))/i)?.[1] ||
      attrs.match(/\bproperty=(?:"([^"]+)"|'([^']+)'|([^\s>]+))/i)?.[2] ||
      attrs.match(/\bname=(?:"([^"]+)"|'([^']+)'|([^\s>]+))/i)?.[1] ||
      attrs.match(/\bname=(?:"([^"]+)"|'([^']+)'|([^\s>]+))/i)?.[2] ||
      "";
    const content =
      attrs.match(/\bcontent=(?:"([^"]+)"|'([^']+)'|([^\s>]+))/i)?.[1] ||
      attrs.match(/\bcontent=(?:"([^"]+)"|'([^']+)'|([^\s>]+))/i)?.[2] ||
      "";
    if (key && content) meta[key] = cleanText(content);
  }
  return meta;
}

export function extractTextTags(html = "", tagName = "p") {
  const values = [];
  const pattern = new RegExp(`<${tagName}\\b[^>]*>([\\s\\S]*?)<\\/${tagName}>`, "gi");
  for (const match of html.matchAll(pattern)) {
    const text = cleanText(match[1]);
    if (text) values.push(text);
  }
  return [...new Set(values)];
}

export function extractAnchorLinks(html, pageBySlug, parentSlug) {
  const links = [];
  for (const match of html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)) {
    const attrs = match[1] || "";
    const rawHref =
      attrs.match(/\bhref=(?:"([^"]+)"|'([^']+)'|([^\s>]+))/i)?.[1] ||
      attrs.match(/\bhref=(?:"([^"]+)"|'([^']+)'|([^\s>]+))/i)?.[2] ||
      attrs.match(/\bhref=(?:"([^"]+)"|'([^']+)'|([^\s>]+))/i)?.[3] ||
      "";
    if (!rawHref || rawHref.startsWith("#") || rawHref.startsWith("mailto:") || rawHref.startsWith("tel:")) continue;

    let url;
    try {
      url = new URL(rawHref, SITE_ORIGIN);
    } catch {
      continue;
    }

    if (url.origin !== SITE_ORIGIN) continue;
    if (url.pathname.includes("/cart") || url.pathname.includes("/account")) continue;

    const slug = slugFromUrl(url.href);
    const page = pageBySlug.get(slug);
    if (!page) continue;

    links.push({
      slug,
      url: page.sourceUrl || pageUrlForSlug(slug),
      parentSlug,
      visibleLinkText: cleanText(match[2]) || cleanText(page.title),
      howDiscovered: parentSlug === "home" ? "home visible link" : "visible page link",
    });
  }
  return links;
}

export function sourceInternalLinks(page, pageBySlug, parentSlug) {
  return (page.internalLinks || [])
    .filter((slug) => pageBySlug.has(slug))
    .filter((slug) => slug !== parentSlug)
    .filter((slug) => !EXCLUDED_UTILITY_SLUGS.has(slug))
    .map((slug) => {
      const linkedPage = pageBySlug.get(slug);
      return {
        slug,
        url: linkedPage.sourceUrl || pageUrlForSlug(slug),
        parentSlug,
        visibleLinkText: cleanText(linkedPage.title),
        howDiscovered: "visible internal page link",
      };
    });
}

export async function buildVisibleSiteMap({ includeOwnerSupport = false } = {}) {
  const sourcePages = await loadRawSourcePages();
  const pageBySlug = new Map(sourcePages.map((page) => [page.slug, page]));
  const reached = new Map([
    ["home", { parentSlug: null, howDiscovered: "start page", visibleLinkText: "Home" }],
  ]);
  const queue = ["home"];

  while (queue.length) {
    const slug = queue.shift();
    const page = pageBySlug.get(slug);
    if (!page) continue;

    let links = [];
    try {
      const html = await fetchHtml(page.sourceUrl || pageUrlForSlug(slug));
      links = extractAnchorLinks(html, pageBySlug, slug);
    } catch {
      links = [];
    }
    links.push(...sourceInternalLinks(page, pageBySlug, slug));

    for (const link of links) {
      if (reached.has(link.slug)) continue;
      reached.set(link.slug, {
        parentSlug: slug,
        howDiscovered: link.howDiscovered,
        visibleLinkText: link.visibleLinkText,
      });
      queue.push(link.slug);
    }
  }

  return sourcePages.map((page) => {
    const reach = reached.get(page.slug);
    const support = includeOwnerSupport && OWNER_SUPPORT_ROUTES.has(page.slug);
    const included = (Boolean(reach) || support) && !EXCLUDED_UTILITY_SLUGS.has(page.slug);
    const parentPage =
      included && !support && reach?.parentSlug
        ? pageBySlug.get(reach.parentSlug)?.sourceUrl || pageUrlForSlug(reach.parentSlug)
        : support
          ? pageUrlForSlug("home")
          : "";

    return {
      pageTitle: cleanText(page.title),
      url: page.sourceUrl || pageUrlForSlug(page.slug),
      route: page.slug === "home" ? "/" : `/${page.slug}`,
      parentPage,
      visibleLinkText: support ? cleanText(page.title) : included ? reach.visibleLinkText : "",
      howDiscovered: support ? "owner requested support route" : included ? reach.howDiscovered : "",
      included,
      reason: included
        ? support
          ? "Included as an owner-requested support route; review before using in primary galleries."
          : page.slug === "home"
            ? "Starting public homepage."
            : "Reachable from the homepage through visible navigation, project cards, buttons, shop links, or page links."
        : EXCLUDED_UTILITY_SLUGS.has(page.slug)
          ? "Excluded utility, duplicate, or test page."
          : "Not reachable from the homepage through visible public links.",
    };
  });
}

export function nearestSection(page, mediaIndex) {
  const sections = page.sections || [];
  if (!sections.length) return { title: "Page media", items: [] };
  const index = Math.min(sections.length - 1, Math.floor((mediaIndex / Math.max(page.images?.length || 1, 1)) * sections.length));
  return sections[index] || sections[0];
}

export function contextForMedia(page, image, index) {
  const section = nearestSection(page, index);
  const heading = cleanText(section.title || page.title);
  const items = (section.items || []).map(cleanText).filter(Boolean);
  const caption = cleanText(image.caption || image.title || image.alt || "");
  const before = items[0] || cleanText(page.summary || page.description || "");
  const after = items[1] || "";
  return {
    assetUrl: image.url,
    localDownloadedPath: image.localPath ? path.join("public", image.localPath).replace(/\\/g, "/") : "",
    publicPath: publicPathFromLocalPath(image.localPath),
    originalPageUrl: page.sourceUrl || pageUrlForSlug(page.slug),
    domPosition: index,
    nearestHeading: heading,
    nearestParagraph: before,
    nearestCaption: caption,
    surroundingTextBefore: before,
    surroundingTextAfter: after,
    sectionLabel: heading,
    imageIndexOnPage: index,
    altText: cleanText(image.alt || ""),
  };
}

export function getImageDimensionsFromBuffer(buffer, ext) {
  const lower = ext.toLowerCase();
  try {
    if (lower === ".png" && buffer.toString("ascii", 1, 4) === "PNG") {
      return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
    }
    if ((lower === ".jpg" || lower === ".jpeg") && buffer[0] === 0xff && buffer[1] === 0xd8) {
      let offset = 2;
      while (offset < buffer.length) {
        if (buffer[offset] !== 0xff) break;
        const marker = buffer[offset + 1];
        const length = buffer.readUInt16BE(offset + 2);
        if ([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(marker)) {
          return { width: buffer.readUInt16BE(offset + 7), height: buffer.readUInt16BE(offset + 5) };
        }
        offset += 2 + length;
      }
    }
    if (lower === ".gif" && buffer.toString("ascii", 0, 3) === "GIF") {
      return { width: buffer.readUInt16LE(6), height: buffer.readUInt16LE(8) };
    }
    if (lower === ".webp" && buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP") {
      const chunk = buffer.toString("ascii", 12, 16);
      if (chunk === "VP8X") return { width: 1 + buffer.readUIntLE(24, 3), height: 1 + buffer.readUIntLE(27, 3) };
      if (chunk === "VP8 ") return { width: buffer.readUInt16LE(26) & 0x3fff, height: buffer.readUInt16LE(28) & 0x3fff };
      if (chunk === "VP8L") {
        const bits = buffer.readUInt32LE(21);
        return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
      }
    }
  } catch {
    return { width: null, height: null };
  }
  return { width: null, height: null };
}

export async function getImageDimensions(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (![".png", ".jpg", ".jpeg", ".gif", ".webp"].includes(ext)) return { width: null, height: null };
  let handle;
  try {
    handle = await open(filePath, "r");
    const buffer = Buffer.alloc(256 * 1024);
    const { bytesRead } = await handle.read(buffer, 0, buffer.length, 0);
    return getImageDimensionsFromBuffer(buffer.subarray(0, bytesRead), ext);
  } catch {
    return { width: null, height: null };
  } finally {
    if (handle) await handle.close();
  }
}

export async function fileStats(filePath) {
  try {
    const info = await stat(filePath);
    return {
      fileSize: info.size,
      modifiedDate: info.mtime.toISOString(),
    };
  } catch {
    return { fileSize: null, modifiedDate: null };
  }
}

export async function sha1ForFile(filePath, maxBytes = 50 * 1024 * 1024) {
  try {
    const info = await stat(filePath);
    const handle = await open(filePath, "r");
    try {
      const length = Math.min(info.size, maxBytes);
      const buffer = Buffer.alloc(length);
      const { bytesRead } = await handle.read(buffer, 0, length, 0);
      const hash = createHash("sha1").update(buffer.subarray(0, bytesRead)).digest("hex");
      return {
        sha1: hash,
        hashMode: info.size > maxBytes ? `partial-${maxBytes}` : "full",
      };
    } finally {
      await handle.close();
    }
  } catch {
    return { sha1: null, hashMode: null };
  }
}

export function aspectRatio(width, height) {
  return width && height ? Number((width / height).toFixed(4)) : null;
}

export function matchProjectFromText(text = "") {
  const haystack = cleanText(text).toLowerCase().replace(/[_-]+/g, " ");
  let best = { project: "", route: "", confidence: 0, reason: "" };
  for (const [project, route, terms] of PROJECT_MATCHERS) {
    const hits = terms.filter((term) => haystack.includes(term));
    if (!hits.length) continue;
    const confidence = Math.min(0.95, 0.45 + hits.length * 0.16);
    if (confidence > best.confidence) {
      best = { project, route, confidence, reason: `Matched ${hits.join(", ")} in path or context.` };
    }
  }
  return best;
}

export function makeAssetId(prefix, value) {
  return `${prefix}-${createHash("sha1").update(String(value)).digest("hex").slice(0, 12)}`;
}

export function inferRecommendedUse(asset) {
  const text = `${asset.section || ""} ${asset.nearbyHeading || ""} ${asset.captionShort || ""}`.toLowerCase();
  if (asset.imageIndexOnPage === 0 || text.includes("hero")) return "hero";
  if (text.includes("sketch") || text.includes("cad") || text.includes("prototype") || text.includes("process")) return "process";
  if (text.includes("logo") || text.includes("diagram") || text.includes("blueprint")) return "detail";
  if (asset.type === "video" || asset.type === "animation") return "gallery";
  if (asset.source === "local" && asset.confidence < 0.7) return "review-only";
  return "gallery";
}

export function confidenceBand(confidence = 0) {
  if (confidence >= 0.75) return "high";
  if (confidence >= 0.45) return "medium";
  return "low";
}

export function safeAssetName(asset, ordinal = 1) {
  const ext = path.extname(asset.localPath || asset.originalFilename || asset.originalUrl || "").toLowerCase() || ".asset";
  const project = slugify(asset.pageRoute?.replace(/^\//, "") || asset.project || "unmatched");
  const section = slugify(asset.section || asset.nearbyHeading || asset.recommendedUse || "gallery");
  const description = slugify(asset.captionShort || asset.visualDescription || asset.originalFilename || "asset").slice(0, 46);
  const typePrefix = asset.type === "image" ? "image" : asset.type;
  return `${project}__${section}__${typePrefix}-${String(ordinal).padStart(3, "0")}__${description}${ext}`;
}

export async function walkLocalAssets(root, results = []) {
  let entries;
  try {
    entries = await readdir(root, { withFileTypes: true });
  } catch {
    return results;
  }

  for (const entry of entries) {
    const fullPath = path.join(root, entry.name);
    if (entry.isDirectory()) {
      if (!IGNORE_DIRS.has(entry.name.toLowerCase())) await walkLocalAssets(fullPath, results);
      continue;
    }
    if (!entry.isFile()) continue;
    const ext = path.extname(entry.name).toLowerCase();
    if (!LOCAL_EXTENSIONS.has(ext)) continue;
    results.push(fullPath);
  }
  return results;
}

export async function copyIfRequested(sourcePath, destinationPath, shouldCopy) {
  await ensureDir(path.dirname(destinationPath));
  if (shouldCopy) await copyFile(sourcePath, destinationPath);
}
