const DEFAULT_SITE_URL = 'https://arsim.github.io';
const DEFAULT_BASE_PATH = '/proba-stats-site';

function normalizeBasePath(value) {
  if (!value || value === '/') return '/';
  return `/${value.replace(/^\/+|\/+$/g, '')}`;
}

/**
 * GitHub Pages:
 * - project site: https://<owner>.github.io/<repo>/
 * - user/org site: https://<owner>.github.io/
 *
 * During Actions builds both values are derived from GITHUB_REPOSITORY so the
 * base path cannot drift from the repository name. Local builds keep the
 * historical default. SITE_URL / BASE_PATH still override everything.
 */
export function resolveSiteUrl(env = process.env) {
  if (env.SITE_URL) return env.SITE_URL;
  const [owner] = (env.GITHUB_REPOSITORY ?? '').split('/');
  return owner ? `https://${owner}.github.io` : DEFAULT_SITE_URL;
}

export function resolveBasePath(env = process.env) {
  if (env.BASE_PATH) return normalizeBasePath(env.BASE_PATH);
  const repoName = (env.GITHUB_REPOSITORY ?? '').split('/')[1];
  if (!repoName) return DEFAULT_BASE_PATH;
  return repoName.endsWith('.github.io') ? '/' : `/${repoName}`;
}
