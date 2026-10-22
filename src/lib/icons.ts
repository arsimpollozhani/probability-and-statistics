import {
  BookOpen,
  BrainCircuit,
  ChartColumn,
  Database,
  File,
  Lightbulb,
  Library,
  PencilLine,
  Sigma,
  SquareRadical,
} from 'lucide-astro';

const ICONS = {
  'book-open': BookOpen,
  'brain-circuit': BrainCircuit,
  'chart-column': ChartColumn,
  database: Database,
  file: File,
  lightbulb: Lightbulb,
  library: Library,
  'pencil-line': PencilLine,
  sigma: Sigma,
  'square-radical': SquareRadical,
} as const;

export type IconName = keyof typeof ICONS;

export function getIcon(name?: string | null) {
  return name && name in ICONS ? ICONS[name as IconName] : BookOpen;
}
