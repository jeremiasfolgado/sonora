'use client';

import React, { useEffect, useState } from 'react';
import { Mic, MicOff, AlertCircle, Info } from 'lucide-react';
import { useTuner } from '../lib/hooks/useTuner';
import { Needle } from './Needle';
import styles from './TunerUI.module.css';

export function TunerUI() {
  const [isAubioLoaded, setIsAubioLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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

  // Función para obtener la frecuencia objetivo de una cuerda
  const getTargetFrequency = (stringName: string): number => {
    const stringMap: { [key: string]: number } = {
      E2: 82.41,
      A2: 110.0,
      D3: 146.83,
      G3: 196.0,
      B3: 246.94,
      E4: 329.63,
    };
    return stringMap[stringName] || 0;
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

      // Crear oscilador para generar tono A4 (440 Hz)
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      // Configurar oscilador
      oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4
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

      console.log('🎵 Tono de prueba A4 (440 Hz) generado');

      // Limpiar después de 2 segundos
      setTimeout(() => {
        audioContext.close();
      }, 2500);
    } catch (error) {
      console.error('Error generando tono de prueba:', error);
    }
  };

  // Función para generar tonos de cuerdas de guitarra específicas
  const testGuitarString = (frequency: number, stringName: string) => {
    if (!isSupported) return;

    try {
      const audioContext = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext)();

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
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

      console.log(`🎸 Tono de prueba ${stringName} (${frequency} Hz) generado`);

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
            <span className={styles.stringName}>{closestString}</span>
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

          {/* Botón de prueba compacto */}
          <button
            className={styles.testButton}
            onClick={() => testToneDetection()}
            disabled={!isSupported}
          >
            🎵 Probar
          </button>
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
                  <strong>Objetivo:</strong> {getTargetFrequency(closestString)}{' '}
                  Hz
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
            onClick={() => testGuitarString(82.41, 'E2')}
            disabled={!isSupported}
          >
            E2 (6ª)
          </button>
          <button
            className={styles.stringButton}
            onClick={() => testGuitarString(110.0, 'A2')}
            disabled={!isSupported}
          >
            A2 (5ª)
          </button>
          <button
            className={styles.stringButton}
            onClick={() => testGuitarString(146.83, 'D3')}
            disabled={!isSupported}
          >
            D3 (4ª)
          </button>
          <button
            className={styles.stringButton}
            onClick={() => testGuitarString(196.0, 'G3')}
            disabled={!isSupported}
          >
            G3 (3ª)
          </button>
          <button
            className={styles.stringButton}
            onClick={() => testGuitarString(246.94, 'B3')}
            disabled={!isSupported}
          >
            B3 (2ª)
          </button>
          <button
            className={styles.stringButton}
            onClick={() => testGuitarString(329.63, 'E4')}
            disabled={!isSupported}
          >
            E4 (1ª)
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
