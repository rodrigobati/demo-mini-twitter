/**
 * Componente TweetList
 * 
 * Responsabilidad: Renderizar una lista de tweets con manejo de estados
 * Componente presentacional que delega lógica a TweetCard
 */

import { TweetCard } from './TweetCard';
import type { TweetResponse } from '../../api/types';
import styles from './TweetList.module.css';

interface TweetListProps {
  tweets: TweetResponse[];
  loading?: boolean;
  error?: string | null;
  onTweetDeleted?: () => void;
  onRetweeted?: () => void;
  emptyMessage?: string;
}

export const TweetList: React.FC<TweetListProps> = ({
  tweets,
  loading = false,
  error = null,
  onTweetDeleted,
  onRetweeted,
  emptyMessage = 'No hay tweets todavía',
}) => {
  if (loading) {
    return (
      <div className={styles.container}>
        <p className={styles.loading}>Cargando tweets...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <p className={styles.error}>{error}</p>
      </div>
    );
  }

  if (tweets.length === 0) {
    return (
      <div className={styles.container}>
        <p className={styles.empty}>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={styles.list}>
      {tweets.map((tweet) => {
        // Log para debugging
        console.log('[TweetList] Renderizando tweet:', {
          id: tweet.id,
          autor: tweet.autor,
          esRetweet: tweet.esRetweet,
          retweeteadoPor: tweet.retweeteadoPor
        });
        
        return (
          <TweetCard
            key={tweet.id}
            tweet={tweet}
            onTweetDeleted={onTweetDeleted}
            onRetweeted={onRetweeted}
          />
        );
      })}
    </div>
  );
};
