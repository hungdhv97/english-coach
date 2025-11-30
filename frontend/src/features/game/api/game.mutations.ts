/**
 * Game mutations using React Query
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { gameEndpoints } from '@/entities/game/api/game.endpoints';
import type {
  CreateGameSessionRequest,
  GameSession,
  GameAnswer,
  SubmitAnswerRequest,
} from '@/entities/game/model/game.types';

export const gameMutations = {
  /**
   * Create a new game session
   */
  useCreateSession: () => {
    const queryClient = useQueryClient();

    return useMutation<GameSession, Error, CreateGameSessionRequest>({
      mutationFn: gameEndpoints.createSession,
      onSuccess: (data) => {
        // Invalidate game session queries if needed
        queryClient.invalidateQueries({ queryKey: ['game', 'sessions'] });
      },
    });
  },

  /**
   * Submit an answer to a question
   */
  useSubmitAnswer: (sessionId: number) => {
    const queryClient = useQueryClient();

    return useMutation<GameAnswer, Error, SubmitAnswerRequest>({
      mutationFn: (request) => gameEndpoints.submitAnswer(sessionId, request),
      onSuccess: () => {
        // Invalidate session query to refresh data
        queryClient.invalidateQueries({
          queryKey: ['game', 'sessions', sessionId],
        });
      },
    });
  },
};

