/**
 * VocabGame API endpoints
 */

import { httpClient } from '@/shared/api/http-client';
import type {
  VocabGameSession,
  CreateVocabGameSessionRequest,
  VocabGameSessionWithQuestions,
  VocabGameAnswer,
  SubmitAnswerRequest,
  SessionStatistics,
} from '../model/vocabgame.types';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export const vocabGameEndpoints = {
  /**
   * Create a new vocabgame session
   */
  createSession: async (request: CreateVocabGameSessionRequest): Promise<VocabGameSession> => {
    const response = await httpClient.post<ApiResponse<VocabGameSession>>(
      '/vocabgames/sessions',
      request
    );
    return response.data;
  },

  /**
   * Get a vocabgame session with questions
   */
  getSession: async (sessionId: number): Promise<VocabGameSessionWithQuestions> => {
    const response = await httpClient.get<ApiResponse<VocabGameSessionWithQuestions>>(
      `/vocabgames/sessions/${sessionId}`
    );
    return response.data;
  },

  /**
   * Submit an answer to a question
   */
  submitAnswer: async (
    sessionId: number,
    request: SubmitAnswerRequest
  ): Promise<VocabGameAnswer> => {
    const response = await httpClient.post<ApiResponse<VocabGameAnswer>>(
      `/vocabgames/sessions/${sessionId}/answers`,
      request
    );
    return response.data;
  },

  /**
   * Get session statistics
   */
  getSessionStatistics: async (sessionId: number): Promise<SessionStatistics> => {
    const response = await httpClient.get<ApiResponse<SessionStatistics>>(
      `/statistics/sessions/${sessionId}`
    );
    return response.data;
  },
};

