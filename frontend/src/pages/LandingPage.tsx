/**
 * Landing Page Component
 * Displays two prominent action buttons for navigation
 */

import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

export default function LandingPage() {
  const navigate = useNavigate();

  const handlePlayGame = () => {
    navigate('/games');
  };

  const handleDictionaryLookup = () => {
    navigate('/dictionary');
  };

  return (
    <div className="landing-page">
      <div className="landing-page__container">
        <header className="landing-page__header">
          <h1 className="landing-page__title">English Coach</h1>
          <p className="landing-page__subtitle">
            Học từ vựng đa ngôn ngữ một cách hiệu quả
          </p>
        </header>

        <main className="landing-page__main">
          <div className="landing-page__actions">
            <button
              className="landing-page__button landing-page__button--primary"
              onClick={handlePlayGame}
              aria-label="Chơi game học từ vựng"
            >
              <span className="landing-page__button-icon">🎮</span>
              <span className="landing-page__button-text">Chơi Game</span>
              <span className="landing-page__button-description">
                Học từ vựng qua các trò chơi thú vị
              </span>
            </button>

            <button
              className="landing-page__button landing-page__button--secondary"
              onClick={handleDictionaryLookup}
              aria-label="Tra cứu từ điển"
            >
              <span className="landing-page__button-icon">📚</span>
              <span className="landing-page__button-text">Tra Cứu Từ Điển</span>
              <span className="landing-page__button-description">
                Tìm kiếm và học từ vựng đa ngôn ngữ
              </span>
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

