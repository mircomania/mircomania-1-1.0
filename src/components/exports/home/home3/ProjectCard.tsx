import Image from 'next/image';

import styles from './home3.module.css';

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
                sizes="(max-width: 1199px) 100vw, 50vw"
                className={styles.cardImage}
            />

            <div className={styles.cardContent}>
                <span className={styles.cardYear}>{project.project_year}</span>

                <h3>{project.title}</h3>

                <p>{project.summary}</p>

                <ul className={styles.stack}>
                    {project.stack.map((tech) => (
                        <li key={tech}>{tech}</li>
                    ))}
                </ul>
            </div>
        </article>
    );
}
