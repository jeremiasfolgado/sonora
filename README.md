# 🎵 Sonora - Afinador de Guitarra

Sonora es una aplicación web desarrollada con Next.js y TypeScript que ofrece herramientas musicales. Su primera funcionalidad es un **afinador en tiempo real** que detecta notas y frecuencias usando el micrófono.

## ✨ Características

- 🎸 **Afinador en tiempo real** para guitarra
- 🎯 **Detección precisa** de frecuencias usando Web Audio API
- 📱 **Diseño mobile-first** y responsive
- 🌙 **Modo oscuro** por defecto
- ⚡ **Baja latencia** (<100ms)
- 🔧 **Base escalable** para futuras herramientas musicales

## 🚀 Tecnologías

- **Framework:** Next.js 15 (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** CSS Modules
- **Audio:** Web Audio API nativa
- **Testing:** Jest + React Testing Library
- **Iconos:** Lucide React

## 📋 Requisitos

- Node.js 18+
- Navegador moderno con soporte para:
  - Web Audio API
  - getUserMedia API
  - ES6+

## 🛠️ Instalación

1. **Clonar el repositorio:**

```bash
git clone <tu-repositorio>
cd sonora
```

2. **Instalar dependencias:**

```bash
npm install
```

3. **Ejecutar en desarrollo:**

```bash
npm run dev
```

4. **Abrir en el navegador:**

```
http://localhost:3000
```

## 🧪 Testing

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch
npm run test:watch

# Ejecutar tests con coverage
npm run test:coverage
```

## 🏗️ Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build de producción
- `npm run start` - Servidor de producción
- `npm run lint` - Linting del código
- `npm test` - Ejecutar tests
- `npm run test:watch` - Tests en modo watch
- `npm run test:coverage` - Tests con coverage

## 📁 Estructura del Proyecto

```
sonora/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página principal
├── components/             # Componentes React
│   ├── TunerUI.tsx        # Interfaz principal del afinador
│   ├── Needle.tsx         # Aguja visual de afinación
│   └── __tests__/         # Tests de componentes
├── lib/                    # Lógica de negocio
│   ├── audio/             # Utilidades de audio
│   │   ├── analyzer.ts    # Analizador de frecuencia
│   │   └── notes.ts       # Utilidades de notas musicales
│   └── hooks/             # Custom hooks
│       ├── useTuner.ts    # Hook del afinador
│       └── __tests__/     # Tests de hooks
├── styles/                 # Estilos globales
│   └── globals.css        # CSS global
└── package.json            # Dependencias y scripts
```

## 🎵 Cómo Usar el Afinador

1. **Permitir acceso al micrófono** cuando el navegador lo solicite
2. **Presionar "Iniciar"** para comenzar la detección
3. **Tocar una cuerda** de la guitarra cerca del micrófono
4. **Observar la aguja** que indica si está afinada:
   - 🟢 **Verde (centro):** Nota afinada
   - 🟡 **Amarillo (izquierda):** Nota plana
   - 🔴 **Rojo (derecha):** Nota aguda
5. **Presionar "Detener"** para pausar la detección

## 🔧 Funcionamiento Técnico

### Detección de Frecuencia

- Utiliza **Web Audio API** para capturar audio del micrófono
- Implementa el algoritmo **YIN** para detección de pitch
- Procesa audio en tiempo real con baja latencia

### Mapeo de Notas

- Convierte frecuencias a notas musicales usando la escala temperada
- Calcula desviación en **cents** respecto a la nota más cercana
- Soporta todas las notas de la escala cromática

### Interfaz Visual

- **Nota grande** en el centro para fácil identificación
- **Aguja animada** que muestra la desviación en tiempo real
- **Indicadores de color** para estado de afinación
- **Diseño responsive** optimizado para móviles

## 🚧 Roadmap

### Próximas Funcionalidades

- 🎯 **Afinador para otros instrumentos** (bajo, ukelele, violín)
- 🥁 **Metrónomo** con BPM ajustable
- 🎵 **Generador de tonos** (frecuencia libre)
- 🎧 **Ejercicios de oído** (intervalos, notas)
- ⚙️ **Afinaciones alternativas** preconfiguradas

### Mejoras Técnicas

- 🔄 **Web Workers** para procesamiento de audio
- 📊 **Visualizador de espectro** en tiempo real
- 🎛️ **Controles de sensibilidad** ajustables
- 💾 **Persistencia de configuraciones** del usuario

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🙏 Agradecimientos

- **Web Audio API** por el soporte nativo de audio
- **pitchfinder** por el algoritmo YIN de detección de pitch
- **Lucide** por los iconos hermosos y consistentes
- **Next.js** por el framework robusto y moderno

---

**Desarrollado con ❤️ para la comunidad musical**
