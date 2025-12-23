package submit_answer

// SubmitAnswerInput represents the input to submit an answer use case.
type SubmitAnswerInput struct {
	QuestionID       int64
	SelectedOptionID int64
	ResponseTimeMs   *int
}

