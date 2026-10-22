#!/usr/bin/env node
/**
 * Incremental sync of the LaTeX sources in `latex/` to the site's Markdown
 * content — run it after editing or adding .tex/image files and only the
 * changed lectures are re-converted.
 *
 * Usage:
 *   node scripts/sync-latex.mjs            one-shot sync (converts changed folders)
 *   node scripts/sync-latex.mjs --watch    keep running and convert on every change
 *   node scripts/sync-latex.mjs --force    re-convert every folder regardless of state
 *
 * Shared options (same meaning as convert-latex.mjs):
 *   --src DIR, --course ID, --type FOLDER, --report FILE
 *
 * How it decides what changed:
 *   - a per-folder fingerprint (hashed content of every .tex + name/size of every
 *     other file) is stored in .latex-sync.json at the repo root;
 *   - a folder is re-converted when its fingerprint changed OR the .md target is
 *     missing; the first run only seeds the state and converts nothing.
 * Delegates the conversion itself to scripts/convert-latex.mjs, so all
 * post-processing (math canonicalization, artifact cleanup, report) applies.
 */
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const args = process.argv.slice(2);
const watch = args.includes('--watch');
const force = args.includes('--force');
const pick = (flag, fallback) => {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : fallback;
};
const srcRoot = resolve(pick('--src', 'latex'));
const courseId = pick('--course', 'probability-statistics');
const typeFolder = pick('--type', 'lectures');
const statePath = resolve(pick('--state', '.latex-sync.json'));

if (!existsSync(srcRoot)) {
  console.error(`LaTeX source folder not found: ${srcRoot}`);
  process.exit(2);
}

/** fingerprint of one lecture folder: hashes, names and sizes of its files */
function fingerprint(dir) {
  const files = readdirSync(dir).sort();
  const hash = createHash('sha256');
  for (const name of files) {
    const stat = statSync(join(dir, name));
    if (stat.isDirectory()) {
      hash.update(`dir:${name}\n`);
      continue;
    }
    hash.update(`${name}:${stat.size}\n`);
    if (/\.(tex|ltx)$/i.test(name)) hash.update(createHash('sha256').update(readFileSync(join(dir, name))).digest('hex') + '\n');
  }
  return hash.digest('hex');
}

/** lecture folders = subfolders of latex/ that contain at least one .tex file */
function lectureFolders() {
  return readdirSync(srcRoot, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .filter((d) => readdirSync(join(srcRoot, d.name)).some((f) => /\.(tex|ltx)$/i.test(f)))
    .map((d) => d.name)
    .sort();
}

function loadState() {
  try {
    return JSON.parse(readFileSync(statePath, 'utf8'));
  } catch {
    return {};
  }
}

function mdExists(folder) {
  const lectureNumber = /^lecture-(\d+)/.exec(folder)?.[1] ?? '';
  const baseSlug =
    folder.replace(/^lecture-\d+-?/, '') || folder;
  const candidates = [];
  if (lectureNumber) candidates.push(`${lectureNumber}-${baseSlug}`);
  candidates.push(baseSlug);
  for (const slug of candidates) {
    const p = resolve('content/courses', courseId, typeFolder, `${slug}.md`);
    if (existsSync(p)) return true;
  }
  return false;
}

function syncOnce() {
  const state = loadState();
  const folders = lectureFolders();
  const changed = [];

  for (const folder of folders) {
    const key = folder;
    const fp = fingerprint(join(srcRoot, folder));
    if (state[key] === fp && mdExists(folder) && !force) continue;
    changed.push(folder);
  }

  // folders that vanished from latex/: forget them in the state
  for (const key of Object.keys(state)) {
    if (!folders.find((f) => f === key)) delete state[key];
  }

  const converted = [];
  for (const folder of changed.sort()) {
    const wasConverted = mdExists(folder);
    const res = spawnSync(
      process.execPath,
      [
        'scripts/convert-latex.mjs',
        '--src', srcRoot,
        '--course', courseId,
        '--type', typeFolder,
        '--only', folder,
        '--overwrite',
        '--no-report',
      ],
      { stdio: 'pipe', encoding: 'utf8' },
    );
    if (res.status !== 0) {
      console.log(
        `[sync] ${folder}: converted with review warnings — see conversion-report.md`,
      );
    }
    console.log(
      `[sync] ${folder}: ${
        res.status === 0
          ? wasConverted ? 'reconverted' : 'converted (new lecture)'
          : (res.stderr ?? '').split('\n')[0]?.slice(0, 140) || 'failed'
      }`,
    );
    if (res.status === 0) state[folder] = fingerprint(join(srcRoot, folder));
    converted.push(folder);
  }

  writeFileSync(statePath, JSON.stringify(state, null, 2));

  // refresh the report over the whole corpus (reads the converted .md files)
  if (converted.length > 0 || force) {
    spawnSync(
      process.execPath,
      [
        'scripts/convert-latex.mjs',
        '--src', srcRoot,
        '--course', courseId,
        '--type', typeFolder,
        '--report-only',
      ],
      { stdio: 'inherit' },
    );
  }

  if (changed.length === 0) {
    console.log('[sync] all lectures up to date');
  }

  return changed;
}

syncOnce();

if (watch) {
  console.log(`[sync] watching ${srcRoot} — Ctrl+C to stop`);
  let timer = null;
  const { watch: fsWatch } = await import('node:fs');
  fsWatch(srcRoot, { recursive: true }, () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      console.log('[sync] change detected');
      syncOnce();
    }, 400);
  });
}
