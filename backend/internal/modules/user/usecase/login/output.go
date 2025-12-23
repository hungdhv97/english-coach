package login

// LoginOutput represents the output for user login use case.
type LoginOutput struct {
	Token    string
	UserID   int64
	Email    *string
	Username *string
}

