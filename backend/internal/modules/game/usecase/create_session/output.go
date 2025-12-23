package create_session

import "time"

// CreateSessionOutput represents the output for creating a game session use case.
type CreateSessionOutput struct {
	ID               int64
	UserID           int64
	Mode             string
	SourceLanguageID int16
	TargetLanguageID int16
	TopicID          *int64
	LevelID          *int64
	TotalQuestions   int16
	CorrectQuestions int16
	StartedAt        time.Time
	EndedAt          *time.Time
}

