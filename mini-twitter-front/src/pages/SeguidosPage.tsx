/**
 * SeguidosPage
 * 
 * Responsabilidad: Mostrar la lista de usuarios seguidos por el usuario actual
 * Permite dejar de seguir
 */

import { Header } from '../components/Header';
import { UsuarioCard } from '../components/social';
import { useSocial } from '../hooks';
import styles from './SeguidosPage.module.css';

export const SeguidosPage = () => {
  const { seguidos, loading, error, dejarDeSeguir, refetch } = useSocial();

  return (
    <div className={styles.page}>
      <Header />
      
      <main className={styles.container}>
        <div className={styles.content}>
          <header className={styles.pageHeader}>
            <h1 className={styles.title}>Siguiendo</h1>
            <button
              onClick={refetch}
              className={styles.refreshBtn}
              disabled={loading}
            >
              🔄 Actualizar
            </button>
          </header>

          {loading && <p className={styles.message}>Cargando...</p>}
          {error && <p className={styles.error}>{error}</p>}
          
          {!loading && !error && seguidos.length === 0 && (
            <p className={styles.empty}>No sigues a ningún usuario todavía</p>
          )}

          {!loading && !error && seguidos.length > 0 && (
            <div className={styles.list}>
              {seguidos.map((usuario) => (
                <UsuarioCard
                  key={usuario.id}
                  usuario={usuario}
                  isSiguiendo={true}
                  onSeguir={async () => {}}
                  onDejarDeSeguir={() => dejarDeSeguir(usuario.id)}
                  showFollowButton={true}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
