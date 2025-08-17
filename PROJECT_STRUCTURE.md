# 🏗️ Estructura del Proyecto Sonora

## 📁 Organización de Directorios

```
sonora/
├── app/                           # Next.js App Router
│   ├── layout.tsx                # Layout principal de la aplicación
│   ├── page.tsx                  # Página principal (afinador)
│   └── globals.css               # Estilos globales con variables CSS
│
├── components/                    # Componentes React organizados por funcionalidad
│   ├── tuner/                    # Componentes específicos del afinador
│   │   ├── TunerUI.tsx          # Componente principal del afinador
│   │   ├── TunerHeader.tsx      # Header con título y subtítulo
│   │   ├── NoteDisplay.tsx      # Visualización de nota y frecuencia
│   │   ├── StringIndicator.tsx  # Indicador de cuerda detectada
│   │   ├── TuningControls.tsx   # Controles de afinación
│   │   ├── AdditionalInfo.tsx   # Información de confianza y objetivo
│   │   ├── StringTestButtons.tsx # Botones de prueba de cuerdas
│   │   ├── BrowserNotSupported.tsx # Mensaje de navegador no compatible
│   │   ├── TunerUI.module.css   # Estilos específicos del afinador
│   │   └── index.ts             # Exportaciones del módulo afinador
│   │
│   ├── common/                   # Componentes reutilizables en toda la app
│   │   ├── Needle.tsx           # Indicador visual de afinación
│   │   ├── Needle.module.css    # Estilos del indicador
│   │   ├── Common.module.css    # Estilos comunes (footer, errores)
│   │   └── index.ts             # Exportaciones de componentes comunes
│   │
│   ├── layout/                   # Componentes de estructura y navegación
│   │   ├── TunerFooter.tsx      # Footer de la aplicación
│   │   ├── ToolNavigation.tsx   # Navegación entre herramientas
│   │   ├── ToolNavigation.module.css # Estilos de navegación
│   │   └── index.ts             # Exportaciones de layout
│   │
│   ├── config/                   # Configuración y tipos
│   │   └── tools.ts             # Configuración de herramientas disponibles
│   │
│   └── __tests__/               # Tests de componentes
│       └── Needle.test.tsx      # Tests del componente Needle
│
├── lib/                          # Lógica de negocio y hooks
│   ├── audio/                   # Funciones relacionadas con audio
│   │   ├── analyzer.ts          # Analizador de frecuencia
│   │   ├── notes.ts             # Utilidades de notas musicales
│   │   └── __tests__/           # Tests de audio
│   │       └── notes.test.ts    # Tests de utilidades de notas
│   │
│   ├── hooks/                   # Hooks personalizados de React
│   │   ├── useTuner.ts          # Hook principal del afinador
│   │   ├── useTuning.ts         # Hook de manejo de afinaciones
│   │   ├── useTunerUtils.ts     # Hook de utilidades del afinador
│   │   └── __tests__/           # Tests de hooks
│   │       ├── useTuner.test.tsx # Tests del hook useTuner
│   │       └── useTuning.test.tsx # Tests del hook useTuning
│   │
│   └── contexts/                # Contextos de React (futuro)
│
├── styles/                       # Estilos globales y variables
│   └── variables.css            # Variables CSS para toda la aplicación
│
├── public/                       # Archivos estáticos
├── package.json                  # Dependencias y scripts
├── tsconfig.json                 # Configuración de TypeScript
├── jest.config.js                # Configuración de Jest
├── eslint.config.mjs             # Configuración de ESLint
└── README.md                     # Documentación principal
```

## 🔄 Flujo de Importaciones

### Componentes del Afinador

```tsx
// Desde components/tuner/
import { TunerUI } from './TunerUI';
import { TunerHeader } from './TunerHeader';
import { NoteDisplay } from './NoteDisplay';
// etc.
```

### Componentes Comunes

```tsx
// Desde cualquier componente
import { Needle } from '../common/Needle';
import { TunerFooter } from '../layout/TunerFooter';
```

### Hooks y Utilidades

```tsx
// Desde components/tuner/
import { useTuner } from '../../lib/hooks/useTuner';
import { useTuning } from '../../lib/hooks/useTuning';
import { useTunerUtils } from '../../lib/hooks/useTunerUtils';
```

