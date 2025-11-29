package response

import (
	"github.com/gin-gonic/gin"
)

// Success sends a success response
func Success(c *gin.Context, statusCode int, data interface{}) {
	c.JSON(statusCode, gin.H{
		"success": true,
		"data":    data,
	})
}

// ErrorResponse sends an error response
func ErrorResponse(c *gin.Context, statusCode int, code, message string, details interface{}) {
	c.JSON(statusCode, gin.H{
		"success": false,
		"error": gin.H{
			"code":    code,
			"message": message,
			"details": details,
		},
	})
}

// Paginated sends a paginated response
func Paginated(c *gin.Context, statusCode int, data interface{}, page, pageSize, total int64) {
	c.JSON(statusCode, gin.H{
		"success": true,
		"data":    data,
		"pagination": gin.H{
			"page":        page,
			"page_size":   pageSize,
			"total":       total,
			"total_pages": (total + pageSize - 1) / pageSize,
		},
	})
}
