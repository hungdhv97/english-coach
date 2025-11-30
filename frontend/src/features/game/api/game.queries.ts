/**
 * Game queries using React Query
 */

import { useQuery } from '@tanstack/react-query';
import { gameEndpoints } from '@/entities/game/api/game.endpoints';
import type {
  GameSessionWithQuestions,
  SessionStatistics,
} from '@/entities/game/model/game.types';

export const gameQueries = {
  /**
   * Query key factory for game queries
   */
  keys: {
    all: ['game'] as const,
    sessions: () => [...gameQueries.keys.all, 'sessions'] as const,
    session: (sessionId: number) =>
      [...gameQueries.keys.sessions(), sessionId] as const,
    statistics: () => [...gameQueries.keys.all, 'statistics'] as const,
    sessionStatistics: (sessionId: number) =>
      [...gameQueries.keys.statistics(), sessionId] as const,
  },

  /**
   * Get a game session with questions
   */
  useSession: (sessionId: number) => {
    return useQuery<GameSessionWithQuestions>({
      queryKey: gameQueries.keys.session(sessionId),
      queryFn: () => gameEndpoints.getSession(sessionId),
      enabled: !!sessionId && sessionId > 0,
      staleTime: 0, // Always fetch fresh data for active game
    });
  },

  /**
   * Get session statistics
   */
  useSessionStatistics: (sessionId: number) => {
    return useQuery<SessionStatistics>({
      queryKey: gameQueries.keys.sessionStatistics(sessionId),
      queryFn: () => gameEndpoints.getSessionStatistics(sessionId),
      enabled: !!sessionId && sessionId > 0,
    });
  },
};

