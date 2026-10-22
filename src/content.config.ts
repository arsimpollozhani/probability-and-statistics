import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';
import { slugifySegment } from './lib/slug';

/**
 * Lectures, tutorials, problem sets and reference sheets.
 * Every Markdown file under content/courses/<course>/<content-type>/ is discovered
 * automatically. The folder is the canonical location: course = first path segment,
 * content type = second, lecture slug = the rest.
 */
const documents = defineCollection({
  loader: glob({
    base: './content/courses',
    pattern: '**/*.md',
    generateId: ({ entry }) =>
      entry
        .replace(/\.md$/, '')
        .split('/')
        .map((segment) => slugifySegment(segment))
        .join('/'),
  }),
  schema: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    order: z.number().int().optional(),
    tags: z.array(z.string()).optional(),
    /**
     * Optional sidebar section override, e.g. `exam` to group a document under
     * "Exam Problems" even when it lives in the `lectures` folder.
     */
    type: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

/**
 * Course registry: content/courses/<course>/course.yaml.
 * Entirely optional — course folder names are humanized when no metadata exists.
 */
const coursesMeta = defineCollection({
  loader: glob({
    base: './content/courses',
    pattern: '*/course.yaml',
    generateId: ({ entry }) => slugifySegment(entry.split('/')[0] ?? ''),
  }),
  schema: z.object({
    id: z.string().optional(),
    title: z.string().optional(),
    description: z.string().optional(),
    icon: z.string().optional(),
    order: z.number().int().optional(),
  }),
});

export const collections = { documents, coursesMeta };
