# 🎵 Sonora - Afinador de Guitarra Profesional

Sonora es una aplicación web desarrollada con Next.js y TypeScript que ofrece herramientas musicales profesionales. Su funcionalidad principal es un **afinador en tiempo real** que detecta notas y frecuencias usando el micrófono, con soporte para múltiples afinaciones y ajustes de semitonos.

## ✨ Características

- 🎸 **Afinador en tiempo real** para guitarra con detección precisa
- 🎯 **Múltiples afinaciones** predefinidas (Estándar, Drop D, Drop C, Open G, etc.)
- 🎛️ **Ajuste de semitonos** personalizable (-12 a +12 semitonos)
- 🎵 **Botones de prueba** para cada cuerda con tonos generados
- 📱 **Diseño responsive** optimizado para desktop, tablet y móvil
- 🌙 **Modo oscuro** por defecto con variables CSS personalizables
- ⚡ **Baja latencia** usando Web Audio API nativa
- 🧪 **Tests completos** con Jest y React Testing Library
- 🚀 **CI/CD automático** con GitHub Actions

## 🚀 Tecnologías

- **Framework:** Next.js 15 (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** CSS Modules con variables CSS
- **Audio:** Web Audio API + Aubio.js para detección de pitch
- **Matemáticas:** BigNumber.js para cálculos precisos
- **Testing:** Jest + React Testing Library
- **CI/CD:** GitHub Actions
- **Deploy:** Vercel (configurado externamente)

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
│   ├── Needle.tsx         # Indicador visual de afinación
│   └── __tests__/         # Tests de componentes
├── lib/                    # Lógica de negocio
│   ├── audio/             # Utilidades de audio
│   │   ├── analyzer.ts    # Analizador de frecuencia
│   │   └── notes.ts       # Utilidades de notas musicales
│   └── hooks/             # Custom hooks
│       ├── useTuner.ts    # Hook del afinador
│       └── useTuning.ts   # Hook de afinaciones
│       └── __tests__/     # Tests de hooks
├── styles/                 # Estilos globales
│   └── globals.css        # CSS global con variables
├── .github/workflows/      # GitHub Actions CI/CD
│   ├── ci.yml             # Pipeline de tests y build
│   └── pr-check.yml       # Verificación de PRs
└── package.json            # Dependencias y scripts
```

## 🎵 Cómo Usar el Afinador

### Funcionalidad Básica

1. **Permitir acceso al micrófono** cuando el navegador lo solicite
2. **Presionar "Iniciar"** para comenzar la detección
3. **Tocar una cuerda** de la guitarra cerca del micrófono
4. **Observar el indicador horizontal** que muestra la afinación:
   - 🟢 **Centro:** Nota afinada (0 cents)
   - 🟡 **Izquierda:** Nota plana (-50 a 0 cents)
   - 🔴 **Derecha:** Nota aguda (0 a +50 cents)
5. **Presionar "Detener"** para pausar la detección

### Afinaciones y Semitonos

- **Selector de afinación:** Cambiar entre afinaciones predefinidas
- **Ajuste de semitonos:** Botones para subir/bajar semitonos individuales
- **Reset:** Volver a la afinación base seleccionada
- **Afinaciones disponibles:**
  - Estándar (E2, A2, D3, G3, B3, E4)
  - Drop D (-2 semitonos)
  - Drop C (-4 semitonos)
  - Open G (-2 semitonos)
  - Open D (-2 semitonos)
  - DADGAD (-2 semitonos)
  - Medio tono arriba/abajo (±1 semitono)
  - Un tono arriba/abajo (±2 semitonos)

### Botones de Prueba

- **Probar cuerdas:** Botones individuales para cada cuerda
- **Generación de tonos:** Escucha el tono correcto de cada cuerda
- **Diseño responsive:**
  - **Desktop:** 6 botones en una línea
  - **Tablet:** 3 botones por fila, 2 filas
  - **Mobile:** 2 botones por fila, 3 filas

## 🔧 Funcionamiento Técnico

### Detección de Frecuencia

- Utiliza **Web Audio API** para capturar audio del micrófono
- Implementa **Aubio.js** para detección de pitch de alta precisión
- Procesa audio en tiempo real con buffer optimizado (4096 samples)

### Sistema de Afinaciones

- **Matrices predefinidas** para cada afinación con frecuencias exactas
- **Cálculos precisos** usando BigNumber.js para evitar errores de punto flotante
- **Mapeo inteligente** entre nombres de cuerdas y frecuencias ajustadas

### Interfaz Visual

- **Indicador horizontal** que reemplaza la flecha tradicional
- **Escala de cents** visual (-50 a +50 cents)
- **Colores dinámicos** basados en el estado de afinación
- **Diseño compacto** optimizado para todas las pantallas

## 🚀 CI/CD Pipeline

### GitHub Actions

- **Tests automáticos** en cada PR y push
- **Linting del código** con ESLint
- **Build automático** para verificar compilación
- **Comentarios automáticos** en PRs con estado de tests
- **Protección de rama** main con tests obligatorios

### Deploy Automático

- **Vercel configurado externamente** para deploy automático
- **Trigger:** Push a rama `main`
- **Prerequisito:** Tests exitosos en GitHub Actions

## 🚧 Roadmap

### Próximas Funcionalidades

- 🎯 **Afinador para otros instrumentos** (bajo, ukelele, violín)
- 🥁 **Metrónomo** con BPM ajustable
- 🎵 **Generador de tonos** (frecuencia libre)
- 🎧 **Ejercicios de oído** (intervalos, notas)
- ⚙️ **Afinaciones personalizadas** del usuario

### Mejoras Técnicas

- 🔄 **Web Workers** para procesamiento de audio
- 📊 **Visualizador de espectro** en tiempo real
- 🎛️ **Controles de sensibilidad** ajustables
- 💾 **Persistencia de configuraciones** del usuario
- 🌐 **PWA** para instalación en dispositivos móviles

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

**Nota:** Todos los PRs deben pasar los tests automáticamente antes del merge.

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🙏 Agradecimientos

- **Aubio.js** por la detección de pitch de alta precisión
- **BigNumber.js** por los cálculos matemáticos precisos
- **Next.js** por el framework robusto y moderno
- **GitHub Actions** por la automatización de CI/CD

---

**Desarrollado por Jeremías Folgado con un poco bastante de IA** 🚀

**Sonora - Herramientas Musicales Profesionales** 🎵
