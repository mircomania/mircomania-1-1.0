import { describe, expect, it } from 'vitest';

import { formatConversions, formatMxn, formatReportedPercentage, formatWholeNumber, mejoravitCommercialReport, mejoravitHistory } from './mejoravit';

describe('Mejoravit verified snapshot', () => {
    it('keeps the 17 months in order and identifies the partial month', () => {
        const { monthly, source, totals } = mejoravitHistory;
        expect(source.rowCount).toBe(42);
        expect(source.conversionColumn).toBe('Conversiones');
        expect(source.sha256).toBe('831d03fd14376ec07b552910dc267cf226f270722f5f9e30005d74d5027f41b3');
        expect(monthly).toHaveLength(17);
        expect(monthly.map((row) => row.month)).toEqual([...monthly.map((row) => row.month)].sort());
        expect(monthly[0]).toMatchObject({ month: '2025-06', costPerConversion: 6.69 });
        expect(monthly.find((row) => row.month === '2026-08')?.costPerConversion).toBe(43.72);
        expect(monthly[16]).toMatchObject({ month: '2026-10', costPerConversion: 15.78, partial: true });
        expect(monthly.filter((row) => row.partial)).toHaveLength(1);
        expect(monthly.reduce((total, row) => total + row.conversions, 0)).toBeCloseTo(totals.conversions, 2);
        expect(totals).toEqual({ conversions: 34795.1, costPerConversion: 15.29 });
    });

    it('compares only the confirmed Mi Cuenta family in the same partial month', () => {
        const { comparison } = mejoravitHistory;
        expect(comparison.month).toBe('2026-10');
        expect(comparison.partial).toBe(true);
        expect(comparison.actionIdsAvailableInExport).toBe(false);
        expect(comparison.channels.map(({ conversions, costPerConversion }) => ({ conversions, costPerConversion }))).toEqual([
            { conversions: 1522.51, costPerConversion: 16.43 }, { conversions: 3168.73, costPerConversion: 7.98 },
        ]);
        expect(comparison.channels.flatMap((channel) => channel.campaigns)).not.toContain('En Linea NL');
    });

    it('does not include campaign spend in the public snapshot', () => {
        const inspect = (value: unknown) => {
            if (value === null || typeof value !== 'object') return;
            for (const [key, child] of Object.entries(value)) {
                expect(['cost', 'spend', 'totalSpend', 'totalCost']).not.toContain(key);
                inspect(child);
            }
        };
        inspect(mejoravitHistory);
    });

    it('keeps the approximate commercial report distinct from Ads conversions', () => {
        expect(mejoravitCommercialReport.start).toBe('2026-09-27');
        expect(mejoravitCommercialReport.end).toBe('2026-10-26');
        expect(mejoravitCommercialReport.originalDocumentAvailable).toBe(false);
        expect(mejoravitCommercialReport.individuallyReconciledWithAds).toBe(false);
        expect(Math.round(mejoravitCommercialReport.usefulReported / mejoravitCommercialReport.evaluatedApproximate * 1000) / 10)
            .toBe(mejoravitCommercialReport.usefulPercentage);
    });

    it('formats MXN and conversions without mixing decimal and grouping separators', () => {
        expect(formatMxn(16.43)).toBe('$16,43 MXN');
        expect(formatConversions(1522.51)).toBe('1.522,51');
        expect(formatConversions(34795.1)).toBe('34.795,10');
        expect(formatWholeNumber(34795.1)).toBe('34.795');
        expect(formatReportedPercentage(mejoravitCommercialReport.usefulPercentage)).toBe('72,8');
    });
});
