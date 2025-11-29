/**
 * Error Interceptor for HTTP requests
 */

import { ApiError } from '../http-client';

export const handleApiError = (error: unknown): ApiError => {
  if (error instanceof Error) {
    // Check if it's already an ApiError
    if ('code' in error && 'message' in error) {
      return error as ApiError;
    }

    // Network or other errors
    return {
      code: 'NETWORK_ERROR',
      message: error.message || 'Network error occurred',
    };
  }

  // Unknown error
  return {
    code: 'UNKNOWN_ERROR',
    message: 'An unknown error occurred',
  };
};

export const isApiError = (error: unknown): error is ApiError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error
  );
};

