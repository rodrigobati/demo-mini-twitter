/**
 * Hook useSocial
 * 
 * Responsabilidad: Gestionar seguidos/seguidores
 * Centraliza lógica de seguimiento
 */

import { useState, useEffect, useCallback } from 'react';
import { usuariosService } from '../api';
import type { UsuarioResponse } from '../api/types';

interface UseSocialReturn {
  seguidos: UsuarioResponse[];
  loading: boolean;
  error: string | null;
  isSiguiendo: (idUsuario: number) => boolean;
  seguir: (idUsuario: number) => Promise<void>;
  dejarDeSeguir: (idUsuario: number) => Promise<void>;
  refetch: () => Promise<void>;
}

export const useSocial = (): UseSocialReturn => {
  const [seguidos, setSeguidos] = useState<UsuarioResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSeguidos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await usuariosService.getSeguidos();
      setSeguidos(data);
    } catch (err) {
      console.error('Error al cargar seguidos:', err);
      setError('No se pudieron cargar los seguidos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSeguidos();
  }, [fetchSeguidos]);

  const isSiguiendo = (idUsuario: number): boolean => {
    return seguidos.some((usuario) => usuario.id === idUsuario);
  };

  const seguir = async (idUsuario: number) => {
    try {
      await usuariosService.seguir(idUsuario);
      // Refetch para actualizar lista
      await fetchSeguidos();
    } catch (err) {
      console.error('Error al seguir usuario:', err);
      throw err;
    }
  };

  const dejarDeSeguir = async (idUsuario: number) => {
    try {
      await usuariosService.dejarDeSeguir(idUsuario);
      // Optimistic update
      setSeguidos((prev) => prev.filter((u) => u.id !== idUsuario));
    } catch (err) {
      console.error('Error al dejar de seguir:', err);
      // Rollback: refetch
      await fetchSeguidos();
      throw err;
    }
  };

  return {
    seguidos,
    loading,
    error,
    isSiguiendo,
    seguir,
    dejarDeSeguir,
    refetch: fetchSeguidos,
  };
};
