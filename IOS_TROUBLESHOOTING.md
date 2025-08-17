# 🍎 Solución de Problemas en iOS

## 🚨 **Problemas Comunes en iOS**

### 1. **Botones de Sonido No Funcionan**

**Síntoma**: Los botones de prueba de cuerdas no reproducen sonido en iPhone/iPad.

**Causa**: Safari en iOS tiene restricciones estrictas sobre reproducción de audio.

**Soluciones**:

- ✅ **Toca directamente el botón** (no desde JavaScript)
- ✅ **Permite acceso al audio** cuando Safari lo solicite
- ✅ **No uses modo incógnito** (tiene más restricciones)
- ✅ **Asegúrate de que el dispositivo no esté en silencio**

### 2. **Afinación No Precisa**

**Síntoma**: La detección de notas es menos precisa que en desktop.

**Causa**: Limitaciones del Web Audio API en iOS.

**Soluciones**:

- ✅ **Mantén el iPhone cerca de la guitarra** (máximo 30cm)
- ✅ **Evita usar auriculares** para mejor detección
- ✅ **Cierra otras apps de audio** que puedan interferir
- ✅ **Usa un entorno silencioso** para mejor precisión

### 3. **Latencia Alta**

**Síntoma**: Hay retraso entre tocar la cuerda y ver la detección.

**Causa**: Buffer size fijo y limitaciones de iOS.

**Soluciones**:

- ✅ **Actualiza a iOS 14+** para mejor rendimiento
- ✅ **Reinicia Safari** si la latencia es muy alta
- ✅ **Cierra otras pestañas** de Safari
- ✅ **Usa iPhone en lugar de iPad** (mejor latencia)

## 🔧 **Configuraciones Optimizadas por Dispositivo**

### **iPhone 11 Pro (iOS 14+)**

```typescript
{
  sampleRate: 48000,
  bufferSize: 4096,
  fftSize: 4096,
  smoothingTimeConstant: 0.6,
  minFrequency: 80,
  confidenceThreshold: 0.7
}
```

### **iPhone 8/SE (iOS 13)**

```typescript
{
  sampleRate: 44100,
  bufferSize: 2048,
  fftSize: 2048,
  smoothingTimeConstant: 0.8,
  minFrequency: 100,
  confidenceThreshold: 0.6
}
```

### **iPad (iOS 12+)**

```typescript
{
  sampleRate: 44100,
  bufferSize: 8192,
  fftSize: 4096,
  smoothingTimeConstant: 0.7,
  minFrequency: 90,
  confidenceThreshold: 0.65
}
```

## 📱 **Mejores Prácticas para iOS**

### **Configuración del Micrófono**

```typescript
const constraints = {
  audio: {
    echoCancellation: false, // ✅ Mejor para iOS
    noiseSuppression: false, // ✅ Mejor para iOS
    autoGainControl: false, // ✅ Mejor para iOS
    sampleRate: 44100, // ✅ Frecuencia estándar
    channelCount: 1, // ✅ Mono para mejor rendimiento
  },
};
```

### **Configuración del Audio Context**

```typescript
const audioContext = new AudioContext({
  sampleRate: 44100, // ✅ Frecuencia estándar
  latencyHint: 'interactive', // ✅ Mejor latencia
});
```

### **Configuración del Analyser**

```typescript
analyser.fftSize = 2048; // ✅ Más pequeño para iOS
analyser.smoothingTimeConstant = 0.8; // ✅ Más suave para iOS
analyser.minDecibels = -90; // ✅ Rango dinámico completo
analyser.maxDecibels = -10; // ✅ Rango dinámico completo
```

## 🎯 **Algoritmos Optimizados para iOS**

### **Detección de Frecuencia**

```typescript
// Filtro de frecuencia específico para iOS
if (isIOS && frequency < 80) {
  return; // Ignorar frecuencias muy bajas
}

// Suavizado específico para iOS
if (isIOS) {
  setCurrentFrequency((prev) => {
    const smoothing = 0.7;
    return prev * smoothing + frequency * (1 - smoothing);
  });
}
```

### **Generación de Tonos**

```typescript
// Configuración específica para iOS
if (isIOS) {
  const roundedFrequency = Math.round(adjustedFrequency);
  oscillator.frequency.setValueAtTime(roundedFrequency, startTime);
  gainNode.gain.setValueAtTime(0.08, startTime); // Gain más bajo
  oscillator.stop(startTime + 2); // Duración más corta
}
```

## 🧪 **Testing en iOS**

### **Dispositivos de Prueba Recomendados**

- ✅ **iPhone 11 Pro** (iOS 14+)
- ✅ **iPhone 12** (iOS 14+)
- ✅ **iPhone 13** (iOS 15+)
- ✅ **iPhone 14** (iOS 16+)
- ✅ **iPhone 15** (iOS 17+)

### **Versiones de iOS a Probar**

- ✅ **iOS 17** (última versión)
- ✅ **iOS 16** (versión estable)
- ✅ **iOS 15** (versión mínima recomendada)
- ⚠️ **iOS 14** (funcionalidad limitada)
- ❌ **iOS 13 y anteriores** (no soportado)

### **Navegadores a Probar**

- ✅ **Safari** (nativo, mejor rendimiento)
- ⚠️ **Chrome** (funcionalidad limitada)
- ❌ **Firefox** (no disponible en iOS)

## 🚀 **Optimizaciones Futuras**

### **Web Audio API v2**

- Mejor soporte para iOS
- Latencia reducida
- Más opciones de configuración

### **Audio Worklets**

- Procesamiento de audio en background
- Mejor rendimiento
- Menos latencia

### **WebAssembly**

- Algoritmos de detección más rápidos
- Mejor precisión
- Menor uso de CPU

## 📊 **Métricas de Rendimiento**

### **Latencia Objetivo**

- **Desktop**: < 50ms
- **iPhone 11 Pro**: < 100ms
- **iPhone 8**: < 150ms
- **iPad**: < 200ms

### **Precisión Objetiva**

- **Desktop**: ±2 cents
- **iPhone 11 Pro**: ±5 cents
- **iPhone 8**: ±8 cents
- **iPad**: ±10 cents

### **Uso de CPU**

- **Desktop**: < 5%
- **iPhone 11 Pro**: < 15%
- **iPhone 8**: < 20%
- **iPad**: < 25%

## 🔍 **Debugging en iOS**

### **Herramientas de Desarrollo**

- **Safari Web Inspector** (conecta iPhone a Mac)
- **Console.log** (visible en Safari Web Inspector)
- **Performance Monitor** (en Safari Web Inspector)

### **Logs Útiles**

```typescript
console.log('iOS Device:', isIOS);
console.log('Audio Context State:', audioContext.state);
console.log('Sample Rate:', audioContext.sampleRate);
console.log('Buffer Size:', audioContext.bufferSize);
console.log('Frequency Detected:', frequency);
```

### **Errores Comunes**

- `NotAllowedError`: Usuario no permitió acceso al micrófono
- `NotSupportedError`: Web Audio API no soportado
- `InvalidStateError`: Audio Context en estado incorrecto
- `QuotaExceededError`: Demasiados nodos de audio activos

---

**Nota**: Estas optimizaciones están implementadas en el código actual del proyecto. Si sigues teniendo problemas, verifica que estés usando la versión más reciente.
