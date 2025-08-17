import { getGuitarStringFrequency } from '../../lib/audio/notes';
import styles from './TunerUI.module.css';

interface StringTestButtonsProps {
  isSupported: boolean;
  getAdjustedStringName: (stringName: string) => string;
}

export function StringTestButtons({
  isSupported,
  getAdjustedStringName,
}: StringTestButtonsProps) {
  // Función para generar tonos de cuerdas de guitarra específicas
  const testGuitarString = (stringName: string) => {
    if (!isSupported) return;

    try {
      const audioContext = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext)();

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      // Obtener la frecuencia ajustada de la cuerda
      const adjustedFrequency = getGuitarStringFrequency(stringName);

      oscillator.frequency.setValueAtTime(
        adjustedFrequency,
        audioContext.currentTime
      );
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 3
      );

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 3);

      setTimeout(() => {
        audioContext.close();
      }, 3500);
    } catch (error) {
      console.error(`Error generando tono ${stringName}:`, error);
    }
  };

  const guitarStrings = [
    { name: 'E2', label: '6ª' },
    { name: 'A2', label: '5ª' },
    { name: 'D3', label: '4ª' },
    { name: 'G3', label: '3ª' },
    { name: 'B3', label: '2ª' },
    { name: 'E4', label: '1ª' },
  ];

  return (
    <div className={styles.stringTestButtons}>
      <p className={styles.testLabel}>Probar cuerdas:</p>
      <div className={styles.stringButtons}>
        {guitarStrings.map((string) => (
          <button
            key={string.name}
            className={styles.stringButton}
            onClick={() => testGuitarString(string.name)}
            disabled={!isSupported}
          >
            {getAdjustedStringName(string.name)} ({string.label})
          </button>
        ))}
      </div>
    </div>
  );
}
