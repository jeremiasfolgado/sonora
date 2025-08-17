import styles from './TunerUI.module.css';

export function TunerHeader() {
  return (
    <div className={styles.header}>
      <h1 className={styles.title}>Sonora</h1>
      <p className={styles.subtitle}>Afinador de Guitarra</p>
    </div>
  );
}
