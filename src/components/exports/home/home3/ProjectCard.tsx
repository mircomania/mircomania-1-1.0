import Image from 'next/image';

import styles from './home3.module.css';

import { projectTypeLabels } from '@/types/projects';
import type { FeaturedProjectCard } from '@/types/projects';

import ButtonLink from '@/utils/ButtonLink';

type Props = {
    project: FeaturedProjectCard;
};

export default function ProjectCard({ project }: Readonly<Props>) {
    return (
        <article className={styles.card}>
            <Image
                src={project.cover.src}
                alt={project.cover.alt}
                width={project.cover.width}
                height={project.cover.height}
                sizes="(max-width: 1199px) 100vw, 360px"
                className={styles.cardImage}
            />

            <div className={styles.cardContent}>
                <div className={styles.cardMeta}>
                    <span>{projectTypeLabels[project.projectType]}</span>
                    <span aria-hidden="true">•</span>
                    <span>{project.projectYear}</span>
                </div>

                <h3>{project.title}</h3>

                <p className={styles.cardSummary}>{project.summary}</p>

                <p className={styles.stack}>{project.stack.join(' • ')}</p>

                {(project.demoUrl || project.repositoryUrl) && (
                    <div className={styles.cardActions}>
                        {project.demoUrl && (
                            <ButtonLink href={project.demoUrl} variant="secondary" dataLink={`"proyectos-demo-link-"${project.slug}`}>
                                Ver proyecto
                            </ButtonLink>
                        )}

                        {project.repositoryUrl && (
                            <ButtonLink href={project.repositoryUrl} variant="secondary" dataLink={`"proyectos-github-link-"${project.slug}`}>
                                Repositorio
                            </ButtonLink>
                        )}
                    </div>
                )}
            </div>
        </article>
    );
}
