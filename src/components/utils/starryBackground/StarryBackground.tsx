import styles from './starryBackground.module.css';

export default function StarryBackground() {
  return (
    <div className={styles.starsContainer}>
      <div className={`${styles.starLayer} ${styles.layer1}`} />
      <div className={`${styles.starLayer} ${styles.layer2}`} />
      <div className={`${styles.starLayer} ${styles.layer3}`} />
    </div>
  );
}
