'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { AudioAnalyzer } from '../audio/analyzer';
import {
  Note,
  getTuningStatus,
  getTuningColor,
  getClosestGuitarString,
} from '../audio/notes';

export interface TunerState {
  isListening: boolean;
  currentFrequency: number;
  currentNote: Note;
  tuningStatus: 'plano' | 'afinado' | 'agudo';
  tuningColor: string;
  error: string | null;
  isSupported: boolean;
  confidence: number;
  closestString: string;
  isStable: boolean;
  forceSupported: boolean; // Nuevo: permite forzar compatibilidad
}

export interface UseTunerReturn extends TunerState {
  startListening: () => Promise<void>;
  stopListening: () => void;
  toggleListening: () => Promise<void>;
  forceSupport: () => void; // Nueva función para forzar compatibilidad
}

export function useTuner(): UseTunerReturn {
  const [state, setState] = useState<TunerState>({
    isListening: false,
    currentFrequency: 0,
    currentNote: {
      name: '--',
      frequency: 0,
      octave: 0,
      cents: 0,
      confidence: 0,
    },
    tuningStatus: 'afinado',
    tuningColor: 'var(--text-secondary)',
    error: null,
    isSupported: false, // Inicialmente false hasta verificar en el cliente
    confidence: 0,
    closestString: '--',
    isStable: false,
    forceSupported: false, // Inicialmente false
  });

  const analyzerRef = useRef<AudioAnalyzer | null>(null);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    const checkSupport = () => {
      try {
        // Verificación directa y explícita
        const hasAudioContext = !!window.AudioContext;

        const hasMediaDevices = !!(
          navigator.mediaDevices && navigator.mediaDevices.getUserMedia
        );

        // Verificación adicional: intentar crear un AudioContext de prueba
        let canCreateAudioContext = false;
        try {
          const testContext = new window.AudioContext();
          canCreateAudioContext =
            testContext.state === 'running' ||
            testContext.state === 'suspended';
          testContext.close();
        } catch {
          canCreateAudioContext = false;
        }

        const isSupported =
          (hasAudioContext && hasMediaDevices && canCreateAudioContext) ||
          state.forceSupported;

        setState((prev) => ({ ...prev, isSupported }));
        return isSupported;
      } catch (error) {
        setState((prev) => ({ ...prev, isSupported: false }));
        return false;
      }
    };

    // Solo verificar si estamos en el cliente
    if (typeof window !== 'undefined') {
      // Verificación inmediata
      checkSupport();

      // Verificación adicional después de un delay
      setTimeout(checkSupport, 500);

      // Verificación final después de 1 segundo
      setTimeout(checkSupport, 1000);

      // Verificación adicional después de 2 segundos (para casos edge)
      setTimeout(checkSupport, 2000);
    }
  }, [state.forceSupported]);

  // Inicializar analizador solo cuando esté soportado
  useEffect(() => {
    if (
      !state.isSupported ||
      isInitializedRef.current ||
      typeof window === 'undefined'
    )
      return;

    const initAnalyzer = async () => {
      try {
        // Esperar a que Aubio esté disponible
        await new Promise<void>((resolve) => {
          const checkAubio = () => {
            if ((window as { aubio?: () => Promise<unknown> }).aubio) {
              resolve();
            } else {
              setTimeout(checkAubio, 100);
            }
          };
          checkAubio();
        });

        analyzerRef.current = new AudioAnalyzer();
        isInitializedRef.current = true;
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error: 'Failed to initialize audio analyzer',
          isSupported: false,
        }));
      }
    };

    initAnalyzer();
  }, [state.isSupported, state.forceSupported]);

  // Configurar listener para frecuencias detectadas
  useEffect(() => {
    if (!state.isSupported) return;

    const handleNoteDetected = (event: CustomEvent) => {
      const { noteData } = event.detail;

      if (noteData && noteData.frequency > 0) {
        // El analizador ahora envía directamente el objeto Note completo
        const note: Note = noteData;

        const tuningStatus = getTuningStatus(note.cents);
        const tuningColor = getTuningColor(tuningStatus);
        const closestString = getClosestGuitarString(note.frequency);

        setState((prev) => ({
          ...prev,
          currentFrequency: note.frequency,
          currentNote: note,
          tuningStatus,
          tuningColor,
          confidence: note.confidence,
          closestString,
          isStable: true, // Aubio ya maneja la estabilidad
          error: null,
        }));
      }
    };

    window.addEventListener(
      'noteDetected',
      handleNoteDetected as EventListener
    );

    return () => {
      window.removeEventListener(
        'noteDetected',
        handleNoteDetected as EventListener
      );
    };
  }, [state.isSupported]);

  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      if (analyzerRef.current) {
        analyzerRef.current.stopListening();
      }
    };
  }, []);

  const startListening = useCallback(async () => {
    if (!analyzerRef.current || !state.isSupported) {
      throw new Error('Audio analyzer not supported or not initialized');
    }

    try {
      setState((prev) => ({ ...prev, error: null }));
      await analyzerRef.current.startListening();

      setState((prev) => ({
        ...prev,
        isListening: true,
        error: null,
      }));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to start listening';
      setState((prev) => ({
        ...prev,
        error: errorMessage,
        isListening: false,
      }));
      throw error;
    }
  }, [state.isSupported]);

  const stopListening = useCallback(() => {
    if (!analyzerRef.current) return;

    try {
      analyzerRef.current.stopListening();

      setState((prev) => ({
        ...prev,
        isListening: false,
        currentFrequency: 0,
        currentNote: {
          name: '--',
          frequency: 0,
          octave: 0,
          cents: 0,
          confidence: 0,
        },
        tuningStatus: 'afinado',
        tuningColor: 'var(--text-secondary)',
        confidence: 0,
        closestString: '--',
        isStable: false,
        error: null,
      }));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to stop listening';
      setState((prev) => ({
        ...prev,
        error: errorMessage,
      }));
    }
  }, []);

  const toggleListening = useCallback(async () => {
    if (state.isListening) {
      stopListening();
    } else {
      await startListening();
    }
  }, [state.isListening, startListening, stopListening]);

  const forceSupport = () => {
    setState((prev) => ({ ...prev, forceSupported: true, isSupported: true }));
  };

  return {
    ...state,
    startListening,
    stopListening,
    toggleListening,
    forceSupport,
  };
}
