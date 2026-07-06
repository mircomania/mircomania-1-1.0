import styles from './home1.module.css';
import StarryBackground from '@/components/utils/starryBackground/StarryBackground';

export default function Home1() {
    return (
        <section className={styles.sectionContainer}>
            <StarryBackground />

            <header>
                <h2>Dev</h2>
                <h1>MIRCOMANIA</h1>
                <h2>Full Stack</h2>
            </header>
        </section>
    );
}
