/**
 * Servicio de Usuarios
 * 
 * Responsabilidad: Encapsular todas las operaciones HTTP relacionadas con usuarios y social
 * No contiene lógica de UI, solo llamadas HTTP tipadas
 */

import api from './api';
import type { UsuarioResponse } from './types';

export const usuariosService = {
  /**
   * Obtiene la lista de TODOS los usuarios del sistema
   * No requiere parámetros - el backend identifica al usuario actual por JWT
   */
  listarUsuarios: async (): Promise<UsuarioResponse[]> => {
    const response = await api.get<UsuarioResponse[]>('/usuarios');
    return response.data;
  },

  /**
   * Obtiene la lista de usuarios seguidos por el usuario actual
   */
  getSeguidos: async (): Promise<UsuarioResponse[]> => {
    const response = await api.get<UsuarioResponse[]>('/social/seguidos');
    return response.data;
  },

  /**
   * Obtiene los seguidores de un usuario específico
   */
  getSeguidores: async (idUsuario: number): Promise<UsuarioResponse[]> => {
    const response = await api.get<UsuarioResponse[]>(
      `/social/usuarios/${idUsuario}/seguidores`
    );
    return response.data;
  },

  /**
   * Seguir a un usuario
   */
  seguir: async (idSeguido: number): Promise<void> => {
    await api.post(`/social/usuarios/${idSeguido}/seguir`);
  },

  /**
   * Dejar de seguir a un usuario
   */
  dejarDeSeguir: async (idSeguido: number): Promise<void> => {
    await api.delete(`/social/usuarios/${idSeguido}/seguir`);
  },
};
