/**
 * Componente Header
 * 
 * Responsabilidad: Presentar el menú de navegación principal con autenticación
 * 
 * Ahora incluye:
 * - Logo y navegación
 * - AuthButton que muestra el estado de autenticación dinámicamente
 * 
 * Componente presentacional - sin lógica de negocio
 */

import { Link } from 'react-router-dom';
import { AuthButton } from './AuthButton';
import styles from './Header.module.css';

export const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <h1 className={styles.logo}>MiniTwitter</h1>
        <nav className={styles.nav}>
          <Link to="/" className={styles.navLink}>
            Home
          </Link>
          <Link to="/timeline" className={styles.navLink}>
            Timeline
          </Link>
          <Link to="/create-tweet" className={styles.navLink}>
            Crear Tweet
          </Link>
          <Link to="/seguidos" className={styles.navLink}>
            Siguiendo
          </Link>
          <AuthButton />
        </nav>
      </div>
    </header>
  );
};
