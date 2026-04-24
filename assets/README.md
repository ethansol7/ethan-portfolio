# Asset Archive Notes

The full public crawl archive for the original Squarespace site and the public Sol Seven site is stored locally under:

- `assets/current-site`
- `assets/sol-seven-studios`

Those directories are intentionally ignored by git because the archive is very large and is not required to run the production portfolio.

The live site only depends on the curated assets in:

- `public/assets/projects`

Additional temporary downloads used during the rebuild, such as local resume snapshots or HTML fetches, are also kept out of git.
