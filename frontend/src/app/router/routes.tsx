/**
 * Application Routes Configuration
 */

import { createBrowserRouter } from 'react-router-dom';
import LandingPage from '../../pages/LandingPage';
import GameListPage from '../../pages/game/GameListPage';

// Placeholder components - will be implemented in later user stories
const GameConfigPage = () => <div>Game Config Page - Coming Soon</div>;
const DictionaryLookupPage = () => <div>Dictionary Lookup Page - Coming Soon</div>;

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
    path: '/dictionary',
    element: <DictionaryLookupPage />,
  },
]);
