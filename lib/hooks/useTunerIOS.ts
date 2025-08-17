import { useEffect, useRef, useState, useCallback } from 'react';
import { useAudioContext } from './useAudioContext';

interface UseTunerIOSReturn {
  isListening: boolean;
  currentFrequency: number;
  error: string | null;
  isSupported: boolean;
  isIOS: boolean;
  isMobile: boolean;
  toggleListening: () => Promise<void>;
  resumeAudio: () => Promise<void>;
}

export function useTunerIOS(): UseTunerIOSReturn {
  const {
    isSupported,
    isIOS,
    isMobile,
    initializeAudio,
    resumeAudio: resumeAudioContext,
  } = useAudioContext();

  const [isListening, setIsListening] = useState(false);
  const [currentFrequency, setCurrentFrequency] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const mediaStreamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Configuración específica para iOS
  const getIOSOptimizedConfig = useCallback(() => {
    if (isIOS) {
      return {
        // iOS requiere configuraciones específicas para mejor rendimiento
        fftSize: 2048, // Más pequeño para iOS
        smoothingTimeConstant: 0.8, // Más suave para iOS
        minDecibels: -90,
        maxDecibels: -10,
        bufferSize: 4096,
      };
    }

    return {
      fftSize: 4096,
      smoothingTimeConstant: 0.5,
      minDecibels: -90,
      maxDecibels: -10,
      bufferSize: 8192,
    };
  }, [isIOS]);

  // Inicializar audio y micrófono
  const initializeAudioAndMic = useCallback(async () => {
    try {
      setError(null);

      // Inicializar Audio Context
      const audioContext = await initializeAudio();

      // Solicitar acceso al micrófono con configuraciones específicas para iOS
      const constraints: MediaStreamConstraints = {
        audio: {
          echoCancellation: isIOS ? false : true, // iOS funciona mejor sin cancelación de eco
          noiseSuppression: isIOS ? false : true, // iOS funciona mejor sin supresión de ruido
          autoGainControl: isIOS ? false : true, // iOS funciona mejor sin control automático de ganancia
          sampleRate: isIOS ? 44100 : undefined, // Frecuencia específica para iOS
          channelCount: 1, // Mono para mejor rendimiento
        },
        video: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      mediaStreamRef.current = stream;

      // Crear Analyser Node con configuración optimizada para iOS
      const analyser = audioContext.createAnalyser();
      const config = getIOSOptimizedConfig();

      analyser.fftSize = config.fftSize;
      analyser.smoothingTimeConstant = config.smoothingTimeConstant;
      analyser.minDecibels = config.minDecibels;
      analyser.maxDecibels = config.maxDecibels;

      // Conectar stream al analyser
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      analyserRef.current = analyser;

      // Resumir Audio Context (crítico en iOS)
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }

      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error desconocido';
      setError(`Error inicializando audio: ${errorMessage}`);
      console.error('Error en useTunerIOS:', err);
      return false;
    }
  }, [initializeAudio, getIOSOptimizedConfig, isIOS]);

  // Función para detectar frecuencia optimizada para iOS
  const detectFrequency = useCallback(() => {
    if (!analyserRef.current) return;

    try {
      const analyser = analyserRef.current;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Float32Array(bufferLength);

      // Obtener datos de frecuencia
      analyser.getFloatFrequencyData(dataArray);

      // Algoritmo optimizado para iOS
      let maxIndex = 0;
      let maxValue = -Infinity;

      // Buscar la frecuencia dominante
      for (let i = 0; i < bufferLength; i++) {
        if (dataArray[i] > maxValue) {
          maxValue = dataArray[i];
          maxIndex = i;
        }
      }

      // Calcular frecuencia con precisión mejorada para iOS
      const sampleRate = analyser.context.sampleRate;
      const frequency = (maxIndex * sampleRate) / (analyser.fftSize * 2);

      // Filtro de frecuencia para iOS (eliminar ruidos de baja frecuencia)
      if (isIOS && frequency < 80) {
        return; // Ignorar frecuencias muy bajas en iOS
      }

      // Suavizar cambios de frecuencia para iOS
      if (isIOS) {
        setCurrentFrequency((prev) => {
          const smoothing = 0.7;
          return prev * smoothing + frequency * (1 - smoothing);
        });
      } else {
        setCurrentFrequency(frequency);
      }

      // Aquí iría la lógica de detección de notas
      // Por ahora solo actualizamos la frecuencia
    } catch (err) {
      console.error('Error detectando frecuencia:', err);
    }
  }, [isIOS]);

  // Iniciar/Detener escucha
  const toggleListening = useCallback(async () => {
    if (isListening) {
      // Detener escucha
      setIsListening(false);

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }

      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }
    } else {
      // Iniciar escucha
      const success = await initializeAudioAndMic();
      if (success) {
        setIsListening(true);

        // Loop de detección optimizado para iOS
        const detectLoop = () => {
          detectFrequency();
          animationFrameRef.current = requestAnimationFrame(detectLoop);
        };

        detectLoop();
      }
    }
  }, [isListening, initializeAudioAndMic, detectFrequency]);

  // Resumir audio (necesario en iOS)
  const resumeAudio = useCallback(async () => {
    await resumeAudioContext();
  }, [resumeAudioContext]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return {
    isListening,
    currentFrequency,
    error,
    isSupported,
    isIOS,
    isMobile,
    toggleListening,
    resumeAudio,
  };
}
