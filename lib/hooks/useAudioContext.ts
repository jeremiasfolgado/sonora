import { useEffect, useRef, useState } from 'react';

interface UseAudioContextReturn {
  audioContext: AudioContext | null;
  isSupported: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  isMobile: boolean;
  initializeAudio: () => Promise<AudioContext>;
  resumeAudio: () => Promise<void>;
  createOscillator: () => OscillatorNode | null;
  createGain: () => GainNode | null;
}

export function useAudioContext(): UseAudioContextReturn {
  const audioContextRef = useRef<AudioContext | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar plataforma
  useEffect(() => {
    const userAgent = navigator.userAgent;
    const isIOSDevice = /iPad|iPhone|iPod/.test(userAgent);
    const isAndroidDevice = /Android/.test(userAgent);
    const isMobileDevice = /Mobile|Android|iPhone|iPad|iPod/.test(userAgent);

    setIsIOS(isIOSDevice);
    setIsAndroid(isAndroidDevice);
    setIsMobile(isMobileDevice);

    // Verificar soporte de Web Audio API
    const hasWebAudio = !!(
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext
    );
    setIsSupported(hasWebAudio);
  }, []);

  // Inicializar Audio Context
  const initializeAudio = async (): Promise<AudioContext> => {
    if (audioContextRef.current) {
      return audioContextRef.current;
    }

    try {
      // Crear Audio Context con configuración específica para iOS
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;

      if (isIOS) {
        // Configuración específica para iOS
        audioContextRef.current = new AudioContextClass({
          sampleRate: 44100,
          latencyHint: 'interactive',
        });
      } else {
        // Configuración estándar para otras plataformas
        audioContextRef.current = new AudioContextClass();
      }

      // Configurar buffer size específico para iOS
      if (isIOS && audioContextRef.current) {
        // iOS requiere un buffer size específico para mejor rendimiento
        try {
          // Intentar configurar buffer size más pequeño para iOS
          (
            audioContextRef.current as unknown as { bufferSize?: number }
          ).bufferSize = 4096;
        } catch (e) {
          console.warn('No se pudo configurar buffer size en iOS:', e);
        }
      }

      return audioContextRef.current;
    } catch (error) {
      console.error('Error inicializando Audio Context:', error);
      throw error;
    }
  };

  // Resumir Audio Context (necesario en iOS)
  const resumeAudio = async (): Promise<void> => {
    if (
      audioContextRef.current &&
      audioContextRef.current.state === 'suspended'
    ) {
      try {
        await audioContextRef.current.resume();
      } catch (error) {
        console.error('Error resumiendo Audio Context:', error);
      }
    }
  };

  // Crear Oscillator con configuración específica para iOS
  const createOscillator = (): OscillatorNode | null => {
    if (!audioContextRef.current) return null;

    try {
      const oscillator = audioContextRef.current.createOscillator();

      if (isIOS) {
        // Configuración específica para iOS
        oscillator.type = 'sine';
        // iOS funciona mejor con frecuencias enteras
        // Nota: No podemos sobrescribir setValueAtTime, pero podemos redondear el valor antes de llamarlo
      }

      return oscillator;
    } catch (error) {
      console.error('Error creando Oscillator:', error);
      return null;
    }
  };

  // Crear Gain Node con configuración específica para iOS
  const createGain = (): GainNode | null => {
    if (!audioContextRef.current) return null;

    try {
      const gainNode = audioContextRef.current.createGain();

      if (isIOS) {
        // iOS requiere un gain más bajo para evitar distorsión
        gainNode.gain.setValueAtTime(0.1, audioContextRef.current.currentTime);
      } else {
        gainNode.gain.setValueAtTime(0.15, audioContextRef.current.currentTime);
      }

      return gainNode;
    } catch (error) {
      console.error('Error creando Gain Node:', error);
      return null;
    }
  };

  return {
    audioContext: audioContextRef.current,
    isSupported,
    isIOS,
    isAndroid,
    isMobile,
    initializeAudio,
    resumeAudio,
    createOscillator,
    createGain,
  };
}
