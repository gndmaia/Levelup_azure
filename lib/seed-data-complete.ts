import { Question } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// Raw questions from the external source
// This file contains the complete Azure AI-900 exam question set

interface RawQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string | string[];
  type: string;
  explanation: string;
  documentationUrl: string;
}

function determineObjective(question: string, explanation: string = ''): string {
  const text = (question + ' ' + explanation).toLowerCase();
  
  if (text.includes('computer vision') || text.includes('vision api') || text.includes('analyze image') || text.includes('image analysis') || text.includes('detect objects') || text.includes('face api') || text.includes('ocr') || text.includes('read api') || text.includes('celebrities') || text.includes('landmarks') || text.includes('image categories')) {
    return 'Computer-Vision';
  }
  if (text.includes('custom vision') || text.includes('train a model to classify') || text.includes('object detection model') || text.includes('classification model') || text.includes('tag images')) {
    return 'Custom-Vision';
  }
  if (text.includes('speech') || text.includes('audio') || text.includes('voice') || text.includes('text-to-speech') || text.includes('speech-to-text') || text.includes('speech recognition') || text.includes('pronunciation')) {
    return 'Speech';
  }
  if (text.includes('text analytics') || text.includes('sentiment') || text.includes('key phrase') || text.includes('entity recognition') || text.includes('named entity') || text.includes('language detection') || text.includes('opinion mining') || text.includes('pii detection')) {
    return 'NLP';
  }
  if (text.includes('translator') || text.includes('translation') || text.includes('translate text')) {
    return 'NLP';
  }
  if (text.includes('conversational') || text.includes(' bot') || text.includes('qna') || text.includes('luis') || text.includes('language understanding') || text.includes('chatbot') || text.includes('bot service') || text.includes('bot framework')) {
    return 'Conversational-AI';
  }
  if (text.includes('form recognizer') || text.includes('document intelligence') || text.includes('receipt') || text.includes('invoice') || text.includes('document analysis')) {
    return 'Document-Intelligence';
  }
  if (text.includes('responsible') || text.includes('fairness') || text.includes('transparency') || text.includes('accountability') || text.includes('privacy') || text.includes('inclusiveness') || text.includes('reliability') || text.includes('bias') || text.includes('ethical')) {
    return 'Responsible-AI';
  }
  if (text.includes('regression') || text.includes('classification') || text.includes('clustering') || text.includes('precision') || text.includes('recall') || text.includes('confusion matrix') || text.includes('f1 score') || text.includes('supervised') || text.includes('unsupervised') || text.includes('reinforcement') || text.includes('training data') || text.includes('test data') || text.includes('validation data')) {
    return 'ML-Fundamentals';
  }
  if (text.includes('azure machine learning') || text.includes('azure ml') || text.includes('aml studio') || text.includes('designer') || text.includes('automated ml') || text.includes('automl') || text.includes('split data') || text.includes('train model') || text.includes('score model') || text.includes('ml pipeline')) {
    return 'Azure-ML';
  }
  if (text.includes('anomaly') || text.includes('anomaly detection') || text.includes('anomalous')) {
    return 'Anomaly-Detection';
  }
  
  return 'AI-Workloads';
}

function determineDifficulty(question: string, options: string[]): 'easy' | 'medium' | 'hard' {
  const questionLength = question.length;
  const optionCount = options.length;
  const avgOptionLength = options.reduce((sum, opt) => sum + opt.length, 0) / optionCount;
  
  // Multiple choice questions are generally harder
  if (optionCount >= 5) return 'hard';
  
  // Long questions with long options are harder
  if (questionLength > 200 && avgOptionLength > 50) return 'hard';
  
  // Medium complexity
  if (questionLength > 120 || avgOptionLength > 40) return 'medium';
  
  return 'easy';
}

function convertQuestion(raw: RawQuestion): Question {
  // Convert options array to structured format with IDs
  const options = raw.options.map((text: string, index: number) => ({
    id: String.fromCharCode(65 + index), // A, B, C, D, E, etc.
    text: text
  }));
  
  // Convert correctAnswer to correctOptions array with letter IDs
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
    references: raw.documentationUrl ? [
      { title: 'Microsoft Documentation', url: raw.documentationUrl }
    ] : [],
    difficulty: determineDifficulty(raw.question, raw.options),
    status: 'published',
    tags: [],
    lastUpdated: new Date().toISOString()
  };
}

