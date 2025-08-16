# 📘 Sonora - Documento de Requerimientos

## 🎯 Objetivo

Sonora es una aplicación web enfocada en herramientas musicales.  
La primera funcionalidad a implementar será un **afinador de guitarra** que detecte en tiempo real la nota y frecuencia de un sonido captado por el micrófono.

En el futuro, Sonora podrá expandirse con más utilidades como metrónomo, generador de tonos y ejercicios musicales.

---

## 1. Requerimientos funcionales (MVP Afinador)

1. **Captura de audio**

   - Usar `navigator.mediaDevices.getUserMedia` para acceder al micrófono.
   - Manejo de permisos y errores en caso de que el usuario no acepte.

2. **Procesamiento de señal**

   - Analizar la señal en tiempo real con **Web Audio API**.
   - Detectar la **frecuencia fundamental** de la señal.
   - Suavizar la detección para evitar fluctuaciones bruscas.

3. **Identificación de nota**

   - Convertir frecuencia en nota musical (ej: 440 Hz → A4).
   - Calcular la desviación en “cents” respecto a la nota más cercana.

4. **Visualización en tiempo real**

   - Mostrar:
     - Nota detectada (en grande).
     - Frecuencia exacta.
     - Barra/aguja indicando si está afinada.
   - Indicadores claros de “plano / afinado / agudo”.

5. **Control de captura**

   - Botón para pausar y reanudar la detección.

6. **Escalabilidad**
   - Base de código preparada para agregar más funcionalidades (metrónomo, generador de tonos, etc.).

---

## 2. Requerimientos no funcionales

1. **UI/UX**

   - Diseño **mobile first**, responsive para escritorio.
   - Minimalista y claro (nota en grande, pocos elementos).
   - Modo oscuro por defecto.

2. **Rendimiento**

   - Baja latencia en procesamiento (<100 ms).
   - Optimización para que el DOM no se recargue en cada frame.

3. **Compatibilidad**

   - Navegadores modernos (Chrome, Edge, Safari, Firefox).
   - Funcional en **móviles (iOS/Android)** y desktop.

4. **Mantenibilidad**

   - Código en **TypeScript**.
   - Estilos con **CSS Modules** (no Tailwind).
   - Separación clara de lógica de audio y UI.

5. **Testing**
   - Todos los componentes deben test test unitarios.
   - Todos los custom hooks deben tener test unitarios.
   - Los metodos auxiliares deben tener test unitarios.

---

## 3. Stack tecnológico

- **Framework:** Next.js (App Router).
- **Lenguaje:** TypeScript.
- **Estilos:** CSS Modules.
- **Audio:** Web Audio API.
- **Librerías sugeridas:**
  - [`pitchfinder`](https://github.com/peterkhayes/pitchfinder) para detección de pitch.
  - [`lucide-react`](https://lucide.dev/) para iconos.

---

## 4. Estructura de proyecto

/app
/page.tsx → página principal del afinador
/components
/TunerUI.tsx → componente de interfaz del afinador
/Needle.tsx → aguja visual de afinación
/lib
/audio
/analyzer.ts → lógica de detección de frecuencia
/notes.ts → utilidades de mapeo frecuencia → nota
/styles
/globals.css
/TunerUI.module.css

---

## 5. Roadmap (MVP Afinador)

1. Configurar proyecto Next.js con TypeScript.
2. Configurar estilos con CSS Modules.
3. Preparar commits para subir el proyecto y deployar en vercel. El deploy lo voy a hacer yo de forma manual.
4. Implementar captura de audio y manejo de permisos.
5. Implementar detección de frecuencia y log en consola.
6. Mapear frecuencia a nota musical + desviación.
7. Crear UI base (nota grande, frecuencia, aguja/barra, botón pausa).
8. Optimizar performance de renderizado.
9. Testear en mobile y desktop.

---

## 6. Futuras extensiones de Sonora

- **Metrónomo** con BPM ajustable.
- **Generador de tonos** (frecuencia libre).
- **Ejercicios de oído** (intervalos, notas).
- **Afinaciones alternativas** preconfiguradas.
