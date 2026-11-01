import ContactForm from '@/components/exports/form/ContactForm';
import DesktopParticlePlanet from '@/components/visuals/particlePlanet/DesktopParticlePlanet';

import type { ContactType } from '@/types/contact';

import styles from './contact1.module.css';

type Props = {
    initialContactType: ContactType | '';
};

export default function Contact1({ initialContactType }: Readonly<Props>) {
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
                    <ContactForm key={initialContactType} initialContactType={initialContactType} />
                </div>
            </div>
        </section>
    );
}
