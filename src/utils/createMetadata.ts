import type { Metadata } from 'next';

type CreateMetadataParams = {
    title: string;
    description: string;
    path: string;
    absoluteTitle?: boolean;
};

export function createMetadata({ title, description, path, absoluteTitle = false }: CreateMetadataParams): Metadata {
    const socialTitle = absoluteTitle ? title : `${title} | Mircomania`;

    return {
        title: absoluteTitle ? { absolute: title } : title,

        description,

        alternates: {
            canonical: path,
        },

        openGraph: {
            type: 'website',
            locale: 'es_CL',
            siteName: 'Mircomania',
            title: socialTitle,
            description,
            url: path,
        },

        twitter: {
            card: 'summary_large_image',
            title: socialTitle,
            description,
        },
    };
}
