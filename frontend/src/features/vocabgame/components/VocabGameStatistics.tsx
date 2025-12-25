/**
 * Game Statistics Component
 * Displays statistics for a completed game session
 */

import type { SessionStatistics } from '@/entities/vocabgame/model/vocabgame.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface GameStatisticsProps {
  statistics: SessionStatistics;
}

export default function GameStatistics({ statistics }: GameStatisticsProps) {
  // Format duration as MM:SS
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Format response time as seconds with 2 decimal places
  const formatResponseTime = (ms: number): string => {
    if (ms === 0) return 'N/A';
    const seconds = ms / 1000;
    return `${seconds.toFixed(2)}s`;
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Thống kê phiên chơi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Accuracy Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Độ chính xác
              </span>
              <span className="text-2xl font-bold">
                {statistics.accuracy_percentage.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${statistics.accuracy_percentage}%` }}
              />
            </div>
          </div>

          {/* Questions Section */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Tổng số câu hỏi</p>
              <p className="text-2xl font-semibold">
                {statistics.total_questions}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Câu trả lời đúng</p>
              <p className="text-2xl font-semibold text-green-600">
                {statistics.correct_answers}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Câu trả lời sai</p>
              <p className="text-2xl font-semibold text-red-600">
                {statistics.wrong_answers}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Thời gian chơi</p>
              <p className="text-2xl font-semibold">
                {formatDuration(statistics.duration_seconds)}
              </p>
            </div>
          </div>

          {/* Response Time Section */}
          <div className="pt-4 border-t">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                Thời gian phản hồi trung bình
              </p>
              <p className="text-xl font-semibold">
                {formatResponseTime(statistics.average_response_time_ms)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

