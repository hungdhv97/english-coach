/**
 * Game API endpoints
 */

import { httpClient } from '@/shared/api/http-client';
import type {
  GameSession,
  CreateGameSessionRequest,
  GameSessionWithQuestions,
  GameAnswer,
  SubmitAnswerRequest,
} from '../model/game.types';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export const gameEndpoints = {
  /**
   * Create a new game session
   */
  createSession: async (request: CreateGameSessionRequest): Promise<GameSession> => {
    const response = await httpClient.post<ApiResponse<GameSession>>(
      '/games/sessions',
      request
    );
    return response.data;
  },

  /**
   * Get a game session with questions
   */
  getSession: async (sessionId: number): Promise<GameSessionWithQuestions> => {
    const response = await httpClient.get<ApiResponse<GameSessionWithQuestions>>(
      `/games/sessions/${sessionId}`
    );
    return response.data;
  },

  /**
   * Submit an answer to a question
   */
  submitAnswer: async (
    sessionId: number,
    request: SubmitAnswerRequest
  ): Promise<GameAnswer> => {
    const response = await httpClient.post<ApiResponse<GameAnswer>>(
      `/games/sessions/${sessionId}/answers`,
      request
    );
    return response.data;
  },
};

