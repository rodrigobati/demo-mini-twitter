/**
 * Componente FollowButton
 * 
 * Responsabilidad: Botón reutilizable para seguir/dejar de seguir
 * Maneja su propio estado de loading
 */

import { useState } from 'react';
import styles from './FollowButton.module.css';

interface FollowButtonProps {
  isSiguiendo: boolean;
  onSeguir: () => Promise<void>;
  onDejarDeSeguir: () => Promise<void>;
}

export const FollowButton: React.FC<FollowButtonProps> = ({
  isSiguiendo,
  onSeguir,
  onDejarDeSeguir,
}) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    try {
      setLoading(true);
      if (isSiguiendo) {
        await onDejarDeSeguir();
      } else {
        await onSeguir();
      }
    } catch (err) {
      console.error('Error al gestionar seguimiento:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`${styles.button} ${isSiguiendo ? styles.siguiendo : styles.seguir}`}
    >
      {loading ? 'Cargando...' : isSiguiendo ? 'Siguiendo' : 'Seguir'}
    </button>
  );
};
