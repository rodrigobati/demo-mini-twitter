/**
 * Componente RespuestaForm
 * 
 * Responsabilidad: Formulario para publicar respuestas a un tweet
 * Componente presentacional reutilizable
 */

import { useState } from 'react';
import type { FormEvent } from 'react';
import type { ResponderTweetRequest } from '../../api/types';
import styles from './TweetCard.module.css';

interface RespuestaFormProps {
  onSubmit: (request: ResponderTweetRequest) => Promise<void>;
  placeholder?: string;
}

export const RespuestaForm: React.FC<RespuestaFormProps> = ({
  onSubmit,
  placeholder = 'Escribe una respuesta...',
}) => {
  const [contenido, setContenido] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!contenido.trim() || submitting) return;

    try {
      setSubmitting(true);
      await onSubmit({ contenido: contenido.trim() });
      setContenido(''); // Limpiar después de enviar
    } catch (err) {
      console.error('Error al enviar respuesta:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.respuestaForm}>
      <textarea
        value={contenido}
        onChange={(e) => setContenido(e.target.value)}
        placeholder={placeholder}
        maxLength={280}
        rows={2}
        className={styles.respuestaInput}
        disabled={submitting}
      />
      <div className={styles.respuestaFormActions}>
        <span className={styles.charCount}>{contenido.length}/280</span>
        <button
          type="submit"
          disabled={!contenido.trim() || submitting}
          className={styles.respuestaSubmit}
        >
          {submitting ? 'Enviando...' : 'Responder'}
        </button>
      </div>
    </form>
  );
};
