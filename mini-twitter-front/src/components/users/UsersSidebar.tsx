/**
 * Componente UsersSidebar
 * 
 * Responsabilidad:
 * - Mostrar lista de todos los usuarios del sistema
 * - Indicar el usuario actual con "(tú)"
 * - Mostrar estado de seguimiento para cada usuario
 * - Permitir seguir/dejar de seguir
 * - Manejar estados de carga, error y lista vacía
 * 
 * Componente presentacional que delega toda la lógica al hook
 */

import { useAuth } from '../../auth';
import { useUsuariosConEstadoDeSeguimiento } from '../../hooks';
import styles from './UsersSidebar.module.css';

export const UsersSidebar: React.FC = () => {
  const { username } = useAuth();
  const { usuarios, loading, error, seguir, dejarDeSeguir } =
    useUsuariosConEstadoDeSeguimiento(username);

  if (loading) {
    return (
      <aside className={styles.sidebar}>
        <h2 className={styles.title}>Usuarios</h2>
        <p className={styles.loading}>Cargando usuarios...</p>
      </aside>
    );
  }

  if (error) {
    return (
      <aside className={styles.sidebar}>
        <h2 className={styles.title}>Usuarios</h2>
        <p className={styles.error}>{error}</p>
      </aside>
    );
  }

  if (usuarios.length === 0) {
    return (
      <aside className={styles.sidebar}>
        <h2 className={styles.title}>Usuarios</h2>
        <p className={styles.empty}>No hay usuarios disponibles</p>
      </aside>
    );
  }

  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.title}>Usuarios del Sistema</h2>
      <ul className={styles.userList}>
        {usuarios.map((usuario) => (
          <li key={usuario.id} className={styles.userItem}>
            <div className={styles.userInfo}>
              {/* Avatar o placeholder */}
              {usuario.avatarUrl ? (
                <img
                  src={usuario.avatarUrl}
                  alt={`Avatar de ${usuario.nombreUsuario}`}
                  className={styles.avatar}
                />
              ) : (
                <div className={styles.avatarPlaceholder}>
                  {usuario.nombreUsuario.charAt(0).toUpperCase()}
                </div>
              )}

              {/* Username con indicador de "tú" */}
              <div className={styles.userDetails}>
                <span className={styles.username}>
                  @{usuario.nombreUsuario}
                </span>
                {usuario.isCurrentUser && (
                  <span className={styles.currentUserBadge}>(tú)</span>
                )}
              </div>
            </div>

            {/* Botón seguir/dejar de seguir (no mostrar para usuario actual) */}
            {!usuario.isCurrentUser && (
              <button
                className={`${styles.followButton} ${
                  usuario.isSiguiendo ? styles.following : styles.follow
                }`}
                onClick={() =>
                  usuario.isSiguiendo
                    ? dejarDeSeguir(usuario.id)
                    : seguir(usuario.id)
                }
              >
                {usuario.isSiguiendo ? 'Siguiendo' : 'Seguir'}
              </button>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
};
