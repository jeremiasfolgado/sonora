import { render, screen, fireEvent } from '@testing-library/react';
import { StringTestButtons } from '../tuner/StringTestButtons';

// Mock de window.AudioContext
const mockAudioContext = {
  createOscillator: jest.fn().mockReturnValue({
    frequency: {
      setValueAtTime: jest.fn(),
    },
    type: '',
    start: jest.fn(),
    stop: jest.fn(),
    connect: jest.fn(),
  }),
  createGain: jest.fn().mockReturnValue({
    gain: {
      setValueAtTime: jest.fn(),
      exponentialRampToValueAtTime: jest.fn(),
    },
    connect: jest.fn(),
  }),
  destination: {},
  currentTime: 0,
  close: jest.fn(),
  state: 'running',
};

// Mock de setTimeout
jest.useFakeTimers();

describe('StringTestButtons', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock de AudioContext
    Object.defineProperty(window, 'AudioContext', {
      value: jest.fn().mockImplementation(() => mockAudioContext),
      writable: true,
    });
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  const mockProps = {
    isSupported: true,
    getAdjustedStringName: jest.fn((name: string) => name),
    getAdjustedFrequency: jest.fn((baseFreq: number) => baseFreq),
  };

  it('should render all guitar string buttons', () => {
    render(<StringTestButtons {...mockProps} />);

    expect(screen.getByText('E2 (6ª)')).toBeInTheDocument();
    expect(screen.getByText('A2 (5ª)')).toBeInTheDocument();
    expect(screen.getByText('D3 (4ª)')).toBeInTheDocument();
    expect(screen.getByText('G3 (3ª)')).toBeInTheDocument();
    expect(screen.getByText('B3 (2ª)')).toBeInTheDocument();
    expect(screen.getByText('E4 (1ª)')).toBeInTheDocument();
  });

  it('should use adjusted frequencies when generating tones', () => {
    // Mock de getAdjustedFrequency para simular Drop D (-2 semitones)
    const mockGetAdjustedFrequency = jest.fn((baseFreq: number) => {
      // Simular Drop D: todas las cuerdas 2 semitonos abajo
      return baseFreq * Math.pow(2, -2 / 12);
    });

    render(
      <StringTestButtons
        {...mockProps}
        getAdjustedFrequency={mockGetAdjustedFrequency}
      />
    );

    // Hacer clic en la 6ª cuerda (E2)
    fireEvent.click(screen.getByText('E2 (6ª)'));

    // Verificar que se llamó con la frecuencia base correcta
    expect(mockGetAdjustedFrequency).toHaveBeenCalledWith(82.41); // E2 base
  });

  it('should use different adjusted frequencies for different tunings', () => {
    // Mock para simular afinación personalizada (+1 semitono)
    const mockGetAdjustedFrequency = jest.fn((baseFreq: number) => {
      return baseFreq * Math.pow(2, 1 / 12);
    });

    render(
      <StringTestButtons
        {...mockProps}
        getAdjustedFrequency={mockGetAdjustedFrequency}
      />
    );

    // Hacer clic en la 1ª cuerda (E4)
    fireEvent.click(screen.getByText('E4 (1ª)'));

    // Verificar que se llamó con la frecuencia base correcta
    expect(mockGetAdjustedFrequency).toHaveBeenCalledWith(329.63); // E4 base
  });

  it('should display adjusted string names when provided', () => {
    // Mock para simular Drop D donde E2 se convierte en D2
    const mockGetAdjustedStringName = jest.fn((name: string) => {
      if (name === 'E2') return 'D2';
      if (name === 'A2') return 'G2';
      if (name === 'D3') return 'C3';
      if (name === 'G3') return 'F3';
      if (name === 'B3') return 'A3';
      if (name === 'E4') return 'D4';
      return name;
    });

    render(
      <StringTestButtons
        {...mockProps}
        getAdjustedStringName={mockGetAdjustedStringName}
      />
    );

    // Verificar que se muestren los nombres ajustados
    expect(screen.getByText('D2 (6ª)')).toBeInTheDocument();
    expect(screen.getByText('G2 (5ª)')).toBeInTheDocument();
    expect(screen.getByText('C3 (4ª)')).toBeInTheDocument();
    expect(screen.getByText('F3 (3ª)')).toBeInTheDocument();
    expect(screen.getByText('A3 (2ª)')).toBeInTheDocument();
    expect(screen.getByText('D4 (1ª)')).toBeInTheDocument();
  });

  it('should not generate tones when not supported', () => {
    render(<StringTestButtons {...mockProps} isSupported={false} />);

    // Los botones deberían estar deshabilitados
    const buttons = screen.getAllByRole('button');
    buttons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });

  it('should create AudioContext and oscillator when button is clicked', () => {
    render(<StringTestButtons {...mockProps} />);

    // Hacer clic en un botón
    fireEvent.click(screen.getByText('A2 (5ª)'));

    // Verificar que se creó el AudioContext
    expect(window.AudioContext).toHaveBeenCalled();

    // Verificar que se creó el oscillator
    expect(mockAudioContext.createOscillator).toHaveBeenCalled();

    // Verificar que se creó el gain node
    expect(mockAudioContext.createGain).toHaveBeenCalled();
  });

  it('should handle errors gracefully when generating tones', () => {
    // Mock de AudioContext que falla
    Object.defineProperty(window, 'AudioContext', {
      value: jest.fn().mockImplementation(() => {
        throw new Error('AudioContext not supported');
      }),
      writable: true,
    });

    // No debería fallar la aplicación
    expect(() => {
      render(<StringTestButtons {...mockProps} />);
    }).not.toThrow();
  });

  it('should use correct base frequencies for each string', () => {
    const mockGetAdjustedFrequency = jest.fn((baseFreq: number) => baseFreq);

    render(
      <StringTestButtons
        {...mockProps}
        getAdjustedFrequency={mockGetAdjustedFrequency}
      />
    );

    // Hacer clic en cada cuerda y verificar las frecuencias base
    fireEvent.click(screen.getByText('E2 (6ª)'));
    expect(mockGetAdjustedFrequency).toHaveBeenCalledWith(82.41);

    fireEvent.click(screen.getByText('A2 (5ª)'));
    expect(mockGetAdjustedFrequency).toHaveBeenCalledWith(110.0);

    fireEvent.click(screen.getByText('D3 (4ª)'));
    expect(mockGetAdjustedFrequency).toHaveBeenCalledWith(146.83);

    fireEvent.click(screen.getByText('G3 (3ª)'));
    expect(mockGetAdjustedFrequency).toHaveBeenCalledWith(196.0);

    fireEvent.click(screen.getByText('B3 (2ª)'));
    expect(mockGetAdjustedFrequency).toHaveBeenCalledWith(246.94);

    fireEvent.click(screen.getByText('E4 (1ª)'));
    expect(mockGetAdjustedFrequency).toHaveBeenCalledWith(329.63);
  });
});
