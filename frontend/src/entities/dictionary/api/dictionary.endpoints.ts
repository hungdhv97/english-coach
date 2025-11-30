/**
 * Dictionary API endpoints
 */

import { httpClient } from '@/shared/api/http-client';
import type { Language, Topic, Level } from '../model/dictionary.types';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export const dictionaryEndpoints = {
  /**
   * Get all languages
   */
  getLanguages: async (): Promise<Language[]> => {
    const response = await httpClient.get<ApiResponse<Language[]>>('/reference/languages');
    return response.data || [];
  },

  /**
   * Get all topics
   */
  getTopics: async (): Promise<Topic[]> => {
    const response = await httpClient.get<ApiResponse<Topic[]>>('/reference/topics');
    return response.data || [];
  },

  /**
   * Get all levels, optionally filtered by language ID
   */
  getLevels: async (languageId?: number): Promise<Level[]> => {
    const url = languageId
      ? `/reference/levels?languageId=${languageId}`
      : '/reference/levels';
    const response = await httpClient.get<ApiResponse<Level[]>>(url);
    return response.data || [];
  },
};

