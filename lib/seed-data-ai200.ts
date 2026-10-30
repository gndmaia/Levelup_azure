import data from './ai200-question-bank.json';
import { createImportedQuestions } from './create-imported-questions';
import { IMPORTED_PRACTICE_EXAMS } from './imported-practice';
import type { ImportedQuestionBank } from './create-imported-questions';
import type { Difficulty } from '@/types';

function isDifficulty(value: string): value is Difficulty {
  return value === 'easy' || value === 'medium' || value === 'hard';
}

const bank: ImportedQuestionBank = {
  importedAt: data.importedAt,
  questions: data.questions.map((question) => {
    if (!isDifficulty(question.difficulty)) {
      throw new Error(`Invalid AI-200 difficulty: ${question.id}`);
    }
    return {
      ...question,
      difficulty: question.difficulty,
      references: [{
        title: `Official AI-200 certification and study guide (question imported from ${question.sourceFilename}, ${question.sourceId})`,
        url: IMPORTED_PRACTICE_EXAMS['AI-200'].certificationUrl,
      }],
    };
  }),
};

export const seedQuestionsAI200 = createImportedQuestions('AI-200', bank, IMPORTED_PRACTICE_EXAMS['AI-200'].sources);
