export const projectTypeLabels = {
    corporate: 'Corporativo',
    full_stack: 'Full Stack',
    saas: 'SaaS',
    automation: 'Automatización',
    ecommerce: 'E-commerce',
    mobile_app: 'Aplicación móvil',
} as const;

export type ProjectType = keyof typeof projectTypeLabels;

export type FeaturedProjectCard = {
    id: string;
    slug: string;
    title: string;
    summary: string;
    projectYear: number | null;
    projectType: ProjectType;
    stack: string[];
    demoUrl: string | null;
    repositoryUrl: string | null;
    cover: {
        src: string;
        alt: string;
        width: number;
        height: number;
    };
};
