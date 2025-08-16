import type { Note } from './notes';

export interface AudioAnalysisResult {
  frequency: number;
  note: Note;
  isListening: boolean;
  error: string | null;
}

export class AudioAnalyzer {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private scriptProcessor: ScriptProcessorNode | null = null;
  private mediaStream: MediaStream | null = null;
  private isListening = false;
  private pitchDetector: unknown = null; // Aubio pitch detector

  // Configuración optimizada basada en el proyecto que funciona
  private readonly BUFFER_SIZE = 4096;
  private readonly SAMPLE_RATE = 44100;
  private readonly MIDDLE_A = 440; // A4
  private readonly SEMITONE = 69; // MIDI note para A4

  // Notas musicales
  private readonly noteStrings = [
    'C',
    'C♯',
    'D',
    'D♯',
    'E',
    'F',
    'F♯',
    'G',
    'G♯',
    'A',
    'A♯',
    'B',
  ];

  constructor() {
    // Inicializar Aubio cuando esté disponible
    this.initAubio();
  }

  /**
   * Inicializa Aubio.js para detección de pitch
   */
  private async initAubio(): Promise<void> {
    try {
      // @ts-expect-error - Aubio es una librería externa
      const aubio = await (window as { aubio: () => Promise<unknown> }).aubio();
      // @ts-expect-error - Aubio crea un detector de pitch
      this.pitchDetector = new aubio.Pitch(
        'default',
        this.BUFFER_SIZE,
        1,
        this.SAMPLE_RATE
      );
      console.log('🎵 Aubio inicializado correctamente');
    } catch (error) {
      console.error('Error inicializando Aubio:', error);
    }
  }

