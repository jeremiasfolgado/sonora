'use client';

import { useTuner } from '../../lib/hooks/useTuner';
import { useTuning } from '../../lib/hooks/useTuning';
import { useTunerUtils } from '../../lib/hooks/useTunerUtils';
import styles from './TunerUI.module.css';
import { Needle } from '../common/Needle';
import { TunerHeader } from './TunerHeader';
import { NoteDisplay } from './NoteDisplay';
import { StringIndicator } from './StringIndicator';
import { TuningControls } from './TuningControls';
import { AdditionalInfo } from './AdditionalInfo';
import { StringTestButtons } from './StringTestButtons';
import { TunerFooter } from '../layout/TunerFooter';
import { BrowserNotSupported } from './BrowserNotSupported';

export function TunerUI() {
  const {
    isListening,
    currentFrequency,
    currentNote,
    tuningStatus,
    tuningColor,
    error,
    isSupported,
    confidence,
    isStable,
    toggleListening,
  } = useTuner();

  const {
    getTuningDisplayName,
    increaseSemitone,
    decreaseSemitone,
    resetTuning,
    customSemitones,
    totalSemitones,
  } = useTuning();

  const { getTargetFrequency, getAdjustedStringName } = useTunerUtils();

  if (!isSupported) {
    return <BrowserNotSupported />;
  }

  return (
    <div className={styles.tunerContainer}>
      <TunerHeader />

      {/* Contenido principal optimizado */}
      <div className={styles.mainContent}>
        <NoteDisplay
          currentNote={currentNote}
          currentFrequency={currentFrequency}
        />

        <StringIndicator
          currentNote={currentNote}
          isListening={isListening}
          currentFrequency={currentFrequency}
        />

        {/* Aguja de afinación */}
        {currentNote && (
          <Needle
            cents={currentNote.cents}
            tuningStatus={tuningStatus as 'plano' | 'afinado' | 'agudo'}
            tuningColor={tuningColor}
            isListening={isListening}
          />
        )}

        {/* Controles principales */}
        <div className={styles.controls}>
          <button
            onClick={toggleListening}
            className={`${styles.toggleButton} ${
              isListening ? styles.listening : ''
            }`}
            disabled={!isSupported}
          >
            {isListening ? 'Detener' : 'Iniciar'}
          </button>
        </div>

        <TuningControls
          getTuningDisplayName={getTuningDisplayName}
          increaseSemitone={increaseSemitone}
          decreaseSemitone={decreaseSemitone}
          resetTuning={resetTuning}
          customSemitones={customSemitones}
          totalSemitones={totalSemitones}
        />

        <AdditionalInfo
          isListening={isListening}
          currentFrequency={currentFrequency}
          confidence={confidence}
          isStable={isStable}
          getTuningDisplayName={getTuningDisplayName}
          getTargetFrequency={() => getTargetFrequency(currentNote)}
        />

        {/* Mensaje de error */}
        {error && (
          <div className={styles.errorMessage}>
            <span>{error}</span>
          </div>
        )}

        {/* Instrucciones compactas */}
        {!isListening && !error && (
          <div className={styles.instructions}>
            <p>Presiona &quot;Iniciar&quot; para comenzar a afinar</p>
            <div className={styles.quickTips}>
              <span>💡 Coloca el micrófono cerca de las cuerdas</span>
              <span>💡 Toca una cuerda a la vez</span>
            </div>
          </div>
        )}
      </div>

      <StringTestButtons
        isSupported={isSupported}
        getAdjustedStringName={getAdjustedStringName}
      />

      <TunerFooter />
    </div>
  );
}
