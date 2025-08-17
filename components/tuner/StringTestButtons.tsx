import styles from './TunerUI.module.css';

interface StringTestButtonsProps {
  isSupported: boolean;
  getAdjustedStringName: (stringName: string) => string;
  getAdjustedFrequency: (baseFrequency: number) => number;
}

export function StringTestButtons({
  isSupported,
  getAdjustedStringName,
  getAdjustedFrequency,
}: StringTestButtonsProps) {
  // Función para generar tonos de cuerdas de guitarra
  const testGuitarString = async (stringName: string) => {
    if (!isSupported) return;

    try {
      // Crear Audio Context estándar
      const audioContext = new window.AudioContext();

      // Crear Oscillator y Gain
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      // Obtener la frecuencia base y ajustarla según la afinación seleccionada
      const stringInfo = guitarStrings.find((s) => s.name === stringName);
      if (!stringInfo) return;

      const adjustedFrequency = getAdjustedFrequency(stringInfo.baseFreq);

      // Configuración estándar
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

      // Conectar nodos
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Iniciar y detener
      const startTime = audioContext.currentTime;
      const duration = 3; // 3 segundos

      oscillator.start(startTime);
      oscillator.stop(startTime + duration);

      // Cleanup
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
    }
  };

  // Frecuencias base de afinación estándar (A4 = 440Hz)
  const baseFrequencies = {
    E2: 82.41,
    A2: 110.0,
    D3: 146.83,
    G3: 196.0,
    B3: 246.94,
    E4: 329.63,
  };

  const guitarStrings = [
    { name: 'E2', label: '6ª', baseFreq: baseFrequencies.E2 },
    { name: 'A2', label: '5ª', baseFreq: baseFrequencies.A2 },
    { name: 'D3', label: '4ª', baseFreq: baseFrequencies.D3 },
    { name: 'G3', label: '3ª', baseFreq: baseFrequencies.G3 },
    { name: 'B3', label: '2ª', baseFreq: baseFrequencies.B3 },
    { name: 'E4', label: '1ª', baseFreq: baseFrequencies.E4 },
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