### Configuración

```tsx
// Desde cualquier componente
import { AVAILABLE_TOOLS, getActiveTools } from '../config/tools';
```

## 🎯 Ventajas de la Nueva Estructura

### 1. **Organización Clara por Funcionalidad**

- `tuner/`: Todo lo relacionado con el afinador
- `common/`: Componentes reutilizables
- `layout/`: Estructura y navegación
- `config/`: Configuración centralizada

### 2. **Escalabilidad para Futuras Herramientas**

```
components/
├── tuner/           # ✅ Implementado
├── metronome/       # 🚧 Futuro
├── scales/          # 🚧 Futuro
├── chords/          # 🚧 Futuro
├── recorder/        # 🚧 Futuro
├── common/          # 🔄 Reutilizable
└── layout/          # 🔄 Reutilizable
```

### 3. **Separación de Responsabilidades**

- **UI Components**: Solo presentación
- **Business Logic**: En hooks y lib/
- **Configuration**: Centralizada en config/
- **Styling**: Organizado por módulo

### 4. **Mantenibilidad**

- Fácil encontrar componentes específicos
- Importaciones claras y predecibles
- Tests organizados junto al código
- Estilos encapsulados por componente

## 🚀 Preparación para Futuras Herramientas

### Metrónomo

```
components/metronome/
├── MetronomeUI.tsx
├── TempoControls.tsx
├── RhythmSelector.tsx
├── BeatVisualizer.tsx
└── Metronome.module.css
```

### Guía de Escalas

```
components/scales/
├── ScalesUI.tsx
├── ScaleSelector.tsx
├── FretboardVisualizer.tsx
├── ScalePatterns.tsx
└── Scales.module.css
```

### Diccionario de Acordes

```
components/chords/
├── ChordsUI.tsx
├── ChordLibrary.tsx
├── ChordDiagram.tsx
├── ProgressionBuilder.tsx
└── Chords.module.css
```

## 📝 Convenciones de Nomenclatura

### Archivos

- **Componentes**: PascalCase (ej: `TunerUI.tsx`)
- **Hooks**: camelCase con prefijo `use` (ej: `useTuner.ts`)
- **Utilidades**: camelCase (ej: `notes.ts`)
- **Estilos**: `ComponentName.module.css`

### Directorios

- **Componentes**: camelCase (ej: `tuner/`, `common/`)
- **Lógica**: camelCase (ej: `hooks/`, `audio/`)
- **Configuración**: camelCase (ej: `config/`)

### Importaciones

- **Relativas**: `../common/ComponentName`
- **Absolutas**: `@/components/common/ComponentName` (futuro)
- **Barrel exports**: Solo para módulos específicos

## 🔧 Configuración de Build

### Next.js

- **App Router**: Configurado para rutas dinámicas
- **CSS Modules**: Soporte completo para estilos modulares
- **TypeScript**: Configuración estricta habilitada

### Testing

- **Jest**: Configurado para componentes React
- **React Testing Library**: Para testing de componentes
- **Coverage**: Configurado para reportes detallados

### Linting

- **ESLint**: Reglas estrictas para TypeScript
- **Prettier**: Formateo automático del código
- **Husky**: Hooks de pre-commit (futuro)

## 📊 Métricas de Calidad

### Antes de la Refactorización

- **TunerUI**: 414 líneas
- **Responsabilidades**: Múltiples en un solo archivo
- **Reutilización**: Limitada
- **Mantenibilidad**: Baja

### Después de la Refactorización

- **TunerUI**: ~100 líneas
- **Responsabilidades**: Una por componente
- **Reutilización**: Alta
- **Mantenibilidad**: Alta
- **Componentes**: 8 + 1 hook personalizado

## 🎯 Próximos Pasos

1. **Implementar Metrónomo** usando la nueva estructura
2. **Crear sistema de navegación** entre herramientas
3. **Implementar tema oscuro** usando variables CSS
4. **Agregar tests** para nuevos componentes
5. **Configurar CI/CD** para la nueva estructura
6. **Documentar APIs** de cada módulo
7. **Crear Storybook** para componentes (futuro)

---

Esta estructura proporciona una base sólida para el crecimiento del proyecto, manteniendo el código organizado, testeable y mantenible.
