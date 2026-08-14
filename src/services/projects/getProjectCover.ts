import type { FeaturedProject, FeaturedProjectMedia } from '@/types/projects';

export function getProjectCover(project: FeaturedProject): FeaturedProjectMedia | null {
    return project.project_media.find((media) => media.is_cover) ?? null;
}
