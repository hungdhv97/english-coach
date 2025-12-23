package update_profile

// UpdateProfileInput represents the input for updating user profile use case.
type UpdateProfileInput struct {
	DisplayName *string
	AvatarURL   *string
	BirthDay    *string // Format: YYYY-MM-DD
	Bio         *string
}

