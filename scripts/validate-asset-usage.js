import { readFile } from "node:fs/promises";
import path from "node:path";
import { dataPath, readJson, slugFromUrl, writeJson } from "./lib/asset-intelligence-core.js";

function normalizeRoute(route) {
  if (!route || route === "/") return "/";
  return route.startsWith("/") ? route : `/${route}`;
}

function routeFromSlug(slug) {
  if (!slug || slug === "home") return "/";
  return `/${slug}`;
}

function appImageReferences(source) {
  const refs = [];
  for (const match of source.matchAll(/imageFrom:\s*\[\s*"([^"]+)"\s*,\s*(\d+)\s*\]/g)) {
    refs.push({ slug: match[1], index: Number(match[2]), kind: "card imageFrom" });
  }
  for (const match of source.matchAll(/hero:\s*(\d+)/g)) {
    refs.push({ slug: null, index: Number(match[1]), kind: "planned hero" });
  }
  return refs;
}

const visibleMap = await readJson(dataPath("visible-site-map.json"));
const pageContext = await readJson(dataPath("page-context-map.json"));
const database = await readJson(dataPath("asset-intelligence.json"));
const renaming = await readJson(dataPath("asset-renaming-map.json"));

const includedRoutes = new Set((visibleMap.pages || []).filter((page) => page.included).map((page) => normalizeRoute(page.route)));
const assetByPublicPath = new Map();
const assetByRouteIndex = new Map();
for (const asset of database.assets || []) {
  if (asset.publicPath) assetByPublicPath.set(asset.publicPath, asset);
  if (asset.source === "website" && Number.isInteger(asset.imageIndexOnPage)) {
    assetByRouteIndex.set(`${normalizeRoute(asset.pageRoute)}:${asset.imageIndexOnPage}`, asset);
  }
}

const errors = [];
const warnings = [];
const validatedAssets = [];

for (const page of pageContext.pages || []) {
  const route = normalizeRoute(page.route);
  if (!includedRoutes.has(route)) {
    errors.push({
      type: "hidden-page-context",
      route,
      message: "Page context exists for a route that is not included in the visible site map.",
    });
    continue;
  }

  for (const media of page.mediaAssets || []) {
    const asset =
      assetByRouteIndex.get(`${route}:${media.imageIndexOnPage}`) ||
      assetByPublicPath.get(media.publicPath);
    if (!asset) {
      errors.push({
        type: "missing-intelligence-entry",
        route,
        asset: media.publicPath || media.assetUrl,
        message: "Displayed/source media is missing from asset-intelligence.json.",
      });
      continue;
    }

    if (!asset.approvedForUse) {
      errors.push({
        type: "unapproved-visible-asset",
        route,
        assetId: asset.assetId,
        confidence: asset.confidence,
        message: "Visible page media is not approved for use.",
      });
    }

    if (normalizeRoute(asset.pageRoute) !== route) {
      errors.push({
        type: "route-mismatch",
        expectedRoute: route,
        actualRoute: asset.pageRoute,
        assetId: asset.assetId,
        message: "Asset route does not match the page where it appears.",
      });
    }

    if (asset.confidence < 0.75) {
      errors.push({
        type: "low-confidence-visible-asset",
        route,
        assetId: asset.assetId,
        confidence: asset.confidence,
        message: "A low or medium confidence asset is present in visible page media.",
      });
    }

    validatedAssets.push(asset.assetId);
  }
}

const appSource = await readFile(path.join(process.cwd(), "src", "App.jsx"), "utf8");
for (const ref of appImageReferences(appSource).filter((ref) => ref.slug)) {
  const route = routeFromSlug(ref.slug);
  const asset = assetByRouteIndex.get(`${route}:${ref.index}`);
  if (!asset) {
    errors.push({
      type: "app-reference-missing-asset",
      route,
      index: ref.index,
      message: "App.jsx references an image index that was not found in asset intelligence.",
    });
    continue;
  }
  if (!asset.approvedForUse || asset.confidence < 0.75) {
    errors.push({
      type: "app-reference-unapproved",
      route,
      index: ref.index,
      assetId: asset.assetId,
      confidence: asset.confidence,
      message: "App.jsx references an unapproved or low-confidence asset.",
    });
  }
}

const forbiddenSourceTerms = [
  ["AI", /\bAI\b/i],
  ["generated", /\bgenerated\b/i],
  ["crawl", /\bcrawl(?:ed|ing)?\b/i],
  ["rebuild", /\brebuild|rebuilt\b/i],
  ["assets pulled", /\bassets pulled\b/i],
  ["page count", /\bpage count\b/i],
  ["media count", /\bmedia count\b/i],
  ["source archive", /\bsource archive\b/i],
  ["dataset", /\bdataset\b/i],
  ["deployment", /\bdeployment\b/i],
  ["status", /\bstatus\b/i],
  ["completion report", /\bcompletion report\b/i],
  ["expanded assets", /\bexpanded assets\b/i],
  ["implementation", /\bimplementation\b/i],
];

for (const [term, pattern] of forbiddenSourceTerms) {
  if (pattern.test(appSource)) {
    warnings.push({
      type: "public-source-term",
      term,
      message: "Term found in App.jsx source. Confirm it does not render publicly.",
    });
  }
}

const summary = {
  passed: errors.length === 0,
  errors: errors.length,
  warnings: warnings.length,
  validatedVisibleAssets: new Set(validatedAssets).size,
  intelligenceAssets: database.assets?.length || 0,
  renamingEntries: renaming.assets?.length || 0,
  visibleRoutes: includedRoutes.size,
};

await writeJson(dataPath("asset-usage-validation.json"), {
  generatedAt: new Date().toISOString(),
  summary,
  errors,
  warnings,
});

console.log(
  JSON.stringify(
    {
      file: "data/asset-usage-validation.json",
      ...summary,
    },
    null,
    2,
  ),
);

if (errors.length) process.exit(1);
