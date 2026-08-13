'use client';

import { useRef, useState } from 'react';
import type { CSSProperties } from 'react';

import styles from './home3.module.css';

import type { FeaturedProject } from '@/types/projects';

import ProjectCard from './ProjectCard';

type Props = Readonly<{
    projects: readonly FeaturedProject[];
}>;

type DeckCardStyle = CSSProperties & {
    '--deck-index': number;
};

const SCROLL_OFFSET = 150;

const ANIMATION_DURATION = 650;
const ANIMATION_STAGGER = 90;

export default function MobileProjectsDeck({ projects }: Props) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    const deckRef = useRef<HTMLDivElement | null>(null);
    const openButtonRef = useRef<HTMLButtonElement | null>(null);
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

    const prefersReducedMotion = () => {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    };

    const getDeckScrollTop = () => {
        if (!deckRef.current) return window.scrollY;

        const deckTop = deckRef.current.getBoundingClientRect().top + window.scrollY;

        return Math.max(0, deckTop - SCROLL_OFFSET);
    };

    const waitForNextFrame = () => {
        return new Promise<void>((resolve) => {
            requestAnimationFrame(() => resolve());
        });
    };

    const waitForScrollEnd = () => {
        return new Promise<void>((resolve) => {
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

            window.addEventListener('scroll', handleScroll, { passive: true });

            handleScroll();
        });
    };

    const animateLayoutChange = async (expanded: boolean) => {
        const cards = cardRefs.current.filter((card): card is HTMLDivElement => card !== null);

        if (prefersReducedMotion()) {
            setIsExpanded(expanded);
            return;
        }

        const firstRects = cards.map((card) => card.getBoundingClientRect());

        setIsExpanded(expanded);

        await waitForNextFrame();

        const lastRects = cards.map((card) => card.getBoundingClientRect());

        const animations = cards.map((card, index) => {
            const first = firstRects[index];
            const last = lastRects[index];

            const deltaX = first.left - last.left;
            const deltaY = first.top - last.top;

            const scaleX = first.width / last.width;
            const scaleY = first.height / last.height;

            return card.animate(
                [
                    {
                        transform: `translate(${deltaX}px, ${deltaY}px) scale(${scaleX}, ${scaleY})`,
                    },
                    {
                        transform: 'translate(0, 0) scale(1, 1)',
                    },
                ],
                {
                    duration: ANIMATION_DURATION,
                    delay: index * ANIMATION_STAGGER,
                    easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
                    fill: 'both',
                },
            );
        });

        await Promise.allSettled(animations.map((animation) => animation.finished));

        animations.forEach((animation) => animation.cancel());
    };

    const handleOpen = async () => {
        if (isAnimating) return;

        setIsAnimating(true);

        await animateLayoutChange(true);

        setIsAnimating(false);
    };

    const handleClose = async () => {
        if (isAnimating) return;

        setIsAnimating(true);

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

        setIsAnimating(false);

        requestAnimationFrame(() => {
            openButtonRef.current?.focus({
                preventScroll: true,
            });
        });
    };

    return (
        <div ref={deckRef} className={`${styles.mobileDeck} ${isExpanded ? styles.mobileDeckExpanded : ''}`} aria-busy={isAnimating}>
            <div id="mobile-projects-list" className={styles.mobileDeckCards}>
                {projects.map((project, index) => {
                    const cardStyle: DeckCardStyle = {
                        '--deck-index': index,
                    };

                    return (
                        <div
                            key={project.id}
                            ref={(element) => {
                                cardRefs.current[index] = element;
                            }}
                            className={styles.mobileDeckCard}
                            style={cardStyle}
                            inert={!isExpanded ? true : undefined}
                        >
                            <ProjectCard project={project} />
                        </div>
                    );
                })}
            </div>

            {!isExpanded && (
                <button
                    ref={openButtonRef}
                    type="button"
                    className={styles.mobileDeckButton}
                    aria-expanded="false"
                    aria-controls="mobile-projects-list"
                    disabled={isAnimating}
                    onClick={handleOpen}
                >
                    Explorar proyectos
                </button>
            )}

            {isExpanded && (
                <button
                    type="button"
                    className={styles.mobileDeckButton}
                    aria-expanded="true"
                    aria-controls="mobile-projects-list"
                    disabled={isAnimating}
                    onClick={handleClose}
                >
                    Cerrar proyectos
                </button>
            )}
        </div>
    );
}
