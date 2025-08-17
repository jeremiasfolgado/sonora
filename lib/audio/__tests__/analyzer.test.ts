import { AudioAnalyzer } from '../analyzer';

describe('AudioAnalyzer - Static Methods', () => {
  describe('isSupported', () => {
    it('should return true when AudioContext is supported', () => {
      // Mock AudioContext
      Object.defineProperty(window, 'AudioContext', {
        value: jest.fn().mockImplementation(() => ({
          state: 'running',
          close: jest.fn(),
        })),
        writable: true,
      });

      expect(AudioAnalyzer.isSupported()).toBe(true);
    });

    it('should return false when AudioContext is not supported', () => {
      // Mock AudioContext as undefined
      Object.defineProperty(window, 'AudioContext', {
        value: undefined,
        writable: true,
      });

      expect(AudioAnalyzer.isSupported()).toBe(false);
    });

    it('should return false when AudioContext creation fails', () => {
      // Mock AudioContext that throws error
      Object.defineProperty(window, 'AudioContext', {
        value: jest.fn().mockImplementation(() => {
          throw new Error('AudioContext not supported');
        }),
        writable: true,
      });

      expect(AudioAnalyzer.isSupported()).toBe(false);
    });
  });

  describe('isMediaDevicesSupported', () => {
    it('should return true when getUserMedia is supported', () => {
      // Mock mediaDevices
      Object.defineProperty(navigator, 'mediaDevices', {
        value: {
          getUserMedia: jest.fn(),
        },
        writable: true,
      });

      expect(AudioAnalyzer.isMediaDevicesSupported()).toBe(true);
    });

    it('should return false when getUserMedia is not supported', () => {
      // Mock mediaDevices as undefined
      Object.defineProperty(navigator, 'mediaDevices', {
        value: undefined,
        writable: true,
      });

      expect(AudioAnalyzer.isMediaDevicesSupported()).toBe(false);
    });
  });

  describe('isAubioSupported', () => {
    it('should return true when Aubio is available', () => {
      // Mock aubio
      Object.defineProperty(window, 'aubio', {
        value: jest.fn(),
        writable: true,
      });

      expect(AudioAnalyzer.isAubioSupported()).toBe(true);
    });

    it('should return false when Aubio is not available', () => {
      // Mock aubio as undefined
      Object.defineProperty(window, 'aubio', {
        value: undefined,
        writable: true,
      });

      expect(AudioAnalyzer.isAubioSupported()).toBe(false);
    });
  });
});
