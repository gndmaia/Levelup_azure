import { seedQuestions } from './seed-data';
import { seedQuestionsAZ900 } from './seed-data-az900';
import { seedQuestionsAB730 } from './seed-data-ab730';
import { seedQuestionsAB731 } from './seed-data-ab731';
import { seedQuestionsGH300 } from './seed-data-gh300';

export function getSeedQuestionsForExam(examId: string) {
  if (examId === 'GH-300') return seedQuestionsGH300;
  if (examId === 'AB-730') return seedQuestionsAB730;
  if (examId === 'AB-731') return seedQuestionsAB731;
  if (examId === 'AZ-900') return seedQuestionsAZ900;
  return seedQuestions;
}
