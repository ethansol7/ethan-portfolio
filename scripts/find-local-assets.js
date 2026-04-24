import { readdir, stat, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const ROOTS = [
  "D:\\4th Year College",
  "D:\\3rd Year College",
  "D:\\Downloads",
];

const OUTPUT_DIR = path.join(process.cwd(), "source-data");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "local-assets-found.json");

const EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".tif",
  ".tiff",
  ".heic",
  ".mp4",
  ".mov",
  ".m4v",
  ".webm",
  ".json",
  ".lottie",
  ".glb",
  ".gltf",
  ".obj",
  ".fbx",
  ".stl",
  ".step",
  ".stp",
  ".f3d",
  ".f3z",
  ".blend",
  ".bip",
  ".ksp",
  ".psd",
  ".ai",
  ".svg",
  ".pdf",
]);

const PROJECTS = [
  ["SOL Lamp System", ["sol lamp", "sol x lamp", "s01", "s02", "s03", "s04", "studio 2 lamp"]],
  ["Sol Seven Studios", ["sol seven", "solseven"]],
  ["PlastiVista", ["plastivista", "plasti vista", "filament recycler", "fillament recycler"]],
  ["Revo Chair", ["revo", "evo seat", "chair prosses"]],
  ["Sol Wheel", ["sol wheel", "solwheel", "steam deck steering"]],
  ["Autodesk Origin", ["autodesk origin", "origin arnimation", "autodesk rit", "origin"]],
  ["ShelfMate", ["shelf mate", "shelfmate", "bookshelf"]],
  ["Bungis Chair", ["bungis"]],
  ["Airo", ["airo"]],
  ["Nomad Nest", ["nomad", "t-minus", "t minus"]],
  ["ET-03", ["et-03", "et03", "et01"]],
  ["The 9INE Light", ["9ine", "nine light"]],
  ["Furniture Collection", ["furniture", "furnature", "chair", "stool"]],
  ["Arizona Can Redesign", ["arizona", "rizon"]],
];

const IGNORE_DIRS = new Set([".git", "node_modules", "$recycle.bin", "__macosx"]);

function kindFor(ext) {
  if ([".jpg", ".jpeg", ".png", ".webp", ".gif", ".tif", ".tiff", ".heic", ".svg"].includes(ext)) return "image";
  if ([".mp4", ".mov", ".m4v", ".webm"].includes(ext)) return "video";
  if ([".json", ".lottie"].includes(ext)) return "animation";
  if ([".glb", ".gltf", ".obj", ".fbx", ".stl", ".step", ".stp", ".f3d", ".f3z", ".blend", ".bip", ".ksp"].includes(ext)) return "model";
  return "source";
}

function matchesProjects(filePath) {
  const haystack = filePath.toLowerCase().replace(/[_-]+/g, " ");
  return PROJECTS.filter(([, terms]) => terms.some((term) => haystack.includes(term))).map(([projectName]) => projectName);
}

async function walk(dir, files) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!IGNORE_DIRS.has(entry.name.toLowerCase())) await walk(fullPath, files);
      continue;
    }

    if (!entry.isFile()) continue;
    const ext = path.extname(entry.name).toLowerCase();
    if (!EXTENSIONS.has(ext)) continue;

    const projects = matchesProjects(fullPath);
    if (!projects.length) continue;

    const info = await stat(fullPath);
    files.push({
      projectNames: projects,
      name: entry.name,
      path: fullPath,
      kind: kindFor(ext),
      sizeMB: Number((info.size / 1024 / 1024).toFixed(2)),
      modified: info.mtime.toISOString(),
    });
  }
}

const files = [];
for (const root of ROOTS) {
  await walk(root, files);
}

const byProject = {};
for (const file of files) {
  for (const projectName of file.projectNames) {
    byProject[projectName] = byProject[projectName] || [];
    byProject[projectName].push({
      name: file.name,
      path: file.path,
      kind: file.kind,
      sizeMB: file.sizeMB,
      modified: file.modified,
    });
  }
}

for (const assets of Object.values(byProject)) {
  assets.sort((a, b) => b.sizeMB - a.sizeMB);
}

await mkdir(OUTPUT_DIR, { recursive: true });
await writeFile(
  OUTPUT_FILE,
  JSON.stringify(
    {
      scannedAt: new Date().toISOString(),
      roots: ROOTS,
      totalMatches: files.length,
      byProject,
    },
    null,
    2,
  ),
);

console.log(`Indexed ${files.length} matching local assets into ${OUTPUT_FILE}`);
