# Ethan Solodukhin Portfolio

React + Vite rebuild of Ethan Solodukhin's industrial design portfolio. The site is designed as a hiring-first master portfolio: six curated flagship case studies up front, plus a complete More Projects index rebuilt from the public Squarespace site.

Live site: https://ethansol7.github.io/ethan-portfolio/

## What is included

- `Home`, `Work`, `More Projects`, `About`, and `Contact`
- Six featured employer-facing case studies:
  - `SOL Lamp System`
  - `Sol Seven Studios`
  - `PlastiVista`
  - `Revo Chair`
  - `Sol Wheel`
  - `Autodesk Origin`
- Complete More Projects index rebuilt from the live `ethansolodukhin.com` structure:
  - 82 recreated public pages
  - 1,245 downloaded public assets organized by source page
  - 22 media or animation references
  - grouped sections for product work, furniture and lighting, SOL universe, shop objects, brand and visualization, utilities, and older project pages
- Curated local-source asset pack:
  - 116 high-resolution project images
  - 9 project videos
  - 35 model/source files
- Responsive layout, SEO metadata, Open Graph tags, GitHub Pages base-path handling, and SPA fallback routing

## Run locally

```bash
cmd /c npm.cmd install
cmd /c npm.cmd run dev
```

## Build locally

```bash
cmd /c npm.cmd run build
```

The production output is written to `dist/`.

## GitHub Pages

This repo is configured for GitHub Pages with:

- automatic `base` path detection in `vite.config.js`
- deployment workflow at `.github/workflows/deploy.yml`
- `public/404.html` fallback routing for deep links
- an `index.html` redirect script so React routes survive direct refreshes

The current Pages URL is:

https://ethansol7.github.io/ethan-portfolio/

### Manual Pages setup

If Pages ever needs to be re-enabled manually:

1. Open the GitHub repository.
2. Go to `Settings -> Pages`.
3. Set `Build and deployment -> Source` to `GitHub Actions`.
4. Run the `Deploy to GitHub Pages` workflow from the `Actions` tab, or push to `main`.

## Base path behavior

- Local builds use `/`
- GitHub Actions builds use `/${repo-name}/` for project pages repos
- User or organization pages repos like `username.github.io` stay on `/`

To test a GitHub Pages-style base path locally:

```bash
$env:VITE_BASE_PATH="/ethan-portfolio/"
cmd /c npm.cmd run build
```

## Content and asset rules

- Public page content comes from `https://www.ethansolodukhin.com/`.
- Images and media are real public assets or approved local project assets.
- No fake projects, clients, awards, or metrics were added.
- Two Lottie files were blocked by the source host with `403 Forbidden`; the site keeps the rest of the source page content intact.
- `asset-manifest.json` documents source pages, website assets, local assets, used assets, and missing assets without storing local absolute paths.

## Asset scripts

The repo includes three optional maintenance scripts:

```bash
node scripts/crawl-site-assets.js
node scripts/find-local-assets.js
node scripts/generate-krea-assets.js
```

The supplemental visual script reads credentials only from the local environment and writes review-only output to `src/assets/generated/review/`. Review files are not used by the site unless manually approved and moved into the normal asset structure.

## Useful folders

- `src/data/portfolio.js`: curated featured case-study copy and contact data
- `src/data/sourcePages.js`: rebuilt full-site source data
- `src/data/localAssets.js`: rebuilt local-source asset data
- `public/assets/projects`: curated featured-project assets
- `public/assets/source-site`: optimized public assets from the live site, organized by source page
- `public/assets/local-source`: curated higher-quality local assets
- `asset-manifest.json`: page-by-page asset manifest
- `scripts/`: crawl, local search, and review-visual tooling
- `.github/workflows/deploy.yml`: GitHub Pages deployment workflow
