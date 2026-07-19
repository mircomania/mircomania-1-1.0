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
            description,
            role,
            client,
            project_year,
            stack,
            featured,
            featured_order,
            demo_url,
            repository_url,
            project_media (
                id,
                media_type,
                storage_path,
                poster_path,
                alt_text,
                caption,
                width,
                height,
                sort_order,
                is_cover,
                variant
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
