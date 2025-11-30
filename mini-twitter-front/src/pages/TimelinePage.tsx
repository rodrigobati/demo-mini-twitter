/**
 * TimelinePage
 * 
 * Responsabilidad: Página principal del timeline con todos los tweets
 * Muestra tweets paginados con límite de 100
 * Incluye panel lateral de usuarios
 */

import { Header } from '../components/Header';
import { TweetList } from '../components/tweet';
import { UsersSidebar } from '../components/users';
import { useTimeline } from '../hooks';
import styles from './TimelinePage.module.css';

export const TimelinePage = () => {
  const { tweets, loading, error, refetch } = useTimeline(100);

  return (
    <div className={styles.page}>
      <Header />
      
      <main className={styles.container}>
        {/* Panel izquierdo: usuarios del sistema */}
        <aside className={styles.sidebar}>
          <UsersSidebar />
        </aside>

        {/* Panel central: timeline de tweets */}
        <div className={styles.content}>
          <header className={styles.pageHeader}>
            <h1 className={styles.title}>Timeline</h1>
            <button
              onClick={refetch}
              className={styles.refreshBtn}
              disabled={loading}
            >
              🔄 Actualizar
            </button>
          </header>

          <TweetList
            tweets={tweets}
            loading={loading}
            error={error}
            onRetweeted={refetch}
            emptyMessage="No hay tweets en el timeline todavía"
          />
        </div>
      </main>
    </div>
  );
};
