# MiniTwitter

Sistema de micro-blogging estilo Twitter con autenticación mediante Keycloak. Permite a los usuarios publicar tweets, hacer retweets, seguir a otros usuarios y visualizar timelines personalizados. Construido con Spring Boot en el backend, React en el frontend, y PostgreSQL como base de datos.

## 🚀 Cómo ejecutar el sistema

1. **Clonar el repositorio:**

   ```bash
   git clone <url-del-repo>
   cd Proyecto\ TP\ individual
   ```

2. **Levantar todos los servicios:**

   ```bash
   docker compose up --build
   ```

3. **Acceder a las aplicaciones:**
   - **Frontend:** http://localhost:3000
   - **Backend API:** http://localhost:8080
   - **Keycloak:** http://localhost:9090

El sistema carga automáticamente datos de prueba (usuarios, tweets, relaciones de seguimiento) al iniciar.

## 📋 Descripción general del proyecto

MiniTwitter es un sistema de micro-blogging que replica funcionalidades básicas de Twitter. Implementa autenticación y autorización con **Keycloak**, un backend en **Java Spring Boot** con arquitectura DDD, un frontend en **React + TypeScript + Vite**, y persistencia en **H2** (desarrollo) con capacidad para PostgreSQL en producción. El sistema soporta publicación de tweets, retweets, respuestas, likes, y gestión de relaciones de seguimiento entre usuarios.

## 🏗️ Arquitectura del proyecto

```
├── tpindividual/              # Backend Java Spring Boot
│   ├── src/main/java/unrn/   # Lógica de dominio, API REST, persistencia
│   └── pom.xml                # Dependencias Maven
│
├── mini-twitter-front/        # Frontend React + TypeScript
│   ├── src/
│   │   ├── pages/             # Páginas (Home, Timeline, CreateTweet)
│   │   ├── components/        # Componentes reutilizables
│   │   ├── api/               # Servicios HTTP (Axios)
│   │   └── auth/              # Contexto de autenticación Keycloak
│   └── package.json
│
├── keycloak/                  # Configuración de autenticación
│   └── realm-export.json      # Realm con usuarios precargados
│
└── docker-compose.yml         # Orquestación de servicios
```

## 🔌 Endpoints disponibles

### Usuarios

- `GET /api/usuarios` - Listar todos los usuarios
- `GET /api/usuarios/{id}` - Obtener usuario por ID
- `GET /api/usuarios/{id}/tweets?limite=50` - Tweets de un usuario específico

### Tweets

- `POST /api/tweets` - Publicar un nuevo tweet
- `GET /api/tweets` - Obtener todos los tweets del sistema
- `GET /api/tweets/timeline?limite=50` - Timeline personalizado del usuario autenticado
- `DELETE /api/tweets/{id}` - Eliminar un tweet propio
- `POST /api/tweets/{id}/retweets` - Hacer retweet
- `POST /api/tweets/{id}/respuestas` - Responder a un tweet
- `GET /api/tweets/{id}/respuestas` - Ver respuestas de un tweet
- `POST /api/tweets/{id}/likes` - Dar like a un tweet
- `DELETE /api/tweets/{id}/likes` - Quitar like
- `GET /api/tweets/{id}/likes` - Ver likes de un tweet

### Social / Seguimientos

- `POST /api/social/seguir/{idUsuario}` - Seguir a un usuario
- `POST /api/social/dejar-de-seguir/{idUsuario}` - Dejar de seguir
- `GET /api/social/seguidos` - Listar usuarios que sigo
- `GET /api/social/seguidores` - Listar mis seguidores

## 🔐 Inicio de sesión

El sistema incluye **usuarios precargados** en el realm de Keycloak:

- **carlos.gomez** / carlos.gomez
- **maria.fernandez** / maria.fernandez
- **juan.perez** / juan.perez
- **ana.rodriguez** / ana.rodriguez
- **luis.sanchez** / luis.sanchez
- **usuariocliente** / usuariocliente

Para iniciar sesión:

1. Acceder a http://localhost:3000
2. Hacer clic en "Login"
3. Usar cualquiera de los usuarios listados (usuario = contraseña)

El servidor de autenticación Keycloak está disponible en http://localhost:9090 (admin/admin).

## 📦 Datos de prueba

El sistema carga automáticamente:

- **6 usuarios** con cuentas en Keycloak
- **17 tweets** distribuidos entre los usuarios
- **6 retweets** cruzados entre usuarios
- **12 relaciones de seguimiento** formando un grafo social

Estos datos se recrean cada vez que se ejecuta `docker compose up --build` desde cero.

## 🛠️ Tecnologías utilizadas

**Backend:**

- Java 23 + Spring Boot 3.3.5
- Spring Security + OAuth2 Resource Server
- JPA + Hibernate
- H2 Database (desarrollo)

**Frontend:**

- React 19 + TypeScript
- Vite
- Keycloak JS Adapter
- Axios

**Autenticación:**

- Keycloak 25.0.2

**Orquestación:**

- Docker + Docker Compose
