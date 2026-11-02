'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

import { getUtmParams } from '@/utils/getUtmParams';

export default function UtmAttributionTracker() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        getUtmParams();
    }, [pathname, searchParams]);

    return null;
}
