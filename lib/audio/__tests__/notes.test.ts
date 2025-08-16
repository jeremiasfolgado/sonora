import {
  midiNoteToFrequency,
  frequencyToNote,
  getFullNoteName,
  isNoteInTune,
  getTuningStatus,
  getTuningColor,
} from '../notes';

describe('Notes Utilities', () => {
  describe('midiNoteToFrequency', () => {
    it('calculates correct frequency for A4 (MIDI note 69)', () => {
      const frequency = midiNoteToFrequency(69);
      expect(frequency).toBeCloseTo(440, 1);
    });

    it('calculates correct frequency for C4 (MIDI note 60)', () => {
      const frequency = midiNoteToFrequency(60);
      expect(frequency).toBeCloseTo(261.63, 1);
    });

    it('calculates correct frequency for E2 (MIDI note 40)', () => {
      const frequency = midiNoteToFrequency(40);
      expect(frequency).toBeCloseTo(82.41, 1);
    });
  });

  describe('frequencyToNote', () => {
    it('returns default note for invalid frequency', () => {
      const note = frequencyToNote(0);
      expect(note.name).toBe('--');
      expect(note.frequency).toBe(0);
      expect(note.octave).toBe(0);
      expect(note.cents).toBe(0);
    });

    it('returns default note for negative frequency', () => {
      const note = frequencyToNote(-100);
      expect(note.name).toBe('--');
    });

    it('correctly identifies A4 (440 Hz)', () => {
      const note = frequencyToNote(440);
      expect(note.name).toBe('A');
      expect(note.octave).toBe(4);
      expect(note.cents).toBeCloseTo(0, 0);
    });

    it('correctly identifies C4 (261.63 Hz)', () => {
      const note = frequencyToNote(261.63);
      expect(note.name).toBe('C');
      expect(note.octave).toBe(4);
      expect(note.cents).toBeCloseTo(0, 0);
    });

    it('calculates cents deviation correctly', () => {
      // A4 + 50 cents = 440 * 2^(50/1200) ≈ 466.16 Hz
      const note = frequencyToNote(466.16);
      expect(note.name).toBe('A#');
      expect(note.octave).toBe(4);
      // La frecuencia 466.16 Hz está muy cerca de A#, por lo que los cents serán cercanos a 0
      expect(note.cents).toBeCloseTo(0, 0);
    });
  });

  describe('getFullNoteName', () => {
    it('returns dash for default note', () => {
      const note = { name: '--', frequency: 0, octave: 0, cents: 0 };
      expect(getFullNoteName(note)).toBe('--');
    });

    it('returns correct full note name', () => {
      const note = { name: 'A', frequency: 440, octave: 4, cents: 0 };
      expect(getFullNoteName(note)).toBe('A4');
    });

    it('handles sharp notes correctly', () => {
      const note = { name: 'C#', frequency: 277.18, octave: 4, cents: 0 };
      expect(getFullNoteName(note)).toBe('C#4');
    });
  });

  describe('isNoteInTune', () => {
    it('returns true for perfectly tuned note', () => {
      expect(isNoteInTune(0)).toBe(true);
    });

    it('returns true for note within tolerance', () => {
      expect(isNoteInTune(5)).toBe(true);
      expect(isNoteInTune(-8)).toBe(true);
    });

    it('returns false for note outside tolerance', () => {
      expect(isNoteInTune(15)).toBe(false);
      expect(isNoteInTune(-20)).toBe(false);
    });

    it('uses custom tolerance', () => {
      expect(isNoteInTune(15, 20)).toBe(true);
      expect(isNoteInTune(25, 20)).toBe(false);
    });
  });

  describe('getTuningStatus', () => {
    it('returns "afinado" for in-tune notes', () => {
      expect(getTuningStatus(0)).toBe('afinado');
      expect(getTuningStatus(5)).toBe('afinado');
      expect(getTuningStatus(-8)).toBe('afinado');
    });

    it('returns "plano" for flat notes', () => {
      expect(getTuningStatus(-15)).toBe('plano');
      expect(getTuningStatus(-50)).toBe('plano');
    });

    it('returns "agudo" for sharp notes', () => {
      expect(getTuningStatus(15)).toBe('agudo');
      expect(getTuningStatus(50)).toBe('agudo');
    });

    it('uses custom tolerance', () => {
      expect(getTuningStatus(15, 20)).toBe('afinado');
      expect(getTuningStatus(25, 20)).toBe('agudo');
    });
  });

  describe('getTuningColor', () => {
    it('returns success color for "afinado"', () => {
      expect(getTuningColor('afinado')).toBe('var(--success-color)');
    });

    it('returns warning color for "plano"', () => {
      expect(getTuningColor('plano')).toBe('var(--warning-color)');
    });

    it('returns error color for "agudo"', () => {
      expect(getTuningColor('agudo')).toBe('var(--error-color)');
    });
  });
});
