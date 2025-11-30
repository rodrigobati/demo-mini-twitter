# MiniTwitter Frontend

Aplicación frontend desarrollada con **React + TypeScript + Vite** siguiendo arquitectura profesional y buenas prácticas de desarrollo.

## 🏗️ Arquitectura

La aplicación sigue una arquitectura **basada en dominios** con separación clara de responsabilidades:

```
src/
├── api/              # Capa de servicios HTTP
│   ├── api.ts        # Cliente Axios configurado
│   ├── types.ts      # Tipos TypeScript del OpenAPI
│   ├── tweetsService.ts
│   └── usuariosService.ts
├── components/       # Componentes presentacionales puros
│   ├── Header.tsx
│   ├── TweetCard.tsx
│   ├── TweetList.tsx
│   ├── UserList.tsx
│   └── TweetForm.tsx
├── hooks/           # Hooks personalizados con lógica de negocio
│   ├── useTweets.ts
│   ├── useUsers.ts
│   └── usePagination.ts
├── pages/           # Páginas que orquestan componentes
│   ├── HomePage.tsx
│   └── CreateTweetPage.tsx
├── router/          # Configuración de React Router
└── styles/          # Estilos globales
```

## 📋 Características Implementadas

### ✅ Home Page

- **Header** con nombre del sistema y navegación
- **Panel Principal**: Lista de tweets paginados (10 por página)
- **Panel Lateral**: Lista de usuarios del sistema
- Navegación de paginación con botones deshabilitados al final
- Cada tweet muestra: autor, contenido y fecha
- Filtrado de tweets por usuario al hacer click

### ✅ Crear Tweet

- Formulario con validación
- Campo para User ID (sin autenticación)
- Campo para contenido del tweet (máx. 280 caracteres)
- Indicadores de éxito/error
- Redirección automática a home después de crear

### ✅ Principios Aplicados

#### 🎯 Separación de Responsabilidades

- **Componentes**: Solo UI, sin lógica de negocio
- **Hooks**: Toda la lógica de negocio
- **Servicios**: Solo llamadas HTTP tipadas
- **Páginas**: Orquestación de componentes

#### 📦 Exports Controlados

Cada carpeta tiene su `index.ts` que controla qué se exporta:

```ts
// src/api/index.ts
export { tweetsService } from "./tweetsService";
export type * from "./types";
```

#### 🎨 CSS Modules

Estilos modulares por componente:

- Sin colisión de nombres
- Scoped por defecto
- Sin CSS global desordenado

#### ♿ Accesibilidad

- Roles ARIA donde corresponde
- Labels en todos los inputs
- Navegación por teclado
- Foco visible

## 🚀 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor en http://localhost:5173

# Build
npm run build        # Genera build de producción

# Preview
npm run preview      # Preview del build de producción
```

## 🔧 Configuración

### Backend API

La URL del backend se configura en `src/api/api.ts`:

```ts
const api = axios.create({
  baseURL: "http://localhost:8080/api",
});
```

### Puertos

- **Frontend**: `http://localhost:5173`
- **Backend**: `http://localhost:8080`

## 📝 Flujo de Datos

```
Usuario → Página → Hook (lógica) → Servicio (HTTP) → API Backend
                     ↓
                Componente (UI pura)
```

### Ejemplo: Cargar Tweets

1. **HomePage** usa el hook `useTweets()`
2. **useTweets()** llama a `tweetsService.getTimeline()`
3. **tweetsService** hace la petición HTTP con Axios
4. Los datos fluyen de vuelta al hook
5. El hook actualiza su estado
6. **HomePage** recibe los tweets y los pasa a **TweetList**
7. **TweetList** (componente puro) solo renderiza

## 🎨 Convenciones de Código

### Nombres

- Componentes: `PascalCase` (ej: `TweetCard`)
- Hooks: `camelCase` con prefijo `use` (ej: `useTweets`)
- Servicios: `camelCase` (ej: `tweetsService`)
- Tipos: `PascalCase` (ej: `TweetResponse`)

### Imports

Usar imports de tipo cuando sea necesario:

```ts
import type { TweetResponse } from "../api";
```

## 🧪 Testing (Futuro)

La arquitectura está preparada para testing:

- Hooks se pueden testear aisladamente
- Componentes puros son fáciles de testear
- Servicios pueden mockearse

## 📚 Dependencias Principales

- **React 18**: UI library
- **TypeScript**: Type safety
- **Vite**: Build tool y dev server
- **React Router v6**: Routing
- **Axios**: HTTP client

## 🏆 Buenas Prácticas Aplicadas

1. ✅ **Separación de responsabilidades**: Componentes vs Hooks vs Servicios
2. ✅ **Type Safety**: Todo tipado con TypeScript
3. ✅ **CSS Modules**: Estilos modulares y scoped
4. ✅ **Exports controlados**: index.ts en cada carpeta
5. ✅ **Accesibilidad**: ARIA, labels, navegación por teclado
6. ✅ **Estructura escalable**: Fácil agregar features
7. ✅ **Performance**: React.memo donde corresponde
8. ✅ **Mantenibilidad**: Código limpio y documentado

## 🔄 Próximos Pasos

- [ ] Agregar autenticación con Keycloak
- [ ] Implementar loading skeletons
- [ ] Agregar tests unitarios e integración
- [ ] Implementar infinite scroll
- [ ] Agregar manejo de errores global
- [ ] Optimizar renders con React.memo
