import type { Metadata } from 'next';

import Star from '@/assets/icons/Star';
import MonthlyCpaChart from '@/components/exports/ads/mejoravit/MonthlyCpaChart';
import styles from '@/components/exports/ads/mejoravit/mejoravit.module.css';
import { ROUTES, SOCIAL_LINKS } from '@/constants/routes';
import {
    formatConversions,
    formatMxn,
    formatReportedPercentage,
    formatWholeNumber,
    mejoravitCommercialReport,
    mejoravitHistory,
} from '@/data/ads/mejoravit';
import { createMetadata } from '@/utils/createMetadata';
import { SmartLink } from '@/utils/SmartLink';
import StarryBackground from '@/utils/starryBackground/StarryBackground';

const pageMetadata = createMetadata({
    title: 'Mejoravit: evolución de una estrategia de Google Ads',
    description:
        'Caso de experiencia profesional en PRO Consultores: 17 meses de captación con Google Ads, evolución mensual del CPA y comparación de Search y Performance Max con contexto.',
    path: ROUTES.adsMejoravit,
});

export const metadata: Metadata = {
    ...pageMetadata,
    openGraph: {
        ...pageMetadata.openGraph,
        images: [{ url: '/opengraph-image.png', width: 1200, height: 630, alt: 'Mircomania — Software Developer' }],
    },
    twitter: {
        ...pageMetadata.twitter,
        images: [{ url: '/twitter-image.png', alt: 'Mircomania — Software Developer' }],
    },
};

const stages = [
    {
        period: 'Junio 2025 – junio 2026',
        title: 'Consolidación',
        text: 'El proyecto comenzó con campañas de Google Search, probando diferentes configuraciones y enfoques para identificar las estrategias más efectivas de captación.',
        evidence:
            'Se trabajó en segmentaciones geográficas, horarios de publicación, palabras clave, términos negativos, anuncios y estrategias de puja. Los resultados permitieron ajustar progresivamente las campañas y ampliar los enfoques que mostraban mejor desempeño.',
    },
    {
        period: 'Julio – agosto 2026',
        title: 'Reestructuración',
        text: 'La operación se adaptó a nuevas páginas web y páginas de destino, reorganizando las campañas para responder a los cambios del proyecto y mejorar la experiencia de captación.',
        evidence:
            'Los aprendizajes obtenidos mediante Search ayudaron a orientar mejoras en el diseño, la experiencia de usuario y los formularios. Las campañas se ajustaron a las nuevas páginas y a las necesidades de la operación.',
    },
    {
        period: 'Septiembre – octubre 2026, parcial',
        title: 'Diversificación',
        text: 'Con la nueva estructura de campañas Search consolidada, se incorporó Performance Max para ampliar las oportunidades de captación y complementar la estrategia existente.',
        evidence:
            'Se desarrollaron nuevas campañas para diferentes zonas geográficas, combinando ambos formatos. En la comparación documentada de octubre, Performance Max registró un menor costo por conversión que Search dentro de las campañas Mi Cuenta analizadas.',
    },
];

