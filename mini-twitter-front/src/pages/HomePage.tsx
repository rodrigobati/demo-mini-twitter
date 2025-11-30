/**
 * Página HomePage
 * 
 * Responsabilidad: Orquestar la página principal con:
 * - Panel principal con tweets paginados (todos o de un usuario)
 * - Panel lateral con usuarios del sistema
 * - Coordinación entre componentes
 */

import { useState, useEffect } from 'react';
import { Header, UserList } from '../components';
import { TweetList } from '../components/tweet';
import { useUsers, usePagination } from '../hooks';
import { useAuth } from '../auth';
import { tweetsService } from '../api';
import type { TweetResponse } from '../api';
import styles from './HomePage.module.css';

export const HomePage = () => {
  const [tweets, setTweets] = useState<TweetResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { users, isLoading: usersLoading } = useUsers();
  const { authenticated } = useAuth();
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  // Paginación de 10 tweets por página
  const {
    paginatedItems,
    currentPage,
    hasNext,
    hasPrevious,
    goToNextPage,
    goToPreviousPage,
    resetPagination,
  } = usePagination(tweets, { itemsPerPage: 10 });

  // Cargar tweets cuando cambia el usuario seleccionado
  useEffect(() => {
    const loadTweets = async () => {
      setIsLoading(true);
      try {
        let response;
        if (selectedUserId) {
          // Cargar tweets del usuario específico (incluye retweets)
          console.log('🔍 [HomePage] Cargando tweets del usuario:', selectedUserId);
          response = await tweetsService.getTweetsDeUsuario(selectedUserId, 100);
          console.log('📦 [HomePage] Tweets recibidos:', response.tweets.length);
          
          // Usuario seleccionado: mostrar todos (originales + retweets)
          setTweets(response.tweets);
        } else {
          // Cargar TODOS los tweets del sistema (sin filtrar por seguimiento)
          console.log('🔍 [HomePage] Cargando TODOS los tweets del sistema (Ver todos)');
          response = await tweetsService.getTodosTweets(100);
          console.log('📦 [HomePage] Tweets recibidos:', response.tweets.length);
          
          // Ver todos: el backend ya devuelve solo originales (sin retweets)
          // No necesitamos filtrar aquí porque el endpoint GET /api/tweets
          // ya retorna solo tweets originales
          setTweets(response.tweets);
        }
        
        console.log('✅ [HomePage] Tweets finales cargados:', tweets.length);
        
      } catch (error) {
        console.error('Error cargando tweets:', error);
        setTweets([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Solo cargar si está autenticado
    if (authenticated) {
      loadTweets();
    }
  }, [selectedUserId, authenticated]);

  const handleUserClick = (userId: number) => {
    setSelectedUserId(userId);
    resetPagination();
  };

  const handleShowAll = () => {
    setSelectedUserId(null);
    resetPagination();
  };

  const refetchTweets = async () => {
    setIsLoading(true);
    try {
      let response;
      if (selectedUserId) {
        response = await tweetsService.getTweetsDeUsuario(selectedUserId, 100);
        setTweets(response.tweets);
      } else {
        response = await tweetsService.getTodosTweets(100);
        setTweets(response.tweets);
      }
    } catch (error) {
      console.error('Error recargando tweets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <Header />
      
      <main className={styles.mainContent}>
        <aside className={styles.sidebar}>
          {usersLoading ? (
            <p>Cargando usuarios...</p>
          ) : (
            <UserList
              users={users}
              onUserClick={handleUserClick}
              selectedUserId={selectedUserId}
            />
          )}
        </aside>

        <section className={styles.mainPanel}>
          <div className={styles.panelHeader}>
            <h2 className={styles.panelTitle}>
              {selectedUserId ? `Tweets del usuario` : 'Todos los Tweets'}
            </h2>
            {selectedUserId && (
              <button onClick={handleShowAll} className={styles.showAllButton}>
                Ver todos
              </button>
            )}
          </div>

          <TweetList
            tweets={paginatedItems}
            loading={isLoading}
            onRetweeted={refetchTweets}
            emptyMessage={selectedUserId ? 'Este usuario no tiene tweets' : 'No hay tweets'}
          />

          {/* Paginación manual */}
          {!isLoading && tweets.length > 0 && (
            <nav className={styles.pagination} aria-label="Paginación de tweets">
              <button
                onClick={goToPreviousPage}
                disabled={!hasPrevious}
                className={styles.paginationButton}
                aria-label="Página anterior"
              >
                ← Anterior
              </button>
              <span className={styles.pageNumber}>Página {currentPage}</span>
              <button
                onClick={goToNextPage}
                disabled={!hasNext}
                className={styles.paginationButton}
                aria-label="Página siguiente"
              >
                Siguiente →
              </button>
            </nav>
          )}
        </section>
      </main>
    </div>
  );
};
