// Mapeo de frecuencias a notas musicales
export interface Note {
  name: string;
  frequency: number;
  octave: number;
  cents: number;
  confidence: number; // Nivel de confianza en la detección
}

// Frecuencias base para A4 (440Hz) y cálculo de otras notas
const A4_FREQUENCY = 440;
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

// Frecuencias estándar de las cuerdas de guitarra (E2, A2, D3, G3, B3, E4)
const GUITAR_STRINGS = {
  E2: 82.41,
  A2: 110.0,
  D3: 146.83,
  G3: 196.0,
  B3: 246.94,
  E4: 329.63,
};

/**
 * Calcula la frecuencia de una nota MIDI
 * @param midiNote - Número de nota MIDI (0-127)
 * @returns Frecuencia en Hz
 */
export function midiNoteToFrequency(midiNote: number): number {
  return A4_FREQUENCY * Math.pow(2, (midiNote - A4_MIDI_NOTE) / 12);
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

  // Calcular nota MIDI más cercana
  const midiNote = Math.round(
    12 * Math.log2(frequency / A4_FREQUENCY) + A4_MIDI_NOTE
  );

  // Calcular frecuencia de la nota más cercana
  const targetFrequency = midiNoteToFrequency(midiNote);

  // Calcular desviación en cents
  const cents = Math.round(1200 * Math.log2(frequency / targetFrequency));

  // Obtener nombre de la nota y octave
  const noteIndex = midiNote % 12;
  const octave = Math.floor(midiNote / 12) - 1;
  const noteName = NOTE_NAMES[noteIndex];

  // Calcular nivel de confianza basado en la estabilidad de la frecuencia
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
 * Obtiene la cuerda de guitarra más cercana a una frecuencia dada
 * @param frequency - Frecuencia en Hz
 * @returns Nombre de la cuerda más cercana
 */
export function getClosestGuitarString(frequency: number): string {
  if (frequency <= 0) return '--';

  let closestString = '';
  let minDifference = Infinity;

  for (const [stringName, stringFreq] of Object.entries(GUITAR_STRINGS)) {
    const difference = Math.abs(frequency - stringFreq);
    if (difference < minDifference) {
      minDifference = difference;
      closestString = stringName;
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
  const stringFreq = GUITAR_STRINGS[stringName as keyof typeof GUITAR_STRINGS];
  if (!stringFreq) return false;

  return Math.abs(frequency - stringFreq) <= tolerance;
}
