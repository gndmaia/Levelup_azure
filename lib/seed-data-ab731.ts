import bank from './ab731-question-bank.json';
import { AB731_SETS } from './ab731-metadata';
import { createFormsQuestions } from './create-forms-questions';

export const seedQuestionsAB731 = createFormsQuestions('AB-731', bank, AB731_SETS);
