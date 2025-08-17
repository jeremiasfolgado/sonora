import { renderHook, act } from '@testing-library/react';
import { useTuning, DEFAULT_TUNINGS } from '../useTuning';

describe('useTuning Hook', () => {
  it('initializes with standard tuning', () => {
    const { result } = renderHook(() => useTuning());

    expect(result.current.currentTuning).toEqual(DEFAULT_TUNINGS[0]);
    expect(result.current.customSemitones).toBe(0);
    expect(result.current.totalSemitones).toBe(0);
  });

  it('changes tuning correctly', () => {
    const { result } = renderHook(() => useTuning());

    act(() => {
      result.current.changeTuning(DEFAULT_TUNINGS[1]); // Drop D
    });

    expect(result.current.currentTuning).toEqual(DEFAULT_TUNINGS[1]);
    expect(result.current.customSemitones).toBe(0);
    expect(result.current.totalSemitones).toBe(-2);
  });

  it('increases semitones correctly', () => {
    const { result } = renderHook(() => useTuning());

    act(() => {
      result.current.increaseSemitone();
    });

    expect(result.current.customSemitones).toBe(1);
    expect(result.current.totalSemitones).toBe(1);
  });

  it('decreases semitones correctly', () => {
    const { result } = renderHook(() => useTuning());

    act(() => {
      result.current.decreaseSemitone();
    });

    expect(result.current.customSemitones).toBe(-1);
    expect(result.current.totalSemitones).toBe(-1);
  });

  it('resets tuning correctly', () => {
    const { result } = renderHook(() => useTuning());

    // Cambiar afinación y semitonos
    act(() => {
      result.current.changeTuning(DEFAULT_TUNINGS[2]); // Drop C
      result.current.increaseSemitone();
      result.current.increaseSemitone();
    });

    expect(result.current.totalSemitones).toBe(-2); // -4 + 2 = -2

    // Resetear solo customSemitones
    act(() => {
      result.current.resetTuning();
    });

    expect(result.current.currentTuning).toEqual(DEFAULT_TUNINGS[2]); // Mantiene la afinación seleccionada
    expect(result.current.customSemitones).toBe(0);
    expect(result.current.totalSemitones).toBe(-4); // Solo currentTuning.semitones
  });

  it('calculates adjusted frequency correctly', () => {
    const { result } = renderHook(() => useTuning());

    // Afinación estándar (440 Hz)
    let adjustedFreq = result.current.getAdjustedFrequency(440);
    expect(adjustedFreq).toBeCloseTo(440, 1);

    // Aumentar un semitono
    act(() => {
      result.current.increaseSemitone();
    });

    adjustedFreq = result.current.getAdjustedFrequency(440);
    expect(adjustedFreq).toBeCloseTo(466.16, 1); // 440 * 2^(1/12)

    // Cambiar a Drop D (-2 semitonos)
    act(() => {
      result.current.changeTuning(DEFAULT_TUNINGS[1]);
    });

    adjustedFreq = result.current.getAdjustedFrequency(440);
    expect(adjustedFreq).toBeCloseTo(392.0, 1); // 440 * 2^(-2/12)
  });

  it('displays correct tuning name', () => {
    const { result } = renderHook(() => useTuning());

    // Afinación estándar
    expect(result.current.getTuningDisplayName()).toBe('Estandar');

    // Con semitonos personalizados
    act(() => {
      result.current.increaseSemitone();
    });

    expect(result.current.getTuningDisplayName()).toBe('Estandar +1 semitones');

    // Con afinación predefinida
    act(() => {
      result.current.changeTuning(DEFAULT_TUNINGS[1]); // Drop D
    });

    expect(result.current.getTuningDisplayName()).toBe('Drop D');

    // Con afinación predefinida + semitonos personalizados
    act(() => {
      result.current.increaseSemitone();
    });

    expect(result.current.getTuningDisplayName()).toBe('Drop D +1 semitones');
  });

  it('provides all available tunings', () => {
    // DEFAULT_TUNINGS está disponible como import, no como propiedad del hook
    expect(DEFAULT_TUNINGS).toHaveLength(10);
    expect(DEFAULT_TUNINGS[0].name).toBe('Estandar');
    expect(DEFAULT_TUNINGS[0].semitones).toBe(0);
  });
});
