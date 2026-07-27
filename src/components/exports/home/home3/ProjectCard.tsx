import Image from 'next/image';

import styles from './home3.module.css';

import { projectTypeLabels } from '@/types/projects';
import type { FeaturedProject } from '@/types/projects';

import { getProjectCover } from '@/services/projects/getProjectCover';
import { getPublicMediaUrl } from '@/lib/supabase/getPublicMediaUrl';

type Props = {
    project: FeaturedProject;
};

export default function ProjectCard({ project }: Props) {
    const desktopCover = getProjectCover(project, 'desktop');

    if (!desktopCover || desktopCover.width === null || desktopCover.height === null) {
        return null;
    }

    return (
        <article className={styles.card}>
            <Image
                src={getPublicMediaUrl(desktopCover.storage_path)}
                alt={desktopCover.alt_text}
                width={desktopCover.width}
                height={desktopCover.height}
                sizes="(max-width: 1199px) 100vw, 360px"
                className={styles.cardImage}
            />

            <div className={styles.cardContent}>
                <div className={styles.cardMeta}>
                    <span>{projectTypeLabels[project.project_type]}</span>
                    <span aria-hidden="true">•</span>
                    <span>{project.project_year}</span>
                </div>

                <h3>{project.title}</h3>

                <p className={styles.cardSummary}>{project.summary}</p>

                <p className={styles.stack}>{project.stack.join(' • ')}</p>

                {(project.demo_url || project.repository_url) && (
                    <div className={styles.cardActions}>
                        {project.demo_url && (
                            <a href={project.demo_url} target="_blank" rel="noopener noreferrer" draggable={false}>
                                Ver proyecto
                            </a>
                        )}

                        {project.repository_url && (
                            <a href={project.repository_url} target="_blank" rel="noopener noreferrer" draggable={false}>
                                Repositorio
                            </a>
                        )}
                    </div>
                )}
            </div>
        </article>
    );
}
