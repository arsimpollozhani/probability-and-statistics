#!/usr/bin/env node
/**
 * LaTeX → Markdown conversion pipeline for the Astro study-notes site.
 *
 * Usage:
 *   node scripts/convert-latex.mjs [options] [sourceFolder ...]
 *
 * Options:
 *   --src DIR       Root folder with one subfolder per lecture (default: latex)
 *   --course ID     Target course id under content/courses (default: probability-statistics)
 *   --type FOLDER   Content-type folder inside the course (default: lectures)
 *   --only STRING   Only convert source folders whose name contains STRING (repeatable)
 *   --overwrite     Overwrite existing .md targets (default: skip and warn)
 *   --dry-run       Do everything except writing files
 *   --no-report     Do not write the conversion report
 *   --report FILE   Report path (default: conversion-report.md)
 *   -h, --help      Show this help
 *
 * Targets: content/courses/<course>/<type>/<NN>-<slug>.md
 * Assets:  public/images/<type>/<NN>-<slug>/<original-image-file>
 * The report compares per-file structure (headings/math/images/items tex→md),
 * validates every math expression with the site's KaTeX version, and flags
 * files that need manual review. Source .tex files are never modified.
 */
import { spawnSync } from 'node:child_process';
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { basename, dirname, extname, join, relative, resolve } from 'node:path';
import { homedir, tmpdir } from 'node:os';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

const USAGE = `Options:
  --src DIR       Root folder with one subfolder per lecture (default: latex)
  --course ID     Target course id under content/courses (default: probability-statistics)
  --type FOLDER   Content-type folder inside the course (default: lectures)
  --only STRING   Only convert source folders whose name contains STRING (repeatable)
  --overwrite     Overwrite existing .md targets (default: skip and warn)
  --dry-run       Do everything except writing files
  --no-report     Do not write the conversion report
  --report FILE   Report path (default: conversion-report.md)`;

const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  console.log(USAGE);
  process.exit(0);
}

function pick(flag, fallback) {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : fallback;
}
function collect(flag) {
  const values = [];
  args.forEach((a, i) => {
    if (a === flag) values.push(args[i + 1]);
  });
  return values.length ? values : null;
}

const srcRoot = pick('--src', 'latex');
const courseId = pick('--course', 'probability-statistics');
const typeFolder = pick('--type', 'lectures');
const onlyFilter = collect('--only');
const overwrite = args.includes('--overwrite');
const dryRun = args.includes('--dry-run');
const writeReport = !args.includes('--no-report');
const reportOnly = args.includes('--report-only');
const reportPath = pick('--report', 'conversion-report.md');

const contentRoot = resolve('content/courses');
const publicRoot = resolve('public');
const KNOWN_IMAGE_EXTS = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'];
const KNOWN_GRAPHIC_EXTS = [...KNOWN_IMAGE_EXTS, '.pdf'];

if (!existsSync(contentRoot)) {
  console.error(`content/courses not found — run from the repository root`);
  process.exit(2);
}

function findPandoc() {
  const candidates = [
    process.env.PANDOC,
    join(homedir(), '.local/bin/pandoc'),
    '/usr/bin/pandoc',
    '/usr/local/bin/pandoc',
  ].filter(Boolean);
  for (const c of candidates) if (existsSync(c)) return c;
  return 'pandoc';
}
const PANDOC = findPandoc();
const versionProbe = spawnSync(PANDOC, ['--version'], { encoding: 'utf8' });
if (versionProbe.status !== 0) {
  console.error(
    'pandoc is required (https://pandoc.org/installing.html); or set PANDOC=/path/to/pandoc',
  );
  process.exit(2);
}
const pandocVersion = versionProbe.stdout.split('\n')[0];

/** Extract the outermost {..} body starting at `start` (index of the opening brace). */
function balancedBody(text, start) {
  let depth = 0;
  for (let i = start; i < text.length; i++) {
    if (text[i] === '{') depth++;
    else if (text[i] === '}') {
      depth--;
      if (depth === 0) return [text.slice(start + 1, i), start, i];
    }
  }
  return null;
}

