/**
 * Hook useRespuestas
 * 
 * Responsabilidad: Gestionar respuestas de un tweet
 * Maneja carga, creación y eliminación de respuestas
 */

import { useState, useCallback } from 'react';
import { tweetsService } from '../api';
import type { RespuestaTweetResponse, ResponderTweetRequest } from '../api/types';

interface UseRespuestasReturn {
  respuestas: RespuestaTweetResponse[];
  loading: boolean;
  error: string | null;
  loadRespuestas: () => Promise<void>;
  agregarRespuesta: (request: ResponderTweetRequest) => Promise<void>;
  eliminarRespuesta: (idRespuesta: number) => Promise<void>;
}

export const useRespuestas = (tweetId: number): UseRespuestasReturn => {
  const [respuestas, setRespuestas] = useState<RespuestaTweetResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRespuestas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await tweetsService.getRespuestas(tweetId);
      setRespuestas(data);
    } catch (err) {
      console.error('Error al cargar respuestas:', err);
      setError('No se pudieron cargar las respuestas');
    } finally {
      setLoading(false);
    }
  }, [tweetId]);

  const agregarRespuesta = async (request: ResponderTweetRequest) => {
    try {
      setLoading(true);
      setError(null);
      const nuevaRespuesta = await tweetsService.responder(tweetId, request);
      setRespuestas((prev) => [...prev, nuevaRespuesta]);
    } catch (err) {
      console.error('Error al agregar respuesta:', err);
      setError('No se pudo publicar la respuesta');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const eliminarRespuesta = async (idRespuesta: number) => {
    try {
      setLoading(true);
      setError(null);
      await tweetsService.eliminarRespuesta(tweetId, idRespuesta);
      setRespuestas((prev) => prev.filter((r) => r.id !== idRespuesta));
    } catch (err) {
      console.error('Error al eliminar respuesta:', err);
      setError('No se pudo eliminar la respuesta');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    respuestas,
    loading,
    error,
    loadRespuestas,
    agregarRespuesta,
    eliminarRespuesta,
  };
};
