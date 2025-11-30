/**
 * Dictionary React Query hooks
 */

import { useQuery } from '@tanstack/react-query';
import { dictionaryEndpoints } from './dictionary.endpoints';
import type { Language, Topic, Level } from '../model/dictionary.types';

export const dictionaryQueries = {
  /**
   * Query key factory for dictionary queries
   */
  keys: {
    all: ['dictionary'] as const,
    languages: () => [...dictionaryQueries.keys.all, 'languages'] as const,
    topics: () => [...dictionaryQueries.keys.all, 'topics'] as const,
    levels: (languageId?: number) =>
      [...dictionaryQueries.keys.all, 'levels', languageId] as const,
  },

  /**
   * Get all languages
   */
  useLanguages: () => {
    return useQuery<Language[]>({
      queryKey: dictionaryQueries.keys.languages(),
      queryFn: dictionaryEndpoints.getLanguages,
    });
  },

  /**
   * Get all topics
   */
  useTopics: () => {
    return useQuery<Topic[]>({
      queryKey: dictionaryQueries.keys.topics(),
      queryFn: dictionaryEndpoints.getTopics,
    });
  },

  /**
   * Get levels, optionally filtered by language ID
   */
  useLevels: (languageId?: number) => {
    return useQuery<Level[]>({
      queryKey: dictionaryQueries.keys.levels(languageId),
      queryFn: () => dictionaryEndpoints.getLevels(languageId),
      enabled: true, // Always enabled, languageId is optional
    });
  },
};

