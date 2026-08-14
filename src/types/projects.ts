// Enums y constantes
export type ProjectMediaType = 'image' | 'video';

export const projectTypeLabels = {
    corporate: 'Corporativo',
    full_stack: 'Full Stack',
    saas: 'SaaS',
    automation: 'Automatización',
    ecommerce: 'E-commerce',
    mobile_app: 'Aplicación móvil',
} as const;

export type ProjectType = keyof typeof projectTypeLabels;

// Modelos

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
    project_type: ProjectType;
    stack: string[];
    featured: boolean;
    featured_order: number | null;
    demo_url: string | null;
    repository_url: string | null;
    project_media: ProjectMedia[];
};
