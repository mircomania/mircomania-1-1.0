import type { PublishedAdsCase } from '@/types/ads';

import AdsCaseCard from './AdsCaseCard';
import styles from './ads.module.css';

export default function AdsCases({ cases, loadFailed }: Readonly<{ cases: PublishedAdsCase[]; loadFailed: boolean }>) {
    return (
        <section id="casos-estudio" className={`${styles.section} programmatic-focus-target`} aria-labelledby="ads-cases-title" tabIndex={-1}>
            <header className={styles.sectionHeader}>
                <p className={styles.eyebrow}>Experiencia real</p>
                <h2 id="ads-cases-title">Estrategia que se puede medir.</h2>
                <p>Cada negocio tiene su contexto. Los datos cuentan una parte; entender qué significan permite tomar mejores decisiones.</p>
            </header>
            {loadFailed ? (
                <div className={styles.catalogState}>
                    <p className={styles.eyebrow}>Casos de estudio</p>
                    <h3>El catálogo no está disponible en este momento.</h3>
                    <p>Inténtalo más tarde. También podemos conversar sobre los objetivos de tu proyecto.</p>
                </div>
            ) : cases.length > 0 ? (
                <div className={styles.casesGrid}>
                    {cases.map((study) => <AdsCaseCard key={study.id} study={study} />)}
                </div>
            ) : (
                <div className={styles.catalogState}>
                    <p className={styles.eyebrow}>Cada resultado necesita contexto</p>
                    <h3>Los próximos casos de estudio están en preparación.</h3>
                    <p>Conocer el punto de partida, las decisiones y el período analizado es tan importante como ver una cifra. Conversemos sobre tu negocio mientras preparamos los estudios completos.</p>
                </div>
            )}
        </section>
    );
}
