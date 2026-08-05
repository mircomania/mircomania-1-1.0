import type { ComponentPropsWithRef } from 'react';

type MenuProps = Omit<ComponentPropsWithRef<'button'>, 'children'>;

export function Menu({ ref, type = 'button', ...buttonProps }: Readonly<MenuProps>) {
    return (
        <button ref={ref} type={type} {...buttonProps}>
            <svg width="32" height="32" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <line x1="4" y1="8" x2="20" y2="8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />

                <line x1="4" y1="16" x2="20" y2="16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
        </button>
    );
}