export default function MejoravitPage() {
    const { totals, period, comparison } = mejoravitHistory;
    const quality = mejoravitCommercialReport;

    return (
        <main className={`space-main ${styles.main}`}>
            <div className={styles.background} aria-hidden="true">
                <StarryBackground />
            </div>
            <section className={`${styles.section} ${styles.hero}`} aria-labelledby="mejoravit-title">
                <SmartLink href={ROUTES.ads} className={styles.backLink}>
                    <span aria-hidden="true">←</span> Volver a publicidad digital
                </SmartLink>
                <p className={styles.eyebrow}>Caso de estudio · Google Ads · México</p>
                <h1 id="mejoravit-title">
                    Mejoravit<span aria-hidden="true">.</span>
                </h1>
                <p className={styles.subtitle}>De campañas de búsqueda a una estrategia de captación diversificada.</p>
                <p className={styles.heroIntro}>
                    Un proyecto de generación de clientes potenciales que evolucionó mediante campañas de Google Search, optimización de páginas web y
                    la incorporación de Performance Max.
                </p>
                <p className={styles.professionalContext}>
                    Experiencia profesional desarrollada en <strong>PRO Consultores</strong> (México).
                </p>
                <dl className={styles.heroMetrics}>
                    <div>
                        <dt>Conversiones registradas</dt>
                        <dd>{formatWholeNumber(totals.conversions)}</dd>
                    </div>
                    <div>
                        <dt>Costo por conversión</dt>
                        <dd>{formatMxn(totals.costPerConversion)}</dd>
                    </div>
                    <div>
                        <dt>Período analizado</dt>
                        <dd>
                            {period.calendarMonths}
                            <span> meses</span>
                        </dd>
                    </div>
                </dl>
                <p className={styles.metricNote}>
                    Junio de 2025 – octubre de 2026, con octubre parcial. Las conversiones registradas no equivalen a ventas.
                </p>
            </section>

            <section className={`${styles.section} ${styles.context}`} aria-labelledby="mejoravit-context-title">
                <header>
                    <p className={styles.eyebrow}>01 / Contexto y objetivos</p>
                    <h2 id="mejoravit-context-title">El desafío de captar clientes potenciales.</h2>
                </header>
                <div className={styles.editorialCopy}>
                    <p>
                        El objetivo de Mejoravit era generar solicitudes de personas interesadas en sus servicios mediante campañas de Google Ads y
                        formularios en sus páginas web. Para conseguir contactos relevantes, era fundamental orientar la publicidad hacia las zonas
                        geográficas donde el negocio podía ofrecer atención.
                    </p>
                    <p>
                        La estrategia no se limitaba a atraer visitantes. También era necesario optimizar las páginas de destino y sus formularios,
                        facilitando que los usuarios completaran sus solicitudes y permitiendo medir los resultados de cada campaña.
                    </p>
                    <div className={styles.roleNote}>
                        <h3>Mi rol en el proyecto</h3>
                        <p>
                            Dentro de PRO Consultores participé en el desarrollo y mantenimiento de las páginas web, la integración de formularios y
                            servicios, la analítica de conversiones y la gestión y optimización de campañas de Google Ads.
                        </p>
                        <SmartLink href={SOCIAL_LINKS.cvEs} className={styles.textLink}>
                            Consultar la experiencia profesional en el CV <span aria-hidden="true">↗</span>
                        </SmartLink>
                    </div>
                    <p className={styles.smallNote}>
                        Trabajar tanto en las campañas publicitarias como en el desarrollo y la medición de las páginas de destino me permitió abordar
                        el proceso de captación de manera integral, identificando oportunidades de mejora desde el anuncio hasta el envío del
                        formulario.
                    </p>
                </div>
            </section>

            <section className={styles.section} aria-labelledby="mejoravit-evolution-title">
                <header className={styles.sectionHeader}>
                    <p className={styles.eyebrow}>02 / Evolución estratégica</p>
                    <h2 id="mejoravit-evolution-title">Una estrategia en constante evolución.</h2>
                </header>
                <ol className={styles.timeline}>
                    {stages.map((stage, index) => (
                        <li key={stage.title}>
                            <span className={styles.stageNumber} aria-hidden="true">
                                0{index + 1}
                            </span>
                            <p className={styles.stagePeriod}>{stage.period}</p>
                            <h3>{stage.title}</h3>
                            <p>{stage.text}</p>
                            <p className={styles.stageEvidence}>{stage.evidence}</p>
                        </li>
                    ))}
                </ol>
            </section>

            <section className={styles.section} aria-labelledby="mejoravit-results-title">
                <header className={styles.sectionHeader}>
                    <p className={styles.eyebrow}>03 / Resultados históricos</p>
                    <h2 id="mejoravit-results-title">La evolución de los resultados.</h2>
                    <p>
                        Durante 2026, la reestructuración de campañas y páginas de destino estuvo acompañada de cambios importantes en el rendimiento.
                        Tras el período de transición, la estrategia recuperó volumen y redujo el costo medio por conversión.
                    </p>
                </header>
                <MonthlyCpaChart data={mejoravitHistory.monthly} />
                <div className={styles.comparisonContext}>
                    <p>
                        Entre agosto y octubre de 2026, el costo por conversión se redujo un 63,9%, mientras la operación recuperaba volumen de
                        captación.
                    </p>
                </div>
            </section>

            <section className={styles.section} aria-labelledby="mejoravit-comparison-title">
                <header className={styles.sectionHeader}>
                    <p className={styles.eyebrow}>04 / Search y Performance Max</p>
                    <h2 id="mejoravit-comparison-title">Dos enfoques de captación.</h2>
                    <p>
                        Octubre de 2026 (parcial) · Campañas Mi Cuenta — Mejoravit 4. Una vez consolidada la estrategia de búsqueda, se incorporó
                        Performance Max para ampliar la captación. La comparación de campañas Mi Cuenta durante octubre de 2026 mostró diferencias
                        importantes en el costo y volumen de conversiones.
                    </p>
                </header>
                <div className={styles.comparisonGrid}>
                    {comparison.channels.map((channel, index) => (
                        <article key={channel.name} className={styles.comparisonPanel}>
                            <p className={styles.eyebrow}>
                                0{index + 1} / {index === 0 ? 'Intención de búsqueda' : 'Diversificación de canales'}
                            </p>
                            <h3>{channel.name}</h3>
                            {channel.complete && channel.costPerConversion !== null && channel.conversions !== null ? (
                                <dl className={styles.comparisonMetrics}>
                                    <div>
                                        <dt>Costo por conversión</dt>
                                        <dd>{formatMxn(channel.costPerConversion)}</dd>
                                    </div>
                                    <div>
                                        <dt>Conversiones registradas</dt>
                                        <dd>{formatConversions(channel.conversions)}</dd>
                                    </div>
                                </dl>
                            ) : (
                                <p className={styles.dataState}>No hay registros completos y comparables para este grupo.</p>
                            )}
                        </article>
                    ))}
                </div>
                <div className={styles.comparisonContext}>
                    <p>
                        Durante el período analizado, Performance Max registró más del doble de conversiones y un costo medio por conversión
                        aproximadamente un 51% menor que Search. Es una comparación descriptiva, no un experimento controlado.
                    </p>
                </div>
            </section>

            <section className={`${styles.section} ${styles.quality}`} aria-labelledby="mejoravit-quality-title">
                <header className={styles.sectionHeader}>
                    <p className={styles.eyebrow}>05 / Calidad y aprendizajes</p>
                    <h2 id="mejoravit-quality-title">Más allá de las conversiones.</h2>
                    <p>
                        Generar formularios es solo una parte del proceso. Para evaluar la calidad de una campaña también es importante conocer
                        cuántos contactos son relevantes para el negocio y qué ocurre cuando llegan al equipo comercial.
                    </p>
                </header>
                <aside className={styles.commercialNote} aria-labelledby="mejoravit-commercial-title">
                    <div>
                        <p className={styles.eyebrow} id="mejoravit-commercial-title">
                            Indicador comercial reportado
                        </p>
                        <p className={styles.reportedValue}>
                            {formatReportedPercentage(quality.usefulPercentage)}
                            <span>%</span>
                        </p>
                        <p>de leads clasificados como útiles</p>
                    </div>
                    <div>
                        <p>
                            <strong>
                                <time dateTime={quality.start}>27 de septiembre</time> – <time dateTime={quality.end}>26 de octubre de 2026</time>.
                            </strong>{' '}
                            Durante el período analizado, el equipo comercial reportó {formatWholeNumber(quality.usefulReported)} de aproximadamente{' '}
                            {formatWholeNumber(quality.evaluatedApproximate)} contactos como útiles, equivalente al{' '}
                            {formatReportedPercentage(quality.usefulPercentage)}% de los registros evaluados. Los restantes fueron aproximadamente{' '}
                            {formatWholeNumber(quality.remainingApproximate)}. Esta información permitió conocer mejor la calidad de los contactos
                            recibidos. El seguimiento comercial es un complemento importante de las métricas publicitarias, porque ayuda a identificar
                            qué tipo de oportunidades está generando la inversión.
                        </p>
                        <p className={styles.smallNote}>
                            Clasificación reportada por el equipo comercial para el período indicado. No representa una tasa de ventas ni de trámites
                            cerrados.
                        </p>
                    </div>
                </aside>
                <ol className={styles.learnings}>
                    <li>
                        <span aria-hidden="true">01</span>
                        <div>
                            <h3>Priorizar contactos útiles</h3>
                            <p>
                                El objetivo no es únicamente conseguir más formularios, sino atraer personas cuyas necesidades correspondan con los
                                servicios que ofrece el negocio.
                            </p>
                        </div>
                    </li>
                    <li>
                        <span aria-hidden="true">02</span>
                        <div>
                            <h3>Conectar publicidad y ventas</h3>
                            <p>
                                La comunicación con el equipo comercial permite conocer la calidad de los contactos recibidos y utilizar esa
                                información para orientar futuras optimizaciones.
                            </p>
                        </div>
                    </li>
                    <li>
                        <span aria-hidden="true">03</span>
                        <div>
                            <h3>Mejorar continuamente</h3>
                            <p>
                                Los resultados publicitarios y el seguimiento comercial aportan información para ajustar segmentaciones, anuncios y
                                páginas de destino, buscando mejorar progresivamente la captación.
                            </p>
                        </div>
                    </li>
                </ol>
            </section>

            <section className={`${styles.section} ${styles.finalCta}`} aria-labelledby="mejoravit-contact-title">
                <Star className={styles.star} />
                <p className={styles.eyebrow}>La estrategia empieza con contexto</p>
                <h2 id="mejoravit-contact-title">¿Buscas resultados medibles para tu negocio?</h2>
                <p>Conversemos sobre tus objetivos y evaluemos qué estrategia publicitaria tiene sentido para tu proyecto.</p>
                <SmartLink href={`${ROUTES.contact}?servicio=marketing`} className={`button-link button-link--primary ${styles.ctaLink}`}>
                    Evaluemos tu estrategia <span aria-hidden="true">↗</span>
                </SmartLink>
            </section>
        </main>
    );
}
