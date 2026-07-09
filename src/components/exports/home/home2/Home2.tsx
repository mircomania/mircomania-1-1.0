'use client';

import { useMediaQuery } from '@/hooks/useMediaQuery';

import styles from './home2.module.css';

import { STARS } from './stars';
import { useConstellation } from './useConstellation';

export default function Home2() {
    const isMovile = useMediaQuery('(max-width: 1199px)');

    const { phase, activeStarId, sliderRef, handleClick, handleScroll } = useConstellation();

    return (
        <section className={styles.sectionContainer} aria-labelledby="services-title">
            <h2 id="services-title" className={styles.visuallyHidden}>
                Servicios digitales
            </h2>

            <div className={styles.constelacionContainer} data-phase={phase}>
                <svg className={styles.constelacionLineas} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
                    <line x1={isMovile ? '25' : '25'} y1={isMovile ? '20' : '10'} x2={isMovile ? '65' : '60'} y2={isMovile ? '40' : '35'} />
                    <line x1={isMovile ? '65' : '60'} y1={isMovile ? '40' : '35'} x2={isMovile ? '35' : '35'} y2={isMovile ? '60' : '70'} />
                    <line x1={isMovile ? '35' : '35'} y1={isMovile ? '60' : '70'} x2={isMovile ? '70' : '75'} y2={isMovile ? '80' : '95'} />
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
