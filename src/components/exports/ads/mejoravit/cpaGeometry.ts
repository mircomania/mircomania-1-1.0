import type { MonthlyCpaPoint } from '@/data/ads/mejoravit';

export const CPA_CHART = { width: 1000, height: 370, left: 72, right: 972, top: 32, bottom: 260 } as const;

export function getCpaGeometry(data: readonly MonthlyCpaPoint[]) {
    const valid = (row: MonthlyCpaPoint) => row.costPerConversion !== null && Number.isFinite(row.costPerConversion)
        && row.costPerConversion >= 0 && row.conversions !== null && Number.isFinite(row.conversions) && row.conversions > 0;
    const values = data.filter(valid).map((row) => row.costPerConversion as number);
    const ceiling = Math.max(10, Math.ceil(Math.max(0, ...values) / 10) * 10);
    const x = (index: number) => data.length > 1
        ? CPA_CHART.left + index * (CPA_CHART.right - CPA_CHART.left) / (data.length - 1)
        : (CPA_CHART.left + CPA_CHART.right) / 2;
    const y = (value: number) => CPA_CHART.bottom - value / ceiling * (CPA_CHART.bottom - CPA_CHART.top);
    const points = data.map((row, index) => valid(row)
        ? { x: x(index), y: y(row.costPerConversion as number), value: row.costPerConversion as number, row }
        : null);
    const segments: string[] = [];
    let segment: string[] = [];
    for (const point of points) {
        if (point) segment.push(`${point.x},${point.y}`);
        else if (segment.length > 0) { segments.push(segment.join(' ')); segment = []; }
    }
    if (segment.length > 0) segments.push(segment.join(' '));
    const ticks = Array.from({ length: 6 }, (_, index) => ({ value: ceiling * index / 5, y: y(ceiling * index / 5) }));
    return { points, segments, ticks, ceiling, x };
}
