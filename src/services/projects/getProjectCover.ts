import type { FeaturedProject, ProjectMedia } from '@/types/projects';

export function getProjectCover(project: FeaturedProject, variant: 'desktop' | 'mobile'): ProjectMedia | null {
    return project.project_media.find((media) => media.variant === variant && media.is_cover) ?? null;
}
