import type { Question, QuestionOption } from '@/types';
import type { FormsExamId, FormsSourceSet } from './forms-practice';

interface ImportedFormsBank {
  importedAt: string;
  questions: {
    id: string;
    sourceSetId: string;
    sourceQuestionNumber: number;
    stem: string;
    options: QuestionOption[];
    correctOptions: string[];
  }[];
}

export function createFormsQuestions(
  examId: FormsExamId,
  bank: ImportedFormsBank,
  sources: FormsSourceSet[]
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
      objectiveId: question.sourceSetId,
      difficulty: 'medium',
      stem: question.stem,
      options: question.options,
      correctOptions: question.correctOptions,
      explanation: `The source quiz marks ${answers.length > 1 ? 'these answers' : 'this answer'} as correct: ${answers.join(' | ')}. Answer key imported from ${source.title}, question ${question.sourceQuestionNumber}.`,
      references: [{ title: `${source.title} - question ${question.sourceQuestionNumber}`, url: source.url }],
      tags: [examId, 'imported-training-question', `source-question-${question.sourceQuestionNumber}`],
      status: 'published',
      lastUpdated: bank.importedAt,
    };
  });
}
