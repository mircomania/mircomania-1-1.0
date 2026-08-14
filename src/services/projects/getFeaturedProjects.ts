import { supabase } from '@/lib/supabase/server';

import type { FeaturedProject } from '@/types/projects';

export async function getFeaturedProjects(): Promise<FeaturedProject[]> {
    const { data, error } = await supabase
        .from('projects')
        .select(
            `
            id,
            slug,
            title,
            summary,
            project_year,
            project_type,
            stack,
            demo_url,
            repository_url,
            project_media (
                storage_path,
                alt_text,
                width,
                height,
                is_cover
            )
`,
        )
        .eq('featured', true)
        .eq('status', 'published')
        .order('featured_order', { ascending: true });

    if (error) {
        console.error('Error obteniendo proyectos destacados:', error);
        throw new Error('No fue posible cargar los proyectos destacados');
    }

    return (data ?? []) as FeaturedProject[];
}
