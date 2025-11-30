/**
 * Componente TweetList
 * 
 * Responsabilidad: Renderizar una lista de tweets con paginación
 * Componente presentacional - la lógica de paginación viene de hooks
 */

import type { TweetResponse } from '../api';
import { TweetCard } from './TweetCard';
import styles from './TweetList.module.css';

interface TweetListProps {
  tweets: TweetResponse[];
  page: number;
  hasNext: boolean;
  hasPrevious: boolean;
  onNextPage: () => void;
  onPreviousPage: () => void;
}

export const TweetList = ({
  tweets,
  page,
  hasNext,
  hasPrevious,
  onNextPage,
  onPreviousPage,
}: TweetListProps) => {
  if (tweets.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No hay tweets para mostrar</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.tweetList}>
        {tweets.map((tweet) => (
          <TweetCard key={tweet.id} tweet={tweet} />
        ))}
      </div>

      <nav className={styles.pagination} aria-label="Paginación de tweets">
        <button
          onClick={onPreviousPage}
          disabled={!hasPrevious}
          className={styles.paginationButton}
          aria-label="Página anterior"
        >
          ← Anterior
        </button>
        <span className={styles.pageNumber}>Página {page}</span>
        <button
          onClick={onNextPage}
          disabled={!hasNext}
          className={styles.paginationButton}
          aria-label="Página siguiente"
        >
          Siguiente →
        </button>
      </nav>
    </div>
  );
};
