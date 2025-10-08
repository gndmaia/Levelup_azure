import { Question } from '@/types';
import { v4 as uuidv4 } from 'uuid';

function determineObjective(question: string, explanation: string = ''): string {
  const text = (question + ' ' + explanation).toLowerCase();
  if (text.includes('computer vision') || text.includes(' image') || text.includes('face') || text.includes('ocr') || text.includes('celebrities') || text.includes('landmarks')) return 'Computer-Vision';
  if (text.includes('custom vision')) return 'Custom-Vision';
  if (text.includes('speech') || text.includes('audio') || text.includes('voice') || text.includes('text-to-speech') || text.includes('speech-to-text')) return 'Speech';
  if (text.includes('text analytics') || text.includes('sentiment') || text.includes('key phrase') || text.includes('entity recognition')) return 'NLP';
  if (text.includes('translator') || text.includes('translation') || text.includes('language')) return 'NLP';
  if (text.includes('conversational') || text.includes(' bot') || text.includes('qna') || text.includes('luis') || text.includes('chatbot')) return 'Conversational-AI';
  if (text.includes('form recognizer') || text.includes('document') || text.includes('receipt')) return 'Document-Intelligence';
  if (text.includes('responsible') || text.includes('fairness') || text.includes('transparency') || text.includes('accountability') || text.includes('privacy') || text.includes('inclusiveness')) return 'Responsible-AI';
  if (text.includes('regression') || text.includes('classification') || text.includes('clustering') || text.includes('precision') || text.includes('recall') || text.includes('confusion matrix') || text.includes('supervised') || text.includes('unsupervised')) return 'ML-Fundamentals';
  if (text.includes('azure ml') || text.includes('designer') || text.includes('aml') || text.includes('split data') || text.includes('train model')) return 'Azure-ML';
  if (text.includes('anomaly')) return 'Anomaly-Detection';
  return 'AI-Workloads';
}

function determineDifficulty(question: string, options: string[]): 'easy' | 'medium' | 'hard' {
  if (options.length >= 5 || question.length > 200) return 'hard';
  if (question.length > 120) return 'medium';
  return 'easy';
}

function convertQuestion(raw: any): Question {
  const options = raw.options.map((text: string, index: number) => ({
    id: String.fromCharCode(65 + index),
    text: text
  }));
  
  let correctOptions: string[];
  if (Array.isArray(raw.correctAnswer)) {
    correctOptions = raw.correctAnswer.map((answer: string) => {
      const index = raw.options.findIndex((opt: string) => opt === answer);
      return index >= 0 ? String.fromCharCode(65 + index) : 'A';
    });
  } else {
    const index = raw.options.findIndex((opt: string) => opt === raw.correctAnswer);
    correctOptions = [index >= 0 ? String.fromCharCode(65 + index) : 'A'];
  }
  
  return {
    id: uuidv4(),
    examId: 'AI-900',
    objectiveId: determineObjective(raw.question, raw.explanation || ''),
    stem: raw.question,
    options: options,
    correctOptions: correctOptions,
    explanation: raw.explanation || 'No explanation provided.',
    references: raw.documentationUrl ? [{ title: 'Microsoft Documentation', url: raw.documentationUrl }] : [],
    difficulty: determineDifficulty(raw.question, raw.options),
    status: 'published',
    tags: [],
    lastUpdated: new Date().toISOString()
  };
}

// NOTE: This file contains 200+ questions. You can adjust the sample size for testing.
export const seedQuestions: Question[] = [
  // Question batch will be added dynamically
].map(convertQuestion);
