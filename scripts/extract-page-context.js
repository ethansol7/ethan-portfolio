import {
  buildVisibleSiteMap,
  cleanText,
  contextForMedia,
  dataPath,
  extractMeta,
  extractTextTags,
  fetchHtml,
  loadRawSourcePages,
  pageUrlForSlug,
  publicPathFromLocalPath,
  readJson,
  slugFromUrl,
  writeJson,
} from "./lib/asset-intelligence-core.js";

function extractLinks(html = "") {
  const links = [];
  for (const match of html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)) {
    const attrs = match[1] || "";
    const href =
      attrs.match(/\bhref=(?:"([^"]+)"|'([^']+)'|([^\s>]+))/i)?.[1] ||
      attrs.match(/\bhref=(?:"([^"]+)"|'([^']+)'|([^\s>]+))/i)?.[2] ||
      attrs.match(/\bhref=(?:"([^"]+)"|'([^']+)'|([^\s>]+))/i)?.[3] ||
      "";
    const label = cleanText(match[2]);
    const ariaLabel =
      attrs.match(/\baria-label=(?:"([^"]+)"|'([^']+)'|([^\s>]+))/i)?.[1] ||
      attrs.match(/\baria-label=(?:"([^"]+)"|'([^']+)'|([^\s>]+))/i)?.[2] ||
      attrs.match(/\baria-label=(?:"([^"]+)"|'([^']+)'|([^\s>]+))/i)?.[3] ||
      "";
    if (!href && !label && !ariaLabel) continue;
    links.push({ href, label, ariaLabel: cleanText(ariaLabel) });
  }
  return links;
}

