/**
 * Componente RespuestaItem
 * 
 * Responsabilidad: Mostrar una respuesta individual
 * Componente presentacional simple
 */

import { formatDate } from '../../utils';
import type { RespuestaTweetResponse } from '../../api/types';
import styles from './TweetCard.module.css';

interface RespuestaItemProps {
  respuesta: RespuestaTweetResponse;
  canDelete: boolean;
  onDelete: () => void;
}

export const RespuestaItem: React.FC<RespuestaItemProps> = ({
  respuesta,
  canDelete,
  onDelete,
}) => {
  return (
    <div className={`${styles.respuestaItem} ${respuesta.eliminado ? styles.deleted : ''}`}>
      <div className={styles.respuestaHeader}>
        <span className={styles.respuestaAutor}>@{respuesta.autor}</span>
        <span className={styles.separator}>·</span>
        <time className={styles.respuestaDate}>{formatDate(respuesta.fechaCreacion)}</time>
        {canDelete && !respuesta.eliminado && (
          <button
            onClick={onDelete}
            className={styles.deleteRespuestaBtn}
            aria-label="Eliminar respuesta"
          >
            🗑️
          </button>
        )}
      </div>
      <p className={styles.respuestaContenido}>{respuesta.contenido}</p>
      {respuesta.eliminado && <span className={styles.deletedBadge}>Eliminado</span>}
    </div>
  );
};
