'use client';

import type { ComponentPropsWithoutRef, MouseEvent, ReactNode } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type SmartLinkProps = Omit<ComponentPropsWithoutRef<typeof Link>, 'children' | 'href' | 'onClick'> & {
    href: string;
    children: ReactNode;
    dataCta?: string;
    dataLink?: string;
    onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
};

export function SmartLink({ href, children, dataCta, dataLink, onClick, draggable = false, ...props }: Readonly<SmartLinkProps>) {
    const pathname = usePathname();

    const handleClick = (event: MouseEvent<HTMLAnchorElement>): void => {
        onClick?.(event);

        if (event.defaultPrevented) return;

        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
            return;
        }

        const targetUrl = new URL(href, window.location.origin);
        const isSamePath = pathname === targetUrl.pathname;

        if (!isSamePath) return;

        event.preventDefault();

        if (!targetUrl.hash) {
            window.scrollTo({
                top: 0,
                behavior: 'smooth',
            });

            return;
        }

        const targetId = decodeURIComponent(targetUrl.hash.slice(1));

        const targetElement = document.getElementById(targetId);

        if (!targetElement) return;

        targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });

        window.history.replaceState(null, '', `${targetUrl.pathname}${targetUrl.search}${targetUrl.hash}`);
    };

    return (
        <Link
            href={href}
            onClick={handleClick}
            draggable={draggable}
            {...(dataCta ? { 'data-cta': dataCta } : {})}
            {...(dataLink ? { 'data-link': dataLink } : {})}
            {...props}
        >
            {children}
        </Link>
    );
}
