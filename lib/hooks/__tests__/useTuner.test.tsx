import { renderHook, act, waitFor } from '@testing-library/react';
import { useTuner } from '../useTuner';

// Mock del componente AudioAnalyzer
jest.mock('../../audio/analyzer', () => ({
  AudioAnalyzer: jest.fn().mockImplementation(() => ({
    startListening: jest.fn().mockResolvedValue(undefined),
    stopListening: jest.fn(),
    getStatus: jest.fn().mockReturnValue({ isListening: false, error: null }),
  })),
}));

// Mock de las funciones de notas
jest.mock('../../audio/notes', () => ({
  frequencyToNote: jest.fn().mockReturnValue({
    name: 'A',
    frequency: 440,
    octave: 4,
    cents: 0,
    confidence: 0.9,
  }),
  getTuningStatus: jest.fn().mockReturnValue('afinado'),
  getTuningColor: jest.fn().mockReturnValue('var(--success-color)'),
  getClosestGuitarString: jest.fn().mockReturnValue('E4'),
}));

describe('useTuner Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock de las APIs del navegador
    Object.defineProperty(window, 'AudioContext', {
      value: jest.fn().mockImplementation(() => ({
        createAnalyser: jest.fn(),
        createMediaStreamSource: jest.fn(),
        createScriptProcessor: jest.fn(),
      })),
      writable: true,
    });

    Object.defineProperty(navigator, 'mediaDevices', {
      value: {
        getUserMedia: jest.fn().mockResolvedValue({
          getTracks: jest.fn().mockReturnValue([{ stop: jest.fn() }]),
        }),
      },
      writable: true,
    });

    // Mock de los métodos estáticos de AudioAnalyzer
    const AudioAnalyzerMock = jest.requireMock(
      '../../audio/analyzer'
    ).AudioAnalyzer;
    AudioAnalyzerMock.isSupported = jest.fn().mockReturnValue(true);
    AudioAnalyzerMock.isMediaDevicesSupported = jest.fn().mockReturnValue(true);

    // Mock de Aubio
    Object.defineProperty(window, 'aubio', {
      value: jest.fn().mockResolvedValue({}),
      writable: true,
    });
  });

  it('initializes with correct default state', () => {
    const { result } = renderHook(() => useTuner());

    expect(result.current.isListening).toBe(false);
    expect(result.current.currentFrequency).toBe(0);
    expect(result.current.currentNote.name).toBe('--');
    expect(result.current.tuningStatus).toBe('afinado');
    expect(result.current.error).toBe(null);
    expect(result.current.isSupported).toBe(true);
  });

  it('provides startListening function', () => {
    const { result } = renderHook(() => useTuner());

    expect(typeof result.current.startListening).toBe('function');
  });

  it('provides stopListening function', () => {
    const { result } = renderHook(() => useTuner());

    expect(typeof result.current.stopListening).toBe('function');
  });

  it('provides toggleListening function', () => {
    const { result } = renderHook(() => useTuner());

    expect(typeof result.current.toggleListening).toBe('function');
  });

  it('handles note detection events', async () => {
    const { result } = renderHook(() => useTuner());

    // Simular evento de nota detectada
    act(() => {
      const event = new CustomEvent('noteDetected', {
        detail: { 
          noteData: {
            name: 'A',
            frequency: 440,
            octave: 4,
            cents: 0
          }
        },
      });
      window.dispatchEvent(event);
    });

    await waitFor(() => {
      expect(result.current.currentFrequency).toBe(440);
    });
  });

  it('cleans up event listeners on unmount', () => {
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

    const { unmount } = renderHook(() => useTuner());

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'noteDetected',
      expect.any(Function)
    );
  });

  it('handles unsupported browser gracefully', () => {
    // Mock de navegador no soportado
    Object.defineProperty(window, 'AudioContext', {
      value: undefined,
      writable: true,
    });

    // Mock de los métodos estáticos de AudioAnalyzer para este test
    const AudioAnalyzerMock = jest.requireMock(
      '../../audio/analyzer'
    ).AudioAnalyzer;
    AudioAnalyzerMock.isSupported = jest.fn().mockReturnValue(false);
    AudioAnalyzerMock.isMediaDevicesSupported = jest
      .fn()
      .mockReturnValue(false);

    const { result } = renderHook(() => useTuner());

    expect(result.current.isSupported).toBe(false);
  });
});
