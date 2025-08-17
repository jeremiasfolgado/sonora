'use client';

import React, { useEffect } from 'react';
import {
  Mic,
  MicOff,
  ChevronUp,
  ChevronDown,
  RotateCcw,
  Info,
  AlertCircle,
} from 'lucide-react';
import styles from './TunerUI.module.css';
import { useTuner } from '../lib/hooks/useTuner';
import { useTuning } from '../lib/hooks/useTuning';
import {
  getGuitarStringFrequency,
  getAdjustedGuitarStrings,
} from '../lib/audio/notes';
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
    console.log('🎵 TunerUI - Valores del hook actualizados:', {
      customSemitones,
      totalSemitones,
      displayName: getTuningDisplayName(),
    });
  }, [customSemitones, totalSemitones, getTuningDisplayName]);

  // Función para obtener la frecuencia objetivo de una cuerda (ajustada por afinación)
  const getTargetFrequency = (stringName: string): number => {
    if (!stringName || stringName === '--') {
      return 0;
    }

    const freq = getGuitarStringFrequency(stringName);
    return freq;
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
        console.log('🎵 Aubio.js ya está cargado');
        return;
      }

      try {
        console.log('🎵 Cargando Aubio.js...');

        const script = document.createElement('script');
        script.src =
          'https://cdn.jsdelivr.net/npm/aubiojs@0.1.1/build/aubio.min.js';
        script.async = true;

        script.onload = () => {
          console.log('🎵 Aubio.js cargado correctamente');
        };

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

  // Función para probar la detección con un tono de referencia
  const testToneDetection = () => {
    if (!isSupported) return;

    try {
      // Crear contexto de audio temporal
      const audioContext = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext)();

      // Crear oscilador para generar tono A4 (440 Hz) ajustado por afinación
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      // Configurar oscilador con frecuencia ajustada
      const adjustedFrequency = getGuitarStringFrequency(
        getTuningDisplayName()
      );
      oscillator.frequency.setValueAtTime(
        adjustedFrequency,
        audioContext.currentTime
      );
      oscillator.type = 'sine';

      // Configurar ganancia (volumen)
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime); // Bajo volumen
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 2
      );

      // Conectar nodos
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Iniciar y detener oscilador
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 2);

      console.log(
        `🎵 Tono de prueba A4 ajustado (${adjustedFrequency.toFixed(
          1
        )} Hz) generado`
      );

      // Limpiar después de 2 segundos
      setTimeout(() => {
        audioContext.close();
      }, 2500);
    } catch (error) {
      console.error('Error generando tono de prueba:', error);
    }
  };

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

      console.log(
        `🎸 Tono de prueba ${stringName} ajustado (${adjustedFrequency.toFixed(
          1
        )} Hz) generado`
      );

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
        <AlertCircle size={48} color="var(--error-color)" />
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
        <AlertCircle size={48} color="var(--error-color)" />
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
        <AlertCircle size={48} color="var(--error-color)" />
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
            className={`${styles.toggleButton} ${
              isListening ? styles.listening : ''
            }`}
            onClick={toggleListening}
            disabled={!isSupported}
          >
            {isListening ? (
              <>
                <MicOff size={20} />
                <span>Detener</span>
              </>
            ) : (
              <>
                <Mic size={20} />
                <span>Iniciar</span>
              </>
            )}
          </button>

          {/* Botón de prueba compacto */}
          <button
            className={styles.testButton}
            onClick={() => testToneDetection()}
            disabled={!isSupported}
          >
            🎵 Probar
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
              className={styles.tuningButton}
              onClick={decreaseSemitone}
              title="Bajar semitono"
            >
              <ChevronDown size={20} />
              Bajar
            </button>

            <button
              className={styles.tuningButton}
              onClick={resetTuning}
              title="Resetear afinación"
            >
              <RotateCcw size={20} />
              Reset
            </button>

            <button
              className={styles.tuningButton}
              onClick={increaseSemitone}
              title="Subir semitono"
            >
              <ChevronUp size={20} />
              Subir
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
                <Info size={14} />
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

                    const targetFreq = getTargetFrequency(
                      getTuningDisplayName()
                    );
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
            <AlertCircle size={16} />
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
        <p>Sonora - Herramientas Musicales</p>
      </div>
    </div>
  );
}
