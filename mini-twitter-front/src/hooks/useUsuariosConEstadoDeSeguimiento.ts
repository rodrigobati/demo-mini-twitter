/**
 * Hook: useUsuariosConEstadoDeSeguimiento
 * 
 * Responsabilidad:
 * - Cargar todos los usuarios del sistema
 * - Cargar los usuarios seguidos por el usuario actual
 * - Combinar ambos conjuntos para saber qué usuarios están siendo seguidos
 * - Proveer funciones para seguir/dejar de seguir con actualización optimista
 * 
 * Este hook centraliza la lógica de negocio del panel de usuarios,
 * manteniendo los componentes presentacionales simples.
 */

import { useState, useEffect } from 'react';
import { usuariosService } from '../api';
import type { UsuarioResponse } from '../api/types';

interface UsuarioConEstado extends UsuarioResponse {
  isSiguiendo: boolean;
  isCurrentUser: boolean;
}

export const useUsuariosConEstadoDeSeguimiento = (currentUsername?: string) => {
  const [usuarios, setUsuarios] = useState<UsuarioConEstado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar usuarios y estado de seguimiento
  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      setError(null);

      // Llamadas en paralelo para optimizar performance
      const [todosLosUsuarios, seguidos] = await Promise.all([
        usuariosService.listarUsuarios(),
        usuariosService.getSeguidos(),
      ]);

      // Crear Set de IDs seguidos para búsqueda O(1)
      const idsSeguidosSet = new Set(seguidos.map(u => u.id));

      // Combinar información: marcar cuáles están siendo seguidos
      const usuariosConEstado: UsuarioConEstado[] = todosLosUsuarios.map(usuario => ({
        ...usuario,
        isSiguiendo: idsSeguidosSet.has(usuario.id),
        isCurrentUser: currentUsername ? usuario.nombreUsuario === currentUsername : false,
      }));

      setUsuarios(usuariosConEstado);
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
      setError('No se pudieron cargar los usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, [currentUsername]);

  // Seguir a un usuario (con actualización optimista)
  const seguir = async (idUsuario: number) => {
    // Actualización optimista
    setUsuarios(prev =>
      prev.map(u =>
        u.id === idUsuario ? { ...u, isSiguiendo: true } : u
      )
    );

    try {
      await usuariosService.seguir(idUsuario);
    } catch (err) {
      console.error('Error al seguir usuario:', err);
      // Revertir en caso de error
      setUsuarios(prev =>
        prev.map(u =>
          u.id === idUsuario ? { ...u, isSiguiendo: false } : u
        )
      );
      throw err;
    }
  };

  // Dejar de seguir a un usuario (con actualización optimista)
  const dejarDeSeguir = async (idUsuario: number) => {
    // Actualización optimista
    setUsuarios(prev =>
      prev.map(u =>
        u.id === idUsuario ? { ...u, isSiguiendo: false } : u
      )
    );

    try {
      await usuariosService.dejarDeSeguir(idUsuario);
    } catch (err) {
      console.error('Error al dejar de seguir usuario:', err);
      // Revertir en caso de error
      setUsuarios(prev =>
        prev.map(u =>
          u.id === idUsuario ? { ...u, isSiguiendo: true } : u
        )
      );
      throw err;
    }
  };

  return {
    usuarios,
    loading,
    error,
    seguir,
    dejarDeSeguir,
    refetch: fetchUsuarios,
  };
};
