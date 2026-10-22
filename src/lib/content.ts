import { getCollection, type CollectionEntry } from 'astro:content';

type DocumentEntry = CollectionEntry<'documents'>;
type MetaEntry = CollectionEntry<'coursesMeta'>;

/** Known content types, in display order. */
export const CONTENT_TYPES = {
  lectures: { label: 'Lectures', icon: 'book-open' },
  exams: { label: 'Exam Problems', icon: 'pencil-line' },
  tutorials: { label: 'Tutorials', icon: 'lightbulb' },
  problems: { label: 'Problem sets', icon: 'pencil-line' },
  reference: { label: 'Reference sheets', icon: 'library' },
} as const;

export type ContentTypeId = keyof typeof CONTENT_TYPES | 'misc';

const KNOWN_TYPE_IDS = new Set<string>(Object.keys(CONTENT_TYPES));

/** Frontmatter `type` aliases mapped onto canonical section ids. */
const TYPE_ALIASES: Record<string, keyof typeof CONTENT_TYPES> = {
  exam: 'exams',
  lecture: 'lectures',
  tutorial: 'tutorials',
  problem: 'problems',
  'problem-set': 'problems',
  'problem-sets': 'problems',
};

/** Resolves a frontmatter `type` value to a known section id. */
function canonicalSectionType(value: string): keyof typeof CONTENT_TYPES | undefined {
  const normalized = value.trim().toLowerCase();
  if (KNOWN_TYPE_IDS.has(normalized)) {
    return normalized as keyof typeof CONTENT_TYPES;
  }
  return TYPE_ALIASES[normalized];
}

export interface DocLink {
  course: string;
  courseTitle: string;
  /** Canonical content type (`lectures`, `problems`, … or `misc`). */
  type: ContentTypeId;
  typeLabel: string;
  tags: string[];
  /** Path under the course folder, e.g. `lectures/01-introduction`. */
  slug: string;
  /** Last slug segment, e.g. `01-introduction`. */
  fileSlug: string;
  title: string;
  summary?: string;
  order: number;
  orderSource: 'frontmatter' | 'prefix' | 'none';
  href: string;
}

export interface CourseSection {
  /** The physical folder name, e.g. `lectures`. */
  folder: string;
  type: ContentTypeId;
  label: string;
  icon: string;
  items: DocLink[];
}

export interface CourseInfo {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  order: number;
  href: string;
  sections: CourseSection[];
  totalDocuments: number;
}

export interface SearchItem {
  title: string;
  summary?: string;
  tags: string[];
  courseTitle: string;
  typeLabel: string;
  href: string;
}

export interface SiteContent {
  courses: CourseInfo[];
  searchIndex: SearchItem[];
}

/** Prefixes a path with the site base path (e.g. `/proba-stats-site/...`). */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL;
  const prefix = base.endsWith('/') ? base.slice(0, -1) : base;
  const clean = path.startsWith('/') ? path.slice(1) : path;
  return `${prefix}/${clean}`;
}

/** Canonical form of a route, independent of base path, trailing slash and `index.html`. */
export function normalizeRoute(rawPath: string): string {
  const url = new URL(rawPath, 'http://x');
  let pathname = url.pathname;
  const base = import.meta.env.BASE_URL;
  const prefix = base.endsWith('/') ? base.slice(0, -1) : base;
  if (prefix && (pathname === prefix || pathname.startsWith(`${prefix}/`))) {
    pathname = pathname.slice(prefix.length);
  }
  pathname = pathname.replace(/\/index\.html$/, '/');
  if (pathname.length > 1 && pathname.endsWith('/')) {
    pathname = pathname.slice(0, -1);
  }
  return pathname === '' ? '/' : pathname;
}

/** `01-probability-basics` -> `Probability basics` */
export function humanizeSlug(slug: string): string {
  return slug
    .replace(/^(\d+)[\s_.-]*/, '')
    .replace(/[-_]+/g, ' ')
    .replace(/^\w/, (c) => c.toUpperCase());
}

