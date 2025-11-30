/**
 * Servicio de Tweets
 * 
 * Responsabilidad: Encapsular todas las operaciones HTTP relacionadas con tweets
 * No contiene lógica de UI, solo llamadas HTTP tipadas
 */

import api from './api';
import type { 
  TimelineResponse, 
  TweetResponse, 
  PublicarTweetRequest,
  LikeResponse,
  RespuestaTweetResponse,
  ResponderTweetRequest,
} from './types';

export const tweetsService = {
  /**
   * Obtiene el timeline personalizado del usuario autenticado
   * (tweets de personas que sigue + retweets)
   */
  getTimeline: async (limite: number = 50): Promise<TimelineResponse> => {
    const response = await api.get<TimelineResponse>('/tweets/timeline', {
      params: { limite },
    });
    return response.data;
  },

  /**
   * Obtiene TODOS los tweets del sistema (sin filtrar por seguimiento)
   * Solo devuelve tweets originales, sin retweets
   * Usado para la vista "Ver todos" en Home Page
   */
  getTodosTweets: async (limite: number = 100): Promise<TimelineResponse> => {
    const response = await api.get<TimelineResponse>('/tweets', {
      params: { limite },
    });
    return response.data;
  },

  /**
   * Obtiene todos los tweets y retweets de un usuario específico
   */
  getTweetsDeUsuario: async (idUsuario: number, limite: number = 50): Promise<TimelineResponse> => {
    const response = await api.get<TimelineResponse>(`/usuarios/${idUsuario}/tweets`, {
      params: { limite },
    });
    return response.data;
  },

  /**
   * Publica un nuevo tweet
   */
  publicarTweet: async (request: PublicarTweetRequest): Promise<TweetResponse> => {
    const response = await api.post<TweetResponse>('/tweets', request);
    return response.data;
  },

  /**
   * Elimina un tweet por ID
   */
  eliminarTweet: async (idTweet: number): Promise<void> => {
    await api.delete(`/tweets/${idTweet}`);
  },

  /**
   * Da like a un tweet
   */
  darLike: async (idTweet: number): Promise<void> => {
    await api.post(`/tweets/${idTweet}/likes`);
  },

  /**
   * Quita like de un tweet
   */
  quitarLike: async (idTweet: number): Promise<void> => {
    await api.delete(`/tweets/${idTweet}/likes`);
  },

  /**
   * Obtiene los likes de un tweet
   */
  getLikes: async (idTweet: number): Promise<LikeResponse[]> => {
    const response = await api.get<LikeResponse[]>(`/tweets/${idTweet}/likes`);
    return response.data;
  },

  /**
   * Hace retweet de un tweet
   */
  retweet: async (idTweet: number): Promise<void> => {
    await api.post(`/tweets/${idTweet}/retweets`);
  },

  /**
   * Publica una respuesta a un tweet
   */
  responder: async (idTweet: number, request: ResponderTweetRequest): Promise<RespuestaTweetResponse> => {
    const response = await api.post<RespuestaTweetResponse>(`/tweets/${idTweet}/respuestas`, request);
    return response.data;
  },

  /**
   * Obtiene las respuestas de un tweet
   */
  getRespuestas: async (idTweet: number): Promise<RespuestaTweetResponse[]> => {
    const response = await api.get<RespuestaTweetResponse[]>(`/tweets/${idTweet}/respuestas`);
    return response.data;
  },

  /**
   * Elimina una respuesta
   */
  eliminarRespuesta: async (idTweet: number, idRespuesta: number): Promise<void> => {
    await api.delete(`/tweets/${idTweet}/respuestas/${idRespuesta}`);
  },
};
