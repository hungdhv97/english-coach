/**
 * Game Statistics Page Component
 * Displays detailed statistics for a completed game session
 */

import { useParams, useNavigate } from 'react-router-dom';
import { gameQueries } from '@/features/game/api/game.queries';
import GameStatistics from '@/features/game/components/GameStatistics';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
import { AlertCircle } from 'lucide-react';

export default function GameStatisticsPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const sessionIdNum = sessionId ? parseInt(sessionId, 10) : 0;

  const {
    data: statistics,
    isLoading,
    error,
  } = gameQueries.useSessionStatistics(sessionIdNum);

  const handlePlayAgain = () => {
    navigate('/games/vocab/config');
  };

  const handleBackToGames = () => {
    navigate('/games');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardContent className="pt-6 space-y-4">
            <div className="flex flex-col items-center gap-4">
              <Spinner className="h-8 w-8" />
              <p className="text-muted-foreground">Đang tải thống kê...</p>
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

  if (error || !statistics) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Lỗi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Không thể tải thống kê</AlertTitle>
              <AlertDescription>
                {error instanceof Error ? error.message : 'Đã xảy ra lỗi'}
              </AlertDescription>
            </Alert>
            <div className="flex gap-2">
              <Button onClick={handleBackToGames} variant="outline" className="flex-1">
                Quay lại danh sách game
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-background to-muted/20">
      <div className="max-w-3xl mx-auto space-y-6">
        <GameStatistics statistics={statistics} />

        {/* Navigation Actions */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4 justify-center">
              <Button onClick={handlePlayAgain} size="lg">
                Chơi lại
              </Button>
              <Button onClick={handleBackToGames} variant="outline" size="lg">
                Quay lại danh sách game
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

