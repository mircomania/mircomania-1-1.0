import type { ComponentPropsWithRef } from 'react';

type MenuProps = Omit<ComponentPropsWithRef<'button'>, 'children'> & {
    size?: number;
    strokeWidth?: number;
};

export function Menu({ size = 44, strokeWidth = 1.2, type = 'button', ref, ...buttonProps }: Readonly<MenuProps>) {
    return (
        <button ref={ref} type={type} {...buttonProps}>
            <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <line x1="3" y1="6" x2="20" y2="6" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />

                <line x1="3" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />

                <line x1="3" y1="18" x2="20" y2="18" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
            </svg>
        </button>
    );
}
