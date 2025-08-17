import styles from '../common/Common.module.css';

interface BrowserNotSupportedProps {
  onForceSupport?: () => void;
}

export function BrowserNotSupported({
  onForceSupport,
}: BrowserNotSupportedProps) {
  return (
    <div className={styles.errorContainer}>
      <div className={styles.errorIcon}>⚠️</div>
      <h2>Navegador no compatible</h2>
      <p>
        Tu navegador no soporta Web Audio API o acceso al micrófono. Por favor,
        usa un navegador moderno como Chrome, Firefox, Safari o Edge.
      </p>

      {onForceSupport && (
        <div className={styles.forceSupportSection}>
          <p className={styles.forceSupportText}>
            <strong>⚠️ Advertencia:</strong> Si estás seguro de que tu navegador
            es compatible, puedes intentar forzar el uso del afinador.
          </p>
          <button
            onClick={onForceSupport}
            className={styles.forceSupportButton}
          >
            🔧 Intentar usar el afinador de todas formas
          </button>
          <p className={styles.forceSupportNote}>
            <small>
              Nota: Esto puede causar errores si tu navegador realmente no es
              compatible.
            </small>
          </p>
        </div>
      )}
    </div>
  );
}
