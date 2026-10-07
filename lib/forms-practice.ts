import { IMPORTED_PRACTICE_EXAMS } from './imported-practice';
import type { ImportedPracticeExam, ImportedSourceSet } from './imported-practice';

export type FormsExamId = 'AB-730' | 'AB-731';
export type FormsSourceSet = ImportedSourceSet;
export type FormsPracticeExam = ImportedPracticeExam;

export const FORMS_PRACTICE_EXAMS = {
  'AB-730': IMPORTED_PRACTICE_EXAMS['AB-730'],
  'AB-731': IMPORTED_PRACTICE_EXAMS['AB-731'],
};

export function getFormsPracticeExam(examId: string): FormsPracticeExam | undefined {
  if (examId === 'AB-730' || examId === 'AB-731') return FORMS_PRACTICE_EXAMS[examId];
  return undefined;
}
