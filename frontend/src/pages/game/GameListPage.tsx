/**
 * Game List Page Component
 * Displays available games for users to select
 */

import { useNavigate } from 'react-router-dom';
import { Gamepad2, BookOpen, TrendingUp, Users } from 'lucide-react';
import './GameListPage.css';

interface Game {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  route: string;
  color: string;
}

const availableGames: Game[] = [
  {
    id: 'vocab',
    name: 'Học Từ Vựng',
    description: 'Học từ vựng qua các câu hỏi trắc nghiệm theo chủ đề hoặc cấp độ',
    icon: <BookOpen className="w-8 h-8" />,
    route: '/games/vocab/config',
    color: 'from-blue-500 to-blue-600',
  },
  // Có thể thêm các game khác sau
  // {
  //   id: 'flashcard',
  //   name: 'Flashcard',
  //   description: 'Học từ vựng bằng thẻ ghi nhớ',
  //   icon: <FileText className="w-8 h-8" />,
  //   route: '/games/flashcard',
  //   color: 'from-purple-500 to-purple-600',
  // },
];

export default function GameListPage() {
  const navigate = useNavigate();

  const handleGameSelect = (game: Game) => {
    navigate(game.route);
  };

  return (
    <div className="game-list-page">
      <div className="game-list-page__container">
        <header className="game-list-page__header">
          <h1 className="game-list-page__title">Chọn Game</h1>
          <p className="game-list-page__subtitle">
            Chọn một game để bắt đầu học từ vựng
          </p>
        </header>

        <main className="game-list-page__main">
          <div className="game-list-page__games">
            {availableGames.map((game) => (
              <div
                key={game.id}
                className={`game-list-page__game-card game-list-page__game-card--${game.id}`}
                onClick={() => handleGameSelect(game)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleGameSelect(game);
                  }
                }}
                aria-label={`Chọn game ${game.name}`}
              >
                <div className={`game-list-page__game-icon bg-gradient-to-br ${game.color}`}>
                  {game.icon}
                </div>
                <div className="game-list-page__game-content">
                  <h2 className="game-list-page__game-name">{game.name}</h2>
                  <p className="game-list-page__game-description">{game.description}</p>
                </div>
                <div className="game-list-page__game-arrow">
                  →
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

