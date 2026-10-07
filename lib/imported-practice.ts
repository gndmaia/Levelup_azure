import ab730Sources from './ab730-sets.json';
import ab731Sources from './ab731-sets.json';
import gh300Sources from './gh300-sets.json';

export type ImportedExamId = 'AB-730' | 'AB-731' | 'GH-300';

export interface ImportedSourceSet {
  id: string;
  title: string;
  questionCount: number;
  originalTitle: string;
  url: string;
  multiSelectCount: number;
}

export interface ImportedPracticeExam {
  id: ImportedExamId;
  title: string;
  description: string;
  certificationUrl: string;
  sources: ImportedSourceSet[];
  questionCount: number;
  multiSelectCount: number;
  syllabusNotice?: string;
  sourceKind: 'forms' | 'markdown';
  timeLimitSec: number;
  timedQuestionCount: number;
}

function defineExam(
  details: Omit<ImportedPracticeExam, 'questionCount' | 'multiSelectCount'>
): ImportedPracticeExam {
  return {
    ...details,
    questionCount: details.sources.reduce((total, source) => total + source.questionCount, 0),
    multiSelectCount: details.sources.reduce((total, source) => total + source.multiSelectCount, 0),
  };
}

export const IMPORTED_PRACTICE_EXAMS = {
  'AB-730': defineExam({
    id: 'AB-730',
    title: 'AI Business Professional',
    description: 'Practice Microsoft 365 Copilot, effective prompting, agents, notebooks, pages, and responsible business use of AI',
    certificationUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/ai-business-professional/',
    sources: ab730Sources,
    sourceKind: 'forms',
    timeLimitSec: 2700,
    timedQuestionCount: 60,
    syllabusNotice: 'Microsoft lists an English AB-730 syllabus update for October 20, 2026. This bank preserves the supplied quizzes; compare them with the latest official study guide.',
  }),
  'AB-731': defineExam({
    id: 'AB-731',
    title: 'AI Transformation Leader',
    description: 'Practice business value, Microsoft AI capabilities, responsible AI, governance, and adoption',
    certificationUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/ai-transformation-leader/',
    sources: ab731Sources,
    sourceKind: 'forms',
    timeLimitSec: 2700,
    timedQuestionCount: 60,
  }),
  'GH-300': defineExam({
    id: 'GH-300',
    title: 'GitHub Copilot',
    description: 'Practice responsible AI, Copilot features, prompting, context, development workflows, privacy, and governance',
    certificationUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/github-copilot/',
    sources: gh300Sources,
    sourceKind: 'markdown',
    timeLimitSec: 6000,
    timedQuestionCount: 60,
    syllabusNotice: 'The supplied detailed files contain 255 questions, not the 300 advertised in the source README. Tests 07 and 08 contain only 10 and 5 questions. Missing entries and raw-file duplicates are not added.',
  }),
};

export function getImportedPracticeExam(examId: string): ImportedPracticeExam | undefined {
  if (examId === 'AB-730' || examId === 'AB-731' || examId === 'GH-300') {
    return IMPORTED_PRACTICE_EXAMS[examId];
  }
  return undefined;
}
