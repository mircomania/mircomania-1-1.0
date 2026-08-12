'use client';

import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, MouseEvent } from 'react';

import styles from './home3.module.css';

import type { FeaturedProject } from '@/types/projects';

import ProjectCard from './ProjectCard';

type Props = Readonly<{
    projects: readonly FeaturedProject[];
}>;

type StackCardStyle = CSSProperties & {
    '--stack-index': number;
};

export default function MobileProjectsStack({ projects }: Props) {
    const [activeIndex, setActiveIndex] = useState(0);
    const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const visibleEntries = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);

                const currentEntry = visibleEntries[0];

                if (!currentEntry) return;

                const index = Number((currentEntry.target as HTMLElement).dataset.index);

                setActiveIndex(index);
            },
            {
                rootMargin: '-35% 0px -55% 0px',
                threshold: [0, 0.25, 0.5, 0.75, 1],
            },
        );

        stepRefs.current.forEach((step) => {
            if (step) observer.observe(step);
        });

        return () => observer.disconnect();
    }, []);

    const goToProject = (index: number) => {
        const step = stepRefs.current[index];

        if (!step) return;

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        step.scrollIntoView({
            behavior: prefersReducedMotion ? 'auto' : 'smooth',
            block: 'center',
        });
    };

    const handleCardClick = (event: MouseEvent<HTMLDivElement>, index: number) => {
        if ((event.target as HTMLElement).closest('a')) return;

        goToProject(index);
    };

    return (
        <div className={styles.mobileStack}>
            <div className={styles.mobileStackStage}>
                {projects.map((project, index) => {
                    const cardStyle: StackCardStyle = {
                        '--stack-index': index,
                    };

                    const isVisible = index <= activeIndex;

                    return (
                        <div
                            key={project.id}
                            className={`${styles.mobileStackCard} ${isVisible ? styles.mobileStackCardVisible : ''}`}
                            style={cardStyle}
                            aria-hidden={!isVisible}
                            inert={!isVisible ? true : undefined}
                            onClick={(event) => handleCardClick(event, index)}
                        >
                            <ProjectCard project={project} />
                        </div>
                    );
                })}
            </div>

            <div className={styles.mobileStackSteps} aria-hidden="true">
                {projects.map((project, index) => (
                    <div
                        key={project.id}
                        ref={(element) => {
                            stepRefs.current[index] = element;
                        }}
                        data-index={index}
                        className={styles.mobileStackStep}
                    />
                ))}
            </div>
        </div>
    );
}
