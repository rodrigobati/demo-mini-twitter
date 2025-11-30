/**
 * ProtectedRoute Component
 * 
 * Componente para proteger rutas que requieren autenticación.
 * 
 * Comportamiento:
 * - Si loading: muestra "Cargando..."
 * - Si authenticated: renderiza el contenido protegido
 * - Si NO authenticated: redirige al login de Keycloak
 * 
 * Uso:
 * <Route element={<ProtectedRoute><CreateTweetPage /></ProtectedRoute>} path="/create-tweet" />
 * 
 * Este componente NO guarda rutas ni maneja redirects complejos,
 * simplemente invoca login() de Keycloak cuando el usuario no está autenticado.
 */

import React, { useEffect } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from './useAuth';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { authenticated, loading, login } = useAuth();

  useEffect(() => {
    // Si no está cargando y no está autenticado, redirigir a login
    if (!loading && !authenticated) {
      login();
    }
  }, [loading, authenticated, login]);

  // Mostrar loading mientras se verifica autenticación
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <p>Cargando...</p>
      </div>
    );
  }

  // Si está autenticado, renderizar el contenido protegido
  if (authenticated) {
    return <>{children}</>;
  }

  // Si no está autenticado, no renderizar nada (el useEffect ya redirigió)
  return null;
};
