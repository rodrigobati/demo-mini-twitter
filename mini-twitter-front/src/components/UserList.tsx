/**
 * Componente UserList
 * 
 * Responsabilidad: Mostrar lista de usuarios del sistema
 * Componente presentacional - recibe datos y handler por props
 */

import type { UsuarioResponse } from '../api';
import styles from './UserList.module.css';

interface UserListProps {
  users: UsuarioResponse[];
  onUserClick: (userId: number) => void;
  selectedUserId?: number | null;
}

export const UserList = ({ users, onUserClick, selectedUserId }: UserListProps) => {
  if (users.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No hay usuarios disponibles</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Usuarios</h2>
      <ul className={styles.userList}>
        {users.map((user) => (
          <li key={user.id}>
            <button
              className={`${styles.userButton} ${
                selectedUserId === user.id ? styles.selected : ''
              }`}
              onClick={() => onUserClick(user.id)}
              aria-label={`Ver tweets de ${user.nombreUsuario}`}
            >
              <span className={styles.username}>@{user.nombreUsuario}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
