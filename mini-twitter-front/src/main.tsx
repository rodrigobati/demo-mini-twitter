/**
 * Punto de entrada de la aplicación
 * 
 * Ahora envuelve toda la aplicación con AuthProvider
 * para proporcionar el contexto de autenticación con Keycloak
 * a todos los componentes.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './auth';
import { router } from './router';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
