import { useAudioContext } from '../../lib/hooks/useAudioContext';
import styles from './Common.module.css';

export function PlatformInfo() {
  const { isMobile } = useAudioContext();

  if (!isMobile) {
    return null; // Solo mostrar en dispositivos móviles
  }

  return (
    <div className={styles.platformInfo}>
      <div className={styles.mobileTips}>
        <h4>📱 Consejos para móviles</h4>
        <ul>
          <li>• Permite acceso al micrófono</li>
          <li>• Mantén el dispositivo cerca de la guitarra</li>
          <li>• Cierra otras apps de audio si tienes problemas</li>
        </ul>
      </div>
    </div>
  );
}
