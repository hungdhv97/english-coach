package port

import (
	"context"

	"github.com/english-coach/backend/internal/domain/game/model"
)

// GameSessionRepository defines operations for game session data access
type GameSessionRepository interface {
	// Create creates a new game session
	Create(ctx context.Context, session *model.GameSession) error
	// FindByID returns a game session by ID
	FindByID(ctx context.Context, id int64) (*model.GameSession, error)
	// Update updates a game session
	Update(ctx context.Context, session *model.GameSession) error
	// EndSession marks a session as ended
	EndSession(ctx context.Context, sessionID int64, endedAt interface{}) error
}

// GameQuestionRepository defines operations for game question data access
type GameQuestionRepository interface {
	// CreateBatch creates multiple questions and their options in a transaction
	CreateBatch(ctx context.Context, questions []*model.GameQuestion, options []*model.GameQuestionOption) error
	// FindBySessionID returns all questions for a session
	FindBySessionID(ctx context.Context, sessionID int64) ([]*model.GameQuestion, []*model.GameQuestionOption, error)
	// FindByID returns a question by ID with its options
	FindByID(ctx context.Context, questionID int64) (*model.GameQuestion, []*model.GameQuestionOption, error)
}

// GameAnswerRepository defines operations for game answer data access
type GameAnswerRepository interface {
	// Create creates a new answer
	Create(ctx context.Context, answer *model.GameAnswer) error
	// FindByQuestionID returns the answer for a specific question
	FindByQuestionID(ctx context.Context, questionID, sessionID, userID int64) (*model.GameAnswer, error)
	// FindBySessionID returns all answers for a session
	FindBySessionID(ctx context.Context, sessionID, userID int64) ([]*model.GameAnswer, error)
}

