package validator

import (
	"net/http"

	"github.com/english-coach/backend/internal/shared/response"
	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
	"github.com/go-playground/validator/v10"
)

var validate *validator.Validate

func init() {
	validate = validator.New()

	// Register custom validators here if needed
	// validate.RegisterValidation("custom_tag", customValidatorFunc)
}

// RegisterGinValidator registers go-playground/validator with Gin
func RegisterGinValidator() error {
	if _, ok := binding.Validator.Engine().(*validator.Validate); ok {
		// Use the same validator instance
		_ = validate
		return nil
	}
	return nil
}

// GetValidator returns the validator instance
func GetValidator() *validator.Validate {
	return validate
}

// ValidateStruct validates a struct and returns errors in Gin format
func ValidateStruct(c *gin.Context, s interface{}) bool {
	if err := validate.Struct(s); err != nil {
		// Handle validation errors
		var errs []string

		if ve, ok := err.(validator.ValidationErrors); ok {
			for _, e := range ve {
				errs = append(errs, getValidationErrorMessage(e))
			}
		} else {
			errs = []string{err.Error()}
		}

		response.ErrorResponse(c, http.StatusBadRequest, "VALIDATION_ERROR", "Xác thực thất bại", errs)
		return false
	}
	return true
}

// ShouldBindJSON validates and binds JSON body
func ShouldBindJSON(c *gin.Context, s interface{}) bool {
	if err := c.ShouldBindJSON(s); err != nil {
		response.ErrorResponse(c, http.StatusBadRequest, "INVALID_JSON", "Định dạng JSON không hợp lệ", err.Error())
		return false
	}
	return ValidateStruct(c, s)
}

// getValidationErrorMessage returns a human-readable error message
func getValidationErrorMessage(e validator.FieldError) string {
	switch e.Tag() {
	case "required":
		return e.Field() + " là bắt buộc"
	case "email":
		return e.Field() + " phải là email hợp lệ"
	case "min":
		return e.Field() + " phải có ít nhất " + e.Param() + " ký tự"
	case "max":
		return e.Field() + " phải có tối đa " + e.Param() + " ký tự"
	default:
		return e.Field() + " không hợp lệ"
	}
}
