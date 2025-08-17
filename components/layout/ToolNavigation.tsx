import { getActiveTools, getPlannedTools } from '../config/tools';
import styles from './ToolNavigation.module.css';

interface ToolNavigationProps {
  currentPath?: string;
  showPlanned?: boolean;
}

export function ToolNavigation({
  currentPath = '/',
  showPlanned = false,
}: ToolNavigationProps) {
  const activeTools = getActiveTools();
  const plannedTools = getPlannedTools();

  return (
    <nav className={styles.toolNavigation}>
      <div className={styles.activeTools}>
        <h3>Herramientas Disponibles</h3>
        <div className={styles.toolGrid}>
          {activeTools.map((tool) => (
            <div
              key={tool.id}
              className={`${styles.toolCard} ${
                currentPath === tool.path ? styles.active : ''
              }`}
            >
              <span className={styles.toolIcon}>{tool.icon}</span>
              <h4>{tool.name}</h4>
              <p>{tool.description}</p>
            </div>
          ))}
        </div>
      </div>

      {showPlanned && plannedTools.length > 0 && (
        <div className={styles.plannedTools}>
          <h3>Próximamente</h3>
          <div className={styles.toolGrid}>
            {plannedTools.map((tool) => (
              <div
                key={tool.id}
                className={`${styles.toolCard} ${styles.planned}`}
              >
                <span className={styles.toolIcon}>{tool.icon}</span>
                <h4>{tool.name}</h4>
                <p>{tool.description}</p>
                <span className={styles.comingSoon}>Próximamente</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
