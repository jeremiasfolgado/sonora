import styles from '../common/Common.module.css';

export function BrowserNotSupported() {
  return (
    <div className={styles.errorContainer}>
      <div className={styles.errorIcon}>⚠️</div>
      <h2>Navegador no compatible</h2>
      <p>
        Tu navegador no soporta Web Audio API o acceso al micrófono. Por favor,
        usa un navegador moderno como Chrome, Firefox, Safari o Edge.
      </p>
    </div>
  );
}
