package vocabgame

import (
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/english-coach/backend/internal/modules/vocabgame/domain"
	db "github.com/english-coach/backend/internal/platform/db/sqlc/gen/game"
)

// GameRepository implements vocabgame repository interfaces using sqlc
type GameRepository struct {
	pool    *pgxpool.Pool
	queries *db.Queries
}

// NewGameRepository creates a new vocabgame repository
func NewGameRepository(pool *pgxpool.Pool) *GameRepository {
	return &GameRepository{
		pool:    pool,
		queries: db.New(pool),
	}
}

// GameSessionRepository returns a GameSessionRepository implementation
func (r *GameRepository) GameSessionRepository() domain.GameSessionRepository {
	return &gameSessionRepository{
		GameRepository: r,
	}
}

// GameQuestionRepository returns a GameQuestionRepository implementation
func (r *GameRepository) GameQuestionRepository() domain.GameQuestionRepository {
	return &gameQuestionRepository{
		GameRepository: r,
	}
}

// GameAnswerRepository returns a GameAnswerRepository implementation
func (r *GameRepository) GameAnswerRepository() domain.GameAnswerRepository {
	return &gameAnswerRepository{
		GameRepository: r,
	}
}
