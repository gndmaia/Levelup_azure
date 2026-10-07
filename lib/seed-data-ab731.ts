import type { Question } from '@/types';
import bank from './ab731-question-bank.json';
import { AB731_SETS } from './ab731-metadata';

export const seedQuestionsAB731: Question[] = bank.questions.map((question) => {
  const source = AB731_SETS.find((item) => item.id === question.sourceSetId);
  if (!source) {
    throw new Error(`Unknown AB-731 source set: ${question.sourceSetId}`);
  }
  const answers = question.options
    .filter((option) => question.correctOptions.includes(option.id))
    .map((option) => option.text);
  return {
    id: question.id,
    examId: 'AB-731',
    objectiveId: question.sourceSetId,
    difficulty: 'medium',
    stem: question.stem,
    options: question.options,
    correctOptions: question.correctOptions,
    explanation: `The source quiz marks ${answers.length > 1 ? 'these answers' : 'this answer'} as correct: ${answers.join(' | ')}. Answer key imported from ${source.title}, question ${question.sourceQuestionNumber}.`,
    references: [{ title: `${source.title} - question ${question.sourceQuestionNumber}`, url: source.url }],
    tags: ['AB-731', 'imported-training-question', `source-question-${question.sourceQuestionNumber}`],
    status: 'published',
    lastUpdated: bank.importedAt,
  };
});
