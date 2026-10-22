# Proba & Stats Notes

A fully static study website for university lecture notes (probability & statistics, databases,
…), built with Astro, Tailwind CSS, KaTeX and Shiki. Deployed on GitHub Pages.

Dark mode: class-based toggle (Moon/Sun button in the sidebar and mobile header), remembers the
choice in `localStorage`, falls back to the system preference on first visit; content math
(KaTeX) and prose adapt automatically via `prose-invert`.

## Content architecture

All study content lives under `content/courses/<course-id>/`. Content is organized by **course**,
**content type** and **document**, exactly one folder per course:

```
content/courses/
├── probability-statistics/          # course folder = stable identifier (kebab-case)
│   ├── course.yaml                  # optional course metadata (id, title, description, icon, order)
│   ├── lectures/                    # content types — the folder determines the type
│   │   ├── 01-probability-basics.md
│   │   ├── 02-random-variables.md
│   │   └── ...                      # zero-padded prefix → ordering + stable URL slug
│   ├── tutorials/
│   │   └── 01-simulation-in-python.md
│   ├── problems/
│   │   ├── 01-probability-exercises.md
│   │   └── 02-inference-exercises.md
│   └── reference/
│       └── 01-statistics-summary-sheet.md
├── databases/
│   ├── course.yaml
│   ├── lectures/…
│   └── problems/…
└── machine-learning/                # course.yaml only — renders as "no documents yet"
    ├── course.yaml
    ├── lectures/ (.gitkeep)
    ├── tutorials/ (.gitkeep)
    ├── problems/ (.gitkeep)
    └── reference/ (.gitkeep)
```

### Known content types

The type comes from the folder name. Known types (and the sidebar order):

| Folder | Label | Icon |
| --- | --- | --- |
| `lectures/` | Lectures | book-open |
| `tutorials/` | Tutorials | lightbulb |
| `problems/` | Problem sets | pencil-line |
| `reference/` | Reference sheets | library |

Any *other* folder name still works and is rendered under a humanized label (e.g. `seminars/`
→ "Seminars") — no Markdown file is ever silently excluded.

### Document URLs and ordering

- URL: `/<course>/<content-type>/<NN-slug>/`, e.g.
  `/probability-statistics/lectures/01-probability-basics/`.
- Ordering: frontmatter `order` wins → else the zero-padded filename prefix (`01-…`) → else
  alphabetical. Previous/next links follow this same order within a content type.
- Titles: frontmatter `title` wins → else derived from the filename
  (`01-probability-basics` → "Probability basics").

### Frontmatter fields (all optional)

```yaml
---
title: Markov chains          # override the derived title
description: One-sentence teaser for course pages and search.
order: 4                      # explicit ordering override (must be unique per folder)
tags: [python, simulation]    # used by search and shown on the page
type: lectures                # advisory only — folder wins, mismatch warns at build
draft: true                   # hide the document from the site
---
```

## Automatic discovery

Every build re-scans `content/courses/`. Adding a Markdown file automatically:

1. discovers and parses the file (Zod-validated frontmatter — invalid metadata fails loudly);
2. generates its static HTML page at the derived URL;
3. adds it to the sidebar under the right course + content type;
4. adds it to the course index page, its section list, and the search index;
5. generates previous/next links from the ordering rules.

No route files, navigation arrays, component code or central registry are touched.

Adding content **strictly requires no application code edits**. The only artifacts that get
regenerated are the build outputs: `npm run dev` / `npm run build`.

## Adding a lecture (exact steps)

1. Choose the course folder, e.g. `content/courses/databases/` (create one first if needed —
   see below).
2. Choose the content type folder: `lectures/`, `tutorials/`, `problems/`, `reference/` or your
   own (`seminars/`).
3. Create `content/courses/databases/lectures/03-joins.md`:
   - the **zero-padded prefix** `03-` determines the order and must be unique within the folder
     (duplicates produce a build-time warning);
   - the remainder of the filename (`joins`) forms the URL slug;
   - do not use spaces or accents in file names; lowercase-kebab-case recommended.
