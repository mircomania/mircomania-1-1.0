import 'server-only';

import { getPublicMediaUrl } from '@/lib/supabase/getPublicMediaUrl';
import { supabase } from '@/lib/supabase/server';

import { projectTypeLabels } from '@/types/projects';
import type { FeaturedProjectCard, ProjectType } from '@/types/projects';

type ProjectNormalizationResult = { success: true; project: FeaturedProjectCard } | { success: false; reason: string };

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
    return typeof value === 'string' && value.trim().length > 0;
}

function isNullableString(value: unknown): value is string | null {
    return value === null || typeof value === 'string';
}

function isNullableInteger(value: unknown): value is number | null {
    return value === null || (typeof value === 'number' && Number.isInteger(value));
}

function isPositiveInteger(value: unknown): value is number {
    return typeof value === 'number' && Number.isInteger(value) && value > 0;
}

function isStringArray(value: unknown): value is string[] {
    return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function isProjectType(value: unknown): value is ProjectType {
    return typeof value === 'string' && Object.prototype.hasOwnProperty.call(projectTypeLabels, value);
}

function normalizeFeaturedProject(row: unknown): ProjectNormalizationResult {
    if (!isRecord(row)) {
        return {
            success: false,
            reason: 'la fila no es un objeto',
        };
    }

    if (!isNonEmptyString(row.id) || !isNonEmptyString(row.slug) || !isNonEmptyString(row.title) || typeof row.summary !== 'string') {
        return {
            success: false,
            reason: 'faltan campos de texto obligatorios',
        };
    }

    if (!isProjectType(row.project_type)) {
        return {
            success: false,
            reason: 'project_type no está soportado',
        };
    }

    if (!isNullableInteger(row.project_year) || !isStringArray(row.stack)) {
        return {
            success: false,
            reason: 'el año o el stack no tienen el formato esperado',
        };
    }

    if (!isNullableString(row.demo_url) || !isNullableString(row.repository_url)) {
        return {
            success: false,
            reason: 'los enlaces no tienen el formato esperado',
        };
    }

    if (!Array.isArray(row.project_media) || row.project_media.length === 0) {
        return {
            success: false,
            reason: 'no existe una portada',
        };
    }

    const cover = row.project_media[0];

    if (!isRecord(cover) || cover.media_type !== 'image' || !isNonEmptyString(cover.storage_path) || !isNonEmptyString(cover.alt_text)) {
        return {
            success: false,
            reason: 'la portada no es una imagen renderizable',
        };
    }

    if (!isPositiveInteger(cover.width) || !isPositiveInteger(cover.height)) {
        return {
            success: false,
            reason: 'la portada no tiene dimensiones válidas',
        };
    }

    const coverUrl = getPublicMediaUrl(cover.storage_path);

    if (!coverUrl) {
        return {
            success: false,
            reason: 'no fue posible construir la URL pública de la portada',
        };
    }

    return {
        success: true,
        project: {
            id: row.id,
            slug: row.slug,
            title: row.title,
            summary: row.summary,
            projectYear: row.project_year,
            projectType: row.project_type,
            stack: row.stack,
            demoUrl: row.demo_url,
            repositoryUrl: row.repository_url,
            cover: {
                src: coverUrl,
                alt: cover.alt_text,
                width: cover.width,
                height: cover.height,
            },
        },
    };
}

function getProjectIdentifier(row: unknown): string {
    if (!isRecord(row)) {
        return 'desconocido';
    }

    if (isNonEmptyString(row.id)) {
        return row.id;
    }

    if (isNonEmptyString(row.slug)) {
        return row.slug;
    }

    return 'desconocido';
}

export async function getFeaturedProjects(): Promise<FeaturedProjectCard[]> {
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
                media_type,
                storage_path,
                alt_text,
                width,
                height
            )
`,
        )
        .eq('featured', true)
        .eq('status', 'published')
        .eq('project_media.is_cover', true)
        .order('featured_order', { ascending: true });

    if (error) {
        console.error('Error obteniendo proyectos destacados:', error);
        throw new Error('No fue posible cargar los proyectos destacados');
    }

    if (!Array.isArray(data)) {
        console.error('Respuesta inesperada al obtener proyectos destacados.');
        throw new Error('No fue posible cargar los proyectos destacados');
    }

    const projects: FeaturedProjectCard[] = [];

    for (const row of data) {
        const result = normalizeFeaturedProject(row);

        if (!result.success) {
            console.warn('Proyecto destacado omitido por datos inválidos:', {
                project: getProjectIdentifier(row),
                reason: result.reason,
            });
            continue;
        }

        projects.push(result.project);
    }

    return projects;
}
