import ContactForm from '@/components/exports/form/ContactForm';
import DesktopParticlePlanet from '@/components/visuals/particlePlanet/DesktopParticlePlanet';

import styles from './contact1.module.css';

export default function Contact1() {
    return (
        <section className={styles.sectionContainer} aria-labelledby="contact-title">
            <div className={styles.sectionContent}>
                <div className={styles.presentationContainer}>
                    <div className={styles.textContainer}>
                        <h1 id="contact-title">HABLEMOS DE TU PROYECTO</h1>

                        <p>
                            Cuéntame qué necesitas, en qué etapa se encuentra tu proyecto y qué quieres conseguir. Revisaré tu mensaje y te responderé
                            personalmente.
                        </p>
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
