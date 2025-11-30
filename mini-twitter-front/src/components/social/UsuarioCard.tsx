/**
 * Componente UsuarioCard
 * 
 * Responsabilidad: Mostrar información de un usuario con botón de seguir/dejar de seguir
 * Componente presentacional reutilizable
 */

import type { UsuarioResponse } from '../../api/types';
import { FollowButton } from './FollowButton';
import styles from './UsuarioCard.module.css';

interface UsuarioCardProps {
  usuario: UsuarioResponse;
  isSiguiendo: boolean;
  onSeguir: () => Promise<void>;
  onDejarDeSeguir: () => Promise<void>;
  showFollowButton?: boolean;
}

export const UsuarioCard: React.FC<UsuarioCardProps> = ({
  usuario,
  isSiguiendo,
  onSeguir,
  onDejarDeSeguir,
  showFollowButton = true,
}) => {
  return (
    <article className={styles.card}>
      <div className={styles.content}>
        {usuario.avatarUrl && (
          <img
            src={usuario.avatarUrl}
            alt={`Avatar de ${usuario.nombreUsuario}`}
            className={styles.avatar}
          />
        )}
        {!usuario.avatarUrl && (
          <div className={styles.avatarPlaceholder}>
            {usuario.nombreUsuario.charAt(0).toUpperCase()}
          </div>
        )}
        
        <div className={styles.info}>
          <h3 className={styles.username}>@{usuario.nombreUsuario}</h3>
          <span className={styles.userId}>ID: {usuario.id}</span>
        </div>
      </div>

      {showFollowButton && (
        <FollowButton
          isSiguiendo={isSiguiendo}
          onSeguir={onSeguir}
          onDejarDeSeguir={onDejarDeSeguir}
        />
      )}
    </article>
  );
};
