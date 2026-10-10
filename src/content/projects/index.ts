import type { Project } from '../schema';
import { peaky } from './peaky';

/** Порядок здесь = порядок на главной и в переходе «Следующий кейс». */
export const projects: Project[] = [peaky];

export function getProject(slug: string | undefined) {
  return projects.find((p) => p.slug === slug);
}

export function getNextProject(slug: string) {
  if (projects.length < 2) return undefined;
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
}
