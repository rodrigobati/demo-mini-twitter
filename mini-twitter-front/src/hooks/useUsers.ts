/**
 * Hook useUsers
 * 
 * Responsabilidad: Gestionar la lógica de negocio para usuarios
 * - Carga de usuarios desde API
 * - Estados de loading y error
 * - Recarga automática cuando el usuario se autentica
 */

import { useState, useEffect } from 'react';
import { useAuth } from '../auth';
import { usuariosService } from '../api';
import type { UsuarioResponse } from '../api';

export const useUsers = () => {
  const [users, setUsers] = useState<UsuarioResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { authenticated } = useAuth();

  const loadUsers = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const usuariosData = await usuariosService.listarUsuarios();
      setUsers(usuariosData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar usuarios';
      setError(errorMessage);
      console.error('Error cargando usuarios:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Solo cargar si está autenticado
    if (authenticated) {
      loadUsers();
    }
  }, [authenticated]);

  return {
    users,
    isLoading,
    error,
    loadUsers,
  };
};
