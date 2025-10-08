// Scoring and session summary utilities

import { Session, SessionSummary, Question } from "@/types";
import { dataStore } from "./data-store";

/**
 * Check if a user's answer is correct
 * For multi-select, all correct options must be chosen (no partial credit in MVP)
 */
export function isAnswerCorrect(question: Question, userAnswer: string[]): boolean {
  if (!userAnswer || userAnswer.length === 0) return false;
  
  const correctSet = new Set(question.correctOptions);
  const userSet = new Set(userAnswer);
  
  if (correctSet.size !== userSet.size) return false;
  
  for (const option of correctSet) {
    if (!userSet.has(option)) return false;
  }
  
  return true;
}

/**
 * Calculate session score and per-category accuracy
 */
export function calculateSessionSummary(session: Session): SessionSummary {
  const questions = session.questionIds
    .map((id) => dataStore.getQuestion(id))
    .filter((q): q is Question => q !== undefined);

  let correctCount = 0;
  const categoryStats = new Map<string, { correct: number; total: number }>();

  questions.forEach((question) => {
    const userAnswer = session.answers[question.id] || [];
    const correct = isAnswerCorrect(question, userAnswer);

    if (correct) correctCount++;

    // Track per-category stats
    if (!categoryStats.has(question.objectiveId)) {
      categoryStats.set(question.objectiveId, { correct: 0, total: 0 });
    }
    const stats = categoryStats.get(question.objectiveId)!;
    stats.total++;
    if (correct) stats.correct++;
  });

  const score = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;

  const perCategoryAccuracy: Record<string, { correct: number; total: number; percentage: number }> = {};
  categoryStats.forEach((stats, category) => {
    perCategoryAccuracy[category] = {
      correct: stats.correct,
      total: stats.total,
      percentage: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
    };
  });

  // Calculate time taken
  let timeTakenSec: number | undefined;
  if (session.completedAt && session.startedAt) {
    const start = new Date(session.startedAt).getTime();
    const end = new Date(session.completedAt).getTime();
    timeTakenSec = Math.round((end - start) / 1000);
  }

  return {
    sessionId: session.id,
    mode: session.mode,
    score,
    totalQuestions: questions.length,
    correctAnswers: correctCount,
    timeTakenSec,
    perCategoryAccuracy,
    completedAt: session.completedAt || new Date().toISOString(),
  };
}

/**
 * Format time in MM:SS format
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

/**
 * Format category name for display
 */
export function formatCategoryName(categoryId: string): string {
  return categoryId
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