  /**
   * Inicia la captura de audio del micrófono
   */
  async startListening(): Promise<void> {
    try {
      if (this.isListening) return;

      // Verificar permisos del micrófono
      if (!navigator.permissions) {
        throw new Error('Permissions API not supported');
      }

      const permission = await navigator.permissions.query({
        name: 'microphone' as PermissionName,
      });

      if (permission.state === 'denied') {
        throw new Error(
          'Microphone permission denied. Please enable it in your browser settings.'
        );
      }

      if (permission.state === 'prompt') {
        console.log('🎤 Solicitando permiso del micrófono...');
      }

      // Crear contexto de audio
      this.audioContext = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext)();

      // Obtener acceso al micrófono con manejo de errores detallado
      try {
        this.mediaStream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: false,
            noiseSuppression: false,
            autoGainControl: false,
            sampleRate: this.SAMPLE_RATE,
            channelCount: 1,
          },
        });
        console.log('🎤 Permiso del micrófono concedido');
      } catch (mediaError) {
        if (mediaError instanceof DOMException) {
          switch (mediaError.name) {
            case 'NotAllowedError':
              throw new Error(
                'Acceso al micrófono denegado. Por favor, permite el acceso en tu navegador.'
              );
            case 'NotFoundError':
              throw new Error(
                'No se encontró ningún micrófono. Verifica que tengas un micrófono conectado.'
              );
            case 'NotReadableError':
              throw new Error(
                'El micrófono está siendo usado por otra aplicación. Cierra otras apps que usen el micrófono.'
              );
            case 'OverconstrainedError':
              throw new Error(
                'El micrófono no soporta la configuración requerida.'
              );
            default:
              throw new Error(`Error del micrófono: ${mediaError.message}`);
          }
        }
        throw new Error(
          `Error accediendo al micrófono: ${
            mediaError instanceof Error ? mediaError.message : 'Unknown error'
          }`
        );
      }

      // Verificar que Aubio esté disponible
      if (!this.pitchDetector) {
        throw new Error(
          'Aubio no está inicializado. Por favor, recarga la página.'
        );
      }

      // Crear nodos de audio
      const source = this.audioContext.createMediaStreamSource(
        this.mediaStream
      );
      this.analyser = this.audioContext.createAnalyser();
      this.scriptProcessor = this.audioContext.createScriptProcessor(
        this.BUFFER_SIZE,
        1,
        1
      );

      // Conectar nodos
      source.connect(this.analyser);
      this.analyser.connect(this.scriptProcessor);
      this.scriptProcessor.connect(this.audioContext.destination);

      // Configurar listener para procesamiento de audio
      this.scriptProcessor.addEventListener('audioprocess', (event) => {
        this.processAudio(event);
      });

      this.isListening = true;
      console.log('🎤 Audio capturado iniciado con Aubio');
    } catch (error) {
      console.error('Error starting audio capture:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to start audio capture';
      throw new Error(errorMessage);
    }
  }

  /**
   * Procesa el audio en tiempo real
   */
  private processAudio(event: AudioProcessingEvent): void {
    if (!this.isListening || !this.pitchDetector) return;

    try {
      // Obtener datos de audio del canal 0 (mono)
      const inputBuffer = event.inputBuffer.getChannelData(0);

      // Detectar pitch usando Aubio
      const frequency = (
        this.pitchDetector as { do: (buffer: Float32Array) => number }
      ).do(inputBuffer);

      if (frequency && frequency > 0) {
        // Obtener información de la nota
        const note = this.getNote(frequency);
        const noteData = {
          name: this.noteStrings[note % 12],
          value: note,
          cents: this.getCents(frequency, note),
          octave: Math.floor(note / 12) - 1,
          frequency: frequency,
        };

        console.log(
          `🎵 Nota detectada: ${noteData.name}${
            noteData.octave
          } (${frequency.toFixed(1)} Hz) - ${noteData.cents} cents`
        );

        // Emitir evento con la nota detectada
        this.onNoteDetected(noteData);
      }
    } catch (error) {
      console.error('Error procesando audio:', error);
    }
  }

  /**
   * Obtiene la nota MIDI desde la frecuencia
   */
  private getNote(frequency: number): number {
    const note = 12 * (Math.log(frequency / this.MIDDLE_A) / Math.log(2));
    return Math.round(note) + this.SEMITONE;
  }

  /**
   * Obtiene la frecuencia estándar de una nota
   */
  private getStandardFrequency(note: number): number {
    return this.MIDDLE_A * Math.pow(2, (note - this.SEMITONE) / 12);
  }

  /**
   * Calcula la diferencia en cents entre la frecuencia dada y la frecuencia estándar
   */
  private getCents(frequency: number, note: number): number {
    return Math.floor(
      (1200 * Math.log(frequency / this.getStandardFrequency(note))) /
        Math.log(2)
    );
  }

  /**
   * Callback cuando se detecta una nota
   */
  private onNoteDetected(noteData: {
    name: string;
    value: number;
    cents: number;
    octave: number;
    frequency: number;
  }): void {
    const event = new CustomEvent('noteDetected', {
      detail: { noteData },
    });
    window.dispatchEvent(event);
  }

  /**
   * Detiene la captura de audio
   */
  stopListening(): void {
    if (!this.isListening) return;

    // Detener script processor
    if (this.scriptProcessor) {
      this.scriptProcessor.removeEventListener(
        'audioprocess',
        this.processAudio
      );
      this.scriptProcessor.disconnect();
      this.scriptProcessor = null;
    }

    // Detener stream de media
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }

    // Desconectar nodos
    if (this.analyser) {
      this.analyser.disconnect();
      this.analyser = null;
    }

    // Cerrar contexto
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
      this.audioContext = null;
    }

    this.isListening = false;
    console.log('🎤 Audio capturado detenido');
  }

  /**
   * Obtiene el estado actual del analizador
   */
  getStatus(): { isListening: boolean; error: string | null } {
    return {
      isListening: this.isListening,
      error: null,
    };
  }

  /**
   * Verifica si el navegador soporta Web Audio API
   */
  static isSupported(): boolean {
    return !!(
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext
    );
  }

  /**
   * Verifica si el navegador soporta getUserMedia
   */
  static isMediaDevicesSupported(): boolean {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }

  /**
   * Verifica si Aubio está disponible
   */
  static isAubioSupported(): boolean {
    return !!(window as { aubio?: () => Promise<unknown> }).aubio;
  }
}
