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
  // Detectar si es iOS
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  // Función para generar tonos de cuerdas de guitarra específicas optimizada para iOS
  const testGuitarString = async (stringName: string) => {
    if (!isSupported) return;

    try {
      // Crear Audio Context optimizado para la plataforma
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;

      // Configuración específica para iOS
      const audioContextOptions = isIOS
        ? {
            sampleRate: 44100,
            latencyHint: 'interactive' as const,
          }
        : {};

      const audioContext = new AudioContextClass(audioContextOptions);

      // Crear Oscillator y Gain
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      // Obtener la frecuencia ajustada de la cuerda
      const adjustedFrequency = getGuitarStringFrequency(stringName);

      // Configuración específica para iOS
      if (isIOS) {
        // iOS requiere frecuencias enteras para mejor rendimiento
        const roundedFrequency = Math.round(adjustedFrequency);
        oscillator.frequency.setValueAtTime(
          roundedFrequency,
          audioContext.currentTime
        );

        // iOS funciona mejor con ondas sinusoidales
        oscillator.type = 'sine';

        // Gain más bajo para iOS para evitar distorsión
        gainNode.gain.setValueAtTime(0.08, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.001,
          audioContext.currentTime + 2
        );
      } else {
        // Configuración estándar para otras plataformas
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
      }

      // Conectar nodos
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Iniciar y detener con timing optimizado para iOS
      const startTime = audioContext.currentTime;
      const duration = isIOS ? 2 : 3; // iOS: 2 segundos, otros: 3 segundos

      oscillator.start(startTime);
      oscillator.stop(startTime + duration);

      // Cleanup optimizado para iOS
      setTimeout(() => {
        try {
          // Solo cerrar si no hay otros sonidos reproduciéndose
          if (audioContext.state === 'running') {
            audioContext.close();
          }
        } catch (error) {
          console.warn('Error cerrando Audio Context:', error);
        }
      }, (duration + 0.5) * 1000);
    } catch (error) {
      console.error(`Error generando tono ${stringName}:`, error);

      // Mostrar mensaje específico para iOS
      if (isIOS) {
        alert(
          'En iOS, asegúrate de tocar el botón directamente y permitir el acceso al audio.'
        );
      }
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
