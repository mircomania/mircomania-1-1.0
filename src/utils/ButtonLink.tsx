import type { AnchorHTMLAttributes, ReactNode } from 'react';

type ButtonLinkVariant = 'primary' | 'secondary';

type ButtonLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children' | 'className' | 'href'> & {
    href: string;
    children: ReactNode;
    variant?: ButtonLinkVariant;
    className?: string;
    dataCta?: string;
    dataLink?: string;
    showExternalIcon?: boolean;
};

export default function ButtonLink({
    href,
    children,
    variant = 'primary',
    className = '',
    dataCta,
    dataLink,
    showExternalIcon = true,
    target = '_blank',
    rel = 'noopener noreferrer',
    draggable = false,
    ...props
}: ButtonLinkProps) {
    const classes = ['button-link', `button-link--${variant}`, className].filter(Boolean).join(' ');

    return (
        <a
            href={href}
            className={classes}
            target={target}
            rel={rel}
            draggable={draggable}
            {...(dataCta ? { 'data-cta': dataCta } : {})}
            {...(dataLink ? { 'data-link': dataLink } : {})}
            {...props}
        >
            <span>{children}</span>

            {showExternalIcon && (
                <svg className="button-link-icon" aria-hidden="true" viewBox="0 0 16 16" width="14" height="14" focusable="false">
                    <path d="M5 11L11 5M6 5h5v5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            )}
        </a>
    );
}