4. Optional frontmatter (title, description, order, tags, draft) — anything can be omitted.
5. Write Markdown ($...$ / $$...$$ math, fenced code blocks) and save.
6. Run `npm run dev` (or commit and let CI build) — the page, sidebar entry, course listing,
   search entry and prev/next links appear automatically.

Verification checklist for a new lecture: `npm run build` then
`npx astro preview --open /databases/lectures/03-joins/`.

## Adding a course (exact steps)

1. `mkdir -p content/courses/<course-id>/{lectures,tutorials,problems,reference}` where
   `<course-id>` is a lowercase kebab-case identifier (e.g. `databases`). The folder name is the
   permanent, stable identifier and part of every document URL — do not change it later.
2. Add `content/courses/<course-id>/course.yaml`:

   ```yaml
   id: <course-id>              # must match the folder name, warned otherwise
   title: Databases             # course title
   description: Short blurb shown on overview pages.
   icon: database               # one of the keys in src/lib/icons.ts (optional)
   order: 2                     # course ordering on the home page (optional, integer)
   ```

   All fields are optional; the file itself may be omitted (the folder name is humanized and
   used as the title). Empty sub-folders are fine — commit a `.gitkeep` or delete
   those you don't plan to use (see `machine-learning/` as a working example of a course
   without documents yet).
3. Add lecture/tutorial/problem/reference Markdown files per the steps above.
4. `npm run build` — the course card and sidebar section appear automatically.

## Search

The `/search` page filters titles, descriptions, tags, course and type over an index that is
embedded at build time (`buildSiteContent().searchIndex`) — new documents are indexed on the
next build automatically. Press `/` from anywhere to jump to search.

## Internal links in Markdown

Write internal links as root-absolute paths without the deployment prefix:

```md
See [Random variables](/probability-statistics/lectures/02-random-variables/).
```

A tiny rehype plugin (`astro.config.mjs → rehypePrefixLinks`) adds the deployment base at
build time, so these links work identically on GitHub Pages, a custom domain root or a preview.
`node scripts/check-links.mjs` (runs as part of `npm run build`) verifies that every internal
link in the generated HTML actually resolves — broken references fail the build.

## Validation & warnings

Detected at build time (non-fatal warnings are printed as `[content] …`, fatal issues abort the
build):

- invalid frontmatter / `course.yaml` → Zod validation error (build fails);
- `course.yaml` `id` mismatching the folder name → warning, folder wins;
- frontmatter `type` mismatching the folder → warning, folder wins;
- duplicate `order` values or duplicate filename prefixes in one folder → warning,
  alphabetical order decides;
- documents outside the required layout (`courses/<course>/<type>/<file>.md`) → warning,
  still published;
- broken internal links after rendering → `[check-links]` report, build fails (exit 1).

## Mathematics

Inline `$x = y^2$` and display `$$\int_\Omega X\,dP$$` syntax (remark-math + rehype-katex,
rendered at build time — zero client JS). Custom macros live in `astro.config.mjs`.

## Commands

| Command | Description |
| --- | --- |
| `npm run dev` | dev server at `http://localhost:4321/proba-stats-site/` |
| `npm run build` | static build + internal link check, output in `dist/` |
| `npm run preview` | preview the production build locally |
| `npm run check` | TypeScript / Astro diagnostics |
| `node scripts/check-links.mjs` | re-run the internal link check only |
| `node scripts/convert-latex.mjs` | convert `latex/<lecture-folder>/main.tex` → course Markdown (see below) |
| `npm run latex:sync` | convert only the lectures whose `latex/` source changed |
| `npm run latex:watch` | watch `latex/` and convert on every change (run while `npm run dev` is up) |

## LaTeX → Markdown conversion

University lecture notes live as LaTeX in `latex/<lecture-folder>/` (one folder per
lecture, main file `main.tex`, images alongside). They are converted with Pandoc +
post-processing; the source `.tex` files are never modified.

First-time setup (no root needed): the pipeline uses a user-local static Pandoc:

