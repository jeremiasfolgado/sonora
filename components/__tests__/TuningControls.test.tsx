import { render, screen, fireEvent } from '@testing-library/react';
import { TuningControls } from '../tuner/TuningControls';

describe('TuningControls', () => {
  const mockProps = {
    getTuningDisplayName: jest.fn(() => 'Estandar'),
    increaseSemitone: jest.fn(),
    decreaseSemitone: jest.fn(),
    resetTuning: jest.fn(),
    customSemitones: 0,
    totalSemitones: 0,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render all tuning control buttons', () => {
    render(<TuningControls {...mockProps} />);

    expect(screen.getByText('Bajar')).toBeInTheDocument();
    expect(screen.getByText('Reset')).toBeInTheDocument();
    expect(screen.getByText('Subir')).toBeInTheDocument();
  });

  it('should display current tuning name', () => {
    render(<TuningControls {...mockProps} />);

    expect(screen.getByText('Afinación:')).toBeInTheDocument();
    expect(screen.getByText('Estandar')).toBeInTheDocument();
  });

  it('should call decreaseSemitone when Bajar button is clicked', () => {
    render(<TuningControls {...mockProps} />);

    fireEvent.click(screen.getByText('Bajar'));
    expect(mockProps.decreaseSemitone).toHaveBeenCalledTimes(1);
  });

  it('should call resetTuning when Reset button is clicked', () => {
    render(<TuningControls {...mockProps} />);

    fireEvent.click(screen.getByText('Reset'));
    expect(mockProps.resetTuning).toHaveBeenCalledTimes(1);
  });

  it('should call increaseSemitone when Subir button is clicked', () => {
    render(<TuningControls {...mockProps} />);

    fireEvent.click(screen.getByText('Subir'));
    expect(mockProps.increaseSemitone).toHaveBeenCalledTimes(1);
  });

  it('should display custom semitones indicator when not zero', () => {
    const propsWithCustomTuning = {
      ...mockProps,
      customSemitones: 2,
      totalSemitones: 2,
    };

    render(<TuningControls {...propsWithCustomTuning} />);

    expect(screen.getByText('(+2 semitones)')).toBeInTheDocument();
  });

  it('should display negative semitones indicator when below zero', () => {
    const propsWithNegativeTuning = {
      ...mockProps,
      customSemitones: -1,
      totalSemitones: -1,
    };

    render(<TuningControls {...propsWithNegativeTuning} />);

    expect(screen.getByText('(-1 semitones)')).toBeInTheDocument();
  });

  it('should disable decrease button when at minimum (-12 semitones)', () => {
    const propsAtMinimum = {
      ...mockProps,
      customSemitones: -12,
      totalSemitones: -12,
    };

    render(<TuningControls {...propsAtMinimum} />);

    const decreaseButton = screen.getByText('Bajar').closest('button');
    expect(decreaseButton).toBeDisabled();
  });

  it('should disable increase button when at maximum (12 semitones)', () => {
    const propsAtMaximum = {
      ...mockProps,
      customSemitones: 12,
      totalSemitones: 12,
    };

    render(<TuningControls {...propsAtMaximum} />);

    const increaseButton = screen.getByText('Subir').closest('button');
    expect(increaseButton).toBeDisabled();
  });

  it('should enable both buttons when within range', () => {
    render(<TuningControls {...mockProps} />);

    const decreaseButton = screen.getByText('Bajar');
    const increaseButton = screen.getByText('Subir');

    expect(decreaseButton).not.toBeDisabled();
    expect(increaseButton).not.toBeDisabled();
  });

  it('should show tuning name with custom semitones', () => {
    const propsWithCustomTuning = {
      ...mockProps,
      customSemitones: 1,
      totalSemitones: 1,
    };

    render(<TuningControls {...propsWithCustomTuning} />);

    // Verificar que se muestre el indicador de semitonos
    expect(screen.getByText('(+1 semitones)')).toBeInTheDocument();
  });

  it('should handle zero custom semitones correctly', () => {
    render(<TuningControls {...mockProps} />);

    // No debería mostrar indicador de semitonos cuando es 0
    expect(screen.queryByText(/semitones/)).not.toBeInTheDocument();
  });

  it('should maintain button order: Bajar, Reset, Subir', () => {
    render(<TuningControls {...mockProps} />);

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(3);

    expect(buttons[0]).toHaveTextContent('Bajar');
    expect(buttons[1]).toHaveTextContent('Reset');
    expect(buttons[2]).toHaveTextContent('Subir');
  });

  it('should display correct tuning name from props', () => {
    const customProps = {
      ...mockProps,
      getTuningDisplayName: jest.fn(() => 'Drop D'),
    };

    render(<TuningControls {...customProps} />);

    expect(screen.getByText('Drop D')).toBeInTheDocument();
  });
});
