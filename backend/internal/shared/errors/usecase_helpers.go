package errors

import (
	dictionarydomain "github.com/english-coach/backend/internal/modules/dictionary/domain"
	userdomain "github.com/english-coach/backend/internal/modules/user/domain"
	vocabgamedomain "github.com/english-coach/backend/internal/modules/vocabgame/domain"
)

// MapDomainErrorToAppError maps a domain error to an AppError
// This is used by usecase layer to convert domain errors to standardized AppErrors
func MapDomainErrorToAppError(err error) *AppError {
	if err == nil {
		return nil
	}

	// Check if it's already an AppError
	if appErr, ok := err.(*AppError); ok {
		return appErr
	}

	// Map user domain errors
	if err := mapUserDomainErrorToAppError(err); err != nil {
		return err
	}

	// Map vocabgame domain errors
	if err := mapvocabgamedomainErrorToAppError(err); err != nil {
		return err
	}

	// Map dictionary domain errors
	if err := mapDictionaryDomainErrorToAppError(err); err != nil {
		return err
	}

	// For unexpected errors, return internal error
	// This should rarely happen if error flow is correct
	return ErrInternalError.WithCause(err)
}

// mapUserDomainErrorToAppError maps user domain errors to AppError
func mapUserDomainErrorToAppError(err error) *AppError {
	switch err {
	case userdomain.ErrEmailRequired:
		return ErrEmailRequired
	case userdomain.ErrEmailExists:
		return ErrEmailExists
	case userdomain.ErrUsernameExists:
		return ErrUsernameExists
	case userdomain.ErrInvalidPassword:
		return ErrInvalidPassword
	case userdomain.ErrInvalidCredentials:
		return ErrInvalidCredentials
	case userdomain.ErrUserInactive:
		return ErrUserInactive
	case userdomain.ErrProfileNotFound:
		return ErrProfileNotFound
	case userdomain.ErrUserNotFound:
		return ErrUserNotFound
	default:
		return nil
	}
}

// mapvocabgamedomainErrorToAppError maps vocabgame domain errors to AppError
func mapvocabgamedomainErrorToAppError(err error) *AppError {
	switch err {
	case vocabgamedomain.ErrInsufficientWords:
		return ErrInsufficientWords
	case vocabgamedomain.ErrSessionNotFound:
		return ErrSessionNotFound
	case vocabgamedomain.ErrSessionEnded:
		return ErrSessionEnded
	case vocabgamedomain.ErrQuestionNotFound:
		return ErrQuestionNotFound
	case vocabgamedomain.ErrQuestionNotInSession:
		return ErrQuestionNotInSession
	case vocabgamedomain.ErrOptionNotFound:
		return ErrOptionNotFound
	case vocabgamedomain.ErrAnswerAlreadySubmitted:
		return ErrAnswerAlreadySubmitted
	case vocabgamedomain.ErrInvalidMode:
		return ErrInvalidMode
	case vocabgamedomain.ErrSessionNotOwned:
		return ErrSessionNotOwned
	case vocabgamedomain.ErrTranslationNotFound:
		return ErrTranslationNotFound
	default:
		return nil
	}
}

// mapDictionaryDomainErrorToAppError maps dictionary domain errors to AppError
func mapDictionaryDomainErrorToAppError(err error) *AppError {
	switch err {
	case dictionarydomain.ErrWordNotFound:
		return ErrWordNotFound
	case dictionarydomain.ErrTopicNotFound:
		return ErrTopicNotFound
	case dictionarydomain.ErrLevelNotFound:
		return ErrLevelNotFound
	case dictionarydomain.ErrLanguageNotFound:
		return ErrLanguageNotFound
	case dictionarydomain.ErrPartOfSpeechNotFound:
		return ErrPartOfSpeechNotFound
	case dictionarydomain.ErrSenseNotFound:
		return ErrSenseNotFound
	default:
		return nil
	}
}
