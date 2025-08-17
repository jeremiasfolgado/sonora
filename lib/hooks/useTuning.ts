'use client';

import { useState, useCallback, useEffect } from 'react';
import { setTuningOffset } from '../audio/notes';

export interface TuningConfig {
  name: string;
  semitones: number;
  description: string;
}

export const DEFAULT_TUNINGS: TuningConfig[] = [
  {
    name: 'Estandar',
    semitones: 0,
    description: 'Afinación estándar (A4 = 440Hz)',
  },
  {
    name: 'Drop D',
    semitones: -2,
    description: 'Drop D (D2, A2, D3, G3, B3, E4)',
  },
  {
    name: 'Drop C',
    semitones: -4,
    description: 'Drop C (C2, G2, C3, F3, A3, D4)',
  },
  {
    name: 'Open G',
    semitones: -2,
    description: 'Open G (D2, G2, D3, G3, B3, D4)',
  },
  {
    name: 'Open D',
    semitones: -2,
    description: 'Open D (D2, A2, D3, F#3, A3, D4)',
  },
  {
    name: 'DADGAD',
    semitones: -2,
    description: 'DADGAD (D2, A2, D3, G3, A3, D4)',
  },
  {
    name: 'Half Step Down',
    semitones: -1,
    description: 'Medio tono abajo (A4 = 415.3Hz)',
  },
  {
    name: 'Full Step Down',
    semitones: -2,
    description: 'Un tono abajo (A4 = 392Hz)',
  },
  {
    name: 'Half Step Up',
    semitones: 1,
    description: 'Medio tono arriba (A4 = 466.2Hz)',
  },
  {
    name: 'Full Step Up',
    semitones: 2,
    description: 'Un tono arriba (A4 = 493.9Hz)',
  },
];

export function useTuning() {
  const [currentTuning, setCurrentTuning] = useState<TuningConfig>(
    DEFAULT_TUNINGS[0]
  );
  const [customSemitones, setCustomSemitones] = useState(0);

  // Sincronizar el offset de afinación con el módulo de notas
  useEffect(() => {
    const totalSemitones = currentTuning.semitones + customSemitones;
    setTuningOffset(totalSemitones);
  }, [currentTuning.semitones, customSemitones]);

  const changeTuning = useCallback((tuning: TuningConfig) => {
    setCurrentTuning(tuning);
    setCustomSemitones(0);
  }, []);

  const increaseSemitone = useCallback(() => {
    setCustomSemitones((prev) => prev + 1);
  }, []);

  const decreaseSemitone = useCallback(() => {
    setCustomSemitones((prev) => prev - 1);
  }, []);

  const resetTuning = useCallback(() => {
    setCurrentTuning(DEFAULT_TUNINGS[0]);
    setCustomSemitones(0);
  }, []);

  const getTotalSemitones = useCallback(() => {
    return currentTuning.semitones + customSemitones;
  }, [currentTuning.semitones, customSemitones]);

  const getAdjustedFrequency = useCallback(
    (baseFrequency: number) => {
      const totalSemitones = getTotalSemitones();
      return baseFrequency * Math.pow(2, totalSemitones / 12);
    },
    [getTotalSemitones]
  );

  const getTuningDisplayName = useCallback(() => {
    if (customSemitones === 0) {
      return currentTuning.name;
    }
    const sign = customSemitones > 0 ? '+' : '';
    return `${currentTuning.name} ${sign}${customSemitones} semitones`;
  }, [currentTuning.name, customSemitones]);

  return {
    currentTuning,
    customSemitones,
    totalSemitones: getTotalSemitones(),
    changeTuning,
    increaseSemitone,
    decreaseSemitone,
    resetTuning,
    getAdjustedFrequency,
    getTuningDisplayName,
    availableTunings: DEFAULT_TUNINGS,
  };
}
