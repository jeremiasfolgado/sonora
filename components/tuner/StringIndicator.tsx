import { Note } from '../../lib/audio/notes';
import styles from './TunerUI.module.css';

interface StringIndicatorProps {
  currentNote: Note | null;
  isListening: boolean;
  currentFrequency: number;
}

export function StringIndicator({
  currentNote,
  isListening,
  currentFrequency,
}: StringIndicatorProps) {
  if (!isListening || currentFrequency <= 0) {
    return null;
  }

  return (
    <div className={styles.stringIndicator}>
      <span className={styles.stringLabel}>Cuerda:</span>
      <span className={styles.stringName}>
        {currentNote ? currentNote.name : '--'}
      </span>
      <span className={styles.stringNumber}>
        {currentNote ? currentNote.octave : ''}
      </span>
    </div>
  );
}
