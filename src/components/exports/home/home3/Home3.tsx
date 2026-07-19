import styles from './home3.module.css';

import type { FeaturedProject } from '@/types/projects';

import ProjectCard from './ProjectCard';

type Props = {
    projects: FeaturedProject[];
};

export default function Home3({ projects }: Props) {
    return (
        <section className={styles.sectionContainer} aria-labelledby="projects-title">
            <div className={styles.container}>
                <header className={styles.header}>
                    <h2 id="projects-title">Proyectos destacados</h2>

                    <p>
                        Una selección de proyectos desarrollados para empresas y clientes reales, enfocados en rendimiento, experiencia de usuario y
                        resultados.
                    </p>
                </header>

                <div className={styles.projectsGrid}>
                    {projects.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>
            </div>
        </section>
    );
}
