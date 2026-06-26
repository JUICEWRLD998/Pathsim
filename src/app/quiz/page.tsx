'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Sparkles, CheckCircle } from 'lucide-react';
import { QUIZ_QUESTIONS } from '@/lib/quiz-questions';
import { useQuizStore } from '@/store/quizStore';
import { callGemini } from '@/lib/api';
import type { RecommendationsResponse } from '@/types/api';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { QuizCard } from '@/components/quiz/QuizCard';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function QuizPage() {
  const router = useRouter();
  const {
    currentQuestion,
    answers,
    setAnswer,
    nextQuestion,
    prevQuestion,
    setRecommendations,
    setLoading,
    isLoading,
    error,
    setError,
  } = useQuizStore();

  const [direction, setDirection] = useState<1 | -1>(1);
  const totalQuestions = QUIZ_QUESTIONS.length;
  const question = QUIZ_QUESTIONS[currentQuestion];
  const progress = (currentQuestion / totalQuestions) * 100;

  const currentAnswer = answers.find((a) => a.questionId === question?.id);
  const hasAnswer = currentAnswer?.answer &&
    (Array.isArray(currentAnswer.answer)
      ? currentAnswer.answer.length > 0
      : currentAnswer.answer !== '');

  const isLastQuestion = currentQuestion === totalQuestions - 1;
  const allAnswered = QUIZ_QUESTIONS.every((q) =>
    answers.some((a) => a.questionId === q.id && (Array.isArray(a.answer) ? a.answer.length > 0 : a.answer !== ''))
  );

  const handleAnswer = (answer: string | string[]) => {
    setAnswer({ questionId: question.id, answer });
  };

  const handleNext = () => {
    if (!hasAnswer) return;
    setDirection(1);
    nextQuestion();
  };

  const handlePrev = () => {
    setDirection(-1);
    prevQuestion();
  };

  const handleSubmit = async () => {
    if (!allAnswered) return;
    setLoading(true);
    setError(null);

    const formatted = QUIZ_QUESTIONS.map((q) => {
      const ans = answers.find((a) => a.questionId === q.id);
      const selectedIds = Array.isArray(ans?.answer) ? ans.answer : [ans?.answer ?? ''];
      const selectedLabels = q.options
        .filter((o) => selectedIds.includes(o.id))
        .map((o) => o.label)
        .join(', ');
      return `Q: ${q.question}\nA: ${selectedLabels}`;
    }).join('\n\n');

    try {
      const data = await callGemini<RecommendationsResponse>('career_recommendation', {
        answers: formatted,
      });
      setRecommendations(data.recommendations, data.personalityProfile);
      router.push('/simulation');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Keep question in bounds
  useEffect(() => {
    if (currentQuestion >= totalQuestions) {
      // already done
    }
  }, [currentQuestion, totalQuestions]);

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center px-4 min-h-[70vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <LoadingSpinner size="lg" label="Analyzing profile with AI..." />
          <p className="mt-4 text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            We are processing your answers through Gemini to discover your top 3 recommended career simulations.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <PageWrapper className="flex flex-1 flex-col items-center justify-center px-4 py-24 relative min-h-[calc(100vh-4rem)]">
      {/* Background glow overlay */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="ambient-glow glow-purple h-[400px] w-[400px] top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.1]" />
      </div>

      <div className="w-full max-w-2xl relative z-10">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mb-3 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-purple-400">
            <Sparkles className="h-4 w-4" aria-hidden />
            Spark Quiz
          </div>
          <h1 className="font-display text-2xl font-bold text-white sm:text-3xl tracking-tight">
            Discover Your Career Match
          </h1>
          <p className="mt-2 text-xs text-slate-500 font-semibold tracking-wider uppercase">
            Question {Math.min(currentQuestion + 1, totalQuestions)} of {totalQuestions}
          </p>
        </div>

        {/* Progress bar container */}
        <div className="mb-10 bg-white/[0.02] border border-white/[0.05] rounded-2xl p-4">
          <div className="mb-2 flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>{Math.round(progress)}% complete</span>
            <span>{totalQuestions - currentQuestion - 1} remaining</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/[0.04] border border-white/[0.06]">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>

          {/* Question dot markers */}
          <div className="mt-4 flex items-center justify-center gap-2">
            {QUIZ_QUESTIONS.map((q, i) => {
              const answered = answers.some(
                (a) => a.questionId === q.id && (Array.isArray(a.answer) ? a.answer.length > 0 : a.answer !== '')
              );
              return (
                <div
                  key={q.id}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === currentQuestion
                      ? 'w-6 bg-purple-400'
                      : answered
                      ? 'w-2 bg-purple-500/50'
                      : 'w-1.5 bg-white/10'
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* Question Card Display */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentQuestion}
            custom={direction}
            variants={{
              enter: (dir: number) => ({
                opacity: 0,
                x: dir > 0 ? 30 : -30,
              }),
              center: { opacity: 1, x: 0 },
              exit: (dir: number) => ({
                opacity: 0,
                x: dir > 0 ? -30 : 30,
              }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <QuizCard
              question={question}
              selectedAnswer={currentAnswer?.answer}
              onAnswer={handleAnswer}
            />
          </motion.div>
        </AnimatePresence>

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-5 rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 text-xs font-semibold text-rose-400"
          >
            {error}
          </motion.div>
        )}

        {/* Footer Navigation */}
        <div className="mt-8 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handlePrev}
            disabled={currentQuestion === 0}
            icon={<ArrowLeft className="h-4 w-4" />}
            iconPosition="left"
          >
            Back
          </Button>

          {isLastQuestion ? (
            <motion.div
              animate={
                allAnswered
                  ? { scale: [1, 1.02, 1], transition: { repeat: Infinity, duration: 2 } }
                  : {}
              }
            >
              <Button
                onClick={handleSubmit}
                disabled={!allAnswered}
                loading={isLoading}
                icon={<CheckCircle className="h-4 w-4" />}
                iconPosition="right"
                className={allAnswered ? 'shadow-[0_0_25px_rgba(168,85,247,0.35)]' : ''}
              >
                Find My Careers
              </Button>
            </motion.div>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!hasAnswer}
              icon={<ArrowRight className="h-4 w-4" />}
              iconPosition="right"
            >
              Next Question
            </Button>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
