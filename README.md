# Ethan Solodukhin Portfolio

React + Vite rebuild of Ethan Solodukhin's portfolio, restructured as a hiring-focused industrial design site with six flagship case studies, grouped supporting projects, and GitHub Pages deployment support.

## What is included

- `Home`, `Work`, `More Projects`, `About`, and `Contact`
- Six featured case studies:
  - `SOL Lamp System`
  - `Sol Seven Studios`
  - `PlastiVista`
  - `Revo Chair`
  - `Sol Wheel`
  - `Autodesk Origin`
- Supporting project archive rebuilt from the public site, including:
  - `Airo`
  - `Shelf Mate`
  - `Nomad Nest`
  - `ET-03`
  - `Bungis Chair`
  - `Arizona Can Redesign`
  - `The 9INE Light`
  - `Furniture Collection`
  - `Spotify Mini Speaker Concept`
  - `Concept Room`
  - `Logo Development`
  - `Every Day Render Challenge`
  - `SOL Digital Art & Sculptures`
- Responsive layout, SEO metadata, Open Graph tags, and GitHub Pages SPA fallback routing
- Production-ready curated assets in `public/assets/projects`
- Local crawl archives and saved source pages used during the rebuild

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

This project is configured for GitHub Pages with:

- automatic `base` path detection in `vite.config.js`
- a Pages deployment workflow at `.github/workflows/deploy.yml`
- `public/404.html` fallback routing for deep links
- an `index.html` redirect script so React routes survive direct refreshes

### How the base path works

- Local builds use `/`
- GitHub Actions builds automatically use `/${repo-name}/` for project pages repos
- User or organization pages repos like `username.github.io` stay on `/`

If you need to test a project-pages base locally, you can override it:

```bash
$env:VITE_BASE_PATH="/your-repo-name/"
cmd /c npm.cmd run build
```

### GitHub Pages setup

1. Create a GitHub repository for this project if one does not already exist.
2. Push the code to the default branch, ideally `main`.
3. In GitHub, open `Settings -> Pages`.
4. Set the source to `GitHub Actions`.
5. Push again or run the `Deploy to GitHub Pages` workflow manually.

The workflow will:

1. install dependencies with `npm ci`
2. run `npm run build`
3. upload `dist/`
4. publish the site to GitHub Pages

## Vercel

This project also works on Vercel with default Vite settings:

- Build command: `npm run build`
- Output directory: `dist`

## Repo hygiene

The public crawl archive in `assets/current-site` and `assets/sol-seven-studios` is very large and is ignored by git on purpose. The production site only ships the curated assets needed to run the portfolio.

## Content notes

- Copy was rebuilt from the public Squarespace portfolio, the public Sol Seven Studios site, and Ethan's public 2026 resume.
- No fake projects, clients, awards, or metrics were added.
- When a deeper internal process log was not publicly available, the copy stays specific to what the public material actually shows.

## Useful folders

- `src/data/portfolio.js`: content model, case-study copy, contact info, and supporting project archive
- `src/App.jsx`: routes and page composition
- `src/styles.css`: visual system and responsive layout
- `public/assets/projects`: curated production assets used by the live site
- `public/404.html`: SPA fallback for GitHub Pages
- `source-data/pages`: saved HTML snapshots from the main portfolio crawl
- `source-data-solseven/pages`: saved HTML snapshots from the Sol Seven crawl
- `assets/README.md`: notes about the large local crawl archive
