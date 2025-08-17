import styles from './TunerUI.module.css';

interface AdditionalInfoProps {
  isListening: boolean;
  currentFrequency: number;
  confidence: number;
  isStable: boolean;
  getTuningDisplayName: () => string;
  getTargetFrequency: () => number;
}

export function AdditionalInfo({
  isListening,
  currentFrequency,
  confidence,
  isStable,
  getTuningDisplayName,
  getTargetFrequency,
}: AdditionalInfoProps) {
  if (!isListening || currentFrequency <= 0) {
    return null;
  }

  return (
    <div className={styles.additionalInfo}>
      <div className={styles.infoRow}>
        <div className={styles.confidenceBar}>
          <span>Confianza:</span>
          <div className={styles.confidenceMeter}>
            <div
              className={styles.confidenceFill}
              style={{
                width: `${confidence * 100}%`,
                backgroundColor:
                  confidence > 0.7
                    ? 'var(--success-color)'
                    : confidence > 0.4
                    ? 'var(--warning-color)'
                    : 'var(--error-color)',
              }}
            />
          </div>
          <span>{Math.round(confidence * 100)}%</span>
        </div>

        <div className={styles.stringInfo}>
          <span>
            <strong>Objetivo:</strong>{' '}
            {(() => {
              if (
                !getTuningDisplayName() ||
                getTuningDisplayName() === '--' ||
                getTuningDisplayName() === ''
              ) {
                return '0.0 Hz';
              }

              const targetFreq = getTargetFrequency();
              return `${targetFreq.toFixed(1)} Hz`;
            })()}
          </span>
        </div>
      </div>

      {!isStable && (
        <div className={styles.stabilityWarning}>
          <span>🔍 Buscando señal estable...</span>
        </div>
      )}
    </div>
  );
}
