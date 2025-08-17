'use client';

import { useEffect } from 'react';
import { useTuner } from '../lib/hooks/useTuner';
import { useTuning } from '../lib/hooks/useTuning';
import {
  getAdjustedGuitarStrings,
  getGuitarStringFrequency,
} from '../lib/audio/notes';
import styles from './TunerUI.module.css';
import { Needle } from './Needle';

export function TunerUI() {
  const {
    isListening,
    currentFrequency,
    currentNote,
    tuningStatus,
    tuningColor,
    error,
    isSupported,
    confidence,
    isStable,
    toggleListening,
  } = useTuner();

  const {
    getTuningDisplayName,
    increaseSemitone,
    decreaseSemitone,
    resetTuning,
    customSemitones,
    totalSemitones,
  } = useTuning();

  // Debug: Log cuando cambien los valores del hook
  useEffect(() => {
    // Los valores del hook se actualizan correctamente
  }, [customSemitones, totalSemitones, getTuningDisplayName]);

  // Función para obtener la frecuencia objetivo de una cuerda (ajustada por afinación)
  const getTargetFrequency = (): number => {
    if (!currentNote || !currentNote.name || currentNote.name === '--') {
      return 0;
    }

    // Obtener la cuerda más cercana a la frecuencia detectada
    const adjustedStrings = getAdjustedGuitarStrings();

    // Buscar la cuerda más cercana en las cuerdas ajustadas
    let closestString = '';
    let minDifference = Infinity;

    Object.entries(adjustedStrings).forEach(([stringName, stringInfo]) => {
      const difference = Math.abs(stringInfo.frequency - currentNote.frequency);
      if (difference < minDifference) {
        minDifference = difference;
        closestString = stringName;
      }
    });

    if (closestString && adjustedStrings[closestString]) {
      return adjustedStrings[closestString].frequency;
    }

    return 0;
  };

  // Función para obtener el nombre ajustado de una cuerda según la afinación
  const getAdjustedStringName = (stringName: string): string => {
    const adjustedStrings = getAdjustedGuitarStrings();
    return adjustedStrings[stringName]?.name || stringName;
  };

  // Cargar Aubio.js dinámicamente
  useEffect(() => {
    const loadAubio = async () => {
      // Verificar si ya está cargado
      if ((window as { aubio?: () => Promise<unknown> }).aubio) {
        return;
      }

      try {
        const script = document.createElement('script');
        script.src =
          'https://cdn.jsdelivr.net/npm/aubiojs@0.1.1/build/aubio.min.js';
        script.async = true;

        script.onload = () => {};

        script.onerror = () => {
          console.error('❌ Error cargando Aubio.js');
        };

        document.head.appendChild(script);
      } catch (error) {
        console.error('Error cargando Aubio:', error);
      }
    };

    // Solo cargar si estamos en el cliente
    if (typeof window !== 'undefined') {
      loadAubio();
    }
  }, []);

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

  if (!isSupported) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorIcon}>⚠️</div>
        <h2>Navegador no compatible</h2>
        <p>
          Tu navegador no soporta Web Audio API o acceso al micrófono. Por
          favor, usa un navegador moderno como Chrome, Firefox, Safari o Edge.
        </p>
      </div>
    );
  }

  if (!isSupported) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorIcon}>⚠️</div>
        <h2>Navegador no compatible</h2>
        <p>
          Tu navegador no soporta Web Audio API o acceso al micrófono. Por
          favor, usa un navegador moderno como Chrome, Firefox, Safari o Edge.
        </p>
      </div>
    );
  }

  if (!isSupported) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorIcon}>⚠️</div>
        <h2>Navegador no compatible</h2>
        <p>
          Tu navegador no soporta Web Audio API o acceso al micrófono. Por
          favor, usa un navegador moderno como Chrome, Firefox, Safari o Edge.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.tunerContainer}>
      {/* Header compacto */}
      <div className={styles.header}>
        <h1 className={styles.title}>Sonora</h1>
        <p className={styles.subtitle}>Afinador de Guitarra</p>
      </div>

      {/* Contenido principal optimizado */}
      <div className={styles.mainContent}>
        {/* Nota detectada y frecuencia */}
        <div className={styles.noteDisplay}>
          <div className={styles.noteName}>
            {currentNote ? currentNote.name : '--'}
          </div>
          <div className={styles.frequency}>
            {currentFrequency > 0
              ? `${currentFrequency.toFixed(1)} Hz`
              : '-- Hz'}
          </div>
        </div>

        {/* Indicador de cuerda prominente */}
        {isListening && currentFrequency > 0 && (
          <div className={styles.stringIndicator}>
            <span className={styles.stringLabel}>Cuerda:</span>
            <span className={styles.stringName}>
              {currentNote ? currentNote.name : '--'}
            </span>
            <span className={styles.stringNumber}>
              {currentNote ? currentNote.octave : ''}
            </span>
          </div>
        )}

        {/* Aguja de afinación */}
        {currentNote && (
          <Needle
            cents={currentNote.cents}
            tuningStatus={tuningStatus as 'plano' | 'afinado' | 'agudo'}
            tuningColor={tuningColor}
            isListening={isListening}
          />
        )}

        {/* Controles principales */}
        <div className={styles.controls}>
          <button
            onClick={toggleListening}
            className={`${styles.toggleButton} ${
              isListening ? styles.listening : ''
            }`}
            disabled={!isSupported}
          >
            {isListening ? 'Detener' : 'Iniciar'}
          </button>
        </div>

        {/* Controles de afinación */}
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

            <button
              onClick={resetTuning}
              className={styles.resetSemitoneButton}
            >
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

        {/* Información adicional compacta */}
        {isListening && currentFrequency > 0 && (
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
        )}

        {/* Mensaje de error */}
        {error && (
          <div className={styles.errorMessage}>
            <span>{error}</span>
          </div>
        )}

        {/* Instrucciones compactas */}
        {!isListening && !error && (
          <div className={styles.instructions}>
            <p>Presiona &quot;Iniciar&quot; para comenzar a afinar</p>
            <div className={styles.quickTips}>
              <span>💡 Coloca el micrófono cerca de las cuerdas</span>
              <span>💡 Toca una cuerda a la vez</span>
            </div>
          </div>
        )}
      </div>

      {/* Botones de prueba de cuerdas compactos */}
      <div className={styles.stringTestButtons}>
        <p className={styles.testLabel}>Probar cuerdas:</p>
        <div className={styles.stringButtons}>
          <button
            className={styles.stringButton}
            onClick={() => testGuitarString('E2')}
            disabled={!isSupported}
          >
            {getAdjustedStringName('E2')} (6ª)
          </button>
          <button
            className={styles.stringButton}
            onClick={() => testGuitarString('A2')}
            disabled={!isSupported}
          >
            {getAdjustedStringName('A2')} (5ª)
          </button>
          <button
            className={styles.stringButton}
            onClick={() => testGuitarString('D3')}
            disabled={!isSupported}
          >
            {getAdjustedStringName('D3')} (4ª)
          </button>
          <button
            className={styles.stringButton}
            onClick={() => testGuitarString('G3')}
            disabled={!isSupported}
          >
            {getAdjustedStringName('G3')} (3ª)
          </button>
          <button
            className={styles.stringButton}
            onClick={() => testGuitarString('B3')}
            disabled={!isSupported}
          >
            {getAdjustedStringName('B3')} (2ª)
          </button>
          <button
            className={styles.stringButton}
            onClick={() => testGuitarString('E4')}
            disabled={!isSupported}
          >
            {getAdjustedStringName('E4')} (1ª)
          </button>
        </div>
      </div>

      {/* Footer compacto */}
      <div className={styles.footer}>
        <p>
          Sonora - Desarrollador por Jeremías Folgado con un poco bastante de IA
        </p>
      </div>
    </div>
  );
}
