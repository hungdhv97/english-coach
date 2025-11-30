/**
 * Game Play Page Component
 * Displays questions and handles game play flow
 */

import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { gameQueries } from '@/features/game/api/game.queries';
import { useGameSession } from '@/features/game/hooks/useGameSession';
import GameQuestion from '@/features/game/components/GameQuestion';
import type { GameQuestionWithOptions } from '@/entities/game/model/game.types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
import { AlertCircle } from 'lucide-react';

export default function GamePlayPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const sessionIdNum = sessionId ? parseInt(sessionId, 10) : 0;

  const { data: sessionData, isLoading, error } = gameQueries.useSession(sessionIdNum);
  const [wordTexts, setWordTexts] = useState<Map<number, string>>(new Map());

  const {
    currentQuestionIndex,
    answers,
    submitAnswer,
    nextQuestion,
    startQuestion,
    isSubmitting,
  } = useGameSession({
    sessionId: sessionIdNum,
    onAnswerSubmitted: () => {
      // Auto-advance to next question after a short delay
      setTimeout(() => {
        if (currentQuestionIndex < (sessionData?.questions.length || 0) - 1) {
          nextQuestion();
        }
      }, 1000);
    },
    onAllQuestionsAnswered: () => {
      // Will be handled by completion check
    },
  });

  // Start tracking time when question changes
  useEffect(() => {
    if (sessionData?.questions && sessionData.questions.length > 0) {
      startQuestion();
    }
  }, [currentQuestionIndex, sessionData, startQuestion]);

  // Extract word IDs and create a simple mapping (in production, fetch actual words)
  useEffect(() => {
    if (!sessionData?.questions) return;

    const wordMap = new Map<number, string>();
    sessionData.questions.forEach((q) => {
      // For now, use word IDs as placeholders
      // In production, fetch actual word text from dictionary API
      wordMap.set(q.source_word_id, `Word ${q.source_word_id}`);
      q.options.forEach((opt) => {
        wordMap.set(opt.target_word_id, `Word ${opt.target_word_id}`);
      });
    });
    setWordTexts(wordMap);
  }, [sessionData]);

  const currentQuestion: GameQuestionWithOptions | undefined = useMemo(() => {
    if (!sessionData?.questions) return undefined;
    return sessionData.questions[currentQuestionIndex];
  }, [sessionData, currentQuestionIndex]);

  const isCompleted = useMemo(() => {
    if (!sessionData?.questions) return false;
    return answers.size >= sessionData.questions.length;
  }, [sessionData, answers]);

  const handleAnswerSelect = async (optionId: number) => {
    if (!currentQuestion || isSubmitting) return;

    try {
      await submitAnswer({
        question_id: currentQuestion.id,
        selected_option_id: optionId,
      });
    } catch (error) {
      console.error('Failed to submit answer:', error);
      // Error handling could show a toast notification here
    }
  };

  const handleViewStatistics = () => {
    navigate(`/games/vocab/statistics/${sessionId}`);
  };

  const handleBackToGames = () => {
    navigate('/games');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 space-y-4">
            <div className="flex flex-col items-center gap-4">
              <Spinner className="h-8 w-8" />
              <p className="text-muted-foreground">Đang tải câu hỏi...</p>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !sessionData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Lỗi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Không thể tải game session</AlertTitle>
              <AlertDescription>
                {error instanceof Error ? error.message : 'Đã xảy ra lỗi'}
              </AlertDescription>
            </Alert>
            <Button onClick={handleBackToGames} className="w-full">
              Quay lại danh sách game
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isCompleted) {
    const correctCount = Array.from(answers.values()).filter((a) => a.is_correct).length;
    const totalQuestions = sessionData.questions.length;
    const accuracy = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;

    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted/20">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">🎉 Hoàn Thành!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-lg bg-muted">
                <div className="text-3xl font-bold text-primary">{correctCount}</div>
                <div className="text-sm text-muted-foreground mt-1">Câu đúng</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted">
                <div className="text-3xl font-bold text-primary">{totalQuestions}</div>
                <div className="text-sm text-muted-foreground mt-1">Tổng câu hỏi</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted">
                <div className="text-3xl font-bold text-primary">{accuracy.toFixed(0)}%</div>
                <div className="text-sm text-muted-foreground mt-1">Độ chính xác</div>
              </div>
            </div>
            <div className="flex gap-4 justify-center">
              <Button onClick={handleViewStatistics} size="lg">
                Xem Thống Kê
              </Button>
              <Button onClick={handleBackToGames} variant="outline" size="lg">
                Quay lại danh sách game
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Lỗi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Không tìm thấy câu hỏi</AlertTitle>
            </Alert>
            <Button onClick={handleBackToGames} className="w-full">
              Quay lại danh sách game
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const sourceWordText = wordTexts.get(currentQuestion.source_word_id) || `Word ${currentQuestion.source_word_id}`;
  const selectedAnswer = answers.get(currentQuestion.id);
  const selectedOptionId = selectedAnswer?.selected_option_id;

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-background to-muted/20">
      <div className="max-w-3xl mx-auto space-y-6">
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Câu hỏi {currentQuestionIndex + 1} / {sessionData.questions.length}</span>
                <span>{Math.round(((currentQuestionIndex + 1) / sessionData.questions.length) * 100)}%</span>
              </div>
              <Progress value={((currentQuestionIndex + 1) / sessionData.questions.length) * 100} />
            </div>
          </CardContent>
        </Card>

        {isSubmitting && (
          <Alert>
            <Spinner className="h-4 w-4" />
            <AlertDescription>Đang gửi câu trả lời...</AlertDescription>
          </Alert>
        )}

        <GameQuestion
          question={currentQuestion}
          sourceWord={sourceWordText}
          targetWords={wordTexts}
          onAnswerSelect={handleAnswerSelect}
          isSubmitting={isSubmitting}
          selectedOptionId={selectedOptionId}
          totalQuestions={sessionData.questions.length}
        />
      </div>
    </div>
  );
}

