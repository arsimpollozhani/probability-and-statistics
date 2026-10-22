#!/usr/bin/env node
/**
 * Post-build check for broken internal references.
 * Scans every generated HTML file in dist/ and verifies that each internal
 * <a href> or <img src> points to a page (or file) that was actually generated.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, posix, resolve } from 'node:path';

const distDir = resolve(process.argv[2] ?? 'dist');

// Keep this in sync with astro.config.mjs: in Actions, the base path follows the
// repository name unless BASE_PATH is explicitly provided.
const repoName = (process.env.GITHUB_REPOSITORY ?? '').split('/')[1];
const defaultBasePath = repoName
  ? repoName.endsWith('.github.io')
    ? '/'
    : `/${repoName}`
  : '/proba-stats-site';
const basePath = (process.env.BASE_PATH ?? defaultBasePath).replace(/\/$/, '');

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const stats = statSync(full);
    if (stats.isDirectory()) {
      yield* walk(full);
    } else if (name.endsWith('.html')) {
      yield full;
    }
  }
}

/** page URL path of an html file, relative to the dist root ("" for index.html) */
function pagePathOf(file) {
  const relative = posix.join(...file.slice(distDir.length + 1).split(/[\\/]+/));
  return relative === 'index.html' ? '' : relative.replace(/\/index\.html$/, '/');
}

/** Strip base path, query and hash from an internal link, returning the dist path. */
function internalTarget(href, pagePath) {
  let path = decodeURIComponent(href.split('#')[0]?.split('?')[0] ?? href);
  if (path === '') path = pagePath;
  if (basePath && path === basePath) path = '/';
  else if (basePath && path.startsWith(`${basePath}/`)) path = path.slice(basePath.length);
  if (path.startsWith('/')) return path.replace(/^\//, '');
  // relative link: resolve against the page's directory
  const dir = pagePath.slice(0, pagePath.lastIndexOf('/') + 1);
  return posix.normalize(posix.join(dir, path));
}

function targetExists(target) {
  if (target === '') return existsSync(join(distDir, 'index.html'));
  return (
    existsSync(join(distDir, target, 'index.html')) ||
    existsSync(`${join(distDir, target)}.html`) ||
    existsSync(join(distDir, target))
  );
}

const broken = [];
let checked = 0;

for (const file of walk(distDir)) {
  const pagePath = pagePathOf(file);
  const html = readFileSync(file, 'utf8');
  for (const match of html.matchAll(/<(?:a\s[^>]*?href|img\s[^>]*?src)="([^"]*)"/g)) {
    const href = match[1] ?? '';
    if (
      href.startsWith('http://') ||
      href.startsWith('https://') ||
      href.startsWith('//') ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:') ||
      href.startsWith('#')
    ) {
      continue;
    }
    checked += 1;
    const target = internalTarget(href, pagePath);
    if (!targetExists(target)) {
      broken.push({ page: `/${pagePath}`, href, target });
    }
  }
}

if (broken.length > 0) {
  console.error(`\n[check-links] ${broken.length} broken internal link(s):\n`);
  for (const { page, href, target } of broken) {
    console.error(`  ${page}  ->  ${href}  (missing "${target}")`);
  }
  process.exit(1);
}

console.log(`[check-links] all ${checked} internal links resolve`);
