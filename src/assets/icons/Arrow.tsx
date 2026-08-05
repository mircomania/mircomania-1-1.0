import type { SVGProps } from 'react';

type ArrowRightProps = SVGProps<SVGSVGElement>;

export function Arrow({ ...svgProps }: Readonly<ArrowRightProps>) {
    return (
        <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false" {...svgProps}>
            <path d="M3 8h9" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />

            <path d="m9 4 4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}
