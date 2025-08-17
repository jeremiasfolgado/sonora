import { useEffect, useRef, useState } from 'react';

interface UseAudioContextReturn {
  audioContext: AudioContext | null;
  isSupported: boolean;
  isMobile: boolean;
  initializeAudio: () => Promise<AudioContext>;
  resumeAudio: () => Promise<void>;
  createOscillator: () => OscillatorNode | null;
  createGain: () => GainNode | null;
}

export function useAudioContext(): UseAudioContextReturn {
  const audioContextRef = useRef<AudioContext | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar plataforma
  useEffect(() => {
    const userAgent = navigator.userAgent;
    const isMobileDevice = /Mobile/.test(userAgent);

    setIsMobile(isMobileDevice);

    // Verificar soporte de Web Audio API
    const hasWebAudio = !!window.AudioContext;
    setIsSupported(hasWebAudio);
  }, []);

  // Inicializar Audio Context
  const initializeAudio = async (): Promise<AudioContext> => {
    if (audioContextRef.current) {
      return audioContextRef.current;
    }

    try {
      // Crear Audio Context estándar
      audioContextRef.current = new window.AudioContext();
      return audioContextRef.current;
    } catch (error) {
      console.error('Error inicializando Audio Context:', error);
      throw error;
    }
  };

  // Resumir Audio Context
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

  // Crear Oscillator estándar
  const createOscillator = (): OscillatorNode | null => {
    if (!audioContextRef.current) return null;

    try {
      const oscillator = audioContextRef.current.createOscillator();
      return oscillator;
    } catch (error) {
      console.error('Error creando Oscillator:', error);
      return null;
    }
  };

  // Crear Gain Node estándar
  const createGain = (): GainNode | null => {
    if (!audioContextRef.current) return null;

    try {
      const gainNode = audioContextRef.current.createGain();
      gainNode.gain.setValueAtTime(0.15, audioContextRef.current.currentTime);
      return gainNode;
    } catch (error) {
      console.error('Error creando Gain Node:', error);
      return null;
    }
  };

  return {
    audioContext: audioContextRef.current,
    isSupported,
    isMobile,
    initializeAudio,
    resumeAudio,
    createOscillator,
    createGain,
  };
}
