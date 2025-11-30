/**
 * Dictionary entity types
 */

export interface Language {
  id: number;
  code: string;
  name: string;
  native_name?: string;
}

export interface Topic {
  id: number;
  code: string;
  name: string;
}

export interface Level {
  id: number;
  code: string;
  name: string;
  description?: string;
  language_id?: number;
  difficulty_order?: number;
}

