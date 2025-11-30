/**
 * Keycloak Singleton Instance
 * 
 * Instancia única de Keycloak que se comparte en toda la aplicación.
 * 
 * Configuración:
 * - URL: http://localhost:9090 (servidor Keycloak)
 * - Realm: minitwitter
 * - Client ID: web (client público con PKCE habilitado)
 * 
 * IMPORTANTE: 
 * Esta instancia NO debe exportarse directamente a los componentes.
 * Debe consumirse únicamente a través del AuthContext/useAuth().
 */

import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'http://localhost:9090',
  realm: 'minitwitter',
  clientId: 'web',
});

export default keycloak;
