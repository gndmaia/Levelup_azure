import bank from './gh300-question-bank.json';
import { IMPORTED_PRACTICE_EXAMS } from './imported-practice';
import { createImportedQuestions } from './create-imported-questions';

export const seedQuestionsGH300 = createImportedQuestions('GH-300', bank, IMPORTED_PRACTICE_EXAMS['GH-300'].sources);
