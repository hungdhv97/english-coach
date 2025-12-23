package http

// SearchWordsRequest represents the query parameters for word search
type SearchWordsRequest struct {
	Query       string `form:"q" binding:"required"`
	LanguageID  int16  `form:"languageId" binding:"required"`
	Page        int    `form:"page"`
	PageSize    int    `form:"pageSize"`
	Limit       int    `form:"limit"`
	Offset      int    `form:"offset"`
}

// GetLevelsRequest represents the query parameters for getting levels
type GetLevelsRequest struct {
	LanguageID *int16 `form:"languageId"`
}

// GetWordDetailRequest represents the path parameter for getting word detail
type GetWordDetailRequest struct {
	WordID int64 `uri:"wordId" binding:"required"`
}

// SenseDetailResponse represents detailed information about a sense for HTTP response.
type SenseDetailResponse struct {
	ID                   int64   `json:"id"`
	SenseOrder           int16   `json:"sense_order"`
	PartOfSpeechID       int16   `json:"part_of_speech_id"`
	PartOfSpeechName     *string `json:"part_of_speech_name,omitempty"`
	Definition           string  `json:"definition"`
	DefinitionLanguageID int16   `json:"definition_language_id"`
	LevelID              *int64  `json:"level_id,omitempty"`
	LevelName            *string `json:"level_name,omitempty"`
	Note                 *string `json:"note,omitempty"`
	// domain-level slices (translations/examples) keep their own JSON tags
	// and will be inlined as-is from domain models.
}

// GetWordDetailResponse represents the HTTP response for getting word detail.
type GetWordDetailResponse struct {
	Word           interface{}           `json:"word"`
	Senses         []SenseDetailResponse `json:"senses"`
	Pronunciations interface{}           `json:"pronunciations"`
	Relations      interface{}           `json:"relations,omitempty"`
}

