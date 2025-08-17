import BigNumber from 'bignumber.js';

// Mapeo de frecuencias a notas musicales
export interface Note {
  name: string;
  frequency: number;
  octave: number;
  cents: number;
  confidence: number; // Nivel de confianza en la detección
}

// Frecuencias base para A4 (440Hz) y cálculo de otras notas
const A4_FREQUENCY = new BigNumber(440);
const A4_MIDI_NOTE = 69;

// Nombres de las notas en orden cromático
const NOTE_NAMES = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
];

// Matriz de afinaciones predefinidas
interface TuningMatrix {
  name: string;
  semitones: number;
  strings: {
    E2: { name: string; frequency: number };
    A2: { name: string; frequency: number };
    D3: { name: string; frequency: number };
    G3: { name: string; frequency: number };
    B3: { name: string; frequency: number };
    E4: { name: string; frequency: number };
  };
}

// Matrices de afinaciones predefinidas con frecuencias exactas
const TUNING_MATRICES: TuningMatrix[] = [
  {
    name: 'Estandar',
    semitones: 0,
    strings: {
      E2: { name: 'E2', frequency: 82.41 },
      A2: { name: 'A2', frequency: 110.0 },
      D3: { name: 'D3', frequency: 146.83 },
      G3: { name: 'G3', frequency: 196.0 },
      B3: { name: 'B3', frequency: 246.94 },
      E4: { name: 'E4', frequency: 329.63 },
    },
  },
  {
    name: 'Medio Tono Abajo',
    semitones: -1,
    strings: {
      E2: { name: 'D#2', frequency: 77.78 },
      A2: { name: 'G#2', frequency: 103.83 },
      D3: { name: 'C#3', frequency: 138.59 },
      G3: { name: 'F#3', frequency: 184.99 },
      B3: { name: 'A#3', frequency: 233.08 },
      E4: { name: 'D#4', frequency: 311.13 },
    },
  },
  {
    name: 'Un Tono Abajo',
    semitones: -2,
    strings: {
      E2: { name: 'D2', frequency: 73.42 },
      A2: { name: 'G2', frequency: 98.0 },
      D3: { name: 'C3', frequency: 130.81 },
      G3: { name: 'F3', frequency: 174.61 },
      B3: { name: 'A3', frequency: 220.0 },
      E4: { name: 'D4', frequency: 293.66 },
    },
  },
  {
    name: 'Medio Tono Arriba',
    semitones: 1,
    strings: {
      E2: { name: 'F2', frequency: 87.31 },
      A2: { name: 'A#2', frequency: 116.54 },
      D3: { name: 'D#3', frequency: 155.56 },
      G3: { name: 'G#3', frequency: 207.65 },
      B3: { name: 'C4', frequency: 261.63 },
      E4: { name: 'F4', frequency: 349.23 },
    },
  },
  {
    name: 'Un Tono Arriba',
    semitones: 2,
    strings: {
      E2: { name: 'F#2', frequency: 92.5 },
      A2: { name: 'B2', frequency: 123.47 },
      D3: { name: 'E3', frequency: 164.81 },
      G3: { name: 'A3', frequency: 220.0 },
      B3: { name: 'C#4', frequency: 277.18 },
      E4: { name: 'F#4', frequency: 369.99 },
    },
  },
];

// Variable global para el offset de afinación
let globalTuningOffset = new BigNumber(0);

/**
 * Establece el offset global de afinación en semitonos
 * @param semitones - Número de semitonos a ajustar (positivo = subir, negativo = bajar)
 */
export function setTuningOffset(semitones: number): void {
  globalTuningOffset = new BigNumber(semitones);
}

/**
 * Obtiene el offset de afinación global en semitonos
 * @returns Offset de afinación en semitonos
 */
export function getTuningOffset(): number {
  return globalTuningOffset.toNumber();
}

/**
 * Ajusta una frecuencia según el offset de afinación global
 * @param frequency - Frecuencia base en Hz
 * @returns Frecuencia ajustada en Hz
 */
export function adjustFrequencyForTuning(frequency: number): number {
  if (globalTuningOffset.isZero()) return frequency;

  const freqBN = new BigNumber(frequency);
  const semitoneRatio = Math.pow(
    2,
    globalTuningOffset.dividedBy(12).toNumber()
  );
  return freqBN.times(semitoneRatio).toNumber();
}

/**
 * Calcula la frecuencia de una nota MIDI
 * @param midiNote - Número de nota MIDI (0-127)
 * @returns Frecuencia en Hz
 */
