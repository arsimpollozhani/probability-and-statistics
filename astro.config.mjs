import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import tailwindcss from '@tailwindcss/vite';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// GitHub Pages:
// - project site: https://<owner>.github.io/<repo>/
// - user/org site: https://<owner>.github.io/
// Derive both from GITHUB_REPOSITORY during Actions builds so the base path can
// never drift from the repository name. Local builds keep the historical default;
// SITE_URL / BASE_PATH still override everything (e.g. for a custom domain).
const [repoOwner, repoName] = (process.env.GITHUB_REPOSITORY ?? '').split('/');
const isUserSite = Boolean(repoName?.endsWith('.github.io'));
const SITE_URL =
  process.env.SITE_URL ??
  (repoOwner ? `https://${repoOwner}.github.io` : 'https://arsim.github.io');
const BASE_PATH =
  process.env.BASE_PATH ??
  (repoName ? (isUserSite ? '/' : `/${repoName}`) : '/proba-stats-site');

/**
 * Markdown authors write internal links as root-absolute (/course/lecture/…) paths.
 * This plugin prepends the deployment base so those links and image sources
 * survive GitHub Pages, regardless of what BASE_PATH the site is built with.
 */
function rehypePrefixLinks(prefix) {
  const visit = (node, fn) => {
    fn(node);
    for (const child of node.children ?? []) visit(child, fn);
  };
  return () => (tree) => {
    const basePrefix = prefix.endsWith('/') ? prefix : `${prefix}/`;
    visit(tree, (node) => {
      if (node.type !== 'element') return;
      for (const attr of ['href', 'src']) {
        const value = node.properties?.[attr];
        if (typeof value === 'string' && value.startsWith('/') && !value.startsWith('//')) {
          node.properties[attr] =
            value === '/' ? basePrefix : `${basePrefix}${value.slice(1)}`;
        }
      }
    });
  };
}

export default defineConfig({
  site: SITE_URL,
  base: BASE_PATH,
  markdown: {
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [
        [rehypeKatex, { strict: 'ignore', throwOnError: false, macros: { '\\R': '\\mathbb{R}' } }],
        [rehypePrefixLinks(BASE_PATH)],
      ],
    }),
    shikiConfig: {
      theme: 'github-light-default',
      wrap: true,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
