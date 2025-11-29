package response

// Error represents a unified error response schema
type Error struct {
	Code    string      `json:"code"`
	Message string      `json:"message"`
	Details interface{} `json:"details,omitempty"`
}

// NewError creates a new Error instance
func NewError(code, message string, details interface{}) *Error {
	return &Error{
		Code:    code,
		Message: message,
		Details: details,
	}
}

// Error implements the error interface
func (e *Error) Error() string {
	return e.Message
}

