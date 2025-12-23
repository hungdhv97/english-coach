package get_profile

// GetProfileOutput represents the output for getting user profile use case.
type GetProfileOutput struct {
	UserID      int64
	DisplayName *string
	AvatarURL   *string
	BirthDay    *string
	Bio         *string
}

