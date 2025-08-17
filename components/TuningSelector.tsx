'use client';

import React, { useState } from 'react';
import { ChevronUp, ChevronDown, RotateCcw, Settings } from 'lucide-react';
import { useTuning, TuningConfig } from '../lib/hooks/useTuning';
import styles from './TuningSelector.module.css';

interface TuningSelectorProps {
  onTuningChange?: (totalSemitones: number) => void;
}

export function TuningSelector({ onTuningChange }: TuningSelectorProps) {
  const {
    currentTuning,
    customSemitones,
    totalSemitones,
    changeTuning,
    increaseSemitone,
    decreaseSemitone,
    resetTuning,
    getTuningDisplayName,
    availableTunings,
  } = useTuning();

  const [isExpanded, setIsExpanded] = useState(false);

  // Notificar cambios de afinación al componente padre
  React.useEffect(() => {
    onTuningChange?.(totalSemitones);
  }, [totalSemitones, onTuningChange]);

  const handleTuningSelect = (tuning: TuningConfig) => {
    changeTuning(tuning);
    setIsExpanded(false);
  };

  const handleSemitoneChange = (increase: boolean) => {
    if (increase) {
      increaseSemitone();
    } else {
      decreaseSemitone();
    }
  };

  return (
    <div className={styles.tuningSelector}>
      {/* Header de afinación actual */}
      <div className={styles.currentTuning}>
        <div className={styles.tuningInfo}>
          <span className={styles.tuningLabel}>Afinación:</span>
          <span className={styles.tuningName}>{getTuningDisplayName()}</span>
          {customSemitones !== 0 && (
            <span className={styles.semitoneIndicator}>
              ({totalSemitones > 0 ? '+' : ''}{totalSemitones} semitones)
            </span>
          )}
        </div>
        
        <div className={styles.tuningControls}>
          {/* Botón para expandir/contraer */}
          <button
            className={styles.expandButton}
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label={isExpanded ? 'Contraer opciones' : 'Expandir opciones'}
          >
            <Settings size={16} />
          </button>
          
          {/* Botones de semitonos */}
          <div className={styles.semitoneControls}>
            <button
              className={styles.semitoneButton}
              onClick={() => handleSemitoneChange(false)}
              aria-label="Disminuir semitono"
            >
              <ChevronDown size={16} />
            </button>
            <button
              className={styles.semitoneButton}
              onClick={() => handleSemitoneChange(true)}
              aria-label="Aumentar semitono"
            >
              <ChevronUp size={16} />
            </button>
          </div>
          
          {/* Botón de reset */}
          <button
            className={styles.resetButton}
            onClick={resetTuning}
            aria-label="Resetear afinación"
            title="Resetear a afinación estándar"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {/* Lista de afinaciones predefinidas */}
      {isExpanded && (
        <div className={styles.tuningOptions}>
          <div className={styles.tuningList}>
            {availableTunings.map((tuning) => (
              <button
                key={tuning.name}
                className={`${styles.tuningOption} ${
                  currentTuning.name === tuning.name && customSemitones === 0
                    ? styles.active
                    : ''
                }`}
                onClick={() => handleTuningSelect(tuning)}
                title={tuning.description}
              >
                <span className={styles.tuningName}>{tuning.name}</span>
                {tuning.semitones !== 0 && (
                  <span className={styles.semitoneOffset}>
                    {tuning.semitones > 0 ? '+' : ''}{tuning.semitones}
                  </span>
                )}
              </button>
            ))}
          </div>
          
          {/* Información de la afinación actual */}
          <div className={styles.tuningDescription}>
            <p>{currentTuning.description}</p>
            {customSemitones !== 0 && (
              <p className={styles.customAdjustment}>
                Ajuste personalizado: {customSemitones > 0 ? '+' : ''}{customSemitones} semitones
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
