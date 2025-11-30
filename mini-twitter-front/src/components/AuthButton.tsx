/**
 * AuthButton Component
 * 
 * Botón de autenticación que se adapta dinámicamente según el estado:
 * 
 * - NO autenticado: Muestra "Iniciar sesión" y llama a login()
 * - Autenticado: Muestra "@nombreUsuario" con menú de logout
 * 
 * Este componente se suscribe al AuthContext mediante useAuth()
 * y re-renderiza automáticamente cuando cambia el estado de autenticación.
 * 
 * Responsabilidad: Presentación del estado de autenticación
 * Lógica: Delegada al hook useAuth()
 */

import React, { useState } from 'react';
import { useAuth } from '../auth';
import styles from './AuthButton.module.css';

export const AuthButton: React.FC = () => {
  const { authenticated, username, login, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  if (!authenticated) {
    return (
      <button className={styles.loginButton} onClick={login}>
        Iniciar sesión
      </button>
    );
  }

  return (
    <div className={styles.userMenu}>
      <button 
        className={styles.userButton} 
        onClick={() => setShowMenu(!showMenu)}
      >
        @{username}
      </button>
      
      {showMenu && (
        <div className={styles.dropdown}>
          <button className={styles.logoutButton} onClick={logout}>
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
};