export function midiNoteToFrequency(midiNote: number): number {
  const semitoneDiff = midiNote - A4_MIDI_NOTE;
  const ratio = Math.pow(2, semitoneDiff / 12);
  const baseFrequency = A4_FREQUENCY.times(ratio);
  return adjustFrequencyForTuning(baseFrequency.toNumber());
}

/**
 * Convierte una frecuencia a la nota musical más cercana
 * @param frequency - Frecuencia en Hz
 * @returns Objeto Note con información de la nota
 */
export function frequencyToNote(frequency: number): Note {
  if (frequency <= 0) {
    return {
      name: '--',
      frequency: 0,
      octave: 0,
      cents: 0,
      confidence: 0,
    };
  }

  // Para un afinador de guitarra, calcular cents contra la cuerda más cercana
  const closestString = getClosestGuitarString(frequency);

  if (closestString === '--') {
    // Si no hay cuerda cercana, usar el cálculo estándar
    const ratio = frequency / A4_FREQUENCY.toNumber();
    const logRatio = Math.log2(ratio);
    const midiNote = Math.round(logRatio * 12 + A4_MIDI_NOTE);

    const baseMidiNote = midiNote - A4_MIDI_NOTE;
    const baseRatio = Math.pow(2, baseMidiNote / 12);
    const baseFrequency = A4_FREQUENCY.times(baseRatio);
    const targetFrequency = adjustFrequencyForTuning(baseFrequency.toNumber());
    const cents = calculateCents(frequency, targetFrequency);

    const noteIndex = midiNote % 12;
    const octave = Math.floor(midiNote / 12) - 1;
    const noteName = NOTE_NAMES[noteIndex];

    const confidence = calculateConfidence(frequency, targetFrequency, cents);

    return {
      name: noteName,
      frequency: targetFrequency,
      octave,
      cents,
      confidence,
    };
  }

  // Calcular cents contra la cuerda de guitarra más cercana
  const adjustedStrings = getAdjustedGuitarStrings();
  const stringInfo = adjustedStrings[closestString];

  if (!stringInfo) {
    // Fallback si no se encuentra la información de la cuerda
    return {
      name: '--',
      frequency: 0,
      octave: 0,
      cents: 0,
      confidence: 0,
    };
  }

  // Calcular cents contra la frecuencia de la cuerda ajustada
  const targetFrequency = stringInfo.frequency;
  const cents = calculateCents(frequency, targetFrequency);

  // Extraer el nombre de la nota completo (incluyendo # si existe)
  let noteName = stringInfo.name.charAt(0);
  if (stringInfo.name.length > 1 && stringInfo.name.charAt(1) === '#') {
    noteName = stringInfo.name.substring(0, 2); // "D#"
  }

  // Extraer la octave (asumiendo que está al final)
  const octaveMatch = stringInfo.name.match(/\d+$/);
  const octave = octaveMatch ? parseInt(octaveMatch[0]) : 0;

  const confidence = calculateConfidence(frequency, targetFrequency, cents);

  return {
    name: noteName,
    frequency: targetFrequency,
    octave,
    cents,
    confidence,
  };
}

/**
 * Calcula la diferencia en cents entre dos frecuencias
 * @param actualFreq - Frecuencia detectada
 * @param targetFreq - Frecuencia objetivo
 * @returns Diferencia en cents
 */
function calculateCents(actualFreq: number, targetFreq: number): number {
  if (targetFreq <= 0) return 0;

  const ratio = actualFreq / targetFreq;
  const cents = Math.log2(ratio) * 1200;

  return Math.round(cents);
}

/**
 * Calcula el nivel de confianza en la detección de la nota
 * @param actualFreq - Frecuencia detectada
 * @param targetFreq - Frecuencia objetivo de la nota
 * @param cents - Desviación en cents
 * @returns Nivel de confianza (0-1)
 */
function calculateConfidence(
  actualFreq: number,
  targetFreq: number,
  cents: number
): number {
  // Base de confianza en la desviación de cents
  const centsConfidence = Math.max(0, 1 - Math.abs(cents) / 50);

  // Confianza en la estabilidad de la frecuencia
  const freqStability = Math.max(
    0,
    1 - Math.abs(actualFreq - targetFreq) / targetFreq
  );

  // Confianza combinada
  return (centsConfidence + freqStability) / 2;
}

/**
 * Obtiene el nombre completo de una nota (ej: "A4", "C#3")
 * @param note - Objeto Note
 * @returns Nombre completo de la nota
 */
export function getFullNoteName(note: Note): string {
  if (note.name === '--') return '--';
  return `${note.name}${note.octave}`;
}

/**
 * Determina si una nota está afinada basándose en la desviación en cents
 * @param cents - Desviación en cents
 * @param tolerance - Tolerancia en cents (por defecto 10)
 * @returns true si está afinada, false si no
 */