/** \title{...} → plain text (strip \vspace, \textbf, line breaks). */
function extractTitle(tex) {
  const m = /\\title\s*\*?\s*\{/.exec(tex);
  if (!m) return null;
  const body = balancedBody(tex, m.index + m[0].length - 1)?.[0] ?? '';
  return body
    .replace(/\\(?:vspace|hspace)\*?\{[^}]*\}/g, ' ')
    .replace(/\\textbf\{([^{}]*)\}/g, '$1')
    .replace(/\\\\/g, ' – ')
    .replace(/\\[a-zA-Z]+\*?/g, ' ')
    .replace(/[{}]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Structure discovery used for the report and for the detection warnings. */
const SAFE_ENVS = new Set([
  'document', 'itemize', 'enumerate', 'description', 'figure', 'figure*',
  'align', 'align*', 'alignat', 'alignat*', 'equation', 'equation*',
  'gather', 'gather*', 'multline', 'multline*', 'eqnarray', 'eqnarray*',
  'split', 'cases', 'dcases', 'array', 'matrix', 'pmatrix', 'bmatrix',
  'vmatrix', 'Bmatrix', 'Vmatrix', 'smallmatrix', 'tabular', 'tabular*',
  'table', 'table*', 'center', 'flushleft', 'flushright', 'minipage',
  'small', 'large', 'abstract', 'theorem', 'lemma', 'proof', 'definition',
  'example', 'thebibliography',
]);
const PHYSICS_MACROS = new Set([
  'abs', 'norm', 'dv', 'pdv', 'dd', 'pv', 'qty', 'qtyf', 'braket', 'bra',
  'ket', 'mel', 'grad', 'curl', 'div', 'laplacian', 'tr', 'det', 'commutator',
  'acomm', 'tensor',
]);

function inspectSource(tex) {
  const labels = new Set(
    [...tex.matchAll(/\\label\{([^}]*)\}/g)].map((m) => m[1]),
  );
  const refs = new Set(
    [...tex.matchAll(/\\(?:ref|eqref|autoref|pageref|cref)\{([^}]*)\}/g)].map(
      (m) => m[1],
    ),
  );
  const envs = [...tex.matchAll(/\\begin\{([a-zA-Z*]+)\}/g)]
    .map((m) => m[1])
    .filter((e) => e !== 'document');
  const customCommands = [
    ...tex.matchAll(
      /\\(?:newcommand|renewcommand|DeclareMathOperator|DeclareRobustCommand)\s*\*?\s*\{?\\?([a-zA-Z]+)\}?|\\def\\([a-zA-Z]+)/g,
    ),
  ].map((m) => m[1] ?? m[2]);
  const includes = [
    ...tex.matchAll(/\\includegraphics(?:\[[^\]]*\])?\s*\{([^}]+)\}/g),
  ].map((m) => m[1].trim());

  const headingCount = (
    tex.match(/\\(?:section|subsection|subsubsection)\*?\s*\{/g) ?? []
  ).length;
  const displayEnvCount = (
    tex.match(
      /\\begin\{(?:align|equation|gather|multline|eqnarray|alignat)\*?\}/g,
    ) ?? []
  ).length;
  const dollarCount = tex.replace(/\\\$/g, '').replace(/\$\$/g, '').split(/(?<!\\)\$/).length - 1;
  return {
    labels,
    refs,
    envs: [...new Set(envs)],
    customCommands: [...new Set(customCommands)],
    includes,
    physicsMacros: [
      ...new Set(
        [...tex.matchAll(/\\([a-zA-Z]+)\b/g)]
          .map((m) => m[1])
          .filter((c) => PHYSICS_MACROS.has(c)),
      ),
    ],
    counts: {
      headings: headingCount,
      displayMath: (tex.match(/\\\[/g) ?? []).length + displayEnvCount,
      inlineMath: Math.floor(dollarCount / 2),
      listItems: (tex.match(/\\item\b/g) ?? []).length,
    },
  };
}

function resolveImageFile(srcDir, target) {
  const candidates = [];
  if (extname(target)) candidates.push(target);
  else for (const e of KNOWN_GRAPHIC_EXTS) candidates.push(target + e);
  for (const c of candidates) {
    const p = join(srcDir, c.replace(/\\/g, '/'));
    if (existsSync(p)) return p;
  }
  return null;
}

function stripIgnoredCommands(tex) {
  return tex
    .replace(/\\(?:vspace|hspace)\*?\{[^}]*\}/g, '')
    .replace(
      /\\(?:newpage|clearpage|onehalfspacing|noindent|bigskip|medskip|smallskip|pagebreak|maketitle|centering)\b/g,
      '',
    )
    // drop includegraphics sizing: with options pandoc emits raw <figure> HTML
    .replace(/\\includegraphics\s*(?:\[[^\]]*\])?/g, '\\includegraphics');
}

