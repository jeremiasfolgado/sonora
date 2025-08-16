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
  // Calcular el ángulo de rotación de la aguja
  // -50 cents = -45 grados, +50 cents = +45 grados
  const maxCents = 50;
  const maxAngle = 45;
  const clampedCents = Math.max(-maxCents, Math.min(maxCents, cents));
  const rotation = (clampedCents / maxCents) * maxAngle;

  return (
    <div className={styles.needleContainer}>
      {/* Indicador de estado */}
      <div className={styles.statusIndicator}>
        <span className={styles.statusText} style={{ color: tuningColor }}>
          {tuningStatus.toUpperCase()}
        </span>
      </div>

      {/* Contenedor de la aguja */}
      <div className={styles.needleWrapper}>
        {/* Marcadores de cents */}
        <div className={styles.centsMarkers}>
          <div className={styles.marker} style={{ left: '10%' }}>
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
          <div className={styles.marker} style={{ right: '10%' }}>
            +50
          </div>
        </div>

        {/* Línea central */}
        <div className={styles.centerLine} />

        {/* Aguja */}
        <div
          className={`${styles.needle} ${isListening ? styles.active : ''}`}
          style={
            {
              transform: `rotate(${rotation}deg)`,
              '--tuning-color': tuningColor,
            } as React.CSSProperties
          }
        >
          <div className={styles.needleTip} />
          <div className={styles.needleBody} />
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
