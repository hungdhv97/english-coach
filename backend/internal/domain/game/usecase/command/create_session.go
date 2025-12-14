package command

import (
	"context"
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/english-coach/backend/internal/domain/game/dto"
	"github.com/english-coach/backend/internal/domain/game/model"
	"github.com/english-coach/backend/internal/domain/game/port"
	"github.com/english-coach/backend/internal/shared/constants"
	"go.uber.org/zap"
)

// CreateGameSessionUseCase handles game session creation
type CreateGameSessionUseCase struct {
	sessionRepo       port.GameSessionRepository
	questionRepo      port.GameQuestionRepository
	questionGenerator port.QuestionGenerator
	logger            *zap.Logger
}

// NewCreateGameSessionUseCase creates a new use case
func NewCreateGameSessionUseCase(
	sessionRepo port.GameSessionRepository,
	questionRepo port.GameQuestionRepository,
	questionGenerator port.QuestionGenerator,
	logger *zap.Logger,
) *CreateGameSessionUseCase {
	return &CreateGameSessionUseCase{
		sessionRepo:       sessionRepo,
		questionRepo:      questionRepo,
		questionGenerator: questionGenerator,
		logger:            logger,
	}
}

// Execute creates a new game session
func (uc *CreateGameSessionUseCase) Execute(ctx context.Context, req *dto.CreateGameSessionRequest, userID int64) (*model.GameSession, error) {
	// Validate request
	if err := req.Validate(); err != nil {
		return nil, fmt.Errorf("validation error: %w", err)
	}

	// Create game session model
	// Note: TopicID is kept for backward compatibility with DB schema, but we use TopicIDs array for filtering
	var topicID *int64
	if len(req.TopicIDs) > 0 {
		// Store first topic ID for DB compatibility (schema still has single topic_id)
		topicID = &req.TopicIDs[0]
	}
	levelID := &req.LevelID

	session := &model.GameSession{
		UserID:           userID,
		Mode:             req.Mode,
		SourceLanguageID: req.SourceLanguageID,
		TargetLanguageID: req.TargetLanguageID,
		TopicID:          topicID,
		LevelID:          levelID,
		TotalQuestions:   0, // Will be set when questions are generated
		CorrectQuestions: 0,
		StartedAt:        time.Now(),
	}

	// Save session to database first (needed for question generation)
	if err := uc.sessionRepo.Create(ctx, session); err != nil {
		uc.logger.Error("failed to create game session",
			zap.Error(err),
			zap.Int64("user_id", userID),
			zap.String("mode", req.Mode),
		)
		return nil, fmt.Errorf("failed to create game session: %w", err)
	}

	// Generate questions upfront - request up to MaxGameQuestionCount (20)
	questions, options, err := uc.questionGenerator.GenerateQuestions(
		ctx,
		session.ID,
		req.SourceLanguageID,
		req.TargetLanguageID,
		req.Mode,
		req.TopicIDs,
		req.LevelID,
		constants.MaxGameQuestionCount,
	)
	if err != nil {
		uc.logger.Error("failed to generate questions",
			zap.Error(err),
			zap.Int64("session_id", session.ID),
			zap.String("mode", req.Mode),
			zap.Int16("source_language_id", req.SourceLanguageID),
			zap.Int16("target_language_id", req.TargetLanguageID),
			zap.Any("topic_ids", req.TopicIDs),
			zap.Any("level_id", req.LevelID),
		)
		// Check for insufficient words error (FR-026)
		// Error message format: "Không đủ từ: cần X, có Y"
		if strings.Contains(err.Error(), "Không đủ từ") {
			return nil, InsufficientWordsError
		}
		return nil, fmt.Errorf("failed to generate questions: %w", err)
	}

	// Check if we have at least the minimum required questions (1)
	if len(questions) < constants.MinGameQuestionCount {
		return nil, InsufficientWordsError
	}

	// Save questions and options
	if err := uc.questionRepo.CreateBatch(ctx, questions, options); err != nil {
		uc.logger.Error("failed to save questions",
			zap.Error(err),
			zap.Int64("session_id", session.ID),
		)
		return nil, fmt.Errorf("failed to save questions: %w", err)
	}

	// Update session with question count
	session.TotalQuestions = int16(len(questions))
	if err := uc.sessionRepo.Update(ctx, session); err != nil {
		uc.logger.Error("failed to update session with question count",
			zap.Error(err),
			zap.Int64("session_id", session.ID),
		)
		// Non-fatal error, continue
	}

	// Log session creation
	uc.logger.Info("game session created with questions",
		zap.Int64("session_id", session.ID),
		zap.Int64("user_id", userID),
		zap.String("mode", req.Mode),
		zap.Int16("source_language_id", req.SourceLanguageID),
		zap.Int16("target_language_id", req.TargetLanguageID),
		zap.Int("question_count", len(questions)),
	)

	return session, nil
}

// InsufficientWordsError represents the error when there are not enough words
var InsufficientWordsError = errors.New("Không đủ từ vựng để tạo phiên chơi. Vui lòng chọn chủ đề hoặc cấp độ khác")
