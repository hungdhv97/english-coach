/**
 * VocabGame entity types
 */

export interface VocabGameSession {
  id: number;
  user_id: number;
  mode: 'level'; // Always 'level' now
  source_language_id: number;
  target_language_id: number;
  topic_id?: number; // Kept for backward compatibility, but not used for filtering
  level_id?: number; // Required
  total_questions: number;
  correct_questions: number;
  started_at: string;
  ended_at?: string;
}

export interface CreateVocabGameSessionRequest {
  source_language_id: number;
  target_language_id: number;
  mode: 'level'; // Always 'level' now
  level_id: number; // Required
  topic_ids?: number[]; // Optional array of topic IDs (empty/null means all topics)
}

export interface CreateVocabGameSessionResponse {
  success: boolean;
  data: VocabGameSession;
}

export interface VocabGameQuestion {
  id: number;
  session_id: number;
  question_order: number;
  question_type: string;
  source_word_id: number;
  source_sense_id?: number;
  correct_target_word_id: number;
  source_language_id: number;
  target_language_id: number;
  created_at: string;
}

export interface VocabGameQuestionOption {
  id: number;
  question_id: number;
  option_label: 'A' | 'B' | 'C' | 'D';
  target_word_id: number;
  word_text: string; // Word text included in response
  // Note: is_correct is not included in GetSession response for security
  // It's only returned in SubmitAnswer response
}

export interface VocabGameQuestionWithOptions {
  id: number;
  session_id: number;
  question_order: number;
  question_type: string;
  source_word_id: number;
  source_sense_id?: number;
  correct_target_word_id: number;
  source_language_id: number;
  target_language_id: number;
  created_at: string;
  source_word_text: string; // Source word text included in response
  options: VocabGameQuestionOption[];
}

export interface VocabGameSessionWithQuestions {
  session: VocabGameSession;
  questions: VocabGameQuestionWithOptions[];
}

export interface VocabGameAnswer {
  id: number;
  question_id: number;
  session_id: number;
  user_id: number;
  selected_option_id?: number;
  is_correct: boolean;
  response_time_ms?: number;
  answered_at: string;
}

export interface SubmitAnswerRequest {
  question_id: number;
  selected_option_id: number;
  response_time_ms?: number;
}

export interface SessionStatistics {
  session_id: number;
  total_questions: number;
  correct_answers: number;
  wrong_answers: number;
  accuracy_percentage: number; // 0-100
  duration_seconds: number; // Total session duration
  average_response_time_ms: number; // Average response time in milliseconds
}

