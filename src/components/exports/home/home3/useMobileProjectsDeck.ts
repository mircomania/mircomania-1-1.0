import { useRef, useState } from 'react';
import type { RefObject } from 'react';

const SCROLL_OFFSET = 150;

const ANIMATION_DURATION = 1000;
const ANIMATION_STAGGER = 90;
const CARD_FOCUSABLE_SELECTOR = 'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])';

type UseMobileProjectsDeckReturn = {
    isExpanded: boolean;
    isAnimating: boolean;
    deckRef: RefObject<HTMLDivElement | null>;
    toggleButtonRef: RefObject<HTMLButtonElement | null>;
    setCardRef: (index: number, element: HTMLDivElement | null) => void;
    handleOpen: (moveFocusToFirstProject?: boolean) => Promise<void>;
    handleClose: () => Promise<void>;
};

const prefersReducedMotion = (): boolean => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

const waitForNextFrame = (): Promise<void> => {
    return new Promise((resolve) => {
        requestAnimationFrame(() => resolve());
    });
};

const waitForScrollEnd = (): Promise<void> => {
    return new Promise((resolve) => {
        let scrollEndTimer: ReturnType<typeof setTimeout>;

        const maxWaitTimer = window.setTimeout(() => {
            cleanup();
            resolve();
        }, 2500);

        const handleScroll = () => {
            clearTimeout(scrollEndTimer);

            scrollEndTimer = setTimeout(() => {
                cleanup();
                resolve();
            }, 120);
        };

        const cleanup = () => {
            window.removeEventListener('scroll', handleScroll);
            clearTimeout(scrollEndTimer);
            clearTimeout(maxWaitTimer);
        };

        window.addEventListener('scroll', handleScroll, {
            passive: true,
        });

        handleScroll();
    });
};

export default function useMobileProjectsDeck(): UseMobileProjectsDeckReturn {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    const deckRef = useRef<HTMLDivElement | null>(null);
    const toggleButtonRef = useRef<HTMLButtonElement | null>(null);
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

    const setCardRef = (index: number, element: HTMLDivElement | null) => {
        cardRefs.current[index] = element;
    };

    const getDeckScrollTop = (): number => {
        if (!deckRef.current) return window.scrollY;

        const deckTop = deckRef.current.getBoundingClientRect().top + window.scrollY;

        return Math.max(0, deckTop - SCROLL_OFFSET);
    };

    const animateLayoutChange = async (expanded: boolean): Promise<void> => {
        const cards = cardRefs.current.filter((card): card is HTMLDivElement => card !== null);

        if (prefersReducedMotion()) {
            setIsExpanded(expanded);
            return;
        }

        const firstRects = cards.map((card) => card.getBoundingClientRect());

        setIsExpanded(expanded);

        await waitForNextFrame();

        const lastRects = cards.map((card) => card.getBoundingClientRect());

        if (expanded) {
            cards.forEach((card, index) => {
                card.style.zIndex = String(cards.length - index);
            });
        }

        const animations = cards.map((card, index) => {
            const first = firstRects[index];
            const last = lastRects[index];

            const deltaX = first.left - last.left;
            const deltaY = first.top - last.top;

            const scaleX = first.width / last.width;
            const scaleY = first.height / last.height;

            const delay = expanded ? Math.max(0, index - 1) * ANIMATION_STAGGER : index * ANIMATION_STAGGER;

            const initialTransform = expanded ? `translateY(${deltaY}px)` : `translate(${deltaX}px, ${deltaY}px) scale(${scaleX}, ${scaleY})`;

            return card.animate(
                [
                    {
                        transform: initialTransform,
                    },
                    {
                        transform: 'translate(0, 0) scale(1, 1)',
                    },
                ],
                {
                    duration: ANIMATION_DURATION,
                    delay,
                    easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
                    fill: 'both',
                },
            );
        });

        await Promise.allSettled(animations.map((animation) => animation.finished));

        animations.forEach((animation) => animation.cancel());

        cards.forEach((card) => {
            card.style.zIndex = '';
        });
    };

    const handleOpen = async (moveFocusToFirstProject = false): Promise<void> => {
        if (isAnimating) return;

        setIsAnimating(true);

        try {
            await animateLayoutChange(true);
        } finally {
            setIsAnimating(false);

            if (moveFocusToFirstProject) {
                requestAnimationFrame(() => {
                    const firstProjectAction = cardRefs.current[0]?.querySelector<HTMLElement>(CARD_FOCUSABLE_SELECTOR);

                    (firstProjectAction ?? toggleButtonRef.current)?.focus();
                });
            }
        }
    };

    const handleClose = async (): Promise<void> => {
        if (isAnimating) return;

        setIsAnimating(true);

        try {
            const targetTop = getDeckScrollTop();
            const reducedMotion = prefersReducedMotion();

            window.scrollTo({
                top: targetTop,
                behavior: reducedMotion ? 'auto' : 'smooth',
            });

            if (!reducedMotion) {
                await waitForScrollEnd();
            }

            window.scrollTo({
                top: targetTop,
                behavior: 'auto',
            });

            await waitForNextFrame();

            await animateLayoutChange(false);

            window.scrollTo({
                top: targetTop,
                behavior: 'auto',
            });
        } finally {
            setIsAnimating(false);

            requestAnimationFrame(() => {
                toggleButtonRef.current?.focus({
                    preventScroll: true,
                });
            });
        }
    };

    return {
        isExpanded,
        isAnimating,
        deckRef,
        toggleButtonRef,
        setCardRef,
        handleOpen,
        handleClose,
    };
}
