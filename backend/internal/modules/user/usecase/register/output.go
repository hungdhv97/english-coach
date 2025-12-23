package register

// RegisterOutput represents the output for user registration use case.
type RegisterOutput struct {
	UserID   int64
	Email    *string
	Username *string
}

