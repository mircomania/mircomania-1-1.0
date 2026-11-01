import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { mejoravitHistory } from '@/data/ads/mejoravit';
import type { MonthlyCpaPoint } from '@/data/ads/mejoravit';

import MonthlyCpaChart from './MonthlyCpaChart';
import { CPA_CHART, getCpaGeometry } from './cpaGeometry';

describe('monthly CPA chart', () => {
    it('uses a zero baseline and places the 17 months inside a common scale', () => {
        const chart = getCpaGeometry(mejoravitHistory.monthly);
        expect(chart.ceiling).toBe(50);
        expect(chart.ticks[0]).toEqual({ value: 0, y: CPA_CHART.bottom });
        expect(chart.points.filter(Boolean)).toHaveLength(17);
        expect(chart.segments).toHaveLength(1);
        expect(chart.points[0]?.x).toBe(CPA_CHART.left);
        expect(chart.points[16]?.x).toBe(CPA_CHART.right);
        for (const point of chart.points) {
            expect(point?.y).toBeGreaterThanOrEqual(CPA_CHART.top);
            expect(point?.y).toBeLessThanOrEqual(CPA_CHART.bottom);
        }
    });

    it('breaks the line for absent data and does not turn undefined CPAs into zero', () => {
        const data: MonthlyCpaPoint[] = [
            { month: '2026-06', conversions: 10, costPerConversion: 0, partial: false },
            { month: '2026-07', conversions: 0, costPerConversion: null, partial: false },
            { month: '2026-08', conversions: 20, costPerConversion: 25, partial: false },
        ];
        const chart = getCpaGeometry(data);
        expect(chart.points[0]?.y).toBe(CPA_CHART.bottom);
        expect(chart.points[1]).toBeNull();
        expect(chart.segments).toHaveLength(2);
        const single = getCpaGeometry([data[0]]);
        expect(single.points[0]?.x).toBe((CPA_CHART.left + CPA_CHART.right) / 2);
    });

    it('renders accessible SVG context, a real data table and the partial period', () => {
        const html = renderToStaticMarkup(createElement(MonthlyCpaChart, { data: mejoravitHistory.monthly }));
        expect(html).toContain('role="img"');
        expect(html).toContain('aria-labelledby="mejoravit-cpa-title"');
        expect(html).toContain('aria-describedby="mejoravit-cpa-description"');
        expect(html).toContain('<details');
        expect(html).toContain('scope="col"');
        expect(html.match(/scope="row"/g)).toHaveLength(17);
        expect(html).toContain('octubre de 2026 (parcial)');
        expect(html).toContain('$43,72 MXN');
        expect(html).toContain('no se promedian los CPA individuales');
    });

    it('renders an honest empty state instead of a fabricated series', () => {
        const html = renderToStaticMarkup(createElement(MonthlyCpaChart, { data: [] }));
        expect(html).toContain('No hay datos suficientes');
        expect(html).not.toContain('<svg');
        expect(html).not.toContain('<table');
    });

    it('does not draw invalid or zero-conversion observations', () => {
        const data: MonthlyCpaPoint[] = [
            { month: '2026-06', conversions: 0, costPerConversion: 0, partial: false },
            { month: '2026-07', conversions: 5, costPerConversion: Number.NaN, partial: false },
            { month: '2026-08', conversions: 10, costPerConversion: -1, partial: false },
        ];
        expect(getCpaGeometry(data).points).toEqual([null, null, null]);
        const html = renderToStaticMarkup(createElement(MonthlyCpaChart, { data }));
        expect(html).toContain('No hay datos suficientes');
        expect(html.match(/No disponible/g)).toHaveLength(3);
        expect(html).not.toContain('<svg');
    });
});
