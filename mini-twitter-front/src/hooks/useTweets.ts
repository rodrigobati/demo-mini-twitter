/**
 * Hook useTweets
 * 
 * Responsabilidad: Gestionar la lógica de negocio para tweets
 * - Carga de datos desde API
 * - Estados de loading y error
 * - Operaciones CRUD sobre tweets
 */

import { useState, useEffect } from 'react';
import { tweetsService } from '../api';
import type { TweetResponse } from '../api';

interface UseTweetsOptions {
  limite?: number;
  autoLoad?: boolean;
}

export const useTweets = (options: UseTweetsOptions = {}) => {
  const { limite = 50, autoLoad = true } = options;
  
  const [tweets, setTweets] = useState<TweetResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTweets = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await tweetsService.getTimeline(limite);
      setTweets(response.tweets);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar tweets';
      setError(errorMessage);
      console.error('Error cargando tweets:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const publicarTweet = async (contenido: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const nuevoTweet = await tweetsService.publicarTweet({ contenido });
      setTweets((prev: TweetResponse[]) => [nuevoTweet, ...prev]);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al publicar tweet';
      setError(errorMessage);
      console.error('Error publicando tweet:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (autoLoad) {
      loadTweets();
    }
  }, [limite, autoLoad]);

  return {
    tweets,
    isLoading,
    error,
    loadTweets,
    publicarTweet,
  };
};
