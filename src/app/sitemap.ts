import type { MetadataRoute } from 'next';

import { ROUTES, SITE_URL } from '@/constants/routes';

export default function sitemap(): MetadataRoute.Sitemap {
    return [{ url: `${SITE_URL}${ROUTES.home}` }, { url: `${SITE_URL}${ROUTES.contact}` }, { url: `${SITE_URL}${ROUTES.privacy}` }];
}
