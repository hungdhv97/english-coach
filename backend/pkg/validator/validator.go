package validator

import (
	"github.com/go-playground/validator/v10"
)

// Validator wraps go-playground/validator
type Validator struct {
	validate *validator.Validate
}

// New creates a new validator instance
func New() *Validator {
	return &Validator{
		validate: validator.New(),
	}
}

// Validate validates a struct
func (v *Validator) Validate(i interface{}) error {
	return v.validate.Struct(i)
}

// Get returns the underlying validator
func (v *Validator) Get() *validator.Validate {
	return v.validate
}

