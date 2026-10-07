import ab730Sources from './ab730-sets.json';
import ab731Sources from './ab731-sets.json';

export type FormsExamId = 'AB-730' | 'AB-731';

export interface FormsSourceSet {
  id: string;
  title: string;
  questionCount: number;
  originalTitle: string;
  url: string;
  multiSelectCount: number;
}

export interface FormsPracticeExam {
  id: FormsExamId;
  title: string;
  description: string;
  certificationUrl: string;
  sources: FormsSourceSet[];
  questionCount: number;
  multiSelectCount: number;
  syllabusNotice?: string;
}

function defineExam(
  details: Omit<FormsPracticeExam, 'questionCount' | 'multiSelectCount'>
): FormsPracticeExam {
  return {
    ...details,
    questionCount: details.sources.reduce((total, source) => total + source.questionCount, 0),
    multiSelectCount: details.sources.reduce((total, source) => total + source.multiSelectCount, 0),
  };
}

export const FORMS_PRACTICE_EXAMS = {
  'AB-730': defineExam({
    id: 'AB-730',
    title: 'AI Business Professional',
    description: 'Practice Microsoft 365 Copilot, effective prompting, agents, notebooks, pages, and responsible business use of AI',
    certificationUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/ai-business-professional/',
    sources: ab730Sources,
    syllabusNotice: 'Microsoft lists an English AB-730 syllabus update for October 20, 2026. This bank preserves the supplied quizzes; compare them with the latest official study guide.',
  }),
  'AB-731': defineExam({
    id: 'AB-731',
    title: 'AI Transformation Leader',
    description: 'Practice business value, Microsoft AI capabilities, responsible AI, governance, and adoption',
    certificationUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/ai-transformation-leader/',
    sources: ab731Sources,
  }),
};

export function getFormsPracticeExam(examId: string): FormsPracticeExam | undefined {
  if (examId === 'AB-730' || examId === 'AB-731') {
    return FORMS_PRACTICE_EXAMS[examId];
  }
  return undefined;
}
