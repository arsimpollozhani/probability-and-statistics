/** Slugify one path segment (folder or file name) for URL/ID stability. */
export function slugifySegment(segment: string): string {
  return segment
    .replace(/\.[^.]+$/, '') // strip any file extension
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
