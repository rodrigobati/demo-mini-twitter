/**
 * useAuth Hook
 * 
 * Hook personalizado para consumir el AuthContext de forma segura.
 * 
 * Uso:
 * const { authenticated, username, login, logout, roles } = useAuth();
 * 
 * Seguridad:
 * - Lanza excepción si se usa fuera del AuthProvider
 * - Garantiza que siempre hay un contexto válido
 * 
 * Este hook encapsula el acceso al token y usuario autenticado,
 * evitando que los componentes accedan directamente a la instancia de Keycloak.
 */

import { useContext } from 'react';
import { AuthContext } from './AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth debe ser usado dentro de un AuthProvider. ' +
      'Asegúrate de envolver tu aplicación con <AuthProvider>.'
    );
  }

  return context;
};
