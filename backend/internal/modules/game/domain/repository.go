package domain

import (
	"context"
)

// GameSessionRepository defines operations for game session data access
type GameSessionRepository interface {
	// Create creates a new game session
	Create(ctx context.Context, session *GameSession) error
	// FindByID returns a game session by ID
	FindByID(ctx context.Context, id int64) (*GameSession, error)
	// Update updates a game session
	Update(ctx context.Context, session *GameSession) error
	// EndSession marks a session as ended
	EndSession(ctx context.Context, sessionID int64, endedAt interface{}) error
}

// GameQuestionRepository defines operations for game question data access
type GameQuestionRepository interface {
	// CreateBatch creates multiple questions and their options in a transaction
	CreateBatch(ctx context.Context, questions []*GameQuestion, options []*GameQuestionOption) error
	// FindQuestionsBySessionID returns all questions for a session
	FindQuestionsBySessionID(ctx context.Context, sessionID int64) ([]*GameQuestion, []*GameQuestionOption, error)
	// FindByID returns a question by ID with its options
	FindQuestionByID(ctx context.Context, questionID int64) (*GameQuestion, []*GameQuestionOption, error)
}

// GameAnswerRepository defines operations for game answer data access
type GameAnswerRepository interface {
	// Create creates a new answer
	Create(ctx context.Context, answer *GameAnswer) error
	// FindAnswerByQuestionID returns the answer for a specific question in a session
	FindAnswerByQuestionID(ctx context.Context, questionID, sessionID, userID int64) (*GameAnswer, error)
	// FindAnswersBySessionID returns all answers for a session
	FindAnswersBySessionID(ctx context.Context, sessionID, userID int64) ([]*GameAnswer, error)
}
