import type { Metadata } from 'next';

import Star from '@/assets/icons/Star';
import MonthlyCpaChart from '@/components/exports/ads/mejoravit/MonthlyCpaChart';
import styles from '@/components/exports/ads/mejoravit/mejoravit.module.css';
import { ROUTES, SOCIAL_LINKS } from '@/constants/routes';
import { formatConversions, formatMxn, formatReportedPercentage, formatWholeNumber, mejoravitCommercialReport, mejoravitHistory } from '@/data/ads/mejoravit';
import { createMetadata } from '@/utils/createMetadata';
import { SmartLink } from '@/utils/SmartLink';
import StarryBackground from '@/utils/starryBackground/StarryBackground';

const pageMetadata = createMetadata({
    title: 'Mejoravit: evolución de una estrategia de Google Ads',
    description: 'Caso de experiencia profesional en PRO Consultores: 17 meses de captación con Google Ads, evolución mensual del CPA y comparación de Search y Performance Max con contexto.',
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
        period: 'Junio 2025 – junio 2026', title: 'Consolidación',
        text: 'Campañas de búsqueda, medición de acciones de captación y aprendizaje operativo. Una primera etapa para entender la relación entre tráfico, formularios y cobertura de la operación.',
        evidence: 'El informe registra distintas campañas y alcances geográficos a lo largo de esta etapa.',
    },
    {
        period: 'Julio – agosto 2026', title: 'Reestructuración',
        text: 'Adaptación de la operación durante 2026, con cambios en las campañas y las páginas de captación. La estrategia debía responder a las condiciones reales del negocio.',
        evidence: 'En estos meses aparecen en la exportación En Linea NL y las campañas Mi Cuenta.',
    },
    {
        period: 'Septiembre – octubre 2026, parcial', title: 'Diversificación',
        text: 'Una combinación de Search y Performance Max dentro de la familia Mi Cuenta, acompañada por seguimiento de la calidad de los contactos y optimización.',
        evidence: 'Los registros incluyen las variantes Max; la comparación verificada se acota a octubre y a la misma familia de campañas.',
    },
];

