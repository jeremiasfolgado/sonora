import styles from './TunerUI.module.css';

interface TuningControlsProps {
  getTuningDisplayName: () => string;
  increaseSemitone: () => void;
  decreaseSemitone: () => void;
  resetTuning: () => void;
  customSemitones: number;
  totalSemitones: number;
}

export function TuningControls({
  getTuningDisplayName,
  increaseSemitone,
  decreaseSemitone,
  resetTuning,
  customSemitones,
  totalSemitones,
}: TuningControlsProps) {
  return (
    <div className={styles.tuningControls}>
      <div className={styles.tuningInfo}>
        <span className={styles.tuningLabel}>Afinación:</span>
        <span className={styles.tuningName}>{getTuningDisplayName()}</span>
        {customSemitones !== 0 && (
          <span className={styles.tuningIndicator}>
            ({totalSemitones > 0 ? '+' : ''}
            {totalSemitones} semitones)
          </span>
        )}
      </div>

      <div className={styles.tuningButtons}>
        <button
          onClick={decreaseSemitone}
          className={styles.tuningButton}
          disabled={customSemitones <= -12}
        >
          <span>Bajar</span>
          <span>▼</span>
        </button>

        <button onClick={resetTuning} className={styles.resetSemitoneButton}>
          <span>Reset</span>
          <span>↺</span>
        </button>

        <button
          onClick={increaseSemitone}
          className={styles.tuningButton}
          disabled={customSemitones >= 12}
        >
          <span>Subir</span>
          <span>▲</span>
        </button>
      </div>
    </div>
  );
}
