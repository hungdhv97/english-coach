package login

// LoginInput represents the input for user login use case.
type LoginInput struct {
	Email    *string
	Username *string
	Password string
}

