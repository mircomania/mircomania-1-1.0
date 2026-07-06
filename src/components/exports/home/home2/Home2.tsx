import Image from 'next/image';
import styles from './home2.module.css';
import img from '@/assets/images/brick-wall.jpg';

const SIGN_DATA = [
    { id: 1, text: ['Sitios', 'Web'], activeClass: styles.activeCyan, position: { top: '0', left: '0' } },
    { id: 2, text: ['Automatizaciones'], activeClass: styles.activePink, position: { top: '25%', left: '50%', transform: 'translateX(-50%)' } },
    { id: 3, text: ['Marketing', 'Digital'], activeClass: styles.activeYellow, position: { top: '46%', right: '0' } },
    { id: 4, text: ['Analítica'], activeClass: styles.activeGreen, position: { bottom: '14%', left: '0' } },
];

export default function Home2() {
    return (
        <section className={styles.sectionContainer}>
            <div className={styles.brickBackground}>
                <Image
                    src={img}
                    alt="Pared de ladrillos nocturna"
                    fill
                    sizes="100vw"
                    style={{
                        objectFit: 'cover',
                        opacity: 0.5,
                        mixBlendMode: 'overlay',
                    }}
                    priority
                />
            </div>

            <div className={styles.signsContainer}>
                {SIGN_DATA.map((sign) => (
                    <div key={sign.id} className={`${styles.neonSign} ${sign.activeClass}`} style={sign.position}>
                        {sign.text.map((line, idx) => (
                            <h2 key={idx}>{line}</h2>
                        ))}
                    </div>
                ))}
            </div>
        </section>
    );
}
