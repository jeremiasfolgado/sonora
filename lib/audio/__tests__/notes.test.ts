import {
  frequencyToNote,
  midiNoteToFrequency,
  getFullNoteName,
  isNoteInTune,
  getTuningStatus,
  getTuningColor,
  setTuningOffset,
  getTuningOffset,
  getAdjustedGuitarStrings,
  getClosestGuitarString,
  getGuitarStringFrequency,
  adjustFrequencyForTuning,
} from '../notes';

describe('Notes Utilities', () => {
  beforeEach(() => {
    // Reset tuning offset before each test
    setTuningOffset(0);
  });

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
      expect(note.cents).toBe(0);
    });

    it('returns default note for negative frequency', () => {
      const note = frequencyToNote(-100);
      expect(note.name).toBe('--');
      expect(note.frequency).toBe(0);
      expect(note.cents).toBe(0);
    });

    it('correctly identifies A4 (440 Hz)', () => {
      const note = frequencyToNote(440);
      expect(note.name).toBe('A');
      expect(note.octave).toBe(4);
      expect(note.cents).toBe(0);
    });

    it('correctly identifies C4 (261.63 Hz)', () => {
      const note = frequencyToNote(261.63);
      expect(note.name).toBe('C');
      expect(note.octave).toBe(4);
      expect(note.cents).toBe(0);
    });

    it('calculates cents deviation correctly', () => {
      const note = frequencyToNote(442); // 2 Hz sharp
      expect(note.name).toBe('A');
      expect(note.octave).toBe(4);
      expect(note.cents).toBeCloseTo(8, 0);
    });
  });

  describe('getFullNoteName', () => {
    it('returns dash for default note', () => {
      const note = { name: '--', frequency: 0, octave: 0, cents: 0, confidence: 0 };
      expect(getFullNoteName(note)).toBe('--');
    });

    it('returns correct full note name', () => {
      const note = { name: 'A', frequency: 440, octave: 4, cents: 0, confidence: 0.9 };
      expect(getFullNoteName(note)).toBe('A4');
    });

    it('handles sharp notes correctly', () => {
      const note = { name: 'C#', frequency: 277.18, octave: 4, cents: 0, confidence: 0.9 };
      expect(getFullNoteName(note)).toBe('C#4');
    });
  });

  describe('isNoteInTune', () => {
    it('returns true for perfectly tuned note', () => {
      expect(isNoteInTune(0)).toBe(true);
    });

    it('returns true for note within tolerance', () => {
      expect(isNoteInTune(5)).toBe(true);
      expect(isNoteInTune(-5)).toBe(true);
    });

    it('returns false for note outside tolerance', () => {
      expect(isNoteInTune(15)).toBe(false);
      expect(isNoteInTune(-15)).toBe(false);
    });

    it('uses custom tolerance', () => {
      expect(isNoteInTune(20, 25)).toBe(true);
    });
  });

  describe('getTuningStatus', () => {
    it('returns "afinado" for in-tune notes', () => {
      expect(getTuningStatus(0)).toBe('afinado');
      expect(getTuningStatus(5)).toBe('afinado');
      expect(getTuningStatus(-5)).toBe('afinado');
    });

    it('returns "plano" for flat notes', () => {
      expect(getTuningStatus(-15)).toBe('plano');
    });

    it('returns "agudo" for sharp notes', () => {
      expect(getTuningStatus(15)).toBe('agudo');
    });

    it('uses custom tolerance', () => {
      expect(getTuningStatus(20, 25)).toBe('afinado');
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

  describe('Tuning Offset System', () => {
    it('sets and gets tuning offset correctly', () => {
      setTuningOffset(-1);
      expect(getTuningOffset()).toBe(-1);
      
      setTuningOffset(2);
      expect(getTuningOffset()).toBe(2);
    });

    it('adjusts guitar strings correctly with -1 semitone', () => {
      setTuningOffset(-1);
      const adjustedStrings = getAdjustedGuitarStrings();
      
      // E2 should become D#2
      expect(adjustedStrings.E2.name).toBe('D#2');
      expect(adjustedStrings.E2.frequency).toBeCloseTo(77.78, 1);
      
      // A2 should become G#2
      expect(adjustedStrings.A2.name).toBe('G#2');
      expect(adjustedStrings.A2.frequency).toBeCloseTo(103.83, 1);
    });

    it('adjusts guitar strings correctly with +1 semitone', () => {
      setTuningOffset(1);
      const adjustedStrings = getAdjustedGuitarStrings();
      
      // E2 should become F2
      expect(adjustedStrings.E2.name).toBe('F2');
      expect(adjustedStrings.E2.frequency).toBeCloseTo(87.31, 1);
      
      // A2 should become A#2
      expect(adjustedStrings.A2.name).toBe('A#2');
      expect(adjustedStrings.E2.frequency).toBeCloseTo(87.31, 1);
    });

    it('returns original strings when no offset', () => {
      setTuningOffset(0);
      const adjustedStrings = getAdjustedGuitarStrings();
      
      expect(adjustedStrings.E2.name).toBe('E2');
      expect(adjustedStrings.E2.frequency).toBeCloseTo(82.41, 1);
      expect(adjustedStrings.A2.name).toBe('A2');
      expect(adjustedStrings.A2.frequency).toBeCloseTo(110.0, 1);
    });

    it('adjusts individual string frequencies correctly', () => {
      setTuningOffset(-1);
      
      // Test individual string frequency adjustment
      const e2Freq = getGuitarStringFrequency('E2');
      expect(e2Freq).toBeCloseTo(77.78, 1);
      
      const a2Freq = getGuitarStringFrequency('A2');
      expect(a2Freq).toBeCloseTo(103.83, 1);
      
      const d3Freq = getGuitarStringFrequency('D3');
      expect(d3Freq).toBeCloseTo(138.59, 1);
    });

    it('adjusts frequency for tuning correctly', () => {
      setTuningOffset(-1);
      
      // Test the adjustFrequencyForTuning function directly
      const originalFreq = 82.41; // E2
      const adjustedFreq = adjustFrequencyForTuning(originalFreq);
      expect(adjustedFreq).toBeCloseTo(77.78, 1);
      
      setTuningOffset(1);
      const adjustedFreqUp = adjustFrequencyForTuning(originalFreq);
      expect(adjustedFreqUp).toBeCloseTo(87.31, 1);
    });
  });

  describe('Guitar String Functions', () => {
    it('finds closest guitar string correctly', () => {
      setTuningOffset(0);
      const closestString = getClosestGuitarString(82.41);
      expect(closestString).toBe('E2');
    });

    it('finds closest guitar string with tuning offset', () => {
      setTuningOffset(-1);
      const closestString = getClosestGuitarString(77.78); // D#2 frequency
      expect(closestString).toBe('D#2');
    });

    it('gets guitar string frequency correctly', () => {
      setTuningOffset(0);
      const frequency = getGuitarStringFrequency('E2');
      expect(frequency).toBeCloseTo(82.41, 1);
    });

    it('gets adjusted guitar string frequency with tuning offset', () => {
      setTuningOffset(-1);
      const frequency = getGuitarStringFrequency('E2'); // Should return D#2 frequency
      expect(frequency).toBeCloseTo(77.78, 1);
    });
  });
});
