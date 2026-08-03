import ContactForm from '@/components/exports/form/ContactForm';
import DesktopParticlePlanet from './DesktopParticlePlanet';

import styles from './home5.module.css';

export default function Home5() {
    return (
        <section className={styles.sectionContainer} aria-labelledby="contact-title">
            <div className={styles.sectionContent}>
                <div className={styles.presentationContainer}>
                    <div className={styles.textContainer}>
                        <h2 id="contact-title">¿Construimos algo juntos?</h2>

                        <p>Si tienes una idea, un proyecto o simplemente quieres conversar, estaré encantado de leer tu mensaje.</p>

                        <ul aria-label="Áreas de colaboración">
                            <li>Proyectos web</li>
                            <li>Automatizaciones</li>
                            <li>Marketing digital</li>
                            <li>Analítica web</li>
                        </ul>
                    </div>

                    <div className={styles.planetContainer} aria-hidden="true">
                        <DesktopParticlePlanet />
                    </div>
                </div>

                <div className={styles.formContainer}>
                    <ContactForm />
                </div>
            </div>
        </section>
    );
}
