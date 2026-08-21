'use client';

import type { CSSProperties } from 'react';

import styles from './home3.module.css';

import type { FeaturedProjectCard } from '@/types/projects';

import ProjectCard from './ProjectCard';
import useMobileProjectsDeck from './useMobileProjectsDeck';

type Props = Readonly<{
    projects: readonly FeaturedProjectCard[];
}>;

type DeckCardStyle = CSSProperties & {
    '--deck-index': number;
};

export default function MobileProjectsDeck({ projects }: Props) {
    const { isExpanded, isAnimating, deckRef, toggleButtonRef, setCardRef, handleOpen, handleClose } = useMobileProjectsDeck();

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
                                setCardRef(index, element);
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

            <button
                ref={toggleButtonRef}
                type="button"
                className={styles.mobileDeckButton}
                aria-expanded={isExpanded}
                aria-controls="mobile-projects-list"
                disabled={isAnimating}
                onClick={(event) => {
                    if (isExpanded) {
                        void handleClose();
                        return;
                    }

                    void handleOpen(event.detail === 0);
                }}
            >
                {isExpanded ? 'Cerrar proyectos' : 'Explorar proyectos'}
            </button>
        </div>
    );
}
