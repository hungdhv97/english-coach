package create_session

import (
	"errors"
)

// CreateSessionInput represents the input to create a game session use case.
type CreateSessionInput struct {
	SourceLanguageID int16
	TargetLanguageID int16
	Mode             string  // Always 'level' now
	LevelID          int64   // Required
	TopicIDs         []int64 // Optional array (empty/nil means all topics)
}

// Validate validates the CreateSessionInput.
func (r *CreateSessionInput) Validate() error {
	// Source and target languages must be different
	if r.SourceLanguageID == r.TargetLanguageID {
		return errors.New("Ngôn ngữ nguồn và ngôn ngữ đích phải khác nhau")
	}

	// Mode must be 'level'
	if r.Mode != "level" {
		return errors.New("Chế độ phải là 'level'")
	}

	// Level ID is required
	if r.LevelID <= 0 {
		return errors.New("Level_id là bắt buộc và phải lớn hơn 0")
	}

	// TopicIDs is optional (empty array or nil means all topics)
	// If provided, all topic IDs must be valid
	for _, topicID := range r.TopicIDs {
		if topicID <= 0 {
			return errors.New("Tất cả topic_ids phải lớn hơn 0")
		}
	}

	return nil
}

