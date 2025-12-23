package submit_answer

import "time"

// SubmitAnswerOutput represents the output for submitting an answer use case.
type SubmitAnswerOutput struct {
	ID               int64
	QuestionID       int64
	SessionID        int64
	UserID           int64
	SelectedOptionID *int64
	IsCorrect        bool
	ResponseTimeMs   *int
	AnsweredAt       time.Time
}

