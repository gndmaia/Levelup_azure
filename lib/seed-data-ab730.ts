import bank from './ab730-question-bank.json';
import { FORMS_PRACTICE_EXAMS } from './forms-practice';
import { createFormsQuestions } from './create-forms-questions';

export const seedQuestionsAB730 = createFormsQuestions('AB-730', bank, FORMS_PRACTICE_EXAMS['AB-730'].sources);