function parseOrder(slug: string): { order: number; orderSource: DocLink['orderSource'] } {
  const match = slug.split('/').pop()?.match(/^(\d+)(?=[-_.]|$)/);
  if (match?.[1]) {
    return { order: Number.parseInt(match[1], 10), orderSource: 'prefix' };
  }
  return { order: Number.POSITIVE_INFINITY, orderSource: 'none' };
}

function compareDocs(a: DocLink, b: DocLink): number {
  return a.order - b.order || a.slug.localeCompare(b.slug);
}

function folderInfo(folder: string): { type: ContentTypeId; label: string; icon: string } {
  if (KNOWN_TYPE_IDS.has(folder)) {
    const info = CONTENT_TYPES[folder as keyof typeof CONTENT_TYPES];
    return { type: folder as keyof typeof CONTENT_TYPES, label: info.label, icon: info.icon };
  }
  return { type: 'misc', label: humanizeSlug(folder), icon: 'file' };
}

function sectionSortKey(section: CourseSection): number {
  const folders = Object.keys(CONTENT_TYPES);
  const index = folders.indexOf(section.folder);
  return index >= 0 ? index : folders.length + 1000;
}

function logWarnings(warnings: string[]): void {
  if (loggedWarnings || warnings.length === 0) return;
  loggedWarnings = true;
  for (const warning of warnings) {
    console.warn(`[content] ${warning}`);
  }
}

let loggedWarnings = false;

/**
 * Maps a document collection id onto its route placement. This single function
 * is used both for links (buildSiteContent) and for generating the static
 * routes, so sidebar links and page URLs can never diverge.
 */
export function placeDocument(id: string): {
  courseId: string;
  typeFolder: string;
  slug: string;
  /** Slug under the course folder, e.g. `lectures/01-introduction` or `misc/stray-note`. */
  documentSlug: string;
  conforms: boolean;
} {
  const segments = id.split('/');
  const course = segments[0];
  const folder = segments[1];
  const rest = segments.slice(2);
  let courseId = course ?? '';
  let typeFolder = folder ?? '';
  let slug = rest.join('/');
  let conforms = true;

  if (segments.length < 3) {
    conforms = false;
    if (segments.length === 2) {
      // File directly inside a course folder: <course>/<file>.md
      typeFolder = 'misc';
      slug = folder ?? '';
    } else {
      // File directly under content/courses/: <file>.md
      courseId = 'uncategorised';
      typeFolder = 'misc';
      slug = [course, folder, ...rest].filter(Boolean).join('/');
    }
  }

  return {
    courseId,
    typeFolder,
    slug,
    documentSlug: typeFolder === 'misc' ? `misc/${slug}` : `${typeFolder}/${slug}`,
    conforms,
  };
}

