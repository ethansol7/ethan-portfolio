import path from "node:path";
import {
  LOCAL_ROOTS,
  ROOT,
  absolutePublicAssetPath,
  aspectRatio,
  cleanText,
  confidenceBand,
  dataPath,
  fileStats,
  getImageDimensions,
  kindForExtension,
  makeAssetId,
  matchProjectFromText,
  readJson,
  sha1ForFile,
  walkLocalAssets,
  writeJson,
} from "./lib/asset-intelligence-core.js";

function sourcePathForWebsiteAsset(media) {
  if (!media.localDownloadedPath) return "";
  if (media.localDownloadedPath.startsWith("public/")) {
    return path.join(ROOT, media.localDownloadedPath);
  }
  return absolutePublicAssetPath(media.localDownloadedPath);
}

function projectFromPage(page) {
  return cleanText(page.projectName || page.pageTitle || "");
}

function dimensionsMatch(a, b) {
  if (!a?.width || !a?.height || !b?.width || !b?.height) return false;
  const widthDelta = Math.abs(a.width - b.width) / Math.max(a.width, b.width);
  const heightDelta = Math.abs(a.height - b.height) / Math.max(a.height, b.height);
  return widthDelta <= 0.02 && heightDelta <= 0.02;
}

function dimKey(assetOrDimensions, type, route = "") {
  const dimensions = assetOrDimensions.dimensions || assetOrDimensions;
  return `${type}:${route}:${dimensions?.width || 0}x${dimensions?.height || 0}`;
}

const pageContext = await readJson(dataPath("page-context-map.json"));
const websiteAssets = [];

for (const page of pageContext.pages || []) {
  for (const media of page.mediaAssets || []) {
    const sourcePath = sourcePathForWebsiteAsset(media);
    const ext = path.extname(sourcePath || media.assetUrl || media.publicPath).toLowerCase();
    const type = kindForExtension(ext);
    const dimensions = type === "image" && sourcePath ? await getImageDimensions(sourcePath) : { width: null, height: null };
    const stats = sourcePath ? await fileStats(sourcePath) : { fileSize: null, modifiedDate: null };
    const hash = sourcePath ? await sha1ForFile(sourcePath) : { sha1: null, hashMode: null };
    const hasContext = Boolean(media.nearestHeading || media.nearestParagraph || media.nearestCaption);
    const confidence = hasContext ? 0.88 : 0.76;

    websiteAssets.push({
      assetId: makeAssetId("web", media.assetUrl || media.publicPath || `${page.route}-${media.imageIndexOnPage}`),
      originalFilename: path.basename(sourcePath || media.assetUrl || media.publicPath || "asset"),
      safeName: "",
      type,
      source: "website",
      originalUrl: media.assetUrl || "",
      localPath: sourcePath,
      publicPath: media.publicPath || "",
      dimensions,
      aspectRatio: aspectRatio(dimensions.width, dimensions.height),
      fileSize: stats.fileSize,
      modifiedDate: stats.modifiedDate,
      sha1: hash.sha1,
      hashMode: hash.hashMode,
      project: projectFromPage(page),
      pageRoute: page.route,
      section: cleanText(media.sectionLabel || media.nearestHeading || ""),
      nearbyHeading: cleanText(media.nearestHeading || ""),
      nearbyText: cleanText(media.nearestParagraph || media.surroundingTextBefore || ""),
      nearbyCaption: cleanText(media.nearestCaption || media.caption || ""),
      captionShort: "",
      captionLong: "",
      visualDescription: "",
      detectedText: "",
      confidence,
      confidenceBand: confidenceBand(confidence),
      confidenceReason: hasContext
        ? "Website asset from an included visible page with nearby section text."
        : "Website asset from an included visible page, but nearby section context is thin.",
      approvedForUse: confidence >= 0.75,
      recommendedUse: "",
      imageIndexOnPage: media.imageIndexOnPage,
      domPosition: media.domPosition,
      originalPageUrl: media.originalPageUrl,
      duplicateGroup: "",
      nearDuplicateGroup: "",
    });
  }
}

