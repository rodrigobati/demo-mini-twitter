/**
 * Hook useLikes
 * 
 * Responsabilidad: Gestionar likes de un tweet específico
 * Maneja estado local de likes + conteo
 */

import { useState, useEffect, useCallback } from 'react';
import { tweetsService } from '../api';
import type { LikeResponse } from '../api/types';

interface UseLikesReturn {
  likes: LikeResponse[];
  likesCount: number;
  hasLiked: boolean;
  loading: boolean;
  toggleLike: () => Promise<void>;
}

export const useLikes = (tweetId: number, currentUsername?: string): UseLikesReturn => {
  const [likes, setLikes] = useState<LikeResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchLikes = useCallback(async () => {
    try {
      const likesData = await tweetsService.getLikes(tweetId);
      setLikes(likesData);
    } catch (err) {
      console.error('Error al cargar likes:', err);
    }
  }, [tweetId]);

  useEffect(() => {
    fetchLikes();
  }, [fetchLikes]);

  const hasLiked = currentUsername
    ? likes.some((like) => like.autor === currentUsername)
    : false;

  const toggleLike = async () => {
    if (!currentUsername || loading) return;

    try {
      setLoading(true);
      
      if (hasLiked) {
        await tweetsService.quitarLike(tweetId);
        // Optimistic update
        setLikes((prev) => prev.filter((like) => like.autor !== currentUsername));
      } else {
        await tweetsService.darLike(tweetId);
        // Refetch para obtener el like con ID correcto
        await fetchLikes();
      }
    } catch (err) {
      console.error('Error al gestionar like:', err);
      // Rollback: refetch
      await fetchLikes();
    } finally {
      setLoading(false);
    }
  };

  return {
    likes,
    likesCount: likes.length,
    hasLiked,
    loading,
    toggleLike,
  };
};