export default function MejoravitPage() {
    const { totals, period, comparison } = mejoravitHistory;
    const quality = mejoravitCommercialReport;

    return (
        <main className={`space-main ${styles.main}`}>
            <div className={styles.background} aria-hidden="true"><StarryBackground /></div>
            <section className={`${styles.section} ${styles.hero}`} aria-labelledby="mejoravit-title">
                <SmartLink href={ROUTES.ads} className={styles.backLink}><span aria-hidden="true">←</span> Volver a publicidad digital</SmartLink>
                <p className={styles.eyebrow}>Caso de estudio · Google Ads · México</p>
                <h1 id="mejoravit-title">Mejoravit<span aria-hidden="true">.</span></h1>
                <p className={styles.subtitle}>De campañas de búsqueda a una estrategia de captación diversificada.</p>
                <p className={styles.heroIntro}>Una mirada a la evolución de una operación de captación: campañas, tecnología web y lectura de resultados con contexto.</p>
                <p className={styles.professionalContext}>Experiencia profesional desarrollada en <strong>PRO Consultores</strong> (México). Mejoravit no se presenta como una contratación directa de Mircomania.</p>
                <dl className={styles.heroMetrics}>
                    <div><dt>Conversiones registradas, redondeadas</dt><dd>{formatWholeNumber(totals.conversions)}</dd></div>
                    <div><dt>Costo agregado por conversión</dt><dd>{formatMxn(totals.costPerConversion)}</dd></div>
                    <div><dt>Meses calendario representados</dt><dd>{period.calendarMonths}<span> meses</span></dd></div>
                </dl>
                <p className={styles.metricNote}>
                    Junio de 2025 – octubre de 2026, con octubre parcial. Total exacto: {formatConversions(totals.conversions)} conversiones.
                    Son acciones medidas; no equivalen necesariamente a clientes únicos ni a ventas. La serie reúne todas las campañas incluidas en el informe.
                </p>
            </section>

            <section className={`${styles.section} ${styles.context}`} aria-labelledby="mejoravit-context-title">
                <header><p className={styles.eyebrow}>01 / Contexto y objetivos</p><h2 id="mejoravit-context-title">El desafío de captar clientes potenciales.</h2></header>
                <div className={styles.editorialCopy}>
                    <p>La operación buscaba recibir contactos mediante formularios en sus páginas de captación. La segmentación geográfica y la experiencia después del clic debían acompañar la cobertura y las condiciones del negocio.</p>
                    <p>Medir esas acciones permitía observar el costo de la captación. Para interpretar el resultado también era necesario entender qué contactos podían atenderse y qué significaba una conversión en cada configuración.</p>
                    <div className={styles.roleNote}>
                        <h3>Mi aportación profesional</h3>
                        <p>Desarrollo y mantenimiento web, integración de formularios y servicios, analítica y trabajo con Google Ads dentro de PRO Consultores. Estas responsabilidades combinaban publicidad digital y tecnología web.</p>
                        <SmartLink href={SOCIAL_LINKS.cvEs} className={styles.textLink}>Consultar la experiencia profesional en el CV <span aria-hidden="true">↗</span></SmartLink>
                    </div>
                    <p className={styles.smallNote}>El objetivo de captación pertenece a la operación. Las cifras describen el conjunto de campañas; no permiten atribuir cada variación a una intervención personal.</p>
                </div>
            </section>

            <section className={styles.section} aria-labelledby="mejoravit-evolution-title">
                <header className={styles.sectionHeader}><p className={styles.eyebrow}>02 / Evolución estratégica</p><h2 id="mejoravit-evolution-title">Una estrategia en constante evolución.</h2></header>
                <ol className={styles.timeline}>
                    {stages.map((stage, index) => (
                        <li key={stage.title}>
                            <span className={styles.stageNumber} aria-hidden="true">0{index + 1}</span>
                            <p className={styles.stagePeriod}>{stage.period}</p>
                            <h3>{stage.title}</h3><p>{stage.text}</p><p className={styles.stageEvidence}>{stage.evidence}</p>
                        </li>
                    ))}
                </ol>
                <p className={styles.smallNote}>Las fechas organizan los registros disponibles; no señalan el día de activación de cada campaña ni prueban relaciones causales entre los cambios y los resultados.</p>
            </section>

            <section className={styles.section} aria-labelledby="mejoravit-results-title">
                <header className={styles.sectionHeader}>
                    <p className={styles.eyebrow}>03 / Resultados históricos</p><h2 id="mejoravit-results-title">La evolución de los resultados.</h2>
                    <p>Una serie con cambios de volumen, campañas y condiciones de operación. El costo por conversión ayuda a leer esa trayectoria cuando se conserva su contexto.</p>
                </header>
                <MonthlyCpaChart data={mejoravitHistory.monthly} />
                <div className={styles.readingNotes}>
                    <p><strong>Una escala común.</strong> La curva parte de cero y conserva los 17 meses en orden. Octubre se identifica como período parcial.</p>
                    <p><strong>Un conjunto cambiante.</strong> La serie incluye todas las familias del XML. Las acciones y configuraciones no se detallan por mes: no es una cohorte homogénea de formularios ni demuestra por sí sola una mejora causal.</p>
                </div>
                <p className={styles.smallNote}>Fuente: exportación de Google Ads «Informe sin título (1).xml», 42 registros de campaña y mes. Se utiliza la columna Conversiones, no Resultados ni Todas las conversiones.</p>
            </section>

            <section className={styles.section} aria-labelledby="mejoravit-comparison-title">
                <header className={styles.sectionHeader}>
                    <p className={styles.eyebrow}>04 / Search y Performance Max</p><h2 id="mejoravit-comparison-title">Dos enfoques de captación.</h2>
                    <p>Octubre de 2026, parcial · Familia {comparison.family}. La misma ventana mensual del informe y un alcance acotado a las cuatro campañas Mi Cuenta.</p>
                </header>
                <div className={styles.comparisonGrid}>
                    {comparison.channels.map((channel, index) => (
                        <article key={channel.name} className={styles.comparisonPanel}>
                            <p className={styles.eyebrow}>0{index + 1} / {index === 0 ? 'Intención de búsqueda' : 'Diversificación de canales'}</p>
                            <h3>{channel.name}</h3>
                            {channel.complete && channel.costPerConversion !== null && channel.conversions !== null ? (
                                <dl className={styles.comparisonMetrics}>
                                    <div><dt>Costo agregado por conversión</dt><dd>{formatMxn(channel.costPerConversion)}</dd></div>
                                    <div><dt>Conversiones registradas</dt><dd>{formatConversions(channel.conversions)}</dd></div>
                                </dl>
                            ) : <p className={styles.dataState}>No hay registros completos y comparables para este grupo.</p>}
                            <p className={styles.campaignList}>{channel.campaigns.join(' · ')}</p>
                        </article>
                    ))}
                </div>
                <div className={styles.comparisonContext}>
                    <p><strong>Qué se compara.</strong> El responsable del caso confirma <code>formulario_enviado</code> como acción principal de optimización de estas cuatro campañas; WhatsApp permanece como acción secundaria o en observación. El XML no incluye identificadores de acciones, por lo que no permite verificar que sean exactamente el mismo identificador.</p>
                    <p><strong>Qué queda fuera.</strong> En Línea NL pertenece a Mejoravit 1, utiliza otra landing y una inversión diferente. Está incluida en la serie histórica global, pero se excluye de esta comparación de Mi Cuenta.</p>
                    <p><strong>Cómo leerlo.</strong> Es una comparación descriptiva, no un experimento controlado. Segmentación, audiencias y condiciones de entrega pueden diferir. Estos valores no implican que Performance Max siempre rinda mejor ni que una campaña cause el resultado de la otra.</p>
                </div>
            </section>

            <section className={`${styles.section} ${styles.quality}`} aria-labelledby="mejoravit-quality-title">
                <header className={styles.sectionHeader}><p className={styles.eyebrow}>05 / Calidad y aprendizajes</p><h2 id="mejoravit-quality-title">Más allá de las conversiones.</h2><p>La cantidad de formularios recibidos no representa necesariamente oportunidades comerciales útiles. La lectura publicitaria necesita el contexto del equipo que atiende esos contactos.</p></header>
                <aside className={styles.commercialNote} aria-labelledby="mejoravit-commercial-title">
                    <div><p className={styles.eyebrow} id="mejoravit-commercial-title">Indicador comercial reportado</p><p className={styles.reportedValue}>{formatReportedPercentage(quality.usefulPercentage)}<span>%</span></p><p>de leads clasificados como útiles</p></div>
                    <div>
                        <p><strong><time dateTime={quality.start}>27 de septiembre</time> – <time dateTime={quality.end}>26 de octubre de 2026</time>.</strong> El equipo comercial reportó {formatWholeNumber(quality.usefulReported)} útiles de aproximadamente {formatWholeNumber(quality.evaluatedApproximate)} contactos evaluados; los restantes fueron aproximadamente {formatWholeNumber(quality.remainingApproximate)}.</p>
                        <p className={styles.smallNote}>Porcentaje redondeado de una clasificación comercial, no una métrica nativa de Google Ads ni una tasa de ventas o cierres. No se aportó el documento original ni una conciliación individual con las conversiones de Ads; este período tampoco coincide con el agregado mensual de octubre.</p>
                    </div>
                </aside>
                <ol className={styles.learnings}>
                    <li><span aria-hidden="true">01</span><div><h3>Medir para interpretar.</h3><p>La medición correcta y una definición clara de conversión son necesarias para entender las cifras.</p></div></li>
                    <li><span aria-hidden="true">02</span><div><h3>Adaptarse a la operación.</h3><p>Las estrategias deben responder a las condiciones reales del negocio, su cobertura y su capacidad de atención.</p></div></li>
                    <li><span aria-hidden="true">03</span><div><h3>Mirar la calidad.</h3><p>La utilidad comercial de los contactos importa tanto como el volumen. Sin datos de ventas e ingresos no corresponde afirmar ROI ni cierres.</p></div></li>
                </ol>
            </section>

            <section className={`${styles.section} ${styles.finalCta}`} aria-labelledby="mejoravit-contact-title">
                <Star className={styles.star} />
                <p className={styles.eyebrow}>La estrategia empieza con contexto</p>
                <h2 id="mejoravit-contact-title">¿Buscas resultados medibles para tu negocio?</h2>
                <p>Conversemos sobre tus objetivos y evaluemos qué estrategia publicitaria tiene sentido para tu proyecto.</p>
                <SmartLink href={`${ROUTES.contact}?servicio=marketing`} className={`button-link button-link--primary ${styles.ctaLink}`}>Evaluemos tu estrategia <span aria-hidden="true">↗</span></SmartLink>
            </section>
        </main>
    );
}
