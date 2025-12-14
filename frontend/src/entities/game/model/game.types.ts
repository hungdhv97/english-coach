/**
 * Game entity types
 */

export interface GameSession {
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

export interface CreateGameSessionRequest {
  source_language_id: number;
  target_language_id: number;
  mode: 'level'; // Always 'level' now
  level_id: number; // Required
  topic_ids?: number[]; // Optional array of topic IDs (empty/null means all topics)
}

export interface CreateGameSessionResponse {
  success: boolean;
  data: GameSession;
}

export interface GameQuestion {
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

export interface GameQuestionOption {
  id: number;
  question_id: number;
  option_label: 'A' | 'B' | 'C' | 'D';
  target_word_id: number;
  is_correct: boolean;
}

export interface GameQuestionWithOptions {
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
  options: GameQuestionOption[];
}

export interface GameSessionWithQuestions {
  session: GameSession;
  questions: GameQuestionWithOptions[];
}

export interface GameAnswer {
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