```sh
mkdir -p ~/.local/bin
curl -fsSL -o /tmp/pandoc.tar.gz https://github.com/jgm/pandoc/releases/download/3.6.4/pandoc-3.6.4-linux-amd64.tar.gz
tar -xzf /tmp/pandoc.tar.gz -C /tmp
cp /tmp/pandoc-3.6.4/bin/pandoc ~/.local/bin
```

Batch-convert every lecture (repeatable; new lectures only need a new folder under `latex/`):

```sh
node scripts/convert-latex.mjs
node scripts/convert-latex.mjs --overwrite        # re-convert existing ones
node scripts/convert-latex.mjs --dry-run          # see warnings without writing
node scripts/convert-latex.mjs --report-only      # refresh the report without converting
```

### Reflecting changes (the usual workflow)

After editing or adding files under `latex/` run:

```sh
npm run latex:sync        # one-shot: converts only the changed lectures
npm run latex:watch       # keeps running; converts automatically on every change
npm run latex:sync -- --force   # re-convert everything (also refreshes the report)
```

The sync script fingerprints each lecture folder (sha256 of every `.tex` file plus
name/size of each other file) into `.latex-sync.json` (git-ignored) and re-converts
only the folders whose fingerprint changed or whose `.md` target is missing. New
lecture folders are picked up automatically; a full `conversion-report.md` is
regenerated afterwards. `latex:watch` uses the same loop so you can keep the dev
server (`npm run dev`) open in another terminal — Astro hot-reloads the content as
the Markdown files change.

What it does per lecture folder:

- writes `content/courses/<course>/<type>/<NN>-<slug>.md` (number comes from the
  `lecture-NN-…` folder prefix), with the `\title{…}` text as frontmatter title;
  **existing targets are skipped unless `--overwrite`**
- copies every image of the folder to `public/images/<type>/<NN>-<slug>/` — including
  images never referenced in the LaTeX (table screenshots etc. are kept as assets)
- rewrites image references to root-absolute `/images/…` paths (the deployment base
  prefix is added at build time)
- converts math to `$…$` / `$$…$$` delimiters and flattens `\begin{figure}`,
  `\newpage`, `\vspace…`; `\ref{…}` markers become visible `[ref: …]` markers
  because equation/figure numbering changes in Markdown
- validates **every** math expression with exactly the KaTeX version the site installs
- compares structure between the .tex source and the .md output
  (headings, inline/display math, images, list items)

It writes `conversion-report.md` at the repo root: a table of per-file counts plus all
warnings, and a **manual-review flag** for any file with custom commands, unsupported
environments, broken `\ref`s, unknown figures, KaTeX-rendering failures or count
differences. The script exits non-zero when some source needs review. Equal counts do
**not** by themselves prove a lossless conversion — the flagged files (and ideally all
of them) must be read by a human before publishing.

## Deployment (GitHub Pages)

The workflow in `.github/workflows/deploy.yml` builds and deploys on every push to `main`.
One-time setup: in the repository **Settings → Pages → Build and deployment**, set *Source* to
**GitHub Actions**.

The base path defaults to `/proba-stats-site`. If the repository is ever renamed, override
without touching code: `SITE_URL=https://example.io BASE_PATH= npm run build`.

## Project structure (code)

```
src/
├── content.config.ts        # collections: documents (**/*.md) + coursesMeta (*/course.yaml)
├── components/Sidebar.astro # persistent navigation (courses → content types → documents)
├── layouts/BaseLayout.astro # shell: sidebar + main + mobile drawer + "/" search shortcut
├── lib/
│   ├── content.ts           # discovery → courses/sections/documents, ordering, warnings, search index
│   ├── icons.ts             # icon name → Lucide component map
│   └── slug.ts              # URL slug rules
├── pages/
│   ├── index.astro                  # course overview
│   ├── search.astro                 # client-side filter over the build-time index
│   ├── 404.astro
│   └── [course]/
│       ├── index.astro              # course index: breadcrumbs, per-type sections
│       └── [...lecture].astro       # document pages: nav math, prev/next
└── styles/global.css
```
