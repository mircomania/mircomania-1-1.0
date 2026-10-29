export type AdsMetric = {
    label: string;
    value: string;
};

export type PublishedAdsCase = {
    id: string;
    slug: string;
    title: string;
    summary: string;
    category: string;
    metrics: AdsMetric[];
    period: string | null;
    logo: { src: string; alt: string } | null;
    studyHref: string | null;
};
