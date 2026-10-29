import 'server-only';

import { getPublicMediaUrl } from '@/lib/supabase/getPublicMediaUrl';
import { supabase } from '@/lib/supabase/server';

import type { AdsMetric, PublishedAdsCase } from '@/types/ads';

// Register a study only after its App Router page exists. Phase 1 has no study routes.
const studyRoutes: ReadonlyMap<string, string> = new Map();

function text(value: unknown, min: number, max: number): string | null {
    if (typeof value !== 'string') return null;
    const trimmed = value.trim();
    return trimmed.length >= min && trimmed.length <= max ? trimmed : null;
}

function normalizeCase(value: unknown): PublishedAdsCase | null {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) return null;
    const row = value as Record<string, unknown>;
    const id = text(row.id, 1, 100);
    const slug = text(row.slug, 1, 200);
    const title = text(row.title, 2, 120);
    const summary = text(row.summary, 10, 500);
    const category = text(row.category, 2, 60);

    if (!id || !slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || !title || !summary || !category) return null;
    if (row.status !== 'published' || !Number.isInteger(row.featured_order) || (row.featured_order as number) <= 0) return null;

    const metrics: AdsMetric[] = [];
    for (const prefix of ['featured_metric', 'featured_metric_secondary']) {
        const rawLabel = row[`${prefix}_label`];
        const rawValue = row[`${prefix}_value`];
        if (rawLabel === null && rawValue === null) continue;
        const label = text(rawLabel, 4, 120);
        const metricValue = text(rawValue, 1, 40);
        if (!label || !metricValue) return null;
        metrics.push({ label, value: metricValue });
    }

    const period = row.featured_metric_period === null ? null : text(row.featured_metric_period, 6, 120);
    if (row.featured_metric_period !== null && !period) return null;

    let logo: PublishedAdsCase['logo'] = null;
    if (row.logo_path !== null || row.logo_alt !== null) {
        const path = text(row.logo_path, 5, 500);
        const alt = text(row.logo_alt, 8, 250);
        if (!path || !alt || path.startsWith('/') || path.includes('..') || !/\.(webp|avif|jpe?g)$/i.test(path)) {
            return null;
        }
        const src = getPublicMediaUrl(path);
        if (!src) return null;
        logo = { src, alt };
    }

    return { id, slug, title, summary, category, metrics, period, logo, studyHref: studyRoutes.get(slug) ?? null };
}

export async function getPublishedAdsCases(): Promise<PublishedAdsCase[]> {
    const { data, error } = await supabase
        .from('ads_cases')
        .select(`
            id, slug, title, summary, category, logo_path, logo_alt, featured_order, status,
            featured_metric_label, featured_metric_value, featured_metric_secondary_label,
            featured_metric_secondary_value, featured_metric_period
        `)
        .eq('status', 'published')
        .order('featured_order', { ascending: true });

    if (error || !Array.isArray(data)) {
        console.error('Error obteniendo casos de publicidad:', error?.code ?? 'respuesta inesperada');
        throw new Error('No fue posible cargar los casos de publicidad');
    }

    const cases: PublishedAdsCase[] = [];
    for (const row of data) {
        const normalized = normalizeCase(row);
        if (normalized) cases.push(normalized);
        else console.warn('Caso de publicidad omitido por datos inválidos.');
    }
    return cases;
}