function extractAriaLabels(html = "") {
  return [...html.matchAll(/\baria-label=(?:"([^"]+)"|'([^']+)'|([^\s>]+))/gi)]
    .map((match) => cleanText(match[1] || match[2] || match[3] || ""))
    .filter(Boolean);
}

function projectNameForPage(page) {
  const title = cleanText(page.title || "");
  if (!title) return "";
  return title
    .replace(/\s+-\s+Ethan Solodukhin\s*$/i, "")
    .replace(/\s+-\s+Sol Shop\s*$/i, "")
    .trim();
}

function sourceImageToMedia(page, image, index) {
  const context = contextForMedia(page, image, index);
  return {
    ...context,
    assetKind: "image",
    assetUrl: image.url,
    localDownloadedPath: image.localPath ? `public/${image.localPath}` : "",
    publicPath: publicPathFromLocalPath(image.localPath),
    altText: cleanText(image.alt || ""),
    title: cleanText(image.title || ""),
    caption: cleanText(image.caption || ""),
    imageOrder: index,
    sectionOrder: index,
    domGrouping: context.sectionLabel,
  };
}

function sourceVideoToMedia(page, item, index) {
  const localPath = item.localPath || item.src?.replace(/^\//, "") || "";
  return {
    assetKind: item.kind || "media",
    assetUrl: item.url || item.src || "",
    localDownloadedPath: localPath ? `public/${localPath}` : "",
    publicPath: publicPathFromLocalPath(localPath),
    originalPageUrl: page.sourceUrl || pageUrlForSlug(page.slug),
    domPosition: index,
    nearestHeading: cleanText(page.title),
    nearestParagraph: cleanText(page.summary || page.description || ""),
    nearestCaption: cleanText(item.caption || item.title || ""),
    surroundingTextBefore: cleanText(page.summary || page.description || ""),
    surroundingTextAfter: "",
    sectionLabel: "Motion",
    imageIndexOnPage: index,
    imageOrder: index,
    sectionOrder: index,
    domGrouping: "Motion",
    altText: cleanText(item.alt || ""),
    title: cleanText(item.title || ""),
    caption: cleanText(item.caption || ""),
  };
}

const existingMap = await readJson(dataPath("visible-site-map.json"), null);
const visiblePages = existingMap?.pages || (await buildVisibleSiteMap({ includeOwnerSupport: true }));
const includedSlugs = new Set(
  visiblePages.filter((page) => page.included).map((page) => slugFromUrl(page.url)),
);
const sourcePages = await loadRawSourcePages();
const contexts = [];

for (const page of sourcePages.filter((candidate) => includedSlugs.has(candidate.slug))) {
  let html = "";
  let metadata = {};
  let liveHeadings = [];
  let liveParagraphs = [];
  let liveCaptions = [];
  let liveLinks = [];
  let ariaLabels = [];
  try {
    html = await fetchHtml(page.sourceUrl || pageUrlForSlug(page.slug));
    metadata = extractMeta(html);
    liveHeadings = ["h1", "h2", "h3", "h4", "h5", "h6"].flatMap((tag) =>
      extractTextTags(html, tag).map((text) => ({ level: tag, text })),
    );
    liveParagraphs = extractTextTags(html, "p");
    liveCaptions = extractTextTags(html, "figcaption");
    liveLinks = extractLinks(html);
    ariaLabels = extractAriaLabels(html);
  } catch (error) {
    metadata = { extractionWarning: error.message };
  }

  const headingsFromSource = (page.textBlocks || [])
    .filter((block) => /^h[1-6]$/i.test(block.level || "") || block.type === "heading")
    .map((block) => ({ level: block.level || "heading", text: cleanText(block.text) }))
    .filter((heading) => heading.text);
  const paragraphsFromSource = (page.textBlocks || [])
    .filter((block) => block.type !== "heading")
    .map((block) => cleanText(block.text))
    .filter(Boolean);
  const captions = [
    ...liveCaptions,
    ...(page.images || []).map((image) => cleanText(image.caption)).filter(Boolean),
  ];
  const mediaAssets = [
    ...(page.images || []).map((image, index) => sourceImageToMedia(page, image, index)),
    ...(page.media || []).map((item, index) => sourceVideoToMedia(page, item, index)),
  ];

  contexts.push({
    pageTitle: cleanText(page.title),
    url: page.sourceUrl || pageUrlForSlug(page.slug),
    route: page.slug === "home" ? "/" : `/${page.slug}`,
    projectName: projectNameForPage(page),
    headings: liveHeadings.length ? liveHeadings : headingsFromSource,
    paragraphs: liveParagraphs.length ? liveParagraphs : paragraphsFromSource,
    captions,
    buttonsAndLinks: liveLinks,
    images: (page.images || []).map((image, index) => ({
      assetUrl: image.url,
      localDownloadedPath: image.localPath ? `public/${image.localPath}` : "",
      publicPath: publicPathFromLocalPath(image.localPath),
      altText: cleanText(image.alt || ""),
      caption: cleanText(image.caption || ""),
      order: index,
    })),
    videos: (page.media || []).map((item, index) => ({
      assetUrl: item.url || item.src || "",
      localDownloadedPath: item.localPath ? `public/${item.localPath}` : "",
      publicPath: publicPathFromLocalPath(item.localPath || item.src || ""),
      caption: cleanText(item.caption || ""),
      order: index,
    })),
    mediaAssets,
    imageOrder: mediaAssets.map((asset) => asset.publicPath || asset.assetUrl),
    sectionOrder: (page.sections || []).map((section) => cleanText(section.title)).filter(Boolean),
    sections: (page.sections || []).map((section, index) => ({
      index,
      title: cleanText(section.title),
      text: (section.items || []).map(cleanText).filter(Boolean),
      mediaGroup: mediaAssets.filter((asset) => asset.sectionLabel === cleanText(section.title)),
      visualLayout: "Preserve original grouped section flow; apply styling only after context validation.",
      spacingRhythm: "Derived from original section breaks and media sequence.",
    })),
    domGroups: (page.sections || []).map((section, index) => ({
      index,
      label: cleanText(section.title) || `Section ${index + 1}`,
      textBlocks: (section.items || []).map(cleanText).filter(Boolean),
      mediaIndexes: mediaAssets
        .filter((asset) => asset.sectionLabel === cleanText(section.title))
        .map((asset) => asset.imageIndexOnPage),
    })),
    altTexts: (page.images || []).map((image) => cleanText(image.alt || "")).filter(Boolean),
    ariaLabels,
    metadata,
    openGraphImage: metadata["og:image"] || metadata["twitter:image"] || page.heroImage || "",
  });
}

await writeJson(dataPath("page-context-map.json"), {
  generatedAt: new Date().toISOString(),
  visiblePageCount: contexts.length,
  pages: contexts,
});

console.log(
  JSON.stringify(
    {
      file: "data/page-context-map.json",
      visiblePageCount: contexts.length,
      mediaAssets: contexts.reduce((sum, page) => sum + page.mediaAssets.length, 0),
    },
    null,
    2,
  ),
);
