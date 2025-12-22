package submit_answer

// SubmitAnswerRequest represents the request to submit an answer
type SubmitAnswerRequest struct {
	QuestionID       int64 `json:"question_id" validate:"required,gt=0"`
	SelectedOptionID int64 `json:"selected_option_id" validate:"required,gt=0"`
	ResponseTimeMs   *int  `json:"response_time_ms,omitempty" validate:"omitempty,gt=0"`
}

