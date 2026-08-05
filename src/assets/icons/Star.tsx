import type { SVGProps } from 'react';

export default function Star(props: Readonly<SVGProps<SVGSVGElement>>) {
    return (
        <svg viewBox="0 0 100 100" aria-hidden="true" focusable="false" {...props}>
            <path
                d="
                    M50 3
                    L57 36
                    L76 24
                    L64 43
                    L97 50
                    L64 57
                    L76 76
                    L57 64
                    L50 97
                    L43 64
                    L24 76
                    L36 57
                    L3 50
                    L36 43
                    L24 24
                    L43 36
                    Z
                "
                fill="currentColor"
            />
        </svg>
    );
}
