import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({ usePathname: () => '/ads' }));

import type { PublishedAdsCase } from '@/types/ads';
import AdsCases from './AdsCases';

const study: PublishedAdsCase = {
    id: 'test-case', slug: 'test-case', title: 'Caso de prueba', category: 'Google Ads',
    summary: 'Descripción de prueba para validar la presentación.', metrics: [{ label: 'Métrica de prueba', value: '100' }],
    period: 'Octubre de 2026', logo: null, studyHref: null,
};

describe('AdsCases rendering', () => {
    it('renders an anchor target and an empty state without fabricated cases', () => {
        const html = renderToStaticMarkup(createElement(AdsCases, { cases: [], loadFailed: false }));
        expect(html).toContain('id="casos-estudio"');
        expect(html).toContain('tabindex="-1"');
        expect(html).toContain('están en preparación');
        expect(html).not.toContain('<article');
        expect(html).not.toContain('href="/ads/');
    });

    it('distinguishes a failed query from an empty catalog', () => {
        const html = renderToStaticMarkup(createElement(AdsCases, { cases: [], loadFailed: true }));
        expect(html).toContain('no está disponible');
        expect(html).not.toContain('están en preparación');
    });

    it.each([1, 2, 3, 5])('renders %i cases with metrics and period, without links to missing routes', (count) => {
        const cases = Array.from({ length: count }, (_, i) => ({ ...study, id: `test-${i}` }));
        const html = renderToStaticMarkup(createElement(AdsCases, { cases, loadFailed: false }));
        expect(html.match(/<article/g)).toHaveLength(count);
        expect(html).toContain('Métrica de prueba');
        expect(html).toContain('Octubre de 2026');
        expect(html).toContain('Estudio completo próximamente');
        expect(html).not.toContain('href="/ads/');
    });
});
