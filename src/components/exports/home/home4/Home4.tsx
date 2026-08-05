import styles from './home4.module.css';
import Star from '@/assets/icons/Star';

import ButtonLink from '@/utils/ButtonLink';

export default function Home4() {
    return (
        <section className={styles.sectionContainer} aria-labelledby="cv-title">
            <Star className={styles.star} />

            <div className={styles.heading}>
                <h2 id="cv-title">¿Buscas desarrollador?</h2>

                <p>Revisa mi experiencia profesional, tecnologías y trayectoria en detalle.</p>
            </div>

            <ButtonLink href="/documents/mirco-rodriguez-cv-es-2026.pdf" variant="primary">
                Abrir CV
            </ButtonLink>
        </section>
    );
}
