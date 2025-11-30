/**
 * Página CreateTweetPage
 * 
 * Responsabilidad: Página para crear un nuevo tweet
 * Orquesta el componente TweetForm con la lógica del hook
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, TweetForm } from '../components';
import { tweetsService } from '../api';
import styles from './CreateTweetPage.module.css';

export const CreateTweetPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (contenido: string) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await tweetsService.publicarTweet({ contenido });
      setSuccess(true);
      
      // Redirigir a la home después de 2 segundos
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'No se pudo publicar el tweet. Intentá nuevamente.';
      setError(errorMessage);
      console.error('Error al publicar tweet:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <Header />
      
      <main className={styles.mainContent}>
        <TweetForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          error={error}
          success={success}
        />
      </main>
    </div>
  );
};
