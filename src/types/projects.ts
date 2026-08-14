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

export type FeaturedProjectMedia = {
    storage_path: string;
    alt_text: string;
    width: number | null;
    height: number | null;
    is_cover: boolean;
};

export type FeaturedProject = {
    id: string;
    slug: string;
    title: string;
    summary: string;
    project_year: number | null;
    project_type: ProjectType;
    stack: string[];
    demo_url: string | null;
    repository_url: string | null;
    project_media: FeaturedProjectMedia[];
};
