/**
 * Game Question Component
 * Displays a question with 4 multiple-choice options (A, B, C, D)
 */

import { useState, useEffect } from 'react';
import type { GameQuestionWithOptions } from '@/entities/game/model/game.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface GameQuestionProps {
  question: GameQuestionWithOptions;
  sourceWord: string; // The word to display (fetched separately)
  targetWords: Map<number, string>; // Map of word_id -> word text
  onAnswerSelect: (optionId: number) => void;
  isSubmitting?: boolean;
  selectedOptionId?: number;
  totalQuestions?: number;
}

export default function GameQuestion({
  question,
  sourceWord,
  targetWords,
  onAnswerSelect,
  isSubmitting = false,
  selectedOptionId,
  totalQuestions,
}: GameQuestionProps) {
  const [localSelected, setLocalSelected] = useState<number | null>(selectedOptionId || null);

  useEffect(() => {
    setLocalSelected(selectedOptionId || null);
  }, [selectedOptionId, question.id]);

  const handleOptionClick = (optionId: number) => {
    if (isSubmitting || localSelected !== null) {
      return; // Prevent multiple selections
    }
    setLocalSelected(optionId);
    onAnswerSelect(optionId);
  };

  // Sort options by label (A, B, C, D)
  const sortedOptions = [...question.options].sort((a, b) =>
    a.option_label.localeCompare(b.option_label)
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center text-2xl">{sourceWord}</CardTitle>
        <p className="text-center text-muted-foreground">
          Chọn từ đúng trong ngôn ngữ đích
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {sortedOptions.map((option) => {
          const wordText = targetWords.get(option.target_word_id) || '...';
          const isSelected = localSelected === option.id;
          const isDisabled = isSubmitting || localSelected !== null;

          return (
            <Button
              key={option.id}
              variant={isSelected ? 'default' : 'outline'}
              className={cn(
                'w-full h-auto py-6 justify-start text-left',
                isSelected && 'bg-primary text-primary-foreground',
                isDisabled && 'cursor-not-allowed opacity-50'
              )}
              onClick={() => handleOptionClick(option.id)}
              disabled={isDisabled}
              aria-label={`Option ${option.option_label}: ${wordText}`}
            >
              <span className="font-semibold mr-3 min-w-[2rem] text-center">
                {option.option_label}.
              </span>
              <span>{wordText}</span>
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
}

