// Question selection algorithms for Practice and Exam modes

import { Question, SessionMode } from "@/types";
import { dataStore } from "./data-store";

// Fisher-Yates shuffle
function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Get recent question IDs for a user to avoid repetition
function getRecentQuestions(userId: string, limit: number = 20): Set<string> {
  const sessions = dataStore.getUserSessions(userId);
  const recentQuestions = new Set<string>();
  
  for (const session of sessions) {
    for (const qId of session.questionIds) {
      recentQuestions.add(qId);
      if (recentQuestions.size >= limit) break;
    }
    if (recentQuestions.size >= limit) break;
  }
  
  return recentQuestions;
}

interface ExamConfig {
  totalQuestions: number;
  easyPercentage: number;
  mediumPercentage: number;
  hardPercentage: number;
}

const DEFAULT_EXAM_CONFIG: ExamConfig = {
  totalQuestions: 45,
  easyPercentage: 0.4,
  mediumPercentage: 0.4,
  hardPercentage: 0.2,
};

/**
 * Select questions for Exam Mode with stratified sampling
 * - Balanced by objective
 * - Difficulty mix: ~40% easy, 40% medium, 20% hard
 */
export function selectExamQuestions(
  examId: string = "AI-900",
  config: ExamConfig = DEFAULT_EXAM_CONFIG
): Question[] {
  const allQuestions = dataStore.getPublishedQuestions(examId);
  
  if (allQuestions.length === 0) {
    return [];
  }

  // Group by objective
  const byObjective = new Map<string, Question[]>();
  allQuestions.forEach((q) => {
    if (!byObjective.has(q.objectiveId)) {
      byObjective.set(q.objectiveId, []);
    }
    byObjective.get(q.objectiveId)!.push(q);
  });

  const objectives = Array.from(byObjective.keys());
  const questionsPerObjective = Math.ceil(config.totalQuestions / objectives.length);

  const selected: Question[] = [];

  // For each objective, select questions with difficulty distribution
  for (const [objectiveId, questions] of byObjective.entries()) {
    const easy = questions.filter((q) => q.difficulty === "easy");
    const medium = questions.filter((q) => q.difficulty === "medium");
    const hard = questions.filter((q) => q.difficulty === "hard");

    const targetEasy = Math.round(questionsPerObjective * config.easyPercentage);
    const targetMedium = Math.round(questionsPerObjective * config.mediumPercentage);
    const targetHard = Math.round(questionsPerObjective * config.hardPercentage);

    const selectedEasy = shuffle(easy).slice(0, Math.min(targetEasy, easy.length));
    const selectedMedium = shuffle(medium).slice(0, Math.min(targetMedium, medium.length));
    const selectedHard = shuffle(hard).slice(0, Math.min(targetHard, hard.length));

    selected.push(...selectedEasy, ...selectedMedium, ...selectedHard);
  }

  // If we don't have enough, pad with random questions
  if (selected.length < config.totalQuestions) {
    const remaining = allQuestions.filter((q) => !selected.find((s) => s.id === q.id));
    const needed = config.totalQuestions - selected.length;
    selected.push(...shuffle(remaining).slice(0, needed));
  }

  // Shuffle the final selection and trim to exact count
  return shuffle(selected).slice(0, config.totalQuestions);
}

/**
 * Select questions for Practice Mode
 * - User can filter by objectives
 * - Avoids recent questions (last 20)
 * - Light difficulty balance
 */
export function selectPracticeQuestions(
  userId: string,
  objectiveIds?: string[],
  count: number = 10,
  examId: string = "AI-900"
): Question[] {
  let pool: Question[];

  if (objectiveIds && objectiveIds.length > 0) {
    // Filter by selected objectives
    pool = [];
    for (const objId of objectiveIds) {
      pool.push(...dataStore.getQuestionsByObjective(objId, examId));
    }
  } else {
    // Mixed mode - all published questions
    pool = dataStore.getPublishedQuestions(examId);
  }

  if (pool.length === 0) {
    return [];
  }

  // Avoid recent questions
  const recentQuestions = getRecentQuestions(userId, 20);
  const freshPool = pool.filter((q) => !recentQuestions.has(q.id));

  // If we filtered out too many, add some back
  const availablePool = freshPool.length > count ? freshPool : pool;

  // Light difficulty balance for practice
  const easy = availablePool.filter((q) => q.difficulty === "easy");
  const medium = availablePool.filter((q) => q.difficulty === "medium");
  const hard = availablePool.filter((q) => q.difficulty === "hard");

  const selected: Question[] = [];
  const targetEasy = Math.ceil(count * 0.4);
  const targetMedium = Math.ceil(count * 0.4);
  const targetHard = Math.ceil(count * 0.2);

  selected.push(...shuffle(easy).slice(0, Math.min(targetEasy, easy.length)));
  selected.push(...shuffle(medium).slice(0, Math.min(targetMedium, medium.length)));
  selected.push(...shuffle(hard).slice(0, Math.min(targetHard, hard.length)));

  // Fill remaining with random
  if (selected.length < count) {
    const remaining = availablePool.filter((q) => !selected.find((s) => s.id === q.id));
    selected.push(...shuffle(remaining).slice(0, count - selected.length));
  }

  return shuffle(selected).slice(0, count);
}

/**
 * Get all unique objectives for an exam
 */
export function getExamObjectives(examId: string = "AI-900"): string[] {
  const questions = dataStore.getPublishedQuestions(examId);
  const objectives = new Set(questions.map((q) => q.objectiveId));
  return Array.from(objectives).sort();
}
