import { Question } from './types';
import { v4 as uuidv4 } from 'uuid';

// Raw questions from the external file
const rawQuestions = [
  {
    id: "q1_mc",
    question: "Which two specialized domain models are supported by Azure AI Vision when categorizing an image?",
    options: ["celebrities", "image types", "landmarks", "people", "people group"],
    correctAnswer: ["celebrities", "landmarks"],
    type: "multiple",
    explanation: "When categorizing an image, the Azure AI Vision service supports two specialized domain models: celebrities and landmarks. Image types is an additional capability of the computer vision service, allowing it to detect the type of image, such as a clip art image or a line drawing. Both people_ and people_group are supported categories when performing image classification.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q2",
    question: "You are developing a model to predict events by using classification. You have a confusion matrix for the model. What is precision?",
    options: [
      "True Positives / (True Positives + False Positives)",
      "True Positives / (True Positives + False Negatives)",
      "True Negatives / (True Negatives + False Positives)",
      "True Negatives / (True Negatives + False Negatives)"
    ],
    correctAnswer: "True Positives / (True Positives + False Positives)",
    type: "single",
    explanation: "Precision measures the accuracy of positive predictions. It's calculated as True Positives divided by (True Positives + False Positives).",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/machine-learning/how-to-understand-automated-ml"
  },
  {
    id: "q3",
    question: "You build a machine learning model by using the automated machine learning user interface (UI). You need to ensure that the model meets the Microsoft transparency principle for responsible AI. What should you do?",
    options: [
      "Set Validation type to Auto.",
      "Enable Explain best model.",
      "Set Primary metric to accuracy.",
      "Set Max concurrent iterations to 0."
    ],
    correctAnswer: "Enable Explain best model.",
    type: "single",
    explanation: "Enabling 'Explain best model' provides model interpretability, which supports the transparency principle by helping users understand how the model makes decisions.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/machine-learning/how-to-machine-learning-interpretability-automl"
  },
  {
    id: "q4",
    question: "Which Azure service should you use to find the intent of a text message?",
    options: [
      "Translator Text",
      "Language Understanding (LUIS)",
      "QnA Maker",
      "Speech"
    ],
    correctAnswer: "Language Understanding (LUIS)",
    type: "single",
    explanation: "Language Understanding (LUIS) is designed to understand the intent and entities in natural language text, making it ideal for finding intent in text messages.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/luis/what-is-luis"
  },
  {
    id: "q4_mc",
    question: "Which of the following are examples of Azure AI Services? (Select all that apply)",
    options: [
      "Computer Vision",
      "Speech Services",
      "Azure SQL Database",
      "Text Analytics"
    ],
    correctAnswer: ["Computer Vision", "Speech Services", "Text Analytics"],
    type: "multiple",
    explanation: "Computer Vision, Speech Services, and Text Analytics are all Azure AI Services. Azure SQL Database is not an AI service.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q4_mc2",
    question: "What are the key components of responsible AI? (Select all that apply)",
    options: [
      "Fairness",
      "Transparency",
      "Accountability",
      "Speed"
    ],
    correctAnswer: ["Fairness", "Transparency", "Accountability"],
    type: "multiple",
    explanation: "The key principles of responsible AI include Fairness, Transparency, Accountability, along with Reliability & Safety, Privacy & Security, and Inclusiveness. Speed is not a core responsible AI principle.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/machine-learning/concept-responsible-ai"
  }
];

// Helper function to determine objective from question content
function determineObjective(question: string, explanation: string = ''): string {
  const text = (question + ' ' + explanation).toLowerCase();
  
  if (text.includes('computer vision') || text.includes('image') || text.includes('face') || text.includes('ocr')) return 'Computer-Vision';
  if (text.includes('custom vision')) return 'Custom-Vision';
  if (text.includes('speech') || text.includes('audio') || text.includes('voice')) return 'Speech';
  if (text.includes('text analytics') || text.includes('language') || text.includes('nlp') || text.includes('sentiment')) return 'NLP';
  if (text.includes('translator') || text.includes('translation')) return 'NLP';
  if (text.includes('conversational') || text.includes('bot') || text.includes('qna') || text.includes('luis')) return 'Conversational-AI';
  if (text.includes('form recognizer') || text.includes('document') || text.includes('receipt')) return 'Document-Intelligence';
  if (text.includes('responsible') || text.includes('fairness') || text.includes('transparency') || text.includes('accountability')) return 'Responsible-AI';
  if (text.includes('regression') || text.includes('classification') || text.includes('clustering') || text.includes('model') || text.includes('training')) return 'ML-Fundamentals';
  if (text.includes('azure ml') || text.includes('designer') || text.includes('aml')) return 'Azure-ML';
  if (text.includes('anomaly')) return 'Anomaly-Detection';
  
  return 'AI-Workloads';
}

// Helper function to determine difficulty
function determineDifficulty(question: string, options: string[]): 'easy' | 'medium' | 'hard' {
  const questionLength = question.length;
  const optionCount = options.length;
  
  if (optionCount >= 5 || questionLength > 200) return 'hard';
  if (questionLength > 120) return 'medium';
  return 'easy';
}

// Convert raw questions to our Question format
function convertQuestion(raw: any): Question {
  const isMultiple = raw.type === 'multiple' || Array.isArray(raw.correctAnswer);
  
  const options = raw.options.map((text: string, index: number) => ({
    id: String.fromCharCode(65 + index),
    text: text
  }));
  
  let correctOptions: string[];
  if (Array.isArray(raw.correctAnswer)) {
    correctOptions = raw.correctAnswer.map((answer: string) => {
      const index = raw.options.findIndex((opt: string) => opt === answer);
      return String.fromCharCode(65 + index);
    });
  } else {
    const index = raw.options.findIndex((opt: string) => opt === raw.correctAnswer);
    correctOptions = [String.fromCharCode(65 + index)];
  }
  
  return {
    id: uuidv4(),
    examId: 'AI-900',
    objectiveId: determineObjective(raw.question, raw.explanation || ''),
    stem: raw.question,
    options: options,
    correctOptions: correctOptions,
    explanation: raw.explanation || 'No explanation provided.',
    references: raw.documentationUrl ? [{
      title: 'Microsoft Learn Documentation',
      url: raw.documentationUrl
    }] : [],
    difficulty: determineDifficulty(raw.question, raw.options),
    status: 'published',
    tags: [],
    lastUpdated: new Date().toISOString()
  };
}

export const seedQuestions: Question[] = rawQuestions.map(convertQuestion);
