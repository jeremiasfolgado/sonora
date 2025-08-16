import React from 'react';
import { render, screen } from '@testing-library/react';
import { Needle } from '../Needle';

describe('Needle Component', () => {
  const defaultProps = {
    cents: 0,
    tuningStatus: 'afinado' as const,
    tuningColor: 'var(--success-color)',
    isListening: false,
  };

  it('renders without crashing', () => {
    render(<Needle {...defaultProps} />);
    expect(screen.getByText('AFINADO')).toBeInTheDocument();
  });

  it('displays the correct tuning status', () => {
    render(<Needle {...defaultProps} tuningStatus="plano" />);
    expect(screen.getByText('PLANO')).toBeInTheDocument();
  });

  it('displays the correct cents value', () => {
    render(<Needle {...defaultProps} cents={25.5} />);
    expect(screen.getByText('+25.5 cents')).toBeInTheDocument();
  });

  it('displays negative cents correctly', () => {
    render(<Needle {...defaultProps} cents={-15.2} />);
    expect(screen.getByText('-15.2 cents')).toBeInTheDocument();
  });

  it('displays zero cents correctly', () => {
    render(<Needle {...defaultProps} cents={0} />);
    expect(screen.getByText('0.0 cents')).toBeInTheDocument();
  });

  it('applies active class when listening', () => {
    render(<Needle {...defaultProps} isListening={true} />);
    const needle = screen
      .getByText('AFINADO')
      .closest('.needleContainer')
      ?.querySelector('.needle');
    expect(needle).toHaveClass('active');
  });

  it('does not apply active class when not listening', () => {
    render(<Needle {...defaultProps} isListening={false} />);
    const needle = screen
      .getByText('AFINADO')
      .closest('.needleContainer')
      ?.querySelector('.needle');
    expect(needle).not.toHaveClass('active');
  });

  it('displays all cent markers', () => {
    render(<Needle {...defaultProps} />);
    expect(screen.getByText('-50')).toBeInTheDocument();
    expect(screen.getByText('-25')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('+25')).toBeInTheDocument();
    expect(screen.getByText('+50')).toBeInTheDocument();
  });

  it('applies custom tuning color', () => {
    const customColor = '#ff0000';
    render(<Needle {...defaultProps} tuningColor={customColor} />);
    const statusText = screen.getByText('AFINADO');
    expect(statusText).toHaveStyle({ color: customColor });
  });
});
