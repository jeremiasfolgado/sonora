import '@testing-library/jest-dom';

// Mock Web Audio API for testing
global.AudioContext = jest.fn().mockImplementation(() => ({
  createAnalyser: jest.fn().mockReturnValue({
    connect: jest.fn(),
    disconnect: jest.fn(),
    getByteFrequencyData: jest.fn(),
    getByteTimeDomainData: jest.fn(),
  }),
  createMediaStreamSource: jest.fn().mockReturnValue({
    connect: jest.fn(),
    disconnect: jest.fn(),
  }),
  createScriptProcessor: jest.fn().mockReturnValue({
    connect: jest.fn(),
    disconnect: jest.fn(),
  }),
}));

// Mock navigator.mediaDevices
Object.defineProperty(navigator, 'mediaDevices', {
  value: {
    getUserMedia: jest.fn().mockResolvedValue({
      getTracks: jest.fn().mockReturnValue([{ stop: jest.fn() }]),
    }),
  },
  writable: true,
});
