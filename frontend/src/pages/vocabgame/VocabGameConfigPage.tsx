/**
 * Game Configuration Page Component
 * Multi-step flow: Languages -> Level -> Topics
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dictionaryQueries } from '@/entities/dictionary/api/dictionary.queries';
import { vocabGameMutations } from '@/features/vocabgame/api/vocabgame.mutations';
import type { Language, Topic, Level } from '@/entities/dictionary/model/dictionary.types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, ChevronRight, ChevronLeft } from 'lucide-react';

type Step = 'languages' | 'level' | 'topics';

export default function GameConfigPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>('languages');
  
  // Step 1: Languages
  const [sourceLanguageId, setSourceLanguageId] = useState<number | ''>('');
  const [targetLanguageId, setTargetLanguageId] = useState<number | ''>('');
  
  // Step 2: Level
  const [levelId, setLevelId] = useState<number | ''>('');
  
  // Step 3: Topics
  const [selectedTopicIds, setSelectedTopicIds] = useState<Set<number>>(new Set());
  const [isAllTopicsSelected, setIsAllTopicsSelected] = useState(true);
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch reference data
  const { data: languages = [], isLoading: languagesLoading } = dictionaryQueries.useLanguages();
  const { data: topics = [], isLoading: topicsLoading } = dictionaryQueries.useTopics();
  const { data: levels = [], isLoading: levelsLoading } = dictionaryQueries.useLevels(
    sourceLanguageId ? Number(sourceLanguageId) : undefined
  );

  // Filter target languages (exclude source language)
  const availableTargetLanguages = languages.filter(
    (lang: Language) => !sourceLanguageId || lang.id !== sourceLanguageId
  );

  // Set default source language to English on initial load
  useEffect(() => {
    if (languages.length > 0 && !sourceLanguageId) {
      const englishLang = languages.find((lang: Language) => lang.code === 'en');
      if (englishLang) {
        setSourceLanguageId(englishLang.id);
      }
    }
  }, [languages, sourceLanguageId]);

  // Auto-set target language when source language changes
  // Set to first available language (excluding source)
  useEffect(() => {
    if (languages.length > 0 && sourceLanguageId) {
      const filtered = languages.filter(
        (lang: Language) => lang.id !== sourceLanguageId
      );
      if (filtered.length > 0) {
        // Always set target to first available language when source changes
        setTargetLanguageId(filtered[0].id);
      } else {
        // If no available languages, clear target
        setTargetLanguageId('');
      }
    }
  }, [languages, sourceLanguageId]);

  // Create session mutation
  const createSessionMutation = vocabGameMutations.useCreateSession();

  // Validation
  const validateLanguages = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!sourceLanguageId || !targetLanguageId) {
      newErrors.languages = 'Vui lòng chọn cả ngôn ngữ nguồn và ngôn ngữ đích';
    } else if (sourceLanguageId === targetLanguageId) {
      newErrors.languages = 'Ngôn ngữ nguồn và ngôn ngữ đích phải khác nhau';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateLevel = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!levelId) {
      newErrors.level = 'Vui lòng chọn cấp độ';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle step navigation
  const handleNextStep = (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();
    e?.stopPropagation();
    
    if (currentStep === 'languages') {
      if (validateLanguages()) {
        setCurrentStep('level');
        setErrors({});
      }
    } else if (currentStep === 'level') {
      if (validateLevel()) {
        setCurrentStep('topics');
        setErrors({});
      }
    }
  };

  const handlePreviousStep = () => {
    if (currentStep === 'level') {
      setCurrentStep('languages');
      setErrors({});
    } else if (currentStep === 'topics') {
      setCurrentStep('level');
      setErrors({});
    }
  };

  // Handle topic selection
  const handleTopicToggle = (topicId: number) => {
    const newSelected = new Set(selectedTopicIds);
    
    if (topicId === -1) {
      // "All" chip clicked
      if (isAllTopicsSelected) {
        // Deselect all
        setIsAllTopicsSelected(false);
        setSelectedTopicIds(new Set());
      } else {
        // Select all
        setIsAllTopicsSelected(true);
        setSelectedTopicIds(new Set());
      }
    } else {
      // Specific topic clicked
      if (newSelected.has(topicId)) {
        newSelected.delete(topicId);
      } else {
        newSelected.add(topicId);
      }
      
      // If any specific topic is selected, unselect "all"
      if (newSelected.size > 0) {
        setIsAllTopicsSelected(false);
      }
      
      // If all topics are selected, set "all" as selected
      if (newSelected.size === topics.length) {
        setIsAllTopicsSelected(true);
        setSelectedTopicIds(new Set());
      } else {
        setSelectedTopicIds(newSelected);
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Prepare topic_ids: empty array or undefined means "all topics"
      const topicIds = isAllTopicsSelected || selectedTopicIds.size === 0 
        ? undefined 
        : Array.from(selectedTopicIds);

      const session = await createSessionMutation.mutateAsync({
        source_language_id: Number(sourceLanguageId),
        target_language_id: Number(targetLanguageId),
        mode: 'level',
        level_id: Number(levelId),
        topic_ids: topicIds,
      });

      // Navigate to game play page
      navigate(`/games/vocab/play/${session.id}`);
    } catch (error: unknown) {
      const apiError = error as { code?: string; message?: string };
      if (apiError.code === 'INSUFFICIENT_WORDS') {
        setErrors({ submit: apiError.message || 'Không đủ từ vựng để tạo game session' });
      } else if (apiError.code === 'VALIDATION_ERROR') {
        setErrors({ submit: apiError.message || 'Dữ liệu không hợp lệ' });
      } else {
        setErrors({ submit: 'Không thể tạo game session. Vui lòng thử lại' });
      }
    }
  };

  // Reset level when source language changes
  useEffect(() => {
    if (currentStep === 'level' || currentStep === 'topics') {
      setLevelId('');
      setSelectedTopicIds(new Set());
      setIsAllTopicsSelected(true);
      setCurrentStep('languages');
    }
  }, [sourceLanguageId]);

  // Reset topics when level changes
  useEffect(() => {
    if (currentStep === 'topics') {
      setSelectedTopicIds(new Set());
      setIsAllTopicsSelected(true);
    }
  }, [levelId]);

  const canProceedToNextStep = () => {
    if (currentStep === 'languages') {
      return sourceLanguageId && targetLanguageId && sourceLanguageId !== targetLanguageId;
    } else if (currentStep === 'level') {
      return !!levelId;
    }
    return false;
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-background to-muted/20">
      <div className="max-w-2xl mx-auto space-y-6">
        <header className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Cấu Hình Game</h1>
          <p className="text-muted-foreground text-lg">
            {currentStep === 'languages' && 'Chọn ngôn ngữ nguồn và ngôn ngữ đích'}
            {currentStep === 'level' && 'Chọn cấp độ'}
            {currentStep === 'topics' && 'Chọn chủ đề (tùy chọn)'}
          </p>
        </header>

        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className={`h-2 w-16 rounded-full ${currentStep === 'languages' ? 'bg-primary' : 'bg-primary/30'}`} />
          <div className={`h-2 w-16 rounded-full ${currentStep === 'level' ? 'bg-primary' : currentStep === 'topics' ? 'bg-primary/30' : 'bg-muted'}`} />
          <div className={`h-2 w-16 rounded-full ${currentStep === 'topics' ? 'bg-primary' : 'bg-muted'}`} />
        </div>

        <main>
          <form onSubmit={currentStep === 'topics' ? handleSubmit : (e) => e.preventDefault()}>
            {/* Step 1: Language Selection */}
            {currentStep === 'languages' && (
              <Card>
                <CardHeader>
                  <CardTitle>Ngôn Ngữ</CardTitle>
                  <CardDescription>Chọn ngôn ngữ nguồn và ngôn ngữ đích</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="source-language">Ngôn Ngữ Nguồn</Label>
                      <Select
                        value={sourceLanguageId ? String(sourceLanguageId) : undefined}
                        onValueChange={(value) => setSourceLanguageId(value ? Number(value) : '')}
                        disabled={languagesLoading}
                        required
                      >
                        <SelectTrigger id="source-language" className={errors.languages ? 'border-destructive' : ''}>
                          <SelectValue placeholder="Chọn ngôn ngữ nguồn" />
                        </SelectTrigger>
                        <SelectContent>
                          {languages.map((lang: Language) => (
                            <SelectItem key={lang.id} value={String(lang.id)}>
                              {lang.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="target-language">Ngôn Ngữ Đích</Label>
                      <Select
                        value={targetLanguageId ? String(targetLanguageId) : undefined}
                        onValueChange={(value) => setTargetLanguageId(value ? Number(value) : '')}
                        disabled={languagesLoading || !sourceLanguageId}
                        required
                      >
                        <SelectTrigger id="target-language" className={errors.languages ? 'border-destructive' : ''}>
                          <SelectValue placeholder={!sourceLanguageId ? "Chọn ngôn ngữ nguồn trước" : "Chọn ngôn ngữ đích"} />
                        </SelectTrigger>
                        <SelectContent>
                          {availableTargetLanguages.map((lang: Language) => (
                            <SelectItem key={lang.id} value={String(lang.id)}>
                              {lang.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {errors.languages && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{errors.languages}</AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Step 2: Level Selection */}
            {currentStep === 'level' && (
              <Card>
                <CardHeader>
                  <CardTitle>Chọn Cấp Độ</CardTitle>
                  <CardDescription>Chọn cấp độ bạn muốn học</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Cấp Độ (Bắt buộc)</Label>
                    <RadioGroup
                      value={levelId ? String(levelId) : undefined}
                      onValueChange={(value) => setLevelId(value ? Number(value) : '')}
                    >
                      <div className="space-y-3">
                        {levelsLoading ? (
                          <div className="text-muted-foreground">Đang tải...</div>
                        ) : levels.length === 0 ? (
                          <div className="text-muted-foreground">Không có cấp độ nào. Vui lòng chọn ngôn ngữ nguồn trước.</div>
                        ) : (
                          levels.map((level: Level) => (
                            <div key={level.id} className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors">
                              <RadioGroupItem value={String(level.id)} id={`level-${level.id}`} />
                              <Label htmlFor={`level-${level.id}`} className="flex-1 cursor-pointer">
                                <div className="font-medium">{level.name}</div>
                                {level.description && (
                                  <div className="text-sm text-muted-foreground">{level.description}</div>
                                )}
                              </Label>
                            </div>
                          ))
                        )}
                      </div>
                    </RadioGroup>
                  </div>
                  {errors.level && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{errors.level}</AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Step 3: Topic Selection */}
            {currentStep === 'topics' && (
              <Card>
                <CardHeader>
                  <CardTitle>Chọn Chủ Đề</CardTitle>
                  <CardDescription>Chọn một hoặc nhiều chủ đề (mặc định: Tất cả)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {topicsLoading ? (
                      <div className="text-muted-foreground">Đang tải...</div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {/* "All" chip */}
                        <Badge
                          variant={isAllTopicsSelected ? 'default' : 'outline'}
                          className="cursor-pointer px-4 py-2 text-sm font-medium transition-colors hover:bg-primary/90"
                          onClick={() => handleTopicToggle(-1)}
                        >
                          Tất Cả
                        </Badge>
                        
                        {/* Topic chips */}
                        {topics.map((topic: Topic) => {
                          const isSelected = selectedTopicIds.has(topic.id);
                          return (
                            <Badge
                              key={topic.id}
                              variant={isSelected ? 'default' : 'outline'}
                              className="cursor-pointer px-4 py-2 text-sm font-medium transition-colors hover:bg-primary/90"
                              onClick={() => handleTopicToggle(topic.id)}
                            >
                              {topic.name}
                            </Badge>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {isAllTopicsSelected || selectedTopicIds.size === 0
                      ? 'Đã chọn: Tất cả chủ đề'
                      : `Đã chọn: ${selectedTopicIds.size} chủ đề`}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Submit Error */}
            {errors.submit && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Lỗi</AlertTitle>
                <AlertDescription>{errors.submit}</AlertDescription>
              </Alert>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 justify-between mt-6">
              <div>
                {currentStep !== 'languages' && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePreviousStep}
                    disabled={createSessionMutation.isPending}
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Quay Lại
                  </Button>
                )}
                {currentStep === 'languages' && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/games')}
                  >
                    Quay Lại
                  </Button>
                )}
              </div>
              
              <div className="flex gap-2">
                {currentStep !== 'topics' ? (
                  <Button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleNextStep(e);
                    }}
                    disabled={!canProceedToNextStep() || createSessionMutation.isPending}
                  >
                    Tiếp Tục
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={createSessionMutation.isPending}
                  >
                    {createSessionMutation.isPending ? 'Đang tạo...' : 'Bắt Đầu Chơi'}
                  </Button>
                )}
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
