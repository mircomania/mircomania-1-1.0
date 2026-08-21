import styles from './home3.module.css';

export default function ProjectsLoadError() {
    return (
        <section className={styles.sectionContainer} aria-label="Proyectos destacados">
            <output className={styles.projectsLoadError}>
                No pudimos cargar los proyectos. <br />
                Inténtalo más tarde.
            </output>
        </section>
    );
}
