'use client';

import React, { useEffect, useState } from 'react';
import {
  Mic,
  MicOff,
  AlertCircle,
  Info,
  Settings,
  ChevronUp,
  ChevronDown,
  RotateCcw,
} from 'lucide-react';
import { useTuner } from '../lib/hooks/useTuner';
import { useTuning } from '../lib/hooks/useTuning';
import {
  getGuitarStringFrequency,
  getAdjustedGuitarStrings,
} from '../lib/audio/notes';
import { Needle } from './Needle';
import { TuningSelector } from './TuningSelector';
import styles from './TunerUI.module.css';

export function TunerUI() {
  const [isAubioLoaded, setIsAubioLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showTuningModal, setShowTuningModal] = useState(false);

  const {
    isListening,
    currentFrequency,
    currentNote,
    tuningStatus,
    tuningColor,
    error,
    isSupported,
    confidence,
    closestString,
    isStable,
    toggleListening,
  } = useTuner();

  const {
    getAdjustedFrequency,
    getTuningDisplayName,
    increaseSemitone,
    decreaseSemitone,
    resetTuning,
    customSemitones,
    totalSemitones,
  } = useTuning();

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

  // Función para obtener el número de cuerda
  const getStringNumber = (stringName: string): string => {
    const stringMap: { [key: string]: string } = {
      E2: '6ª',
      A2: '5ª',
      D3: '4ª',
      G3: '3ª',
      B3: '2ª',
      E4: '1ª',
    };
    return stringMap[stringName] || '';
  };

  // Cargar Aubio.js dinámicamente
  useEffect(() => {
    const loadAubio = async () => {
      // Verificar si ya está cargado
      if ((window as { aubio?: () => Promise<unknown> }).aubio) {
        console.log('🎵 Aubio.js ya está cargado');
        setIsAubioLoaded(true);
        setIsLoading(false);
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
          setIsAubioLoaded(true);
          setIsLoading(false);
        };

        script.onerror = () => {
          console.error('❌ Error cargando Aubio.js');
          setIsLoading(false);
        };

        document.head.appendChild(script);
      } catch (error) {
        console.error('Error cargando Aubio:', error);
        setIsLoading(false);
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
      const baseFrequency = 440; // A4 base
      const adjustedFrequency = getAdjustedFrequency(baseFrequency);
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

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <h2>Cargando afinador...</h2>
        <p>Inicializando componentes de audio</p>
      </div>
    );
  }

  if (!isAubioLoaded) {
    return (
      <div className={styles.errorContainer}>
        <AlertCircle size={48} color="var(--warning-color)" />
        <h2>Error cargando librería de audio</h2>
        <p>
          No se pudo cargar Aubio.js. Por favor, recarga la página o verifica tu
          conexión a internet.
        </p>
        <button
          className={styles.retryButton}
          onClick={() => window.location.reload()}
        >
          🔄 Recargar página
        </button>
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
            {currentNote.name === '--' ? '--' : currentNote.name}
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
              {closestString && closestString !== '--'
                ? getAdjustedStringName(closestString)
                : closestString}
            </span>
            <span className={styles.stringNumber}>
              {getStringNumber(closestString)}
            </span>
          </div>
        )}

        {/* Aguja de afinación */}
        <Needle
          cents={currentNote.cents}
          tuningStatus={tuningStatus}
          tuningColor={tuningColor}
          isListening={isListening}
        />

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

          {/* Botón de configuración */}
          <button
            className={styles.settingsButton}
            onClick={() => setShowTuningModal(true)}
            title="Configurar afinación"
          >
            <Settings size={20} />
            <span>{getTuningDisplayName()}</span>
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

        {/* Controles de semitonos */}
        <div className={styles.semitoneControls}>
          <div className={styles.semitoneHeader}>
            <span className={styles.semitoneLabel}>Ajuste de Afinación</span>
            {customSemitones !== 0 && (
              <span className={styles.semitoneIndicator}>
                {totalSemitones > 0 ? '+' : ''}
                {totalSemitones} semitones
              </span>
            )}
          </div>

          <div className={styles.semitoneButtons}>
            <button
              className={styles.semitoneButton}
              onClick={decreaseSemitone}
              title="Disminuir semitono"
            >
              <ChevronDown size={20} />
              <span>Bajar</span>
            </button>

            <button
              className={styles.resetSemitoneButton}
              onClick={resetTuning}
              title="Resetear a afinación estándar"
            >
              <RotateCcw size={16} />
              <span>Reset</span>
            </button>

            <button
              className={styles.semitoneButton}
              onClick={increaseSemitone}
              title="Aumentar semitono"
            >
              <ChevronUp size={20} />
              <span>Subir</span>
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
                      !closestString ||
                      closestString === '--' ||
                      closestString === ''
                    ) {
                      return '0.0 Hz';
                    }

                    const targetFreq = getTargetFrequency(closestString);
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

      {/* Modal de configuración de afinación */}
      {showTuningModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowTuningModal(false)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Configuración de Afinación</h3>
              <button
                className={styles.closeButton}
                onClick={() => setShowTuningModal(false)}
              >
                ×
              </button>
            </div>
            <div className={styles.modalContent}>
              <TuningSelector />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
