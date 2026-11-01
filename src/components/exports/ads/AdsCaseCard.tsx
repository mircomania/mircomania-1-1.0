import Image from 'next/image';

import type { PublishedAdsCase } from '@/types/ads';
import { SmartLink } from '@/utils/SmartLink';

import styles from './ads.module.css';

export default function AdsCaseCard({ study }: Readonly<{ study: PublishedAdsCase }>) {
    return (
        <article className={styles.caseCard}>
            <div className={styles.caseHeader}>
                <p className={styles.eyebrow}>{study.category}</p>
                {study.logo && <Image src={study.logo.src} alt={study.logo.alt} width={88} height={48} className={styles.logo} />}
            </div>
            <h3>{study.title}</h3>
            <p className={styles.description}>{study.summary}</p>
            {study.metrics.length > 0 && (
                <dl className={styles.caseMetrics}>
                    {study.metrics.slice(0, 2).map((metric) => (
                        <div key={metric.label}>
                            <dt>{metric.label}</dt>
                            <dd>{metric.value}</dd>
                        </div>
                    ))}
                </dl>
            )}
            {study.period && <p className={styles.period}>Período de referencia: {study.period}</p>}
            <div className={styles.caseAction}>
                {study.studyHref ? (
                    <SmartLink href={study.studyHref} className={`button-link button-link--secondary ${styles.link}`} dataLink="ads-mejoravit-link">
                        Explorar estudio de caso <span aria-hidden="true">↗</span>
                    </SmartLink>
                ) : (
                    <p className={styles.period}>Estudio completo próximamente.</p>
                )}
            </div>
        </article>
    );
}
