import type { Difficulty, Question, QuestionOption, Reference } from '@/types';
import type { ImportedExamId, ImportedSourceSet } from './imported-practice';

export interface ImportedQuestionBank {
  importedAt: string;
  questions: {
    id: string;
    sourceSetId: string;
    sourceQuestionNumber: number;
    stem: string;
    options: QuestionOption[];
    correctOptions: string[];
    explanation?: string;
    references?: Reference[];
    difficulty?: Difficulty;
    domain?: string;
  }[];
}

export function createImportedQuestions(
  examId: ImportedExamId,
  bank: ImportedQuestionBank,
  sources: ImportedSourceSet[]
): Question[] {
  return bank.questions.map((question) => {
    const source = sources.find((item) => item.id === question.sourceSetId);
    if (!source) {
      throw new Error(`Unknown ${examId} source set: ${question.sourceSetId}`);
    }
    const answers = question.options
      .filter((option) => question.correctOptions.includes(option.id))
      .map((option) => option.text);
    if (answers.length === 0 || answers.length !== question.correctOptions.length) {
      throw new Error(`Invalid ${examId} answer key: ${question.id}`);
    }
    return {
      id: question.id,
      examId,
      objectiveId: question.domain ?? question.sourceSetId,
      difficulty: question.difficulty ?? 'medium',
      stem: question.stem,
      options: question.options,
      correctOptions: question.correctOptions,
      explanation: question.explanation ?? `The source quiz marks ${answers.length > 1 ? 'these answers' : 'this answer'} as correct: ${answers.join(' | ')}. Answer key imported from ${source.title}, question ${question.sourceQuestionNumber}.`,
      references: question.references ?? [{ title: `${source.title} - question ${question.sourceQuestionNumber}`, url: source.url }],
      textFormat: examId === 'GH-300' || examId === 'AI-200' ? 'markdown' : undefined,
      tags: [examId, 'imported-training-question', `source-question-${question.sourceQuestionNumber}`],
      status: 'published',
      lastUpdated: bank.importedAt,
    };
  });
}