const hashToWebsite = new Map(websiteAssets.filter((asset) => asset.sha1).map((asset) => [asset.sha1, asset]));
const websiteSizes = new Set(websiteAssets.map((asset) => asset.fileSize).filter(Boolean));
const websiteByRouteDim = new Map();
for (const asset of websiteAssets) {
  const route = asset.pageRoute?.replace(/^\//, "") || "";
  const key = dimKey(asset, asset.type, route);
  if (!websiteByRouteDim.has(key)) websiteByRouteDim.set(key, []);
  websiteByRouteDim.get(key).push(asset);
}

const localPaths = [];
for (const root of LOCAL_ROOTS) {
  await walkLocalAssets(root, localPaths);
}

const localAssets = [];
let processedLocal = 0;
for (const localPath of localPaths) {
  processedLocal += 1;
  if (processedLocal % 1000 === 0) {
    console.log(`Analyzed ${processedLocal}/${localPaths.length} local assets`);
  }

  const ext = path.extname(localPath).toLowerCase();
  const type = kindForExtension(ext);
  const stats = await fileStats(localPath);
  const dimensions = type === "image" ? await getImageDimensions(localPath) : { width: null, height: null };
  const projectMatch = matchProjectFromText(localPath);
  const shouldHashLocal =
    stats.fileSize &&
    stats.fileSize <= 12 * 1024 * 1024 &&
    websiteSizes.has(stats.fileSize) &&
    ["image", "video", "animation"].includes(type);
  const hash = shouldHashLocal ? await sha1ForFile(localPath, stats.fileSize) : { sha1: null, hashMode: "skipped-local" };
  const exactWebMatch = hash.sha1 ? hashToWebsite.get(hash.sha1) : null;
  const routeDimMatches = projectMatch.route ? websiteByRouteDim.get(dimKey(dimensions, type, projectMatch.route)) || [] : [];
  const nearWebMatch = !exactWebMatch
    ? routeDimMatches.find((asset) => dimensionsMatch(asset.dimensions, dimensions))
    : null;

  let confidence = 0.18;
  let confidenceReason = "No strong project or website context match found.";
  let project = projectMatch.project || "";
  let pageRoute = projectMatch.route ? `/${projectMatch.route}` : "";
  let section = "";
  let nearbyHeading = "";
  let nearbyText = "";
  let originalPageUrl = "";

  if (exactWebMatch) {
    confidence = 0.96;
    confidenceReason = `Exact hash match to website asset on ${exactWebMatch.pageRoute}.`;
    project = exactWebMatch.project;
    pageRoute = exactWebMatch.pageRoute;
    section = exactWebMatch.section;
    nearbyHeading = exactWebMatch.nearbyHeading;
    nearbyText = exactWebMatch.nearbyText;
    originalPageUrl = exactWebMatch.originalPageUrl;
  } else if (nearWebMatch) {
    confidence = 0.78;
    confidenceReason = `Near dimension and project-path match to website asset on ${nearWebMatch.pageRoute}.`;
    project = nearWebMatch.project;
    pageRoute = nearWebMatch.pageRoute;
    section = nearWebMatch.section;
    nearbyHeading = nearWebMatch.nearbyHeading;
    nearbyText = nearWebMatch.nearbyText;
    originalPageUrl = nearWebMatch.originalPageUrl;
  } else if (projectMatch.confidence >= 0.6) {
    confidence = Math.min(0.68, projectMatch.confidence);
    confidenceReason = projectMatch.reason;
  } else if (projectMatch.confidence > 0) {
    confidence = projectMatch.confidence;
    confidenceReason = `${projectMatch.reason} Needs manual confirmation before use.`;
  }

  localAssets.push({
    assetId: makeAssetId("local", localPath),
    originalFilename: path.basename(localPath),
    safeName: "",
    type,
    source: "local",
    originalUrl: "",
    localPath,
    publicPath: "",
    dimensions,
    aspectRatio: aspectRatio(dimensions.width, dimensions.height),
    fileSize: stats.fileSize,
    modifiedDate: stats.modifiedDate,
    sha1: hash.sha1,
    hashMode: hash.hashMode,
    folderPath: path.dirname(localPath),
    nearbyFolderNames: path.dirname(localPath).split(path.sep).slice(-5),
    possibleProjectName: projectMatch.project,
    project,
    pageRoute,
    section,
    nearbyHeading,
    nearbyText,
    nearbyCaption: "",
    captionShort: "",
    captionLong: "",
    visualDescription: "",
    detectedText: "",
    confidence,
    confidenceBand: confidenceBand(confidence),
    confidenceReason,
    approvedForUse: confidence >= 0.75,
    recommendedUse: "",
    imageIndexOnPage: null,
    originalPageUrl,
    matchedWebsiteAssetId: exactWebMatch?.assetId || nearWebMatch?.assetId || "",
    duplicateGroup: "",
    nearDuplicateGroup: "",
  });
}

const assets = [...websiteAssets, ...localAssets];
const byHash = new Map();
for (const asset of assets) {
  if (!asset.sha1) continue;
  if (!byHash.has(asset.sha1)) byHash.set(asset.sha1, []);
  byHash.get(asset.sha1).push(asset);
}

for (const [hash, group] of byHash) {
  if (group.length < 2) continue;
  const duplicateGroup = `sha1-${hash.slice(0, 10)}`;
  for (const asset of group) asset.duplicateGroup = duplicateGroup;
}

const bySignature = new Map();
for (const asset of assets) {
  const key = `${asset.type}:${asset.dimensions?.width || 0}x${asset.dimensions?.height || 0}:${asset.fileSize || 0}`;
  if (!bySignature.has(key)) bySignature.set(key, []);
  bySignature.get(key).push(asset);
}

for (const [signature, group] of bySignature) {
  if (group.length < 2 || signature.includes("0x0")) continue;
  const nearDuplicateGroup = `signature-${Math.abs([...signature].reduce((sum, char) => sum + char.charCodeAt(0), 0))}`;
  for (const asset of group) asset.nearDuplicateGroup = nearDuplicateGroup;
}

const summary = {
  totalAssets: assets.length,
  websiteAssets: websiteAssets.length,
  localAssets: localAssets.length,
  highConfidence: assets.filter((asset) => asset.confidence >= 0.75).length,
  mediumConfidence: assets.filter((asset) => asset.confidence >= 0.45 && asset.confidence < 0.75).length,
  lowConfidence: assets.filter((asset) => asset.confidence < 0.45).length,
  duplicateGroups: [...byHash.values()].filter((group) => group.length > 1).length,
};

await writeJson(dataPath("asset-intelligence.json"), {
  generatedAt: new Date().toISOString(),
  localRoots: LOCAL_ROOTS,
  summary,
  assets,
});

console.log(
  JSON.stringify(
    {
      file: "data/asset-intelligence.json",
      ...summary,
    },
    null,
    2,
  ),
);
