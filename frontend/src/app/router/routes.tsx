/**
 * Application Routes Configuration
 */

import { createBrowserRouter, Navigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import LandingPage from '../../pages/LandingPage';
import VocabGameListPage from '../../pages/vocabgame/VocabGameListPage';
import VocabGameConfigPage from '../../pages/vocabgame/VocabGameConfigPage';
import VocabGamePlayPage from '../../pages/vocabgame/VocabGamePlayPage';
import VocabGameStatisticsPage from '../../pages/vocabgame/VocabGameStatisticsPage';
import DictionaryLookupPage from '../../pages/dictionary/DictionaryLookupPage';
import WordDetailPage from '../../pages/dictionary/WordDetailPage';
import LoginPage from '../../pages/auth/LoginPage';
import RegisterPage from '../../pages/auth/RegisterPage';
import ProfilePage from '../../pages/auth/ProfilePage';
import { useAuthStore } from '../../shared/store/useAuthStore';

// Protected Route wrapper component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }
  return <>{children}</>;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: '/auth/login',
        element: <LoginPage />,
      },
      {
        path: '/auth/register',
        element: <RegisterPage />,
      },
      {
        path: '/auth/profile',
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/games',
        element: (
          <ProtectedRoute>
            <VocabGameListPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/games/vocab/config',
        element: (
          <ProtectedRoute>
            <VocabGameConfigPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/games/vocab/play/:sessionId',
        element: (
          <ProtectedRoute>
            <VocabGamePlayPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/games/vocab/statistics/:sessionId',
        element: (
          <ProtectedRoute>
            <VocabGameStatisticsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/dictionary',
        element: <DictionaryLookupPage />,
      },
      {
        path: '/dictionary/words/:wordId',
        element: <WordDetailPage />,
      },
    ],
  },
]);
