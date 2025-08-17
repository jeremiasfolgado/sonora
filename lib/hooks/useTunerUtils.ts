import { useEffect } from 'react';
import { getAdjustedGuitarStrings } from '../audio/notes';
import { Note } from '../audio/notes';

export function useTunerUtils() {
  // Función para obtener la frecuencia objetivo de una cuerda (ajustada por afinación)
  const getTargetFrequency = (currentNote: Note | null): number => {
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

  return {
    getTargetFrequency,
    getAdjustedStringName,
  };
}
