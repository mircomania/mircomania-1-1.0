import ButtonLink from '@/utils/ButtonLink';

import { SOCIAL_LINKS } from '@/constants/routes';

import styles from './home4.module.css';
import Star from '@/assets/icons/Star';

export default function Home4() {
    return (
        <section className={styles.sectionContainer} aria-labelledby="cv-title">
            <Star className={styles.star} />

            <div className={styles.heading}>
                <h2 id="cv-title">¿Buscas desarrollador?</h2>

                <p>Revisa mi experiencia profesional, tecnologías y trayectoria en detalle.</p>
            </div>

            <ButtonLink href={SOCIAL_LINKS.cv} variant="primary">
                Abrir CV
            </ButtonLink>
        </section>
    );
}
