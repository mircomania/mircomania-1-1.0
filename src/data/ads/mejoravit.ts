import snapshot from './mejoravit-history.json';

export type MonthlyCpaPoint = {
    month: string;
    conversions: number | null;
    costPerConversion: number | null;
    partial: boolean;
};

export const mejoravitHistory = snapshot;

// Reported by the case owner on 30 October 2026. Separate from the XML metrics.
export const mejoravitCommercialReport = {
    usefulPercentage: 72.8,
    evaluatedApproximate: 6775,
    usefulReported: 4935,
    remainingApproximate: 1840,
    start: '2026-09-27',
    end: '2026-10-26',
    originalDocumentAvailable: false,
    individuallyReconciledWithAds: false,
} as const;

const decimal = new Intl.NumberFormat('es-CL', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const integer = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 });
const month = new Intl.DateTimeFormat('es-CL', { month: 'long', year: 'numeric', timeZone: 'UTC' });
const shortMonth = new Intl.DateTimeFormat('es-CL', { month: 'short', year: '2-digit', timeZone: 'UTC' });

export function formatMxn(value: number) {
    return `$${decimal.format(value)} MXN`;
}

export function formatConversions(value: number) {
    return decimal.format(value);
}

export function formatWholeNumber(value: number) {
    return integer.format(value);
}

export function formatReportedPercentage(value: number) {
    return new Intl.NumberFormat('es-CL', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(value);
}

export function formatHistoryMonth(value: string, short = false) {
    return (short ? shortMonth : month).format(new Date(`${value}-01T00:00:00Z`));
}
