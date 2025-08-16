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
}

export interface UseTunerReturn extends TunerState {
  startListening: () => Promise<void>;
  stopListening: () => void;
  toggleListening: () => Promise<void>;
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
  });

  const analyzerRef = useRef<AudioAnalyzer | null>(null);
  const isInitializedRef = useRef(false);

  // Verificar soporte solo en el cliente
  useEffect(() => {
    const checkSupport = () => {
      const isSupported =
        AudioAnalyzer.isSupported() && AudioAnalyzer.isMediaDevicesSupported();
      setState((prev) => ({ ...prev, isSupported }));
      return isSupported;
    };

    // Solo verificar si estamos en el cliente
    if (typeof window !== 'undefined') {
      checkSupport();
    }
  }, []);

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
        console.log('🎵 Analizador de audio inicializado correctamente');
      } catch (error) {
        console.error('Error inicializando analizador:', error);
        setState((prev) => ({
          ...prev,
          error: 'Failed to initialize audio analyzer',
          isSupported: false,
        }));
      }
    };

    initAnalyzer();
  }, [state.isSupported]);

  // Configurar listener para frecuencias detectadas
  useEffect(() => {
    if (!state.isSupported) return;

    const handleNoteDetected = (event: CustomEvent) => {
      const { noteData } = event.detail;

      if (noteData && noteData.frequency > 0) {
        // Convertir la nota de Aubio a nuestro formato
        const note: Note = {
          name: noteData.name,
          frequency: noteData.frequency,
          octave: noteData.octave,
          cents: noteData.cents,
          confidence: 0.9, // Aubio es muy confiable
        };

        const tuningStatus = getTuningStatus(note.cents);
        const tuningColor = getTuningColor(tuningStatus);
        const closestString = getClosestGuitarString(noteData.frequency);

        setState((prev) => ({
          ...prev,
          currentFrequency: noteData.frequency,
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

  return {
    ...state,
    startListening,
    stopListening,
    toggleListening,
  };
}
