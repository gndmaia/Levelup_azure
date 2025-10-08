// Data models for LevelUp Azure

export type ExamId = "AI-900" | "DP-900" | "AZ-104"; // Extensible for future exams

export type Difficulty = "easy" | "medium" | "hard";

export type QuestionStatus = "draft" | "published";

export type SessionMode = "practice" | "exam";

export type UserRole = "user" | "admin";

export interface QuestionOption {
  id: string; // "A", "B", "C", "D", etc.
  text: string;
}

export interface Reference {
  title: string;
  url: string;
}

export interface Question {
  id: string; // uuid
  examId: ExamId;
  objectiveId: string; // e.g., "AI-Workloads", "Computer-Vision"
  difficulty: Difficulty;
  stem: string; // supports simple markdown
  options: QuestionOption[];
  correctOptions: string[]; // Array of correct option IDs (supports multi-select)
  explanation: string;
  references: Reference[];
  tags: string[];
  status: QuestionStatus;
  lastUpdated: string; // ISO date string
}

export interface Session {
  id: string;
  userId: string;
  mode: SessionMode;
  startedAt: string; // ISO date string
  completedAt?: string; // ISO date string
  timeLimitSec?: number; // exam only
  score?: number; // 0-100, set on submit
  questionIds: string[];
  answers: Record<string, string[]>; // questionId -> selected option IDs
  flaggedQuestions?: string[]; // exam mode
  bookmarkedQuestions?: string[]; // practice mode
  perCategoryAccuracy?: Record<string, { correct: number; total: number }>;
}

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: string; // ISO date string
  role: UserRole;
}

export interface SessionConfig {
  mode: SessionMode;
  objectiveIds?: string[]; // For practice mode; undefined = mixed
  questionCount?: number; // For exam mode
  timeLimitSec?: number; // For exam mode
}

export interface SessionSummary {
  sessionId: string;
  mode: SessionMode;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeTakenSec?: number;
  perCategoryAccuracy: Record<string, { correct: number; total: number; percentage: number }>;
  completedAt: string;
}

export interface QuestionWithFeedback extends Question {
  isCorrect?: boolean;
  userAnswer?: string[];
}

export interface ImportValidationResult {
  success: boolean;
  imported: number;
  errors: Array<{ row: number; message: string }>;
  warnings: Array<{ row: number; message: string }>;
}

export interface CoverageReport {
  examId: ExamId;
  objectives: Array<{
    objectiveId: string;
    published: number;
    draft: number;
    total: number;
  }>;
  totalPublished: number;
  totalDraft: number;
}

// Auth types
export interface AuthResponse {
  success: boolean;
  user?: Omit<User, "passwordHash">;
  error?: string;
}

export interface SessionResponse {
  success: boolean;
  session?: Session;
  error?: string;
}

export interface QuestionResponse {
  question?: Question;
  feedback?: {
    isCorrect: boolean;
    explanation: string;
    references: Reference[];
    correctOptions: string[];
  };
  error?: string;
}
