package http

// RegisterRequest represents the request body for user registration
type RegisterRequest struct {
	DisplayName *string `json:"display_name,omitempty" binding:"omitempty,max=100"`
	Email       *string `json:"email,omitempty" binding:"omitempty,email"`
	Username    *string `json:"username,omitempty" binding:"omitempty,min=3,max=100"`
	Password    string  `json:"password" binding:"required,min=6"`
}

// RegisterResponse represents the response body for user registration
type RegisterResponse struct {
	UserID   int64   `json:"user_id"`
	Email    *string `json:"email,omitempty"`
	Username *string `json:"username,omitempty"`
}

// LoginRequest represents the request body for user login
type LoginRequest struct {
	Email    *string `json:"email,omitempty"`
	Username *string `json:"username,omitempty"`
	Password string  `json:"password" binding:"required"`
}

// LoginResponse represents the response body for user login
type LoginResponse struct {
	Token    string  `json:"token"`
	UserID   int64   `json:"user_id"`
	Email    *string `json:"email,omitempty"`
	Username *string `json:"username,omitempty"`
}

// UpdateProfileRequest represents the request body for updating user profile
type UpdateProfileRequest struct {
	DisplayName *string `json:"display_name,omitempty" binding:"omitempty,max=100"`
	AvatarURL   *string `json:"avatar_url,omitempty" binding:"omitempty,url,max=500"`
	BirthDay    *string `json:"birth_day,omitempty" binding:"omitempty,datetime=2006-01-02"`
	Bio         *string `json:"bio,omitempty"`
}

// UserProfileResponse represents the user profile response body
type UserProfileResponse struct {
	UserID      int64   `json:"user_id"`
	DisplayName *string `json:"display_name,omitempty"`
	AvatarURL   *string `json:"avatar_url,omitempty"`
	BirthDay    *string `json:"birth_day,omitempty"`
	Bio         *string `json:"bio,omitempty"`
}

// UpdateProfileResponse represents the response body for updating user profile
type UpdateProfileResponse struct {
	UserID      int64   `json:"user_id"`
	DisplayName *string `json:"display_name,omitempty"`
	AvatarURL   *string `json:"avatar_url,omitempty"`
	BirthDay    *string `json:"birth_day,omitempty"`
	Bio         *string `json:"bio,omitempty"`
}

// CheckEmailAvailabilityResponse represents the response for email availability check
type CheckEmailAvailabilityResponse struct {
	Available bool `json:"available"`
	Exists    bool `json:"exists"`
}

// CheckUsernameAvailabilityResponse represents the response for username availability check
type CheckUsernameAvailabilityResponse struct {
	Available bool `json:"available"`
	Exists    bool `json:"exists"`
}
