import { writeFile } from "node:fs/promises";
import path from "node:path";
import {
  ORGANIZED_ASSET_DIR,
  confidenceBand,
  copyIfRequested,
  dataPath,
  ensureDir,
  readJson,
  slugify,
  writeJson,
} from "./lib/asset-intelligence-core.js";

function destinationFor(asset) {
  const projectSlug =
    asset.approvedForUse && asset.confidence >= 0.75
      ? slugify(asset.pageRoute?.replace(/^\//, "") || asset.project || "unmatched")
      : "_review";
  return path.join(ORGANIZED_ASSET_DIR, projectSlug, asset.safeName || asset.originalFilename);
}

function safeOriginalPath(asset) {
  if (asset.source === "website") return asset.publicPath || asset.originalUrl || "";
  if (!asset.localPath) return "";
  return asset.localPath.replace(process.cwd(), "[repo]").replace(/\\/g, "/");
}

function markdownImage(asset) {
  if (asset.source === "website" && asset.publicPath) return `![thumbnail](${asset.publicPath})`;
  return "`local asset`";
}

function tableRows(assets, limit = 300) {
  return assets.slice(0, limit).map((asset) => {
    const original = asset.source === "website" ? asset.originalUrl || asset.publicPath : asset.localPath;
    return `| ${markdownImage(asset)} | ${asset.originalFilename || ""} | ${asset.project || asset.possibleProjectName || ""} | ${asset.section || ""} | ${asset.captionShort || ""} | ${asset.confidence.toFixed(2)} | ${asset.confidenceReason || ""} | ${asset.recommendedUse || ""} | ${asset.originalPageUrl || original || ""} |`;
  });
}

function section(title, assets, limit) {
  const rows = tableRows(assets, limit);
  return [
    `## ${title} (${assets.length})`,
    "",
    assets.length > limit ? `_Showing first ${limit} items. Full data is in data/asset-intelligence.json._` : "",
    "",
    "| Thumbnail | Current filename | Suggested project | Suggested section | Caption | Confidence | Reason | Recommended placement | Original page/link |",
    "|---|---|---|---|---|---:|---|---|---|",
    ...rows,
    "",
  ].join("\n");
}

const shouldCopy = process.env.COPY_ORGANIZED_ASSETS === "1";
const database = await readJson(dataPath("asset-intelligence.json"));
await ensureDir(ORGANIZED_ASSET_DIR);
await ensureDir(path.join(ORGANIZED_ASSET_DIR, "_review"));

const renamingMap = [];

for (const asset of database.assets || []) {
  const destination = destinationFor(asset);
  const folder = path.dirname(destination);
  const relativeDestination = path.relative(process.cwd(), destination).replace(/\\/g, "/");
  const sourcePath = asset.localPath || "";
  const entry = {
    assetId: asset.assetId,
    originalPath: safeOriginalPath(asset),
    newOrganizedPath: relativeDestination,
    mode: shouldCopy ? "copy" : "alias",
    project: asset.project || asset.possibleProjectName || "",
    section: asset.section || "",
    caption: asset.captionShort || "",
    confidence: asset.confidence,
    confidenceBand: confidenceBand(asset.confidence),
    approvedForUse: asset.approvedForUse,
  };
  renamingMap.push(entry);

  if (shouldCopy && sourcePath) {
    try {
      await copyIfRequested(sourcePath, destination, true);
    } catch (error) {
      entry.copyWarning = error.message;
    }
  } else {
    await ensureDir(folder);
  }
}

const assets = database.assets || [];
const high = assets.filter((asset) => asset.confidence >= 0.75);
const medium = assets.filter((asset) => asset.confidence >= 0.45 && asset.confidence < 0.75);
const low = assets.filter((asset) => asset.confidence < 0.45);
const duplicates = assets.filter((asset) => asset.duplicateGroup);
const unmatched = assets.filter((asset) => !asset.project || !asset.pageRoute);
const review = [
  "# Asset Review",
  "",
  "Internal review file for confirming asset placement before public use.",
  "",
  section("High confidence", high, 300),
  section("Medium confidence", medium, 300),
  section("Low confidence", low, 300),
  section("Duplicates", duplicates, 300),
  section("Unmatched", unmatched, 300),
].join("\n");

await writeJson(dataPath("asset-renaming-map.json"), {
  generatedAt: new Date().toISOString(),
  copyMode: shouldCopy,
  organizedRoot: path.relative(process.cwd(), ORGANIZED_ASSET_DIR).replace(/\\/g, "/"),
  summary: {
    totalMapped: renamingMap.length,
    highConfidence: high.length,
    mediumConfidence: medium.length,
    lowConfidence: low.length,
    duplicates: duplicates.length,
    unmatched: unmatched.length,
  },
  assets: renamingMap,
});
await writeFile(dataPath("asset-review.md"), review);

console.log(
  JSON.stringify(
    {
      file: "data/asset-renaming-map.json",
      review: "data/asset-review.md",
      mode: shouldCopy ? "copy" : "alias",
      totalMapped: renamingMap.length,
    },
    null,
    2,
  ),
);
