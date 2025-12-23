package register

// RegisterInput represents the input for user registration use case.
type RegisterInput struct {
	DisplayName *string
	Email       *string
	Username    *string
	Password    string
}

