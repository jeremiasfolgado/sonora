import { useAudioContext } from '../../lib/hooks/useAudioContext';
import styles from './Common.module.css';

export function PlatformInfo() {
  const { isIOS, isAndroid, isMobile } = useAudioContext();

  if (!isMobile) {
    return null; // Solo mostrar en dispositivos móviles
  }

  return (
    <div className={styles.platformInfo}>
      {isIOS && (
        <div className={styles.iosTips}>
          <h4>📱 Consejos para iOS</h4>
          <ul>
            <li>• Toca directamente los botones de prueba de cuerdas</li>
            <li>• Permite acceso al micrófono cuando se solicite</li>
            <li>• Mantén el dispositivo cerca de la guitarra</li>
            <li>• Evita usar auriculares para mejor detección</li>
            <li>• La afinación puede ser menos precisa que en desktop</li>
          </ul>
        </div>
      )}

      {isAndroid && (
        <div className={styles.androidTips}>
          <h4>🤖 Consejos para Android</h4>
          <ul>
            <li>• Permite acceso al micrófono</li>
            <li>• Mantén el dispositivo cerca de la guitarra</li>
            <li>• Cierra otras apps de audio si tienes problemas</li>
          </ul>
        </div>
      )}
    </div>
  );
}
