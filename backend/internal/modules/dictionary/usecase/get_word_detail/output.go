package get_word_detail

import (
	"github.com/english-coach/backend/internal/modules/dictionary/domain"
)

// GetWordDetailOutput represents detailed information about a word for the use case.
type GetWordDetailOutput struct {
	Word           *domain.Word
	Senses         []SenseDetail
	Pronunciations []*domain.Pronunciation
	Relations      []*domain.WordRelation
}

// SenseDetail represents detailed information about a sense.
type SenseDetail struct {
	ID                   int64
	SenseOrder           int16
	PartOfSpeechID       int16
	PartOfSpeechName     *string
	Definition           string
	DefinitionLanguageID int16
	LevelID              *int64
	LevelName            *string
	Note                 *string
	Translations         []*domain.Word
	Examples             []*domain.Example
}

