import { buildVisibleSiteMap, dataPath, writeJson } from "./lib/asset-intelligence-core.js";

const includeOwnerSupport = process.argv.includes("--include-support");
const pages = await buildVisibleSiteMap({ includeOwnerSupport });
const summary = {
  included: pages.filter((page) => page.included).length,
  excluded: pages.filter((page) => !page.included).length,
  ownerSupport: pages.filter((page) => page.howDiscovered === "owner requested support route").length,
};

await writeJson(dataPath("visible-site-map.json"), {
  generatedAt: new Date().toISOString(),
  source: "https://www.ethansolodukhin.com/",
  includeOwnerSupport,
  summary,
  pages,
});

console.log(
  JSON.stringify(
    {
      file: "data/visible-site-map.json",
      ...summary,
    },
    null,
    2,
  ),
);
