/**
 * Componente TweetCard
 * 
 * Responsabilidad: Presentar un tweet individual con su información
 * Componente presentacional puro - recibe datos por props
 */

import type { TweetResponse } from '../api';
import styles from './TweetCard.module.css';

interface TweetCardProps {
  tweet: TweetResponse;
}

export const TweetCard = ({ tweet }: TweetCardProps) => {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-AR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (tweet.eliminado) {
    return (
      <article className={`${styles.card} ${styles.deleted}`}>
        <p className={styles.deletedText}>Este tweet ha sido eliminado</p>
      </article>
    );
  }

  return (
    <article className={styles.card}>
      <header className={styles.header}>
        <h3 className={styles.author}>@{tweet.autor}</h3>
        <time className={styles.date} dateTime={tweet.fechaCreacion}>
          {formatDate(tweet.fechaCreacion)}
        </time>
      </header>
      <p className={styles.content}>{tweet.contenido}</p>
    </article>
  );
};
