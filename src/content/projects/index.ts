import type { Project } from '../schema';
import { brass } from './brass';

/** Порядок здесь = порядок на главной и в переходе «Следующий кейс». */
export const projects: Project[] = [brass];

export function getProject(slug: string | undefined) {
  return projects.find((p) => p.slug === slug);
}

export function getNextProject(slug: string) {
  if (projects.length < 2) return undefined;
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
}

/** Избранные проекты для главной: до трёх; если не отмечены — первые в списке. */
export function getFeaturedProjects() {
  const marked = projects.filter((p) => p.featured);
  return (marked.length ? marked : projects).slice(0, 3);
}
