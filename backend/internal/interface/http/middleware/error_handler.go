package middleware

import (
	"net/http"

	"github.com/english-coach/backend/internal/shared/response"
	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

// ErrorHandler is a centralized error handling middleware for Gin
func ErrorHandler(logger *zap.Logger) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Next()

		// Check if there are any errors
		if len(c.Errors) > 0 {
			err := c.Errors.Last().Err

			logger.Error("request error",
				zap.String("method", c.Request.Method),
				zap.String("path", c.Request.URL.Path),
				zap.Error(err),
			)

			// Determine status code
			statusCode := http.StatusInternalServerError
			code := "INTERNAL_ERROR"

			if c.Writer.Status() != http.StatusOK {
				statusCode = c.Writer.Status()
			}

			c.JSON(statusCode, response.NewError(
				code,
				err.Error(),
				nil,
			))
		}
	}
}
