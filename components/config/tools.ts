// Configuración de herramientas musicales disponibles
export interface ToolConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  path: string;
  status: 'active' | 'planned' | 'development';
}

export const AVAILABLE_TOOLS: ToolConfig[] = [
  {
    id: 'tuner',
    name: 'Afinador',
    description: 'Afinador de guitarra con detección de notas en tiempo real',
    icon: '🎸',
    path: '/tuner',
    status: 'active',
  },
  {
    id: 'metronome',
    name: 'Metrónomo',
    description: 'Metrónomo digital con diferentes ritmos y subdivisiones',
    icon: '🥁',
    path: '/metronome',
    status: 'planned',
  },
  {
    id: 'scales',
    name: 'Guía de Escalas',
    description: 'Visualización interactiva de escalas musicales',
    icon: '🎼',
    path: '/scales',
    status: 'planned',
  },
  {
    id: 'chords',
    name: 'Diccionario de Acordes',
    description: 'Biblioteca de acordes con posiciones y variaciones',
    icon: '🎹',
    path: '/chords',
    status: 'planned',
  },
  {
    id: 'recorder',
    name: 'Grabador',
    description: 'Grabación de audio para practicar y revisar',
    icon: '🎙️',
    path: '/recorder',
    status: 'planned',
  },
];

export const getToolByPath = (path: string): ToolConfig | undefined => {
  return AVAILABLE_TOOLS.find((tool) => tool.path === path);
};

export const getActiveTools = (): ToolConfig[] => {
  return AVAILABLE_TOOLS.filter((tool) => tool.status === 'active');
};

export const getPlannedTools = (): ToolConfig[] => {
  return AVAILABLE_TOOLS.filter((tool) => tool.status === 'planned');
};