/** \ref{X} → visible marker: numbering changes in Markdown, so a human must fix these. */
function markRefs(tex, labels) {
  let missing = [];
  const out = tex.replace(
    /\\(?:ref|eqref|autoref|pageref|cref)\{([^}]*)\}/g,
    (m, target) => {
      if (!labels.has(target)) missing.push(target);
      return `\\textbf{[ref: ${target}]}`;
    },
  );
  return { out, missing };
}

function runPandoc(texPath, outPath, cwd) {
  const res = spawnSync(
    PANDOC,
    [
      texPath,
      '-f', 'latex',
      // pandoc "markdown" writer → $…$ inline and $$…$$ display math.
      // Only pipe tables are allowed so tables stay GFM-compatible;
      // multi-line cells are flattened to one line.
      '-t', 'markdown+pipe_tables-grid_tables-multiline_tables-simple_tables',
      '--wrap=none',
      '-o', outPath,
    ],
    { cwd, encoding: 'utf8' },
  );
  if (res.status !== 0) {
    return { error: res.stderr.toString().trim() || `pandoc exited with status ${res.status}` };
  }
  return { error: null };
}

/** Collect every $…$ / $$…$$ math span of the generated Markdown. */
function extractMath(md) {
  const math = [];
  const lines = md.split('\n');
  let inFence = false;
  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (/^(`{3,}|~{3,})/.test(trimmed)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    let rest = lines[i];
    let guard = 0;
    while (rest && guard++ < 1000) {
      if (rest.startsWith('$$')) {
        const closing = rest.indexOf('$$', 2);
        if (closing >= 0) {
          if (rest.slice(2, closing).trim()) {
            math.push({ type: 'display', value: rest.slice(2, closing).trim(), line: i + 1 });
          }
          rest = rest.slice(closing + 2);
          continue;
        }
        let buffer = rest.slice(2);
        let j = i + 1;
        let closed = false;
        while (j < lines.length) {
          const k = lines[j].indexOf('$$');
          if (k >= 0) {
            buffer += `\n${lines[j].slice(0, k)}`;
            closed = true;
            i = j;
            break;
          }
          buffer += `\n${lines[j]}`;
          j++;
        }
        if (buffer.trim()) {
          math.push({ type: 'display', value: buffer.trim(), line: i + 1 });
        }
        if (!closed) return math;
        rest = '';
        continue;
      }
      const opening = rest.indexOf('$');
      if (opening < 0) break;
      const closing = rest.indexOf('$', opening + 1);
      if (closing < 0) break;
      const value = rest.slice(opening + 1, closing);
      if (
        value.trim() &&
        value.trim() !== '$' &&
        (opening === 0 || rest[opening - 1] !== '\\')
      ) {
        math.push({ type: 'inline', value, line: i + 1 });
      }
      rest = rest.slice(closing + 1);
    }
  }
  return math;
}

function validateMathWithKatex(mathItems, warnings) {
  if (mathItems.length === 0) return true;
  let katex;
  try {
    katex = require('katex');
  } catch {
    warnings.push('katex module not found inside the website — math was NOT validated');
    return false;
  }
  let ok = true;
  for (const item of mathItems) {
    try {
      katex.renderToString(item.value, {
        displayMode: item.type === 'display',
        throwOnError: true,
        strict: 'ignore',
        macros: { '\\R': '\\mathbb{R}' },
      });
    } catch (err) {
      ok = false;
      warnings.push(
        `KaTeX cannot render ${item.type} math on line ${item.line}: ${String(err.message).split('\n')[0]}\n    > ${item.value.replace(/\s+/g, ' ').slice(0, 160)}`,
      );
    }
  }
  return ok;
}

/* ------------------------------------------------------------------ */

let sourceDirs = readdirSync(srcRoot, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => join(srcRoot, d.name))
  .sort();
if (onlyFilter) {
  sourceDirs = sourceDirs.filter((d) => onlyFilter.some((s) => basename(d).includes(s)));
}
if (sourceDirs.length === 0) {
  console.error(`no lecture subfolder under "${srcRoot}" matches the filters`);
  process.exit(2);
}

const typeDir = join(contentRoot, courseId, typeFolder);
const assetsDir = join(publicRoot, 'images', typeFolder);
const stats = [];

for (const srcDir of sourceDirs) {
  const folder = basename(srcDir);
  const entry = {
    source: `${srcRoot}/${folder}`,
    target: null,
    title: null,
    warnings: [],
    imagesCopied: [],
    status: 'converted',
    comparison: null,
  };
  stats.push(entry);

  const texFiles = readdirSync(srcDir).filter((f) => /\.(tex|ltx)$/i.test(f));
  const main = texFiles.find((f) => /^main\.tex$/i.test(f)) ?? texFiles[0];
  entry.texFile = main;
  if (!main) {
    entry.warnings.push('no .tex file in this folder');
    entry.status = 'review';
    continue;
  }
  const tex = readFileSync(join(srcDir, main), 'utf8');
  const info = inspectSource(tex);

  if (info.customCommands.length > 0) {
    entry.warnings.push(
      `source defines custom command(s) (${info.customCommands.join(', ')}) — verify pandoc expanded them`,
    );
    entry.status = 'review';
  }
  for (const env of info.envs) {
    if (!SAFE_ENVS.has(env)) {
      entry.warnings.push(`unsupported environment \\begin{${env}} — verify the output`);
      entry.status = 'review';
    }
  }
  if (info.refs.size > 0) {
    entry.warnings.push(
      `${info.refs.size} \\ref target(s): replaced inline with visible "[ref: …]" markers because numbering changes in Markdown`,
    );
  }
  for (const target of info.refs) {
    if (!info.labels.has(target)) {
      entry.warnings.push(`broken reference: \\ref{${target}} has no \\label in the source`);
      entry.status = 'review';
    }
  }
  for (const macro of info.physicsMacros) {
    entry.warnings.push(
      `physics package macro \\${macro} used — KaTeX does not define it; verify the rendered output`,
    );
    entry.status = 'review';
  }

  const missingImages = [];
  const imageMap = new Map();
  for (const target of info.includes) {
    const found = resolveImageFile(srcDir, target.replace(/\\/g, '/'));
    if (!found) {
      missingImages.push(target);
      continue;
    }
    imageMap.set(basename(target), found);
    imageMap.set(basename(found), found);
  }
  if (missingImages.length > 0) {
    entry.warnings.push(
      `\\includegraphics target(s) missing on disk: ${missingImages.join(', ')}`,
    );
    entry.status = 'review';
  }

  const lectureNumber =
    /^lecture-(\d+)/.exec(folder)?.[1] ?? String(stats.length).padStart(2, '0');
  const baseSlug = folder.replace(/^lecture-\d+-?/, '').replace(/\.tex$/i, '') || folder;
  const fileSlug = `${lectureNumber}-${baseSlug}`;
  const outMd = join(typeDir, `${fileSlug}.md`);
  const outAssets = join(assetsDir, fileSlug);
  entry.target = outMd.replace(`${process.cwd()}/`, '');

  if (existsSync(outMd) && !overwrite && !reportOnly) {
    entry.warnings.push('target exists — SKIPPED (use --overwrite to reconvert)');
    entry.status = 'skipped';
    continue;
  }

  const title = extractTitle(tex) ?? baseSlug.replace(/-/g, ' ');
  entry.title = title;

  if (reportOnly) {
    if (!existsSync(outMd)) {
      entry.warnings.push('no Markdown output for this source — run the converter');
      entry.status = 'review';
    } else {
      const md = readFileSync(outMd, 'utf8');
      const mathItems = extractMath(md);
      const katexOk = validateMathWithKatex(mathItems, entry.warnings);
      const mdCounts = {
        headings: (md.match(/^#{1,6} /gm) ?? []).length,
        displayMath: (md.match(/\$\$/g) ?? []).length / 2,
        inlineMath: mathItems.filter((m) => m.type === 'inline').length,
        listItems: (md.match(/^\s*(?:[-+*]\s|\d+[.)]\s)/gm) ?? []).length,
        images: (md.match(/!\[[^\]]*\]\(/g) ?? []).length,
      };
      entry.comparison = { tex: info.counts, md: mdCounts };
      if (!katexOk) entry.status = 'review';
      const diffs = [];
      if (info.counts.headings !== mdCounts.headings)
        diffs.push(`headings ${info.counts.headings}→${mdCounts.headings}`);
      if (info.includes.length !== mdCounts.images)
        diffs.push(`images ${info.includes.length}→${mdCounts.images}`);
      if (Math.abs(info.counts.inlineMath - mdCounts.inlineMath) > 1)
        diffs.push(`inline math ${info.counts.inlineMath}→${mdCounts.inlineMath}`);
      if (info.counts.displayMath !== mdCounts.displayMath)
        diffs.push(`display math ${info.counts.displayMath}→${mdCounts.displayMath}`);
      if (info.counts.listItems !== mdCounts.listItems)
        diffs.push(`list items ${info.counts.listItems}→${mdCounts.listItems}`);
      if (diffs.length > 0) {
        entry.warnings.push(`count differences: ${diffs.join('; ')}`);
        entry.status = 'review';
      }
    }
    continue;
  }

  if (!dryRun) {
    mkdirSync(outAssets, { recursive: true });
    mkdirSync(dirname(outMd), { recursive: true });
  }

  // copy every image file of the lecture folder, referenced or not
  const referencedRealFiles = new Set([...imageMap.values()].map((p) => basename(p)));
  const imageFiles = readdirSync(srcDir).filter((f) =>
    [...KNOWN_IMAGE_EXTS, ...KNOWN_GRAPHIC_EXTS].includes(extname(f).toLowerCase()),
  );
  for (const f of imageFiles) {
    entry.imagesCopied.push(f);
    if (!dryRun) copyFileSync(join(srcDir, f), join(outAssets, f));
  }
  const unreferenced = imageFiles.filter((f) => !referencedRealFiles.has(f));
  if (unreferenced.length > 0) {
    entry.warnings.push(
      `image file(s) copied but never referenced in the LaTeX source (kept as course assets): ${unreferenced.join(', ')}`,
    );
  }

  if (dryRun) continue;

  // 1. temp preprocessed copy — originals stay untouched
  const tmpTex = join(tmpdir(), `convert-latex-${fileSlug}.tex`);
  const tmpMd = join(tmpdir(), `convert-latex-${fileSlug}.md`);
  let tex2 = stripIgnoredCommands(tex);
  const titleMarker = /\\title\s*\*?\s*\{/.exec(tex2);
  if (titleMarker) {
    const fullTitleBlock = balancedBody(tex2, titleMarker.index + titleMarker[0].length - 1);
    if (fullTitleBlock) {
      tex2 =
        tex2.slice(0, titleMarker.index) +
        `\\title{${title.replace(/[{}]/g, '')}}` +
        tex2.slice(fullTitleBlock[2] + 1);
    }
  }
  const refResult = markRefs(tex2, info.labels);
  tex2 = refResult.out;
  writeFileSync(tmpTex, tex2);

  // 2. convert
  const pandocResult = runPandoc(tmpTex, tmpMd, srcDir);
  if (pandocResult.error) {
    entry.warnings.push(`pandoc failed: ${pandocResult.error}`);
    entry.status = 'review';
    continue;
  }
  let md = readFileSync(tmpMd, 'utf8');

  // 3. rewrite image sources to root-absolute site paths; rehypePrefixLinks
  //    prepends the deployment base at build time
  //    (safety net: raw <figure> HTML that pandoc may still emit)
  md = md.replace(
    /<figure[^>]*>\s*<img[^>]*?src="([^"]*)"[^>]*\/?>\s*(?:<figcaption[^>]*>([\s\S]*?)<\/figcaption>\s*)?<\/figure>/gi,
    (m, src, caption) => `![${(caption ?? '').replace(/^[ \t]+|[ \t]+$/g, '')}](${src})`,
  );
  md = md.replace(/(!\[[^\]]*\]\()([^)\s]+)/g, (match, lead, src) => {
    const decoded = decodeURIComponent(src);
    const key = basename(decoded.replace(/\\/g, '/'));
    const real = imageMap.get(key);
    return real ? `${lead}/images/${typeFolder}/${fileSlug}/${basename(real)}` : match;
  });

/**
 * Canonical display-math form required by remark-math: the $$ fences alone on
 * their own lines, with blank lines around the block. Inline $…$ is untouched.
 */
function canonicalizeDisplayMath(md) {
  const parts = md.split('$$');
  if (parts.length % 2 === 0) return md; // unbalanced: leave for the report to flag
  const out = [];
  for (let i = 0; i < parts.length; i++) {
    if (i % 2 === 0) {
      out.push(parts[i]);
    } else {
      out.push(`\n\n$$\n${parts[i].trim()}\n$$\n\n`);
    }
  }
  return out.join('').replace(/\n{3,}/g, '\n\n');
}

function fixEmptyHeaderTables(md) {
  const rows = md.split('\n');
  const isCells = (l) => /^\|.+\|[ \t]*$/.test(l);
  const isSeparator = (l) => /^\|[-:\s|]+\|[ \t]*$/.test(l);
  const out = [];
  let i = 0;
  while (i < rows.length) {
    if (
      isCells(rows[i]) &&
      rows[i]
        .split('|')
        .slice(1, -1)
        .every((c) => c.trim() === '') &&
      isCells(rows[i + 1]) &&
      isSeparator(rows[i + 1]) &&
      isCells(rows[i + 2])
    ) {
      out.push(rows[i + 2]);
      out.push(rows[i + 1]);
      i += 3;
      continue;
    }
    out.push(rows[i]);
    i += 1;
  }
  return out.join('\n');
}

md = md
  .split('\n')
  .map((line) => line.replace(/\s+$/, ''))
  .join('\n')
  .replace(/\n{3,}/g, '\n\n')
  .replace(/ ?\{#[^}]*\}/g, '')
  // pandoc sometimes inserts a raw-HTML zero-width marker inside table cells
  .replace(/`<!-- -->`{=html}/g, '')
  // pandoc headings would duplicate the page <h1>; demote content headings one level
  .replace(/^(#{1,5}) (.*)$/gm, (m, hashes, text) => `${'#'.repeat(Math.min(hashes.length + 1, 6))} ${text}`);
md = fixEmptyHeaderTables(canonicalizeDisplayMath(md)).trim();
  const frontmatter = `---\ntitle: "${title.replace(/\\/g, ' ').replace(/"/g, "'")}"\n---\n\n`;
  md = `${frontmatter}${md}\n`;

  // 4. validate every math span with the KaTeX version the site installs
  const mathItems = extractMath(md);
  const katexOk = validateMathWithKatex(mathItems, entry.warnings);
  if (!katexOk) entry.status = 'review';

  // 5. compare the generated structure against the source (detection only!)
  const mdCounts = {
    headings: (md.match(/^#{1,6} /gm) ?? []).length,
    displayMath: (md.match(/\$\$/g) ?? []).length / 2,
    inlineMath: mathItems.filter((m) => m.type === 'inline').length,
    listItems: (md.match(/^\s*(?:[-+*]\s|\d+[.)]\s)/gm) ?? []).length,
    images: (md.match(/!\[[^\]]*\]\(/g) ?? []).length,
  };
  entry.comparison = { tex: info.counts, md: mdCounts };
  const diffs = [];
  if (info.counts.headings !== mdCounts.headings)
    diffs.push(`headings ${info.counts.headings}→${mdCounts.headings}`);
  if (info.includes.length !== mdCounts.images)
    diffs.push(`images ${info.includes.length}→${mdCounts.images}`);
  if (Math.abs(info.counts.inlineMath - mdCounts.inlineMath) > 1)
    diffs.push(`inline math ${info.counts.inlineMath}→${mdCounts.inlineMath}`);
  if (info.counts.displayMath !== mdCounts.displayMath)
    diffs.push(`display math ${info.counts.displayMath}→${mdCounts.displayMath}`);
  if (info.counts.listItems !== mdCounts.listItems)
    diffs.push(`list items ${info.counts.listItems}→${mdCounts.listItems}`);
  if (diffs.length > 0) {
    entry.warnings.push(
      `count differences between the .tex source and the generated .md: ${diffs.join('; ')}`,
    );
    entry.status = 'review';
  }
  if (refResult.missing.length > 0) entry.status = 'review';

  writeFileSync(outMd, md);
  rmSync(tmpTex, { force: true });
  rmSync(tmpMd, { force: true });
}

/* ------------------------------------------------------------------ */

if (writeReport && !dryRun) {
  const needsReview = stats.filter((s) => s.status === 'review');
  const fmt = (a, b) => `${a}→${b ?? '—'}`;
  const lines = [
    '# LaTeX → Markdown conversion report',
    '',
    `${pandocVersion} · course \`${courseId}\` → content/courses/${courseId}/${typeFolder} · assets → public/images/${typeFolder}/ · ${new Date().toISOString()}`,
    '',
    `Converted: **${stats.filter((s) => s.comparison).length}** · Skipped: **${stats.filter((s) => s.status === 'skipped').length}** · Needs manual review: **${needsReview.length}**`,
    '',
    '| Source | Output | Title | Headings tex→md | Inline math tex→md | Display math tex→md | Images tex→md | List items tex→md | KaTeX | Review |',
    '| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |',
  ];
  for (const s of stats) {
    const c = s.comparison;
    lines.push(
      `| \`${relative(process.cwd(), s.source)}/${s.texFile}\` | ${s.target ? '`' + relative(process.cwd(), s.target) + '`' : '—'} | ${s.title ?? '—'} | ${c ? fmt(c.tex.headings, c.md.headings) : '—'} | ${c ? fmt(c.tex.inlineMath, c.md.inlineMath) : '—'} | ${c ? fmt(c.tex.displayMath, c.md.displayMath) : '—'} | ${c ? fmt(c.tex.images ?? c.md.images, c.md.images) : '—'} | ${c ? fmt(c.tex.listItems, c.md.listItems) : '—'} | ${s.warnings.some((w) => w.startsWith('KaTeX')) ? '**FAIL**' : 'ok'} | ${s.status === 'review' ? '**YES**' : s.status === 'skipped' ? 'skipped' : 'no'} |`,
    );
  }
  lines.push('', '## Details and warnings', '');
  for (const s of stats) {
    if (s.warnings.length === 0 && s.imagesCopied.length === 0) continue;
    lines.push(`### ${s.source}`);
    lines.push('');
    for (const w of s.warnings) lines.push(`- ${w}`);
    if (s.imagesCopied.length > 0) {
      lines.push(
        '',
        `<details><summary>images copied (${s.imagesCopied.length})</summary>`,
        '',
        ...s.imagesCopied.map((f) => `- ${f}`),
        '',
        '</details>',
      );
    }
    lines.push('');
  }
  lines.push(
    '## Notes',
    '',
    '- Structural counts compare the .tex source with the generated .md. Equal counts do NOT prove the text survived verbatim — they flag obvious drops. Files flagged YES must be read by a human.',
    '- Math is validated with the exact KaTeX version installed in the website.',
    '- Re-run with --overwrite to reconvert; existing targets are otherwise skipped.',
  );
  writeFileSync(resolve(reportPath), `${lines.join('\n')}\n`);
  console.log(`[convert] report → ${reportPath}`);
}

const reviewCount = stats.filter((s) => s.status === 'review').length;
console.log(
  `[convert] ${stats.length} source folder(s): ${stats.filter((s) => s.comparison).length} converted, ${reviewCount} needing review, ${stats.filter((s) => s.status === 'skipped').length} skipped`,
);
process.exit(reviewCount > 0 ? 1 : 0);
