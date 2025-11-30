/**
 * Componente TweetForm
 * 
 * Responsabilidad: Formulario para crear un nuevo tweet
 * Componente presentacional - lógica de form en hook personalizado
 */

import { useState, useEffect } from 'react';
import styles from './TweetForm.module.css';

interface TweetFormProps {
  onSubmit: (contenido: string) => void;
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

export const TweetForm = ({ onSubmit, isLoading, error, success }: TweetFormProps) => {
  const [contenido, setContenido] = useState('');
  const [charCount, setCharCount] = useState(0);

  // Limpiar formulario solo cuando la publicación fue exitosa
  useEffect(() => {
    if (success) {
      setContenido('');
      setCharCount(0);
    }
  }, [success]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (contenido.trim() && !isLoading) {
      onSubmit(contenido);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setContenido(value);
    setCharCount(value.length);
  };

  const isSubmitDisabled = isLoading || contenido.trim().length === 0 || charCount > 280;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Crear Nuevo Tweet</h2>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="contenido" className={styles.label}>
            Contenido del Tweet *
          </label>
          <textarea
            id="contenido"
            name="contenido"
            className={styles.textarea}
            value={contenido}
            onChange={handleChange}
            required
            maxLength={280}
            rows={4}
            placeholder="¿Qué está pasando?"
            disabled={isLoading}
            aria-required="true"
            aria-describedby="char-count"
          />
          <p id="char-count" className={`${styles.hint} ${charCount > 280 ? styles.hintError : ''}`}>
            {charCount} / 280 caracteres
          </p>
        </div>

        <button
          type="submit"
          className={styles.submitButton}
          disabled={isSubmitDisabled}
          aria-busy={isLoading}
        >
          {isLoading && (
            <span className={styles.spinner} aria-hidden="true"></span>
          )}
          {isLoading ? 'Publicando...' : 'Publicar Tweet'}
        </button>

        {error && (
          <div className={styles.error} role="alert">
            <strong>Error:</strong> {error}
          </div>
        )}

        {success && (
          <div className={styles.success} role="status">
            <strong>¡Éxito!</strong> Tu tweet se publicó correctamente
          </div>
        )}
      </form>
    </div>
  );
};
