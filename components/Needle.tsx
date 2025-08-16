'use client';

import React from 'react';
import styles from './Needle.module.css';

interface NeedleProps {
  cents: number;
  tuningStatus: 'plano' | 'afinado' | 'agudo';
  tuningColor: string;
  isListening: boolean;
}

export function Needle({
  cents,
  tuningStatus,
  tuningColor,
  isListening,
}: NeedleProps) {
  // Calcular la posición horizontal del indicador
  // -50 cents = 0%, +50 cents = 100%
  const maxCents = 50;
  const clampedCents = Math.max(-maxCents, Math.min(maxCents, cents));
  const position = ((clampedCents + maxCents) / (maxCents * 2)) * 100;

  return (
    <div className={styles.needleContainer}>
      {/* Indicador de estado */}
      <div className={styles.statusIndicator}>
        <span className={styles.statusText} style={{ color: tuningColor }}>
          {tuningStatus.toUpperCase()}
        </span>
      </div>

      {/* Contenedor del indicador horizontal */}
      <div className={styles.needleWrapper}>
        {/* Marcadores de cents */}
        <div className={styles.centsMarkers}>
          <div className={styles.marker} style={{ left: '0%' }}>
            -50
          </div>
          <div className={styles.marker} style={{ left: '25%' }}>
            -25
          </div>
          <div className={styles.marker} style={{ left: '50%' }}>
            0
          </div>
          <div className={styles.marker} style={{ left: '75%' }}>
            +25
          </div>
          <div className={styles.marker} style={{ left: '100%' }}>
            +50
          </div>
        </div>

        {/* Línea central con gradiente */}
        <div className={styles.centerLine}>
          {/* Indicador deslizante */}
          <div
            className={`${styles.sliderIndicator} ${isListening ? styles.active : ''}`}
            style={{
              left: `${position}%`,
              '--tuning-color': tuningColor,
            } as React.CSSProperties}
          >
            <div className={styles.indicatorDot} />
            <div className={styles.indicatorLine} />
          </div>
        </div>

        {/* Punto central */}
        <div className={styles.centerPoint} />
      </div>

      {/* Valor de cents */}
      <div className={styles.centsValue}>
        <span style={{ color: tuningColor }}>
          {cents > 0 ? '+' : ''}
          {cents.toFixed(1)} cents
        </span>
      </div>
    </div>
  );
}
