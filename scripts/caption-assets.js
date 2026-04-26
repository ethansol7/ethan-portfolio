import { writeFile } from "node:fs/promises";
import path from "node:path";
import {
  ROOT,
  cleanText,
  confidenceBand,
  dataPath,
  ensureDir,
  inferRecommendedUse,
  readJson,
  safeAssetName,
  slugify,
  writeJson,
} from "./lib/asset-intelligence-core.js";

function readableProject(asset) {
  return cleanText(asset.project || asset.possibleProjectName || asset.pageRoute?.replace(/^\//, "") || "Unmatched asset");
}

function deriveShortCaption(asset) {
  const caption = cleanText(asset.nearbyCaption || asset.captionShort || "");
  if (caption) return caption.slice(0, 140);
  const heading = cleanText(asset.nearbyHeading || asset.section || "");
  const project = readableProject(asset);
  if (heading && project && heading.toLowerCase() !== project.toLowerCase()) return `${project}: ${heading}`.slice(0, 140);
  if (project) return project.slice(0, 140);
  return cleanText(asset.originalFilename || "Portfolio asset").slice(0, 140);
}

function deriveLongCaption(asset, shortCaption) {
  const context = cleanText(asset.nearbyText || "");
  const section = cleanText(asset.section || asset.nearbyHeading || "");
  const parts = [shortCaption];
  if (section && !shortCaption.toLowerCase().includes(section.toLowerCase())) parts.push(`Section: ${section}.`);
  if (context) parts.push(context.slice(0, 260));
  if (asset.source === "local" && asset.matchedWebsiteAssetId) {
    parts.push("Matched to a visible website asset by file hash or image metadata.");
  }
  if (asset.source === "local" && !asset.matchedWebsiteAssetId) {
    parts.push("Local asset requires manual confirmation before portfolio use.");
  }
  return parts.join(" ").slice(0, 520);
}

function deriveDescription(asset, shortCaption) {
  const dimensions = asset.dimensions?.width && asset.dimensions?.height
    ? `${asset.dimensions.width}x${asset.dimensions.height}`
    : "unknown dimensions";
  const sourceContext = asset.source === "website"
    ? `appeared on ${asset.pageRoute || "an included page"}`
    : `found in ${asset.folderPath || "a local folder"}`;
  return `${shortCaption}. ${asset.type} asset, ${dimensions}, ${sourceContext}.`.slice(0, 420);
}

function deriveDetectedText(asset) {
  return cleanText(
    [
      asset.nearbyCaption,
      asset.nearbyHeading,
      asset.type === "document" ? asset.originalFilename : "",
    ]
      .filter(Boolean)
      .join(" "),
  ).slice(0, 280);
}

function generateUsageIndex(assets) {
  const byRoute = {};
  for (const asset of assets) {
    if (asset.source !== "website" || asset.type !== "image" || !asset.approvedForUse || !asset.pageRoute) continue;
    const routeSlug = asset.pageRoute === "/" ? "home" : asset.pageRoute.replace(/^\//, "");
    const index = Number.isInteger(asset.imageIndexOnPage) ? asset.imageIndexOnPage : null;
    if (index === null) continue;
    if (!byRoute[routeSlug]) byRoute[routeSlug] = {};
    byRoute[routeSlug][index] = {
      src: asset.publicPath,
      captionShort: asset.captionShort,
      width: asset.dimensions?.width || null,
      height: asset.dimensions?.height || null,
      aspectRatio: asset.aspectRatio || null,
      section: asset.section,
      confidence: asset.confidence,
      assetId: asset.assetId,
    };
  }

  return `export const approvedAssetByRouteAndIndex = ${JSON.stringify(byRoute, null, 2)};\n`;
}

const database = await readJson(dataPath("asset-intelligence.json"));
const ordinalByBucket = new Map();

const assets = (database.assets || []).map((asset) => {
  const captionShort = deriveShortCaption(asset);
  const captionLong = deriveLongCaption(asset, captionShort);
  const visualDescription = deriveDescription(asset, captionShort);
  const recommendedUse = inferRecommendedUse({ ...asset, captionShort });
  const bucket = `${slugify(asset.pageRoute || asset.project || "review")}:${slugify(asset.section || recommendedUse || "gallery")}:${asset.type}`;
  const ordinal = (ordinalByBucket.get(bucket) || 0) + 1;
  ordinalByBucket.set(bucket, ordinal);
  const confidence = Number(asset.confidence || 0);

  return {
    ...asset,
    captionShort,
    captionLong,
    visualDescription,
    detectedText: deriveDetectedText(asset),
    recommendedUse,
    safeName: safeAssetName({ ...asset, captionShort, recommendedUse }, ordinal),
    confidenceBand: confidenceBand(confidence),
    approvedForUse: asset.approvedForUse && confidence >= 0.75,
  };
});

const summary = {
  ...database.summary,
  highConfidence: assets.filter((asset) => asset.confidence >= 0.75).length,
  mediumConfidence: assets.filter((asset) => asset.confidence >= 0.45 && asset.confidence < 0.75).length,
  lowConfidence: assets.filter((asset) => asset.confidence < 0.45).length,
  approvedForUse: assets.filter((asset) => asset.approvedForUse).length,
};

await writeJson(dataPath("asset-intelligence.json"), {
  ...database,
  generatedAt: new Date().toISOString(),
  summary,
  assets,
});

await ensureDir(path.join(ROOT, "src", "data"));
await writeFile(path.join(ROOT, "src", "data", "approvedAssetIndex.js"), generateUsageIndex(assets));

console.log(
  JSON.stringify(
    {
      file: "data/asset-intelligence.json",
      usageIndex: "src/data/approvedAssetIndex.js",
      ...summary,
    },
    null,
    2,
  ),
);
