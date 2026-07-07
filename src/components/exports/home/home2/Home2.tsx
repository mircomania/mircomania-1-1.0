'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './home2.module.css';

import { STARS } from './stars';

type Phase = 'map' | 'hideLabels' | 'aligning' | 'content';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function Home2() {
    const [phase, setPhase] = useState<Phase>('map');
    const [activeStarId, setActiveStarId] = useState<number | null>(null);

    const sliderRef = useRef<HTMLDivElement>(null);
    const ignoreScrollRef = useRef(false);
    const initialStarRef = useRef<number | null>(null);

    const isDesktop = () => window.innerWidth >= 1200;

    const goToSlide = (id: number) => {
        const slider = sliderRef.current;
        const index = STARS.findIndex((star) => star.id === id);

        if (!slider || index === -1) return;

        ignoreScrollRef.current = true;

        slider.scrollTo({
            left: isDesktop() ? 0 : slider.clientWidth * index,
            top: isDesktop() ? slider.clientHeight * index : 0,
            behavior: 'smooth',
        });

        setActiveStarId(id);

        window.setTimeout(() => {
            ignoreScrollRef.current = false;
        }, 500);
    };

    const handleClick = async (id: number) => {
        if (phase === 'content') {
            goToSlide(id);
            return;
        }

        if (phase !== 'map') return;

        setActiveStarId(id);
        initialStarRef.current = id;
        setPhase('hideLabels');

        await wait(450);

        setPhase('aligning');

        await wait(1500);

        setPhase('content');
    };

    useEffect(() => {
        if (phase !== 'content') return;
        if (initialStarRef.current === null) return;

        const slider = sliderRef.current;
        const index = STARS.findIndex((star) => star.id === initialStarRef.current);

        if (!slider || index === -1) return;

        ignoreScrollRef.current = true;

        requestAnimationFrame(() => {
            if (isDesktop()) {
                slider.scrollTop = slider.clientHeight * index;
            } else {
                slider.scrollLeft = slider.clientWidth * index;
            }

            window.setTimeout(() => {
                ignoreScrollRef.current = false;
            }, 100);
        });
    }, [phase]);

    const handleScroll = () => {
        if (ignoreScrollRef.current) return;

        const slider = sliderRef.current;
        if (!slider) return;

        const currentIndex = isDesktop() ? Math.round(slider.scrollTop / slider.clientHeight) : Math.round(slider.scrollLeft / slider.clientWidth);

        const currentStar = STARS[currentIndex];

        if (currentStar) {
            setActiveStarId(currentStar.id);
        }
    };

    return (
        <section className={styles.sectionContainer}>
            <div className={styles.constelacionContainer} data-phase={phase}>
                <svg className={styles.constelacionLineas} viewBox="0 0 100 100" preserveAspectRatio="none">
                    <line x1="25" y1="20" x2="65" y2="40" />
                    <line x1="65" y1="40" x2="35" y2="60" />
                    <line x1="35" y1="60" x2="70" y2="80" />
                </svg>

                {STARS.map((star, index) => {
                    const isActive = activeStarId === star.id;

                    return (
                        <div
                            key={star.id}
                            className={`${styles.estrellaContainer} ${styles[`estrellaContainer${index + 1}`]} ${isActive ? styles.activeStar : ''}`}
                            onClick={() => handleClick(star.id)}
                        >
                            <div className={styles.estrella}></div>
                            <h3>{star.title}</h3>
                        </div>
                    );
                })}

                {phase === 'content' && (
                    <div ref={sliderRef} className={styles.sliderMobile} onScroll={handleScroll}>
                        {STARS.map((star) => (
                            <article key={star.id} className={styles.slideCard}>
                                <h3>{star.title}</h3>
                                <p>{star.text}</p>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
