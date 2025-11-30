/**
 * Configuración del Router con rutas protegidas
 * 
 * Responsabilidad: Definir las rutas de la aplicación
 * Usa React Router v6
 * 
 * Rutas protegidas:
 * - /create-tweet: Requiere autenticación mediante ProtectedRoute
 */

import { createBrowserRouter } from 'react-router-dom';
import { ProtectedRoute } from '../auth';
import { 
  HomePage, 
  CreateTweetPage, 
  TimelinePage, 
  SeguidosPage, 
  SeguidoresPage 
} from '../pages';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/timeline',
    element: (
      <ProtectedRoute>
        <TimelinePage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/create-tweet',
    element: (
      <ProtectedRoute>
        <CreateTweetPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/seguidos',
    element: (
      <ProtectedRoute>
        <SeguidosPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/seguidores/:idUsuario',
    element: (
      <ProtectedRoute>
        <SeguidoresPage />
      </ProtectedRoute>
    ),
  },
]);
