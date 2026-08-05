'use client';

import { useEffect, useState } from 'react';

export type NavbarScrollState = 'top' | 'transition' | 'solid';

const TRANSITION_THRESHOLD = 16;
const SOLID_THRESHOLD = 96;

function getNavbarScrollState(scrollY: number): NavbarScrollState {
    if (scrollY < TRANSITION_THRESHOLD) {
        return 'top';
    }

    if (scrollY < SOLID_THRESHOLD) {
        return 'transition';
    }

    return 'solid';
}

export function useNavbarScroll(): NavbarScrollState {
    const [scrollState, setScrollState] = useState<NavbarScrollState>('top');

    useEffect(() => {
        let animationFrameId: number | null = null;

        const updateScrollState = (): void => {
            const nextState = getNavbarScrollState(window.scrollY);

            setScrollState((currentState) => {
                return currentState === nextState ? currentState : nextState;
            });

            animationFrameId = null;
        };

        const handleScroll = (): void => {
            if (animationFrameId !== null) return;

            animationFrameId = window.requestAnimationFrame(updateScrollState);
        };

        updateScrollState();

        window.addEventListener('scroll', handleScroll, {
            passive: true,
        });

        return () => {
            window.removeEventListener('scroll', handleScroll);

            if (animationFrameId !== null) {
                window.cancelAnimationFrame(animationFrameId);
            }
        };
    }, []);

    return scrollState;
}
