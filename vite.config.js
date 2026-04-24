import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "";
const isUserOrOrgPagesRepo = repoName.endsWith(".github.io");
const base =
  process.env.VITE_BASE_PATH ||
  (process.env.GITHUB_ACTIONS
    ? isUserOrOrgPagesRepo || !repoName
      ? "/"
      : `/${repoName}/`
    : "/");

export default defineConfig({
  plugins: [react()],
  base,
});
