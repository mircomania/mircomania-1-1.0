import AdsCases from '@/components/exports/ads/AdsCases';
import styles from '@/components/exports/ads/ads.module.css';
import { ROUTES } from '@/constants/routes';
import { getPublishedAdsCases } from '@/services/ads/getPublishedAdsCases';
import type { PublishedAdsCase } from '@/types/ads';
import { createMetadata } from '@/utils/createMetadata';
import { SmartLink } from '@/utils/SmartLink';
import StarryBackground from '@/utils/starryBackground/StarryBackground';

export const metadata = createMetadata({
    title: 'Publicidad digital',
    description:
        'Campañas de Google Ads, medición y optimización web para conectar tu negocio con las personas adecuadas. Estrategia y resultados con contexto.',
    path: ROUTES.ads,
});

export const revalidate = 3600;

const contactHref = `${ROUTES.contact}?servicio=marketing`;
const services = [
    {
        number: '01',
        title: 'Google Search',
        description:
            'Conecta con personas que ya buscan lo que ofreces. Palabras clave, anuncios y una estructura alineada con la intención de búsqueda.',
    },
    {
        number: '02',
        title: 'Performance Max',
        description:
            'Amplía el alcance de tus campañas en los canales de Google, con señales, recursos creativos y objetivos de conversión bien definidos.',
    },
    {
        number: '03',
        title: 'Medición y optimización web',
        description:
            'Comprende qué pasa después del clic. Medición de conversiones y mejoras en la experiencia web para tomar decisiones con más contexto.',
    },
];
const steps = [
    { title: 'Diagnóstico', description: 'Entender tu negocio, tus objetivos y el estado de tus campañas y medición.' },
    { title: 'Implementación', description: 'Definir la estructura, configurar conversiones y poner en marcha la estrategia.' },
    { title: 'Optimización', description: 'Analizar señales, ajustar campañas y mejorar la experiencia después del clic.' },
    { title: 'Seguimiento', description: 'Revisar resultados contigo y acordar los siguientes pasos con información clara.' },
];

export default async function AdsPage() {
    let cases: PublishedAdsCase[] = [];
    let loadFailed = false;
    try {
        cases = await getPublishedAdsCases();
    } catch {
        loadFailed = true;
    }

    return (
        <main className={`space-main ${styles.main}`}>
            <div className={styles.background} aria-hidden="true">
                <StarryBackground />
            </div>
            <section className={`${styles.section} ${styles.hero}`} aria-labelledby="ads-title">
                <div className={styles.heroCopy}>
                    <p className={styles.eyebrow}>
                        <span className={styles.signal} aria-hidden="true" /> Publicidad digital · Google Ads
                    </p>
                    <h1 id="ads-title">
                        Menos clics vacíos.
                        <br />
                        <span>Más oportunidades.</span>
                    </h1>
                    <p className={styles.intro}>
                        Campañas publicitarias orientadas a resultados medibles. Estrategia, optimización y tecnología para conectar tu negocio con
                        las personas adecuadas.
                    </p>
                    <div className={styles.actions}>
                        <SmartLink href={contactHref} className={`button-link button-link--primary ${styles.link}`}>
                            Solicitar evaluación <span aria-hidden="true">↗</span>
                        </SmartLink>
                        <SmartLink href={`${ROUTES.ads}#casos-estudio`} className={`button-link button-link--secondary ${styles.link}`}>
                            Explorar casos <span aria-hidden="true">↓</span>
                        </SmartLink>
                    </div>
                </div>
                <div className={styles.indicators}>
                    <div className={styles.orbit} aria-hidden="true">
                        <span />
                    </div>
                    <div className={styles.indicatorContent}>
                        <p className={styles.eyebrow}>Una mirada a los datos</p>
                        <p className={styles.period}>
                            <time dateTime="2026-09-27">27 de septiembre</time>–<time dateTime="2026-10-26">26 de octubre de 2026</time>
                        </p>
                        <dl className={styles.heroMetrics}>
                            <div>
                                <dt>Conversiones registradas</dt>
                                <dd>6.775</dd>
                            </div>
                            <div>
                                <dt>Por conversión</dt>
                                <dd>
                                    $16,34 <span>MXN</span>
                                </dd>
                            </div>
                            <div>
                                <dt>Leads útiles reportados</dt>
                                <dd>
                                    72,8<span>%</span>
                                </dd>
                            </div>
                        </dl>
                        <p className={styles.metricNote}>
                            Datos históricos. Las conversiones registradas son acciones medidas; no equivalen a ventas. Los leads útiles reportados
                            reflejan calidad de contacto, no cierres comerciales.
                        </p>
                    </div>
                </div>
            </section>

            <section className={styles.section} aria-labelledby="ads-services-title">
                <header className={styles.sectionHeader}>
                    <p className={styles.eyebrow}>Servicios</p>
                    <h2 id="ads-services-title">Publicidad que funciona con tu negocio.</h2>
                    <p>Desde la búsqueda hasta la experiencia en tu sitio: una estrategia conectada con tus objetivos.</p>
                </header>
                <div className={styles.servicesGrid}>
                    {services.map((service) => (
                        <article className={styles.serviceCard} key={service.number}>
                            <span className={styles.serviceNumber} aria-hidden="true">
                                {service.number} /
                            </span>
                            <h3>{service.title}</h3>
                            <p>{service.description}</p>
                        </article>
                    ))}
                </div>
            </section>

            <AdsCases cases={cases} loadFailed={loadFailed} />

            <section className={styles.section} aria-labelledby="ads-method-title">
                <header className={styles.sectionHeader}>
                    <p className={styles.eyebrow}>Metodología</p>
                    <h2 id="ads-method-title">Datos, decisiones y mejora continua.</h2>
                </header>
                <ol className={styles.steps}>
                    {steps.map((step, index) => (
                        <li key={step.title}>
                            <span className={styles.stepNumber} aria-hidden="true">
                                0{index + 1}
                            </span>
                            <h3>{step.title}</h3>
                            <p>{step.description}</p>
                        </li>
                    ))}
                </ol>
            </section>

            <section className={`${styles.section} ${styles.tools}`} aria-labelledby="ads-tools-title">
                <header className={styles.sectionHeader}>
                    <p className={styles.eyebrow}>Herramientas</p>
                    <h2 id="ads-tools-title">Tecnología al servicio de la estrategia.</h2>
                    <p>Un ecosistema para activar campañas, medir lo que importa y entender los resultados.</p>
                </header>
                <ul className={styles.toolList}>
                    {['Google Ads', 'Google Analytics 4', 'Google Tag Manager', 'Looker Studio', 'Google Search Console'].map((tool) => (
                        <li key={tool}>{tool}</li>
                    ))}
                </ul>
            </section>

            <section className={`${styles.section} ${styles.finalCta}`} aria-labelledby="ads-contact-title">
                <span className={styles.ctaStar} aria-hidden="true">
                    ✦
                </span>
                <p className={styles.eyebrow}>El siguiente paso</p>
                <h2 id="ads-contact-title">Tu siguiente cliente puede estar buscándote.</h2>
                <p>Cuéntame sobre tu proyecto y evaluemos qué estrategia tiene sentido para tu negocio.</p>
                <SmartLink href={contactHref} className={`button-link button-link--primary ${styles.link}`}>
                    Hablemos de tu proyecto <span aria-hidden="true">↗</span>
                </SmartLink>
            </section>
        </main>
    );
}
