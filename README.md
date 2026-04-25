# Ethan Solodukhin Portfolio

React + Vite portfolio site for Ethan Solodukhin, built for GitHub Pages.

Live site: https://ethansol7.github.io/ethan-portfolio/

## Run Locally

```bash
npm install
npm run dev
```

Local dev runs with Vite at the URL printed in the terminal.

## Build

```bash
npm run build
```

The production output is written to `dist/`.

## Preview GitHub Pages Path

```bash
npm run build
npm run preview -- --host 127.0.0.1 --port 4175 --base /ethan-portfolio/
```

Then open:

```text
http://127.0.0.1:4175/ethan-portfolio/
```

## GitHub Pages Setup

This repo is configured for GitHub Pages with:

- `vite.config.js` base path support for `ethan-portfolio`
- `.github/workflows/deploy.yml`
- `public/404.html` fallback routing for direct project links

If Pages needs to be enabled manually:

1. Open the GitHub repository.
2. Go to `Settings -> Pages`.
3. Set `Build and deployment -> Source` to `GitHub Actions`.
4. Push to `main`, or run the `Deploy to GitHub Pages` workflow from the `Actions` tab.

## Project Structure

```text
src/
  App.jsx
  main.jsx
  styles.css
  data/
public/
  assets/
  404.html
.github/
  workflows/
```

## Content Notes

Project content and imagery are based on Ethan's existing portfolio at:

https://www.ethansolodukhin.com/

Contact details are managed in `src/data/portfolio.js`.