/** Everything is derived from the Markdown files and `course.yaml` files at build time. */
export async function buildSiteContent(): Promise<SiteContent> {
  const [docEntries, metaEntries] = await Promise.all([
    getCollection('documents', ({ data }) => !data.draft),
    getCollection('coursesMeta'),
  ]);

  const metaById = new Map(metaEntries.map((entry) => [entry.id, entry]));
  const courseIdSet = new Set<string>(metaById.keys());
  const warnings: string[] = [];

  /** course -> section (folder or frontmatter type) -> documents */
  const byCourse = new Map<string, Map<string, DocLink[]>>();

  for (const entry of docEntries) {
    const placement = placeDocument(entry.id);
    const courseId = placement.courseId;
    const typeFolder = placement.typeFolder;
    const slug = placement.slug;

    if (!placement.conforms) {
      // Does not match the required layout — still rendered, never silently excluded.
      warnings.push(
        `document "${entry.id}" does not match "courses/<course>/<content-type>/<file>.md"; publishing it under "${courseId}/${typeFolder}" — move the file to fix this`,
      );
    }
    courseIdSet.add(courseId);

    const declaredType = entry.data.type ? canonicalSectionType(entry.data.type) : undefined;
    if (entry.data.type && !declaredType) {
      warnings.push(
        `document "${entry.id}" declares unknown frontmatter type "${entry.data.type}"; using the folder ("${typeFolder}")`,
      );
    }
    const sectionKey = declaredType ?? typeFolder;
    const info = folderInfo(sectionKey);
    const fileSlug = slug.split('/').pop() ?? slug;
    const courseTitle = metaById.get(courseId)?.data?.title ?? humanizeSlug(courseId);
    const { order, orderSource } = parseOrder(slug);

    const documentSlug = placement.documentSlug;
    const link: DocLink = {
      course: courseId,
      courseTitle,
      type: info.type,
      typeLabel: info.label,
      tags: entry.data.tags ?? [],
      slug: documentSlug,
      fileSlug,
      title: entry.data.title ?? humanizeSlug(fileSlug),
      summary: entry.data.description,
      order,
      orderSource,
      href: withBase(`${courseId}/${documentSlug}/`),
    };

    const sections = byCourse.get(courseId) ?? new Map<string, DocLink[]>();
    const list = sections.get(sectionKey) ?? [];
    list.push(link);
    sections.set(sectionKey, list);
    byCourse.set(courseId, sections);
  }

  // course.yaml consistency warnings
  for (const course of courseIdSet) {
    const meta = metaById.get(course);
    if (meta?.data.id && meta.data.id !== course) {
      warnings.push(
        `course.yaml in "${course}" declares id "${meta.data.id}" but the folder name is "${course}"; the folder name wins`,
      );
    }
  }

  const courses: CourseInfo[] = [...courseIdSet].map((course) => {
    const meta = metaById.get(course);
    const folderMap = byCourse.get(course) ?? new Map<string, DocLink[]>();

    const sections: CourseSection[] = [...folderMap.entries()]
      .map(([folder, items]) => {
        const info = folderInfo(folder);
        const sorted = [...items].sort(compareDocs);
        // Detect duplicate ordering metadata in this section (still builds, deterministically).
        const seenExplicit = new Map<number, string>();
        for (const item of sorted) {
          if (item.orderSource === 'none') continue;
          const previous = seenExplicit.get(item.order);
          if (previous) {
            warnings.push(
              `duplicate ${item.orderSource === 'frontmatter' ? 'frontmatter order' : 'filename prefix'} ${item.order} in "${course}/${folder}": "${previous}" and "${item.fileSlug}"; alphabetical order decides`,
            );
          } else {
            seenExplicit.set(item.order, item.fileSlug);
          }
        }
        return { folder, ...info, items: sorted };
      })
      .sort((a, b) => sectionSortKey(a) - sectionSortKey(b) || a.label.localeCompare(b.label));

    const totalDocuments = sections.reduce((acc, section) => acc + section.items.length, 0);

    return {
      id: course,
      title: meta?.data.title ?? humanizeSlug(course),
      description: meta?.data.description,
      icon: meta?.data.icon,
      order: meta?.data.order ?? Number.POSITIVE_INFINITY,
      href: withBase(`${course}/`),
      sections,
      totalDocuments,
    };
  });

  courses.sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));

  const searchIndex: SearchItem[] = courses.flatMap((course) =>
    course.sections.flatMap((section) =>
      section.items.map((item) => ({
        title: item.title,
        summary: item.summary,
        tags: item.tags,
        courseTitle: course.title,
        typeLabel: section.label,
        href: item.href,
      })),
    ),
  );

  logWarnings(warnings);
  return { courses, searchIndex };
}

/** Returns the previous and next documents within the same course + content type. */
export function neighbours(
  sections: CourseSection[],
  route: string,
): { prev?: DocLink; next?: DocLink } {
  const all = sections.flatMap((section) => section.items);
  const index = all.findIndex((item) => normalizeRoute(item.href) === normalizeRoute(route));
  if (index < 0) return {};
  return {
    prev: index > 0 ? all[index - 1] : undefined,
    next: index < all.length - 1 ? all[index + 1] : undefined,
  };
}

export type { DocumentEntry, MetaEntry };
