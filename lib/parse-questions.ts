// Script to parse and convert questions from the external format to our format
import { Question } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// This maps the question topics to our objective IDs
const topicMapping: Record<string, string> = {
  'computer vision': 'Computer-Vision',
  'vision': 'Computer-Vision',
  'cv': 'Computer-Vision',
  'image': 'Computer-Vision',
  'ocr': 'Computer-Vision',
  'face': 'Computer-Vision',
  'custom vision': 'Custom-Vision',
  
  'nlp': 'NLP',
  'text': 'NLP',
  'language': 'NLP',
  'text analytics': 'NLP',
  
  'speech': 'Speech',
  'audio': 'Speech',
  'voice': 'Speech',
  
  'conversational': 'Conversational-AI',
  'bot': 'Conversational-AI',
  'chatbot': 'Conversational-AI',
  'qna': 'Conversational-AI',
  
  'translator': 'NLP',
  'translation': 'NLP',
  
  'form': 'Document-Intelligence',
  'document': 'Document-Intelligence',
  'receipt': 'Document-Intelligence',
  
  'responsible': 'Responsible-AI',
  'fairness': 'Responsible-AI',
  'transparency': 'Responsible-AI',
  'accountability': 'Responsible-AI',
  
  'ml': 'ML-Fundamentals',
  'machine learning': 'ML-Fundamentals',
  'model': 'ML-Fundamentals',
  'training': 'ML-Fundamentals',
  'regression': 'ML-Fundamentals',
  'classification': 'ML-Fundamentals',
  'clustering': 'ML-Fundamentals',
  
  'azure ml': 'Azure-ML',
  'aml': 'Azure-ML',
  'designer': 'Azure-ML',
  
  'anomaly': 'Anomaly-Detection',
  
  'workload': 'AI-Workloads',
  'ai': 'AI-Workloads',
};

// Determine difficulty based on question complexity
function determineDifficulty(question: string, options: string[]): 'easy' | 'medium' | 'hard' {
  const questionLength = question.length;
  const optionCount = options.length;
  
  // Multiple choice questions with more options are harder
  if (optionCount >= 5) return 'hard';
  
  // Long, complex questions
  if (questionLength > 200) return 'hard';
  if (questionLength > 120) return 'medium';
  
  return 'easy';
}

// Determine topic from question text
function determineObjective(question: string, explanation: string = ''): string {
  const text = (question + ' ' + explanation).toLowerCase();
  
  for (const [keyword, objective] of Object.entries(topicMapping)) {
    if (text.includes(keyword)) {
      return objective;
    }
  }
  
  return 'AI-Workloads'; // default
}

export function convertQuestion(rawQuestion: any): Question {
  const isMultipleChoice = rawQuestion.type === 'multiple' || Array.isArray(rawQuestion.correctAnswer);
  
  // Convert options to our format with IDs
  const options = rawQuestion.options.map((text: string, index: number) => ({
    id: String.fromCharCode(65 + index), // A, B, C, D...
    text: text
  }));
  
  // Convert correct answers to option IDs
  let correctOptions: string[];
  if (Array.isArray(rawQuestion.correctAnswer)) {
    correctOptions = rawQuestion.correctAnswer.map((answer: string) => {
      const index = rawQuestion.options.findIndex((opt: string) => opt === answer);
      return String.fromCharCode(65 + index);
    });
  } else {
    const index = rawQuestion.options.findIndex((opt: string) => opt === rawQuestion.correctAnswer);
    correctOptions = [String.fromCharCode(65 + index)];
  }
  
  const objective = determineObjective(rawQuestion.question, rawQuestion.explanation || '');
  const difficulty = determineDifficulty(rawQuestion.question, rawQuestion.options);
  
  const question: Question = {
    id: uuidv4(),
    examId: 'AI-900',
    objectiveId: objective,
    stem: rawQuestion.question,
    options: options,
    correctOptions: correctOptions,
    explanation: rawQuestion.explanation || 'No explanation provided.',
    references: rawQuestion.documentationUrl ? [{
      title: 'Microsoft Learn Documentation',
      url: rawQuestion.documentationUrl
    }] : [],
    difficulty: difficulty,
    status: 'published',
    tags: [],
    lastUpdated: new Date().toISOString()
  };
  
  return question;
}
