'use client';

import { useMediaQuery } from '@/hooks/useMediaQuery';

import styles from './home2.module.css';

import { STARS } from './stars';
import { useConstellation } from './useConstellation';

export default function Home2() {
    const isDesktop = useMediaQuery('(min-width: 1200px)');

    const { phase, activeStarId, sliderRef, handleClick, handleScroll } = useConstellation();

    return (
        <section className={styles.sectionContainer} aria-labelledby="services-title">
            <h2 id="services-title" className={styles.visuallyHidden}>
                Servicios digitales
            </h2>

            <div className={styles.constelacionContainer} data-phase={phase}>
                <svg className={styles.constelacionLineas} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
                    <line x1="25" y1={isDesktop ? '10' : '20'} x2={isDesktop ? '60' : '65'} y2={isDesktop ? '35' : '40'} />
                    <line x1={isDesktop ? '60' : '65'} y1={isDesktop ? '35' : '40'} x2="35" y2={isDesktop ? '70' : '60'} />
                    <line x1="35" y1={isDesktop ? '70' : '60'} x2={isDesktop ? '75' : '70'} y2={isDesktop ? '95' : '80'} />
                </svg>

                {STARS.map((star, index) => {
                    const isActive = activeStarId === star.id;

                    return (
                        <div
                            key={star.id}
                            className={`${styles.estrellaContainer} ${styles[`estrellaContainer${index + 1}`]} ${isActive ? styles.activeStar : ''}`}
                            data-link={star.dataLink}
                        >
                            <div className={styles.estrellaInner}>
                                <button
                                    type="button"
                                    className={styles.estrella}
                                    onClick={() => handleClick(star.id)}
                                    aria-label={`Seleccionar ${star.title}`}
                                    aria-pressed={isActive && phase === 'content' ? 'true' : undefined}
                                ></button>
                                <h3>{star.title}</h3>
                            </div>
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