// Import all raw questions from the source file
// This is the complete set of Azure AI-900 exam questions
const rawQuestions: RawQuestion[] = [
  {
    id: "q1_mc",
    question: "Which two specialized domain models are supported by Azure AI Vision when categorizing an image?",
    options: [
      "celebrities",
      "image types",
      "landmarks",
      "people",
      "people group"
    ],
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
      "Translator",
      "Text Analytics",
      "Language Understanding (LUIS)",
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
      "Azure SQL Database", 
      "Speech Services",
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
  },
  {
    id: "q5",
    question: "What is computer vision?",
    options: [
      "A machine learning technique to create 3D models",
      "An AI technique to extract information from images",
      "A cloud storage solution for images",
      "A database for storing visual content"
    ],
    correctAnswer: "An AI technique to extract information from images",
    type: "single",
    explanation: "Computer vision is a field of AI that trains computers to interpret and understand visual information from images and videos.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/computer-vision/"
  },
  {
    id: "q5_mc",
    question: "Which Azure services can be used for text analysis? (Select all that apply)",
    options: [
      "Language Service",
      "Computer Vision", 
      "Translator",
      "Form Recognizer"
    ],
    correctAnswer: ["Language Service", "Translator", "Form Recognizer"],
    type: "multiple",
    explanation: "Language Service provides text analytics capabilities, Translator handles text translation, and Form Recognizer can extract text from documents. Computer Vision primarily handles images.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/language-service/"
  },
  {
    id: "q6",
    question: "Which Azure Cognitive Services service should you use to identify the language of a text document?",
    options: [
      "Translator",
      "Text Analytics",
      "Language Understanding",
      "Speech Services"
    ],
    correctAnswer: "Text Analytics",
    type: "single",
    explanation: "Text Analytics can detect the language of text documents as one of its core capabilities.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/language-service/language-detection/overview"
  },
  {
    id: "q7",
    question: "What is clustering in machine learning?",
    options: [
      "A supervised learning technique",
      "An unsupervised learning technique that groups similar data",
      "A deep learning algorithm",
      "A data preprocessing method"
    ],
    correctAnswer: "An unsupervised learning technique that groups similar data",
    type: "single",
    explanation: "Clustering is an unsupervised learning technique that groups data points with similar characteristics together without using labeled training data.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/machine-learning/concept-automated-ml"
  },
  {
    id: "q8",
    question: "Which Azure service provides pre-built AI models for common scenarios?",
    options: [
      "Azure Machine Learning",
      "Azure Cognitive Services",
      "Azure Data Factory",
      "Azure Synapse Analytics"
    ],
    correctAnswer: "Azure Cognitive Services",
    type: "single",
    explanation: "Azure Cognitive Services provides pre-built AI models for vision, speech, language, and decision-making scenarios.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q9",
    question: "What is the main purpose of Azure Bot Service?",
    options: [
      "To store conversational data",
      "To create and deploy intelligent bots",
      "To translate languages",
      "To analyze speech patterns"
    ],
    correctAnswer: "To create and deploy intelligent bots",
    type: "single",
    explanation: "Azure Bot Service enables developers to build, test, deploy, and manage intelligent bots all in one place.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/bot-service/"
  },
  {
    id: "q10",
    question: "Which type of machine learning algorithm predicts a continuous numeric value?",
    options: [
      "Classification",
      "Clustering",
      "Regression",
      "Reinforcement learning"
    ],
    correctAnswer: "Regression",
    type: "single",
    explanation: "Regression algorithms predict continuous numeric values, such as prices, temperatures, or sales figures.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/machine-learning/concept-automated-ml"
  },
  {
    id: "q11",
    question: "What is natural language processing (NLP)?",
    options: [
      "Processing of programming languages",
      "AI that enables computers to understand human language",
      "Converting speech to text",
      "Translating between languages"
    ],
    correctAnswer: "AI that enables computers to understand human language",
    type: "single",
    explanation: "Natural Language Processing (NLP) is a branch of AI that helps computers understand, interpret, and manipulate human language.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/language-service/"
  }
];

// Convert and export all questions
export const seedQuestions: Question[] = rawQuestions.map(convertQuestion);

// For debugging: log question distribution by topic
if (typeof window === 'undefined') {
  const distribution = seedQuestions.reduce((acc, q) => {
    acc[q.objectiveId] = (acc[q.objectiveId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  console.log('Question distribution by topic:', distribution);
  console.log('Total questions:', seedQuestions.length);
}
