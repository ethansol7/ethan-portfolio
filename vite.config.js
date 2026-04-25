import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command }) => {
  const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1] || "ethan-portfolio";
  const isUserOrOrgPagesRepo = repoName.endsWith(".github.io");
  const base =
    process.env.VITE_BASE_PATH ||
    (command === "serve"
      ? "/"
      : isUserOrOrgPagesRepo
        ? "/"
        : `/${repoName}/`);

  return {
    plugins: [react()],
    base,
  };
});
