import styles from './home3.module.css';

export default function ProjectsLoadError() {
    return (
        <section className={styles.sectionContainer} aria-label="Proyectos destacados">
            <p className={styles.projectsLoadError} role="status">
                No pudimos cargar los proyectos. Recarga la página o inténtalo más tarde.
            </p>
        </section>
    );
}
