package update_profile

// UpdateProfileOutput represents the output for updating user profile use case.
type UpdateProfileOutput struct {
	UserID      int64
	DisplayName *string
	AvatarURL   *string
	BirthDay    *string
	Bio         *string
}

