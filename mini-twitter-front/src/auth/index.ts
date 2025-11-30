/**
 * Auth Module - Barrel Exports
 * 
 * Exportaciones controladas del módulo de autenticación.
 * Facilita imports limpios desde otros módulos.
 * 
 * Uso:
 * import { AuthProvider, useAuth, ProtectedRoute } from '@/auth';
 */

export { AuthProvider, AuthContext } from './AuthContext';
export { useAuth } from './useAuth';
export { ProtectedRoute } from './ProtectedRoute';
