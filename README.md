# 🎵 Sonora - Suite de Herramientas Musicales

Sonora es una aplicación web moderna que proporciona herramientas musicales profesionales para músicos de todos los niveles.

## 🚀 Herramientas Disponibles

### 🎸 Afinador de Guitarra (Activo)

- Detección de notas en tiempo real
- Ajuste de afinación personalizada
- Prueba de cuerdas con tonos de referencia
- Interfaz intuitiva y responsive

### 🥁 Metrónomo (Próximamente)

- Diferentes ritmos y subdivisiones
- Ajuste de tempo personalizable
- Patrones rítmicos predefinidos

### 🎼 Guía de Escalas (Próximamente)

- Visualización interactiva de escalas
- Diferentes modos y tonalidades
- Posiciones en el mástil de guitarra

### 🎹 Diccionario de Acordes (Próximamente)

- Biblioteca completa de acordes
- Posiciones y variaciones
- Progresiones comunes

### 🎙️ Grabador (Próximamente)

- Grabación de audio para práctica
- Reproducción y análisis
- Compartir grabaciones

## 🏗️ Estructura del Proyecto

```
sonora/
├── app/                    # Páginas de Next.js
├── components/            # Componentes React
│   ├── tuner/            # Componentes del afinador
│   ├── common/           # Componentes reutilizables
│   ├── layout/           # Componentes de estructura
│   └── config/           # Configuración de herramientas
├── lib/                   # Lógica de negocio
│   ├── audio/            # Funciones de audio
│   ├── hooks/            # Hooks personalizados
│   └── contexts/         # Contextos de React
├── styles/                # Estilos globales
└── public/                # Archivos estáticos
```

## 🛠️ Tecnologías Utilizadas

- **Frontend**: Next.js 15, React 18, TypeScript
- **Audio**: Web Audio API, Aubio.js
- **Estilos**: CSS Modules, CSS Variables
- **Testing**: Jest, React Testing Library
- **Build**: Next.js App Router

## 🚀 Instalación y Uso

### Prerrequisitos

- Node.js 18+
- npm o yarn

### Instalación

```bash
git clone https://github.com/tu-usuario/sonora.git
cd sonora
npm install
```

### Desarrollo

```bash
npm run dev
```

### Build de Producción

```bash
npm run build
npm start
```

### Testing

```bash
npm test
```

## 🎯 Características Principales

### Afinador

- ✅ Detección de frecuencia en tiempo real
- ✅ Ajuste de afinación personalizada
- ✅ Prueba de cuerdas con tonos de referencia
- ✅ Interfaz responsive y accesible
- ✅ Soporte para diferentes afinaciones

### Arquitectura

- ✅ Componentes modulares y reutilizables
- ✅ Hooks personalizados para lógica de audio
- ✅ Sistema de variables CSS para consistencia
- ✅ Estructura preparada para futuras herramientas
- ✅ Código limpio y mantenible

## 🔮 Roadmap

### Fase 1: Afinador ✅

- [x] Detección de notas básica
- [x] Interfaz de usuario
- [x] Ajuste de afinación
- [x] Prueba de cuerdas

### Fase 2: Metrónomo 🥁

- [ ] Controles de tempo
- [ ] Diferentes ritmos
- [ ] Subdivisiones
- [ ] Patrones personalizados

### Fase 3: Guía de Escalas 🎼

- [ ] Visualización de escalas
- [ ] Diferentes modos
- [ ] Posiciones en guitarra
- [ ] Ejercicios de práctica

### Fase 4: Diccionario de Acordes 🎹

- [ ] Biblioteca de acordes
- [ ] Posiciones en guitarra
- [ ] Progresiones comunes
- [ ] Búsqueda y filtros

### Fase 5: Grabador 🎙️

- [ ] Grabación de audio
- [ ] Reproducción
- [ ] Análisis de grabaciones
- [ ] Compartir y exportar

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Desarrollador

**Jeremías Folgado** - Desarrollador principal con un poco bastante de IA

---

¿Tienes alguna pregunta o sugerencia? ¡Abre un issue o contáctame!
