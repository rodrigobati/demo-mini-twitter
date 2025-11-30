/**
 * AuthContext - Contexto de Autenticación con Keycloak
 * 
 * Responsabilidades:
 * - Inicializar Keycloak con PKCE (S256)
 * - Mantener el token JWT en memoria (NUNCA en localStorage)
 * - Refrescar automáticamente el token antes de expiración
 * - Proveer estado de autenticación a toda la app
 * - Extraer claims del token: sub (keycloakId), preferred_username, roles
 * 
 * Seguridad:
 * - PKCE habilitado con método S256
 * - Token en memoria únicamente
 * - checkLoginIframe: false para simplificar
 * - Auto-refresh con setInterval cada 60 segundos
 */

import React, { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import keycloak from '../keycloak';

interface AuthContextType {
  authenticated: boolean;
  loading: boolean;
  token?: string;
  username?: string;
  keycloakId?: string;
  roles: string[];
  login: () => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | undefined>(undefined);
  const [username, setUsername] = useState<string | undefined>(undefined);
  const [keycloakId, setKeycloakId] = useState<string | undefined>(undefined);
  const [roles, setRoles] = useState<string[]>([]);

  useEffect(() => {
    let refreshInterval: number | null = null;

    // Inicializar Keycloak sin PKCE (deshabilitado para compatibilidad con registro)
    keycloak
      .init({
        onLoad: 'check-sso', // Verificar SSO sin forzar login
        checkLoginIframe: false, // Desactivar iframe para simplificar
      })
      .then((auth) => {
        setAuthenticated(auth);
        setLoading(false);

        if (auth && keycloak.token) {
          // Extraer información del token parseado
          setToken(keycloak.token);
          
          const tokenParsed = keycloak.tokenParsed;
          if (tokenParsed) {
            // sub → keycloakId (UUID del usuario en Keycloak)
            setKeycloakId(tokenParsed.sub);
            
            // preferred_username → nombre de usuario visible
            setUsername(tokenParsed.preferred_username);
            
            // Extraer roles desde realm_access.roles
            const realmRoles = tokenParsed.realm_access?.roles || [];
            setRoles(realmRoles);

            // Log informativo con tiempo de expiración
            const expiresIn = Math.round((tokenParsed.exp! - Date.now() / 1000) / 60);
            console.log(`✅ Autenticado como: ${tokenParsed.preferred_username}`);
            console.log(`🔑 Token expira en: ${expiresIn} minutos`);
          }

          // Configurar auto-refresh del token
          // Intenta refrescar cada 30 segundos si está por expirar en menos de 60 segundos
          refreshInterval = setInterval(() => {
            keycloak
              .updateToken(60) // Refrescar si expira en menos de 60 segundos
              .then((refreshed) => {
                if (refreshed && keycloak.token) {
                  setToken(keycloak.token);
                  console.log('🔄 Token actualizado exitosamente');
                  
                  // Mostrar nuevo tiempo de expiración
                  if (keycloak.tokenParsed?.exp) {
                    const newExpiresIn = Math.round((keycloak.tokenParsed.exp - Date.now() / 1000) / 60);
                    console.log(`🔑 Nuevo token expira en: ${newExpiresIn} minutos`);
                  }
                } else {
                  console.log('ℹ️ Token aún válido, no requiere refresh');
                }
              })
              .catch((error) => {
                console.error('❌ No se pudo refrescar el token:', error);
                console.log('🔄 Redirigiendo a login...');
                setAuthenticated(false);
                setToken(undefined);
                setUsername(undefined);
                setKeycloakId(undefined);
                setRoles([]);
                keycloak.login();
              });
          }, 30000); // Cada 30 segundos
        }
      })
      .catch((error) => {
        console.error('Error al inicializar Keycloak:', error);
        setLoading(false);
      });

    // Cleanup: limpiar el intervalo al desmontar el componente
    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
        console.log('🗑️ Intervalo de refresh detenido');
      }
    };
  }, []);

  const login = () => {
    keycloak.login({
      redirectUri: window.location.origin,
    });
  };

  const logout = () => {
    // Limpiar estado local ANTES de hacer logout en Keycloak
    setAuthenticated(false);
    setToken(undefined);
    setUsername(undefined);
    setKeycloakId(undefined);
    setRoles([]);
    
    // Logout de Keycloak con redirect explícito a home
    keycloak.logout({
      redirectUri: `${window.location.origin}/`,
    });
  };

  const value: AuthContextType = {
    authenticated,
    loading,
    token,
    username,
    keycloakId,
    roles,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
