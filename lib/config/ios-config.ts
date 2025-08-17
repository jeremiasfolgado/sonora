// Configuración específica para iOS para optimizar el rendimiento del afinador

export const IOS_AUDIO_CONFIG = {
  // Configuración del Audio Context
  audioContext: {
    sampleRate: 44100,
    latencyHint: 'interactive' as const,
    bufferSize: 4096,
  },

  // Configuración del Analyser Node
  analyser: {
    fftSize: 2048, // Más pequeño para iOS
    smoothingTimeConstant: 0.8, // Más suave para iOS
    minDecibels: -90,
    maxDecibels: -10,
  },

  // Configuración del micrófono
  microphone: {
    echoCancellation: false, // iOS funciona mejor sin cancelación de eco
    noiseSuppression: false, // iOS funciona mejor sin supresión de ruido
    autoGainControl: false, // iOS funciona mejor sin control automático de ganancia
    channelCount: 1, // Mono para mejor rendimiento
    sampleRate: 44100,
  },

  // Configuración de detección de frecuencia
  frequencyDetection: {
    minFrequency: 80, // Frecuencia mínima para iOS
    smoothingFactor: 0.7, // Factor de suavizado para iOS
    confidenceThreshold: 0.6, // Umbral de confianza más bajo para iOS
  },

  // Configuración de generación de tonos
  toneGeneration: {
    gain: 0.08, // Gain más bajo para iOS
    duration: 2, // Duración más corta para iOS
    fadeOutTime: 0.1, // Tiempo de fade out para iOS
  },

  // Configuración de la interfaz
  ui: {
    showPlatformTips: true, // Mostrar consejos específicos de iOS
    autoResumeAudio: true, // Resumir audio automáticamente en iOS
    showLatencyWarning: true, // Mostrar advertencia de latencia en iOS
  },
};

// Función para obtener configuración específica según la versión de iOS
export const getIOSVersionConfig = () => {
  const userAgent = navigator.userAgent;
  const iosVersionMatch = userAgent.match(/OS (\d+)_(\d+)_?(\d+)?/);

  if (!iosVersionMatch) {
    return IOS_AUDIO_CONFIG;
  }

  const majorVersion = parseInt(iosVersionMatch[1], 10);
  // const minorVersion = parseInt(iosVersionMatch[2], 10); // No usado por ahora

  // iOS 14+ tiene mejor soporte para Web Audio API
  if (majorVersion >= 14) {
    return {
      ...IOS_AUDIO_CONFIG,
      analyser: {
        ...IOS_AUDIO_CONFIG.analyser,
        fftSize: 4096, // Usar FFT más grande en iOS 14+
        smoothingTimeConstant: 0.6, // Menos suavizado en iOS 14+
      },
      frequencyDetection: {
        ...IOS_AUDIO_CONFIG.frequencyDetection,
        confidenceThreshold: 0.7, // Umbral más alto en iOS 14+
      },
    };
  }

  // iOS 13 y anteriores
  if (majorVersion === 13) {
    return {
      ...IOS_AUDIO_CONFIG,
      audioContext: {
        ...IOS_AUDIO_CONFIG.audioContext,
        bufferSize: 2048, // Buffer más pequeño para iOS 13
      },
      frequencyDetection: {
        ...IOS_AUDIO_CONFIG.frequencyDetection,
        minFrequency: 100, // Frecuencia mínima más alta para iOS 13
        smoothingFactor: 0.8, // Más suavizado para iOS 13
      },
    };
  }

  // iOS 12 y anteriores
  return {
    ...IOS_AUDIO_CONFIG,
    audioContext: {
      ...IOS_AUDIO_CONFIG.audioContext,
      bufferSize: 1024, // Buffer muy pequeño para iOS 12-
    },
    analyser: {
      ...IOS_AUDIO_CONFIG.analyser,
      fftSize: 1024, // FFT muy pequeño para iOS 12-
    },
    frequencyDetection: {
      ...IOS_AUDIO_CONFIG.frequencyDetection,
      minFrequency: 120, // Frecuencia mínima muy alta para iOS 12-
      smoothingFactor: 0.9, // Mucho suavizado para iOS 12-
    },
  };
};

// Función para detectar si es un dispositivo iOS específico
export const getIOSDeviceConfig = () => {
  const userAgent = navigator.userAgent;

  // iPhone específico
  if (/iPhone/.test(userAgent)) {
    return {
      ...IOS_AUDIO_CONFIG,
      microphone: {
        ...IOS_AUDIO_CONFIG.microphone,
        sampleRate: 48000, // iPhone tiene mejor soporte para 48kHz
      },
      ui: {
        ...IOS_AUDIO_CONFIG.ui,
        showLatencyWarning: false, // iPhone tiene mejor latencia
      },
    };
  }

  // iPad específico
  if (/iPad/.test(userAgent)) {
    return {
      ...IOS_AUDIO_CONFIG,
      audioContext: {
        ...IOS_AUDIO_CONFIG.audioContext,
        bufferSize: 8192, // iPad puede manejar buffers más grandes
      },
      analyser: {
        ...IOS_AUDIO_CONFIG.analyser,
        fftSize: 4096, // iPad puede manejar FFT más grandes
      },
    };
  }

  return IOS_AUDIO_CONFIG;
};
