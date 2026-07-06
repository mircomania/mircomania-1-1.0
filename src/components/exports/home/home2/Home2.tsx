'use client';

import { useState, useRef } from 'react';
import styles from './home2.module.css';

const MOBILE_STARS = [
    {
        id: 1,
        label: 'Sitios Web',
        position: { top: '10%', left: '50%' },
        x: '50%',
        y: '10%',
        desc: 'Desarrollo de aplicaciones web modernas, rápidas y optimizadas para SEO utilizando el stack más eficiente del mercado.',
    },
    {
        id: 2,
        label: 'Automatizaciones',
        position: { top: '35%', left: '30%' },
        x: '30%',
        y: '35%',
        desc: 'Optimización de tiempos mediante flujos de trabajo automatizados con n8n, conectando tus herramientas diarias.',
    },
    {
        id: 3,
        label: 'Marketing Digital',
        position: { top: '55%', left: '70%' },
        x: '70%',
        y: '55%',
        desc: 'Estrategias de conversión de alto impacto mediante campañas en Google Ads y Meta Ads orientadas a resultados reales.',
    },
    {
        id: 4,
        label: 'Analítica',
        position: { top: '90%', left: '40%' },
        x: '40%',
        y: '90%',
        desc: 'Medición avanzada con Google Analytics para entender el comportamiento de tus usuarios y tomar decisiones basadas en datos.',
    },
];

export default function Home2() {
    const [activeStarId, setActiveStarId] = useState<number | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const handleStarClick = (id: number) => {
        setActiveStarId(id);
        const container = scrollContainerRef.current;
        if (container) {
            const targetElement = container.querySelector(`[data-card-id="${id}"]`);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                    inline: 'center',
                });
            }
        }
    };

    const handleScroll = () => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const children = Array.from(container.children) as HTMLElement[];

        const isDesktop = window.innerWidth >= 1200;

        let currentActiveId = activeStarId;
        let closestDistance = Infinity;

        const containerCenter = isDesktop
            ? container.getBoundingClientRect().top + container.offsetHeight / 2
            : container.getBoundingClientRect().left + container.offsetWidth / 2;

        children.forEach((child) => {
            const rect = child.getBoundingClientRect();

            const childCenter = isDesktop ? rect.top + rect.height / 2 : rect.left + rect.width / 2;

            const distance = Math.abs(containerCenter - childCenter);

            if (distance < closestDistance) {
                closestDistance = distance;
                const idAttr = child.getAttribute('data-card-id');
                if (idAttr) currentActiveId = parseInt(idAttr, 10);
            }
        });

        if (currentActiveId !== activeStarId && currentActiveId !== null) {
            setActiveStarId(currentActiveId);
        }
    };

    return (
        <section className={styles.sectionContainer}>
            <div className={styles.constellationContainer} data-view={activeStarId ? 'detail' : 'map'}>
                {!activeStarId && (
                    <svg className={styles.svgCanvas}>
                        <line x1={MOBILE_STARS[0].x} y1={MOBILE_STARS[0].y} x2={MOBILE_STARS[1].x} y2={MOBILE_STARS[1].y} />
                        <line x1={MOBILE_STARS[1].x} y1={MOBILE_STARS[1].y} x2={MOBILE_STARS[2].x} y2={MOBILE_STARS[2].y} />
                        <line x1={MOBILE_STARS[2].x} y1={MOBILE_STARS[2].y} x2={MOBILE_STARS[3].x} y2={MOBILE_STARS[3].y} />
                    </svg>
                )}

                <div className={styles.starsRow}>
                    {MOBILE_STARS.map((star) => {
                        const isSelected = activeStarId === star.id;
                        return (
                            <div
                                key={star.id}
                                className={`${styles.starNode} ${isSelected ? styles.selectedNode : ''}`}
                                style={!activeStarId ? star.position : undefined}
                                onClick={() => handleStarClick(star.id)}
                            >
                                <div className={styles.starPoint} />
                                <h3>{star.label}</h3>
                            </div>
                        );
                    })}
                </div>

                {activeStarId && (
                    <div className={styles.infoScrollWrapper} ref={scrollContainerRef} onScroll={handleScroll}>
                        {MOBILE_STARS.map((star) => (
                            <div key={star.id} className={styles.infoContentCard} data-card-id={star.id}>
                                <h3>{star.label}</h3>
                                <p>{star.desc}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
