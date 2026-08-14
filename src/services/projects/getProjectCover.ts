import type { FeaturedProject, ProjectMedia } from '@/types/projects';

export function getProjectCover(project: FeaturedProject): ProjectMedia | null {
    return project.project_media.find((media) => media.is_cover) ?? null;
}
