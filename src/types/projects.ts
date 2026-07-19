export type ProjectMediaVariant = 'desktop' | 'mobile' | 'shared';
export type ProjectMediaType = 'image' | 'video';

export type ProjectMedia = {
    id: string;
    media_type: ProjectMediaType;
    storage_path: string;
    poster_path: string | null;
    alt_text: string;
    caption: string | null;
    width: number | null;
    height: number | null;
    sort_order: number;
    is_cover: boolean;
    variant: ProjectMediaVariant;
};

export type FeaturedProject = {
    id: string;
    slug: string;
    title: string;
    summary: string;
    description: string | null;
    role: string | null;
    client: string | null;
    project_year: number | null;
    stack: string[];
    featured: boolean;
    featured_order: number | null;
    demo_url: string | null;
    repository_url: string | null;
    project_media: ProjectMedia[];
};
