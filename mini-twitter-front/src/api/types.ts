/**
 * Tipos TypeScript generados desde la especificación OpenAPI
 * Estos tipos aseguran type-safety en toda la aplicación
 */

export interface TweetResponse {
  id: number;
  autor: string;
  contenido: string;
  fechaCreacion: string;
  eliminado: boolean;
  esRetweet: boolean;
  retweeteadoPor: string | null;
}

export interface UsuarioResponse {
  id: number;
  nombreUsuario: string;
  avatarUrl: string | null;
}

export interface TimelineResponse {
  tweets: TweetResponse[];
}

export interface RespuestaTweetResponse {
  id: number;
  autor: string;
  contenido: string;
  fechaCreacion: string;
  eliminado: boolean;
}

export interface LikeResponse {
  id: number;
  autor: string;
  fechaCreacion: string;
}

export interface PublicarTweetRequest {
  contenido: string;
}

export interface ResponderTweetRequest {
  contenido: string;
}

export interface RetweetResponse {
  id: number;
  autorRetweet: string;
  tweetOriginal: TweetResponse;
  fechaRetweet: string;
}

export interface FollowResponse {
  id: number;
  seguidor: string;
  seguido: string;
  fechaCreacion: string;
}
