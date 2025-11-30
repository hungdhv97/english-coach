package handler

import (
	"net/http"
	"strconv"

	"github.com/english-coach/backend/internal/domain/dictionary/port"
	"github.com/english-coach/backend/internal/shared/response"
	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

// DictionaryHandler handles dictionary-related HTTP requests
type DictionaryHandler struct {
	languageRepo port.LanguageRepository
	topicRepo    port.TopicRepository
	levelRepo    port.LevelRepository
	logger       *zap.Logger
}

// NewDictionaryHandler creates a new dictionary handler
func NewDictionaryHandler(
	languageRepo port.LanguageRepository,
	topicRepo port.TopicRepository,
	levelRepo port.LevelRepository,
	logger *zap.Logger,
) *DictionaryHandler {
	return &DictionaryHandler{
		languageRepo: languageRepo,
		topicRepo:    topicRepo,
		levelRepo:    levelRepo,
		logger:       logger,
	}
}

// GetLanguages handles GET /api/v1/reference/languages
func (h *DictionaryHandler) GetLanguages(c *gin.Context) {
	ctx := c.Request.Context()

	languages, err := h.languageRepo.FindAll(ctx)
	if err != nil {
		h.logger.Error("failed to fetch languages",
			zap.Error(err),
			zap.String("path", c.Request.URL.Path),
		)
		response.ErrorResponse(c, http.StatusInternalServerError,
			"INTERNAL_ERROR",
			"Không thể lấy danh sách ngôn ngữ",
			nil,
		)
		return
	}

	response.Success(c, http.StatusOK, languages)
}

// GetTopics handles GET /api/v1/reference/topics
func (h *DictionaryHandler) GetTopics(c *gin.Context) {
	ctx := c.Request.Context()

	topics, err := h.topicRepo.FindAll(ctx)
	if err != nil {
		h.logger.Error("failed to fetch topics",
			zap.Error(err),
			zap.String("path", c.Request.URL.Path),
		)
		response.ErrorResponse(c, http.StatusInternalServerError,
			"INTERNAL_ERROR",
			"Không thể lấy danh sách chủ đề",
			nil,
		)
		return
	}

	response.Success(c, http.StatusOK, topics)
}

// GetLevels handles GET /api/v1/reference/levels?languageId=...
func (h *DictionaryHandler) GetLevels(c *gin.Context) {
	ctx := c.Request.Context()

	languageIDStr := c.Query("languageId")
	if languageIDStr != "" {
		languageID, err := strconv.ParseInt(languageIDStr, 10, 16)
		if err != nil {
			response.ErrorResponse(c, http.StatusBadRequest,
				"INVALID_PARAMETER",
				"Tham số languageId không hợp lệ",
				nil,
			)
			return
		}

		levels, err := h.levelRepo.FindByLanguageID(ctx, int16(languageID))
		if err != nil {
			h.logger.Error("failed to fetch levels by language",
				zap.Error(err),
				zap.String("path", c.Request.URL.Path),
				zap.Int16("language_id", int16(languageID)),
			)
			response.ErrorResponse(c, http.StatusInternalServerError,
				"INTERNAL_ERROR",
				"Không thể lấy danh sách cấp độ",
				nil,
			)
			return
		}

		response.Success(c, http.StatusOK, levels)
		return
	}

	// If no languageId provided, return all levels
	levels, err := h.levelRepo.FindAll(ctx)
	if err != nil {
		h.logger.Error("failed to fetch levels",
			zap.Error(err),
			zap.String("path", c.Request.URL.Path),
		)
		response.ErrorResponse(c, http.StatusInternalServerError,
			"INTERNAL_ERROR",
			"Không thể lấy danh sách cấp độ",
			nil,
		)
		return
	}

	response.Success(c, http.StatusOK, levels)
}

