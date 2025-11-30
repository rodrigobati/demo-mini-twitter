/**
 * Cliente HTTP centralizado usando Axios con integración Keycloak
 * 
 * Responsabilidades:
 * - Configuración base de Axios con URL del backend
 * - Inyección automática del token JWT en header Authorization
 * - Manejo centralizado de errores HTTP
 * 
 * Seguridad:
 * - El token se obtiene desde la instancia de Keycloak (memoria)
 * - NUNCA se guarda en localStorage ni sessionStorage
 * - Se envía como Bearer token en cada request
 * 
 * Nota: Este módulo accede directamente a keycloak para obtener el token.
 * No se usa useAuth() aquí porque este módulo no es un componente React.
 */

import axios from 'axios';
import keycloak from '../keycloak';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor para requests - inyectar token JWT
api.interceptors.request.use(
  (config) => {
    console.log('═══════════════════════════════════════');
    console.log('📤 INTERCEPTOR REQUEST');
    console.log('URL:', config.url);
    console.log('Method:', config.method?.toUpperCase());
    console.log('BaseURL:', config.baseURL);
    console.log('Full URL:', `${config.baseURL}${config.url}`);
    
    // Verificar estado de Keycloak
    console.log('🔐 Estado de Keycloak:');
    console.log('  - authenticated:', keycloak.authenticated);
    console.log('  - token existe:', !!keycloak.token);
    console.log('  - idToken existe:', !!keycloak.idToken);
    console.log('  - refreshToken existe:', !!keycloak.refreshToken);
    
    // Obtener el token desde Keycloak (en memoria)
    const token = keycloak.token;
    
    if (token) {
      // Inyectar header Authorization: Bearer <token>
      config.headers.Authorization = `Bearer ${token}`;
      
      console.log('✅ Token agregado al header:');
      console.log('  Token (primeros 50 chars):', token.substring(0, 50) + '...');
      
      // Mostrar claims del token
      if (keycloak.tokenParsed) {
        console.log('📋 Claims del token:');
        console.log('  - sub:', keycloak.tokenParsed.sub);
        console.log('  - preferred_username:', keycloak.tokenParsed.preferred_username);
        console.log('  - aud:', keycloak.tokenParsed.aud);
        console.log('  - azp:', keycloak.tokenParsed.azp);
        console.log('  - iss:', keycloak.tokenParsed.iss);
        console.log('  - exp:', new Date(keycloak.tokenParsed.exp! * 1000).toLocaleString());
        
        const expiresInSeconds = keycloak.tokenParsed.exp! - Math.floor(Date.now() / 1000);
        console.log(`  - Expira en: ${expiresInSeconds} segundos (${Math.floor(expiresInSeconds / 60)} minutos)`);
        
        if (expiresInSeconds < 0) {
          console.error('⚠️ ¡ADVERTENCIA! El token YA EXPIRÓ');
        }
      }
    } else {
      console.error('❌ NO HAY TOKEN DISPONIBLE');
      console.error('   Usuario debe hacer login');
    }
    
    console.log('📋 Headers finales:', config.headers);
    console.log('═══════════════════════════════════════');
    
    return config;
  },
  (error) => {
    console.error('❌ Error en request interceptor:', error);
    return Promise.reject(error);
  }
);

// Interceptor para respuestas - manejo centralizado de errores
api.interceptors.response.use(
  (response) => {
    console.log('✅ Response exitoso:', response.status, response.config.url);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    console.log('═══════════════════════════════════════');
    console.log('❌ INTERCEPTOR RESPONSE - ERROR');
    console.log('Status:', error.response?.status);
    console.log('URL:', originalRequest?.url);
    console.log('Method:', originalRequest?.method);
    
    // Evitar loop infinito de retries
    if (originalRequest._retry) {
      console.error('⚠️ Ya se intentó un retry, evitando loop infinito');
      console.error('❌ Rechazando petición sin redirigir');
      console.log('═══════════════════════════════════════');
      return Promise.reject(error);
    }
    
    // Si el backend responde 401 Unauthorized, el token es inválido o expiró
    if (error.response?.status === 401) {
      console.error('❌ 401 Unauthorized recibido');
      console.log('🔑 Intentando refrescar el token...');
      
      // Marcar que ya se intentó un retry
      originalRequest._retry = true;
      
      try {
        const refreshed = await keycloak.updateToken(5);
        
        if (refreshed && keycloak.token) {
          console.log('✅ Token refrescado exitosamente');
          console.log('🆕 Nuevo token (primeros 50 chars):', keycloak.token.substring(0, 50) + '...');
          
          // Actualizar el header con el nuevo token
          originalRequest.headers.Authorization = `Bearer ${keycloak.token}`;
          
          console.log('🔄 Reintentando petición original...');
          console.log('═══════════════════════════════════════');
          
          // Reintentar la petición original
          return api.request(originalRequest);
        } else {
          console.warn('⚠️ updateToken no refrescó (token aún válido o ya actualizado)');
          console.warn('   Pero aún recibimos 401, posible problema de configuración backend');
          console.log('═══════════════════════════════════════');
          return Promise.reject(error);
        }
      } catch (refreshError) {
        console.error('❌ Error al refrescar token:', refreshError);
        console.log('═══════════════════════════════════════');
        return Promise.reject(error);
      }
    }
    
    console.error('❌ Error en la petición HTTP:', error.message);
    console.log('═══════════════════════════════════════');
    return Promise.reject(error);
  }
);

export default api;
