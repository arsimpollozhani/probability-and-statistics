# Proba & Stats Notes

A static study-notes site built with Astro, Tailwind CSS, KaTeX and Shiki. Lecture content lives
as Markdown and is deployed automatically to GitHub Pages on every push to `main`.

## Requirements

- Node.js (LTS) and npm
- [Pandoc](https://pandoc.org/installing.html) — only needed for LaTeX → Markdown conversion

## Setup

```bash
git clone https://github.com/arsimpollozhani/probability-and-statistics.git
cd probability-and-statistics
npm install
npm run dev
```

Open `http://localhost:4321/proba-stats-site/`.

## Adding a lecture

### From Markdown

Create a file under a course content folder:

```
content/courses/probability-statistics/lectures/06-markov-chains.md
```

The zero-padded prefix (`06-`) controls ordering and the URL. Frontmatter is optional:

```yaml
---
title: Markov chains
description: One-sentence summary for listings and search.
tags: [markov, stochastic]
draft: false
---
```

Write normal Markdown with `$inline$` and `$$display$$` math. The page, sidebar entry, search
result and previous/next links are generated automatically.

### From LaTeX

1. Add one folder per lecture under `latex/`, with `main.tex` and its images:

   ```
   latex/lecture-06-markov-chains/main.tex
   ```

2. Convert the changed lectures:

   ```bash
   npm run latex:sync
   ```

   This writes `content/courses/probability-statistics/lectures/06-markov-chains.md` and copies
   images to `public/images/lectures/06-markov-chains/`.

3. Read `conversion-report.md`. Fix anything marked **YES / needs review** in the generated
   Markdown and run the checks:

   ```bash
   npm run build
   npm run check
   ```

4. Commit the `.tex` source, generated `.md`, copied images and report, then push.

Useful conversion commands:

```bash
npm run latex:sync              # convert only changed lectures
npm run latex:watch             # watch latex/ and convert on change
npm run latex:sync -- --force   # reconvert everything
npm run latex:sync -- --course databases   # convert into another course
```

**Important:** GitHub Actions builds the site but does **not** run the LaTeX converter. Only
committed Markdown and images are published. Syncing a changed `.tex` overwrites its generated
`.md`, so make manual edits after conversion or reapply them after the next sync.

## Adding a course

Create `content/courses/<course-id>/` with an optional `course.yaml`:

```yaml
id: databases
title: Databases
description: Short blurb for the home and course pages.
icon: database
order: 2
```

Then add Markdown files under `lectures/`, `tutorials/`, `problems/` or `reference/`. The folder
name is the permanent course ID and part of every URL.

## Commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Build the site and check all internal links |
| `npm run preview` | Preview the production build locally |
| `npm run check` | Run Astro/TypeScript diagnostics |
| `npm run latex:sync` | Convert changed LaTeX lectures to Markdown |
| `npm run latex:watch` | Watch `latex/` and convert on every change |

## Project layout

```
latex/                 # LaTeX lecture sources
content/courses/       # Markdown content, grouped by course and type
public/images/         # Images used by lectures
src/                   # Astro pages, layouts, components and styles
scripts/               # LaTeX conversion and link-checking scripts
```

## Deployment

Pushing to `main` runs `.github/workflows/deploy.yml`, builds the site and deploys it to GitHub
Pages. The Pages source must remain **Settings → Pages → Source → GitHub Actions**.

The site URL and base path are derived from the repository name during Actions builds. Override
them only when needed:

```bash
SITE_URL=https://example.io BASE_PATH=/ npm run build
```