export function isNoteInTune(cents: number, tolerance: number = 10): boolean {
  return Math.abs(cents) <= tolerance;
}

/**
 * Obtiene el estado de afinación como string
 * @param cents - Desviación en cents
 * @param tolerance - Tolerancia en cents (por defecto 10)
 * @returns "plano", "afinado", o "agudo"
 */
export function getTuningStatus(
  cents: number,
  tolerance: number = 10
): 'plano' | 'afinado' | 'agudo' {
  if (Math.abs(cents) <= tolerance) {
    return 'afinado';
  }
  return cents < 0 ? 'plano' : 'agudo';
}

/**
 * Obtiene el color CSS para el estado de afinación
 * @param status - Estado de afinación
 * @returns Color CSS
 */
export function getTuningColor(status: 'plano' | 'afinado' | 'agudo'): string {
  switch (status) {
    case 'afinado':
      return 'var(--success-color)';
    case 'plano':
      return 'var(--warning-color)';
    case 'agudo':
      return 'var(--error-color)';
    default:
      return 'var(--text-secondary)';
  }
}

/**
 * Obtiene las cuerdas de guitarra ajustadas según el offset de afinación
 * @returns Objeto con nombres de cuerdas ajustados y sus frecuencias
 */
export function getAdjustedGuitarStrings(): Record<
  string,
  { name: string; frequency: number }
> {
  // Buscar la matriz de afinación que coincida con el offset actual
  const tuningMatrix = TUNING_MATRICES.find(
    (tuning) => tuning.semitones === globalTuningOffset.toNumber()
  );

  if (tuningMatrix) {
    // Usar la matriz predefinida
    const result: Record<string, { name: string; frequency: number }> = {};
    for (const [stringName, stringInfo] of Object.entries(
      tuningMatrix.strings
    )) {
      result[stringName] = {
        name: stringInfo.name,
        frequency: stringInfo.frequency,
      };
    }
    return result;
  }

  // Si no hay matriz predefinida, usar la afinación estándar
  const standardTuning = TUNING_MATRICES[0];
  const result: Record<string, { name: string; frequency: number }> = {};
  for (const [stringName, stringInfo] of Object.entries(
    standardTuning.strings
  )) {
    result[stringName] = {
      name: stringInfo.name,
      frequency: stringInfo.frequency,
    };
  }
  return result;
}

/**
 * Obtiene la cuerda de guitarra más cercana a una frecuencia dada
 * @param frequency - Frecuencia en Hz
 * @returns Nombre de la cuerda más cercana
 */
export function getClosestGuitarString(frequency: number): string {
  if (frequency <= 0) {
    return '--';
  }

  const adjustedStrings = getAdjustedGuitarStrings();

  let closestString = '';
  let minDifference = new BigNumber(Infinity);

  for (const [stringName, stringInfo] of Object.entries(adjustedStrings)) {
    const difference = new BigNumber(
      Math.abs(frequency - stringInfo.frequency)
    );

    if (difference.isLessThan(minDifference)) {
      minDifference = difference;
      closestString = stringName; // Usar el nombre original (E2, A2, etc.)
    }
  }

  return closestString;
}

/**
 * Verifica si una frecuencia está cerca de una cuerda de guitarra específica
 * @param frequency - Frecuencia en Hz
 * @param stringName - Nombre de la cuerda (ej: "E2", "A2")
 * @param tolerance - Tolerancia en Hz (por defecto 5)
 * @returns true si está cerca de la cuerda
 */
export function isNearGuitarString(
  frequency: number,
  stringName: string,
  tolerance: number = 5
): boolean {
  const adjustedStrings = getAdjustedGuitarStrings();

  // Buscar la cuerda por su nombre original (E2, A2, etc.)
  if (adjustedStrings[stringName]) {
    const difference = new BigNumber(
      Math.abs(frequency - adjustedStrings[stringName].frequency)
    );
    return difference.isLessThanOrEqualTo(tolerance);
  }

  return false;
}

/**
 * Obtiene la frecuencia ajustada de una cuerda de guitarra
 * @param stringName - Nombre de la cuerda (ej: "E2", "A2")
 * @returns Frecuencia ajustada en Hz
 */
export function getGuitarStringFrequency(stringName: string): number {
  const adjustedStrings = getAdjustedGuitarStrings();

  // Buscar la cuerda por su nombre original (E2, A2, etc.)
  // stringName es el nombre original (E2), no el ajustado (D#2)
  if (adjustedStrings[stringName]) {
    return adjustedStrings[stringName].frequency;
  }

  return 0;
}
