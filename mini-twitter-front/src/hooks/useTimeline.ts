/**
 * Hook useTimeline
 * 
 * Responsabilidad: Gestionar el estado del timeline de tweets
 * Separa lógica de negocio de componentes presentacionales
 */

import { useState, useEffect } from 'react';
import { tweetsService } from '../api';
import type { TweetResponse } from '../api/types';

interface UseTimelineReturn {
  tweets: TweetResponse[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useTimeline = (limite: number = 100): UseTimelineReturn => {
  const [tweets, setTweets] = useState<TweetResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTimeline = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await tweetsService.getTimeline(limite);
      setTweets(response.tweets);
    } catch (err) {
      console.error('Error al cargar timeline:', err);
      setError('No se pudo cargar el timeline');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimeline();
  }, [limite]);

  return {
    tweets,
    loading,
    error,
    refetch: fetchTimeline,
  };
};
