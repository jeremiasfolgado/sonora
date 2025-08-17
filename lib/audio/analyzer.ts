import type { Note } from './notes';
import { frequencyToNote } from './notes';

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

  constructor() {
    // Inicializar Aubio cuando esté disponible
    this.initAubio();
  }

  /**
   * Inicializa Aubio.js para detección de pitch
   */
  private async initAubio(): Promise<void> {
    try {
      const aubio = await (
        window as unknown as {
          aubio: () => Promise<{
            Pitch: new (
              mode: string,
              bufferSize: number,
              channels: number,
              sampleRate: number
            ) => unknown;
          }>;
        }
      ).aubio();
      this.pitchDetector = new aubio.Pitch(
        'default',
        this.BUFFER_SIZE,
        1,
        this.SAMPLE_RATE
      );
    } catch {
      throw new Error('Failed to initialize Aubio');
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
        // Solicitando permiso del micrófono...
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
    if (!this.isListening || !this.pitchDetector) {
      return;
    }

    try {
      // Obtener datos de audio del canal 0 (mono)
      const inputBuffer = event.inputBuffer.getChannelData(0);

      // Detectar pitch usando Aubio
      const frequency = (
        this.pitchDetector as { do: (buffer: Float32Array) => number }
      ).do(inputBuffer);

      if (frequency && frequency > 0) {
        // Usar el sistema de notas de notes.ts para obtener la información completa
        const note = frequencyToNote(frequency);

        // Emitir evento con la nota detectada usando la estructura completa de Note
        this.onNoteDetected(note);
      }
    } catch (error) {
      console.error('Error procesando audio:', error);
    }
  }

  // Notas musicales para compatibilidad
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

  /**
   * Callback cuando se detecta una nota
   */
  private onNoteDetected(note: Note): void {
    const event = new CustomEvent('noteDetected', {
      detail: { noteData: note },
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
    try {
      if (typeof window === 'undefined') return false;

      const hasAudioContext = !!(
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext
      );

      if (!hasAudioContext) return false;

      // Verificación adicional: intentar crear un AudioContext de prueba
      try {
        const testContext = new (window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext)();
        const isValid =
          testContext.state === 'running' || testContext.state === 'suspended';
        testContext.close();
        return isValid;
      } catch {
        return false;
      }
    } catch {
      return false;
    }
  }

  /**
   * Verifica si el navegador soporta getUserMedia
   */
  static isMediaDevicesSupported(): boolean {
    try {
      if (typeof navigator === 'undefined') return false;

      return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    } catch {
      return false;
    }
  }

  /**
   * Verifica si Aubio está disponible
   */
  static isAubioSupported(): boolean {
    return !!(window as { aubio?: () => Promise<unknown> }).aubio;
  }
}
