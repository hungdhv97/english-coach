/**
 * Hook to handle token expiration
 * Sets up automatic logout and redirect when token expires
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { httpClient } from '@/shared/api/http-client';
import { useAuthStore } from '@/shared/store/useAuthStore';

export function useTokenExpiration() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    // Set up token expiration callback
    httpClient.setTokenExpiredCallback(() => {
      // Logout user
      logout();
      
      // Redirect to login page
      navigate('/auth/login', { replace: true });
    });

    // Cleanup: remove callback on unmount
    return () => {
      httpClient.setTokenExpiredCallback(() => {});
    };
  }, [logout, navigate]);
}

