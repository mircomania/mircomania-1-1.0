'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function RouteFocusManager() {
    const pathname = usePathname();
    const previousPathnameRef = useRef(pathname);

    useEffect(() => {
        if (previousPathnameRef.current === pathname) {
            return;
        }

        previousPathnameRef.current = pathname;

        const main = document.querySelector<HTMLElement>('main');

        if (!main) {
            return;
        }

        main.classList.add('programmatic-focus-target');
        main.tabIndex = -1;
        main.focus({
            preventScroll: true,
        });
    }, [pathname]);

    return null;
}
