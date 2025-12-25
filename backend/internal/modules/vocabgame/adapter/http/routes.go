package http

import (
	"github.com/gin-gonic/gin"
)

// RegisterRoutes registers vocabgame-related HTTP routes
func RegisterRoutes(router *gin.RouterGroup, handler *Handler, authMiddleware gin.HandlerFunc) {
	// VocabGame routes: /api/v1/games/... (protected - requires login)
	gameGroup := router.Group("/games")
	gameGroup.Use(authMiddleware)
	{
		sessionsGroup := gameGroup.Group("/sessions")
		{
			sessionsGroup.POST("", handler.CreateSession)
			sessionsGroup.GET("/:sessionId", handler.GetSession)
			sessionsGroup.POST("/:sessionId/answers", handler.SubmitAnswer)
		}
	}
}

