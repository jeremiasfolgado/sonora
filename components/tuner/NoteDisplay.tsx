import { Note } from '../../lib/audio/notes';
import styles from './TunerUI.module.css';

interface NoteDisplayProps {
  currentNote: Note | null;
  currentFrequency: number;
}

export function NoteDisplay({
  currentNote,
  currentFrequency,
}: NoteDisplayProps) {
  return (
    <div className={styles.noteDisplay}>
      <div className={styles.noteName}>
        {currentNote ? currentNote.name : '--'}
      </div>
      <div className={styles.frequency}>
        {currentFrequency > 0 ? `${currentFrequency.toFixed(1)} Hz` : '-- Hz'}
      </div>
    </div>
  );
}
