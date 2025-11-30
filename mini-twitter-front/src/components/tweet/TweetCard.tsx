/**
 * Componente TweetCard
 * 
 * Responsabilidad: Presentar un tweet individual con todas sus acciones
 * - Likes (con contador)
 * - Retweet
 * - Respuestas (expandibles)
 * - Seguir/Dejar de seguir al autor
 * 
 * Componente presentacional con lógica delegada a hooks
 */

import { useState } from 'react';
import { useLikes, useRespuestas } from '../../hooks';
import { useAuth } from '../../auth';
import { formatDate } from '../../utils';
import { RespuestaForm } from './RespuestaForm';
import { RespuestaItem } from './RespuestaItem';
import { tweetsService } from '../../api';
import type { TweetResponse } from '../../api/types';
import styles from './TweetCard.module.css';

interface TweetCardProps {
  tweet: TweetResponse;
  onTweetDeleted?: () => void;
  onRetweeted?: () => void;
  showAuthorId?: boolean;
}

export const TweetCard: React.FC<TweetCardProps> = ({
  tweet,
  onRetweeted,
  showAuthorId = false,
}) => {
  const { username } = useAuth();
  const { likesCount, hasLiked, toggleLike } = useLikes(tweet.id, username);
  const { respuestas, loadRespuestas, agregarRespuesta, eliminarRespuesta } = useRespuestas(tweet.id);

  const [showRespuestas, setShowRespuestas] = useState(false);
  const [retweeting, setRetweeting] = useState(false);
  const [retweetError, setRetweetError] = useState<string | null>(null);

  const isOwnTweet = username === tweet.autor;

  // Log para debugging del badge de retweet
  console.log('[TweetCard] Evaluando badge:', {
    id: tweet.id,
    autor: tweet.autor,
    esRetweet: tweet.esRetweet,
    retweeteadoPor: tweet.retweeteadoPor,
    condicionBadge: tweet.esRetweet && tweet.retweeteadoPor
  });

  const handleRetweet = async () => {
    if (!username) {
      setRetweetError('Debes iniciar sesión para retwittear');
      return;
    }

    try {
      setRetweeting(true);
      setRetweetError(null);
      await tweetsService.retweet(tweet.id);
      // Refrescar timeline después del retweet
      onRetweeted?.();
    } catch (err: any) {
      console.error('Error al hacer retweet:', err);
      // Manejar error de duplicado o general
      const errorMsg = err.response?.data?.message || 'Error al hacer retweet';
      setRetweetError(errorMsg);
      // Limpiar error después de 3 segundos
      setTimeout(() => setRetweetError(null), 3000);
    } finally {
      setRetweeting(false);
    }
  };

  const handleToggleRespuestas = async () => {
    if (!showRespuestas && respuestas.length === 0) {
      await loadRespuestas();
    }
    setShowRespuestas(!showRespuestas);
  };

  const handleSeguir = async () => {
    // Necesitamos el ID numérico del autor, pero solo tenemos el username
    // Para esto necesitaríamos un endpoint que devuelva el ID desde el username
    // Por ahora lo dejamos comentado
    console.warn('Funcionalidad de seguir requiere ID numérico del usuario');
  };

  return (
    <article className={`${styles.card} ${tweet.eliminado ? styles.deleted : ''}`}>
      {/* Badge de Retweet */}
      {tweet.esRetweet && tweet.retweeteadoPor && (
        <div className={styles.retweetBadge}>
          <span className={styles.retweetIcon}>🔄</span>
          <span className={styles.retweetText}>Retweeted by @{tweet.retweeteadoPor}</span>
        </div>
      )}

      {/* Header */}
      <header className={styles.header}>
        <div className={styles.authorInfo}>
          <span className={styles.author}>@{tweet.autor}</span>
          {showAuthorId && <span className={styles.authorId}>(ID: {tweet.id})</span>}
          <span className={styles.separator}>·</span>
          <time className={styles.date} title={tweet.fechaCreacion}>
            {formatDate(tweet.fechaCreacion)}
          </time>
        </div>

        {/* Botón seguir solo si no es mi tweet */}
        {!isOwnTweet && username && (
          <button
            className={styles.followBtn}
            onClick={handleSeguir}
            disabled
            title="Funcionalidad en desarrollo"
          >
            Seguir
          </button>
        )}
      </header>

      {/* Contenido */}
      <div className={styles.content}>
        <p className={styles.text}>{tweet.contenido}</p>
        {tweet.eliminado && <span className={styles.deletedBadge}>Eliminado</span>}
      </div>

      {/* Acciones */}
      <footer className={styles.actions}>
        {/* Like */}
        <button
          className={`${styles.actionBtn} ${hasLiked ? styles.liked : ''}`}
          onClick={toggleLike}
          disabled={!username}
          aria-label={hasLiked ? 'Quitar like' : 'Dar like'}
        >
          <span className={styles.icon}>{hasLiked ? '❤️' : '🤍'}</span>
          <span className={styles.count}>{likesCount}</span>
        </button>

        {/* Respuestas */}
        <button
          className={styles.actionBtn}
          onClick={handleToggleRespuestas}
          aria-label="Ver respuestas"
        >
          <span className={styles.icon}>💬</span>
          <span className={styles.count}>{respuestas.length}</span>
        </button>

        {/* Retweet */}
        {/* No mostrar botón de retweet en tweets propios */}
        {!isOwnTweet && (
          <button
            className={`${styles.actionBtn} ${retweetError ? styles.error : ''}`}
            onClick={handleRetweet}
            disabled={!username || retweeting}
            aria-label="Retweet"
            title={retweetError || 'Retweet'}
          >
            <span className={styles.icon}>🔄</span>
            {retweeting && <span className={styles.count}>...</span>}
            {retweetError && <span className={styles.errorText}>{retweetError}</span>}
          </button>
        )}
      </footer>

      {/* Sección de respuestas expandible */}
      {showRespuestas && (
        <section className={styles.respuestasSection}>
          {/* Formulario para nueva respuesta */}
          {username && (
            <RespuestaForm
              onSubmit={agregarRespuesta}
              placeholder="Escribe una respuesta..."
            />
          )}

          {/* Lista de respuestas */}
          {respuestas.length > 0 ? (
            <div className={styles.respuestasList}>
              {respuestas.map((respuesta) => (
                <RespuestaItem
                  key={respuesta.id}
                  respuesta={respuesta}
                  canDelete={username === respuesta.autor}
                  onDelete={() => eliminarRespuesta(respuesta.id)}
                />
              ))}
            </div>
          ) : (
            <p className={styles.noRespuestas}>No hay respuestas todavía</p>
          )}
        </section>
      )}
    </article>
  );
};
