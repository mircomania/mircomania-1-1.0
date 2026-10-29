import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ from: vi.fn(), select: vi.fn(), eq: vi.fn(), order: vi.fn(), mediaUrl: vi.fn() }));

vi.mock('@/lib/supabase/server', () => ({ supabase: { from: mocks.from } }));
vi.mock('@/lib/supabase/getPublicMediaUrl', () => ({ getPublicMediaUrl: mocks.mediaUrl }));

import { getPublishedAdsCases } from './getPublishedAdsCases';

// Synthetic fixtures for validation only; these records are never used by the page.
const validRow = {
    id: 'test-case-id',
    slug: 'test-case',
    title: ' Caso de prueba ',
    summary: ' Descripción de prueba para el catálogo. ',
    category: ' Google Ads ',
    status: 'published',
    featured_order: 1,
    logo_path: null,
    logo_alt: null,
    featured_metric_label: 'Conversiones de prueba',
    featured_metric_value: '100',
    featured_metric_secondary_label: 'Costo de prueba',
    featured_metric_secondary_value: '$10 MXN',
    featured_metric_period: 'Octubre de 2026',
};

beforeEach(() => {
    vi.resetAllMocks();
    mocks.from.mockReturnValue({ select: mocks.select });
    mocks.select.mockReturnValue({ eq: mocks.eq });
    mocks.eq.mockReturnValue({ order: mocks.order });
    mocks.order.mockResolvedValue({ data: [], error: null });
    mocks.mediaUrl.mockReturnValue('https://example.test/logo.webp');
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
});

describe('getPublishedAdsCases', () => {
    it('queries only published cases in featured order and returns an honest empty catalog', async () => {
        await expect(getPublishedAdsCases()).resolves.toEqual([]);
        expect(mocks.from).toHaveBeenCalledWith('ads_cases');
        expect(mocks.eq).toHaveBeenCalledWith('status', 'published');
        expect(mocks.order).toHaveBeenCalledWith('featured_order', { ascending: true });
    });

    it('normalizes text, two metrics and period without requiring a logo or inventing a study route', async () => {
        mocks.order.mockResolvedValue({ data: [validRow], error: null });
        const [study] = await getPublishedAdsCases();
        expect(study).toMatchObject({ title: 'Caso de prueba', summary: 'Descripción de prueba para el catálogo.', category: 'Google Ads', logo: null, studyHref: null, period: 'Octubre de 2026' });
        expect(study.metrics).toEqual([{ label: 'Conversiones de prueba', value: '100' }, { label: 'Costo de prueba', value: '$10 MXN' }]);
        expect(mocks.mediaUrl).not.toHaveBeenCalled();
    });

    it('supports cases without metrics and an optional storage logo', async () => {
        mocks.order.mockResolvedValue({ data: [{ ...validRow, logo_path: 'ads/test/logo.webp', logo_alt: 'Logo de prueba', featured_metric_label: null, featured_metric_value: null, featured_metric_secondary_label: null, featured_metric_secondary_value: null, featured_metric_period: null }], error: null });
        const [study] = await getPublishedAdsCases();
        expect(study.metrics).toEqual([]);
        expect(study.period).toBeNull();
        expect(study.logo).toEqual({ src: 'https://example.test/logo.webp', alt: 'Logo de prueba' });
        expect(mocks.mediaUrl).toHaveBeenCalledWith('ads/test/logo.webp');
    });

    it.each([
        { status: 'draft' },
        { slug: '../mejoravit' },
        { featured_order: null },
        { featured_order: 0 },
        { summary: ' ' },
        { title: 123 },
        { featured_metric_value: null },
        { featured_metric_secondary_label: '' },
        { featured_metric_period: 123 },
        { logo_path: '../logo.webp', logo_alt: 'Logo de prueba' },
        { logo_path: 'logo.svg', logo_alt: 'Logo de prueba' },
        { logo_path: 'logo.webp', logo_alt: null },
    ])('omits unsafe or incomplete records: %j', async (invalidFields) => {
        mocks.order.mockResolvedValue({ data: [null, { ...validRow, ...invalidFields }, validRow], error: null });
        const cases = await getPublishedAdsCases();
        expect(cases).toHaveLength(1);
        expect(cases[0].slug).toBe('test-case');
    });

    it('omits a logo record when Storage cannot resolve its URL', async () => {
        mocks.mediaUrl.mockReturnValue(null);
        mocks.order.mockResolvedValue({ data: [{ ...validRow, logo_path: 'ads/logo.webp', logo_alt: 'Logo de prueba' }], error: null });
        await expect(getPublishedAdsCases()).resolves.toEqual([]);
    });

    it('does not treat inherited object properties as study routes', async () => {
        mocks.order.mockResolvedValue({ data: [{ ...validRow, slug: 'constructor' }], error: null });
        expect((await getPublishedAdsCases())[0].studyHref).toBeNull();
    });

    it.each([{ data: null, error: { code: '42501' } }, { data: {}, error: null }])('fails distinctly from an empty catalog: %j', async (response) => {
        mocks.order.mockResolvedValue(response);
        await expect(getPublishedAdsCases()).rejects.toThrow('No fue posible cargar los casos de publicidad');
    });

    it('propagates network failures for the page fallback', async () => {
        mocks.order.mockRejectedValue(new Error('network unavailable'));
        await expect(getPublishedAdsCases()).rejects.toThrow('network unavailable');
    });
});
