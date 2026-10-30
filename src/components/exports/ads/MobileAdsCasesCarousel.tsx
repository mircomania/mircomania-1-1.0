'use client';

import type { ReactNode } from 'react';

import { useMobileAdsCasesCarousel } from './useMobileAdsCasesCarousel';
import styles from './ads.module.css';

export default function MobileAdsCasesCarousel({ slides }: Readonly<{ slides: ReactNode[] }>) {
    const { isMobile, looping, trackRef, activeIndex } = useMobileAdsCasesCarousel(slides.length);

    return (
        <>
            <div
                ref={trackRef}
                className={`${styles.casesGrid} ${styles.carouselTrack}`}
                role={looping ? 'region' : undefined}
                aria-roledescription={looping ? 'carrusel' : undefined}
                aria-label={looping ? 'Casos de publicidad. Usa las flechas izquierda y derecha para explorar.' : undefined}
                tabIndex={looping ? 0 : undefined}
            >
                {looping && <div className={styles.carouselSlide} aria-hidden="true" inert>{slides[slides.length - 1]}</div>}
                {slides.map((slide, index) => (
                    <div
                        className={styles.carouselSlide}
                        key={index}
                        data-ads-slide={index}
                        role={isMobile ? 'group' : undefined}
                        aria-roledescription={isMobile ? 'diapositiva' : undefined}
                        aria-label={isMobile ? `Caso ${index + 1} de ${slides.length}` : undefined}
                    >
                        {slide}
                    </div>
                ))}
                {looping && <div className={styles.carouselSlide} aria-hidden="true" inert>{slides[0]}</div>}
            </div>
            {looping && (
                <>
                    <div className={styles.carouselIndicators} aria-hidden="true">
                        {slides.map((_, index) => <span key={index} data-active={index === activeIndex} />)}
                    </div>
                    <p className={styles.carouselStatus} role="status" aria-live="polite" aria-atomic="true">
                        Caso {activeIndex + 1} de {slides.length}
                    </p>
                </>
            )}
        </>
    );
}
