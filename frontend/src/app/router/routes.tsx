/**
 * Application Routes Configuration
 */

import { createBrowserRouter } from 'react-router-dom';
import LandingPage from '../../pages/LandingPage';
import GameListPage from '../../pages/game/GameListPage';
import GameConfigPage from '../../pages/game/GameConfigPage';
import GamePlayPage from '../../pages/game/GamePlayPage';
import GameStatisticsPage from '../../pages/game/GameStatisticsPage';

// Placeholder components - will be implemented in later user stories
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const DictionaryLookupPage = () => (
  <div className="min-h-screen flex items-center justify-center p-4">
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Dictionary Lookup</CardTitle>
        <CardDescription>Coming Soon</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">This feature will be implemented in a later user story.</p>
      </CardContent>
    </Card>
  </div>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/games',
    element: <GameListPage />,
  },
  {
    path: '/games/vocab/config',
    element: <GameConfigPage />,
  },
  {
    path: '/games/vocab/play/:sessionId',
    element: <GamePlayPage />,
  },
  {
    path: '/games/vocab/statistics/:sessionId',
    element: <GameStatisticsPage />,
  },
  {
    path: '/dictionary',
    element: <DictionaryLookupPage />,
  },
]);
