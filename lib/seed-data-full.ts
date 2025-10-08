import { Question } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// Complete set of 246 Azure AI-900 exam questions
// Auto-generated from external source

interface RawQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string | string[];
  type: string;
  explanation?: string;
  documentationUrl?: string;
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
  
  if (optionCount >= 5) return 'hard';
  if (questionLength > 200 && avgOptionLength > 50) return 'hard';
  if (questionLength > 120 || avgOptionLength > 40) return 'medium';
  return 'easy';
}

function convertQuestion(raw: RawQuestion): Question {
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
    references: raw.documentationUrl ? [
      { title: 'Microsoft Documentation', url: raw.documentationUrl }
    ] : [],
    difficulty: determineDifficulty(raw.question, raw.options),
    status: 'published',
    tags: [],
    lastUpdated: new Date().toISOString()
  };
}

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
  },
  {
    id: "q12",
    question: "Which Azure service should you use to extract text from images?",
    options: [
      "Computer Vision",
      "Text Analytics",
      "Translator",
      "Speech Services"
    ],
    correctAnswer: "Computer Vision",
    type: "single",
    explanation: "Computer Vision service includes OCR (Optical Character Recognition) capabilities to extract text from images.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/computer-vision/concept-recognizing-text"
  },
  {
    id: "q13",
    question: "What is supervised learning?",
    options: [
      "Learning without any data",
      "Learning with labeled training data",
      "Learning without human supervision",
      "Learning only from mistakes"
    ],
    correctAnswer: "Learning with labeled training data",
    type: "single",
    explanation: "Supervised learning uses labeled training data to learn the mapping between input features and target outcomes.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/machine-learning/concept-automated-ml"
  },
  {
    id: "q14",
    question: "Which Azure service should you use to translate text between languages?",
    options: [
      "Text Analytics",
      "Translator",
      "Language Understanding",
      "Computer Vision"
    ],
    correctAnswer: "Translator",
    type: "single",
    explanation: "Azure Translator service provides real-time text translation between more than 90 languages.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/translator/"
  },
  {
    id: "q15",
    question: "What is unsupervised learning?",
    options: [
      "Learning with labeled data",
      "Learning without labeled data to find patterns",
      "Learning with constant supervision",
      "Learning only classification tasks"
    ],
    correctAnswer: "Learning without labeled data to find patterns",
    type: "single",
    explanation: "Unsupervised learning finds patterns in data without using labeled examples, often through clustering or dimensionality reduction.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/machine-learning/concept-automated-ml"
  },
  {
    id: "q16",
    question: "Which metric measures how well a classification model performs overall?",
    options: [
      "Precision",
      "Recall",
      "Accuracy",
      "F1-score"
    ],
    correctAnswer: "Accuracy",
    type: "single",
    explanation: "Accuracy measures the overall performance of a classification model by calculating the ratio of correct predictions to total predictions.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/machine-learning/how-to-understand-automated-ml"
  },
  {
    id: "q17",
    question: "What is the purpose of the Custom Vision service?",
    options: [
      "To extract text from images",
      "To build custom image classification models",
      "To translate images",
      "To compress images"
    ],
    correctAnswer: "To build custom image classification models",
    type: "single",
    explanation: "Custom Vision allows you to build and deploy custom image classification and object detection models with your own images.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/custom-vision-service/"
  },
  {
    id: "q18",
    question: "Which Azure service provides speech-to-text capabilities?",
    options: [
      "Text Analytics",
      "Translator",
      "Speech Services",
      "Language Understanding"
    ],
    correctAnswer: "Speech Services",
    type: "single",
    explanation: "Azure Speech Services provides speech-to-text, text-to-speech, and speech translation capabilities.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/"
  },
  {
    id: "q19",
    question: "What is reinforcement learning?",
    options: [
      "Learning from labeled examples",
      "Learning through trial and error with rewards",
      "Learning without any feedback",
      "Learning only from textbooks"
    ],
    correctAnswer: "Learning through trial and error with rewards",
    type: "single",
    explanation: "Reinforcement learning involves an agent learning optimal actions through trial and error, receiving rewards or penalties for its actions.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/machine-learning/concept-reinforcement-learning"
  },
  {
    id: "q20",
    question: "Which Azure service should you use to detect emotions in text?",
    options: [
      "Computer Vision",
      "Text Analytics",
      "Translator",
      "Speech Services"
    ],
    correctAnswer: "Text Analytics",
    type: "single",
    explanation: "Text Analytics includes sentiment analysis capabilities that can detect emotions and opinions in text.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/language-service/sentiment-opinion-mining/overview"
  },
  {
    id: "q21",
    question: "What is deep learning?",
    options: [
      "Learning very complex topics",
      "Machine learning using neural networks with multiple layers",
      "Learning from very large datasets",
      "Learning without computers"
    ],
    correctAnswer: "Machine learning using neural networks with multiple layers",
    type: "single",
    explanation: "Deep learning is a subset of machine learning that uses neural networks with multiple hidden layers to model complex patterns.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/machine-learning/concept-deep-learning-vs-machine-learning"
  },
  {
    id: "q22",
    question: "Which Azure service should you use to detect objects in images?",
    options: [
      "Text Analytics",
      "Computer Vision",
      "Translator",
      "Speech Services"
    ],
    correctAnswer: "Computer Vision",
    type: "single",
    explanation: "Computer Vision service can detect and identify objects, people, animals, and activities in images.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/computer-vision/concept-object-detection"
  },
  {
    id: "q23",
    question: "What is feature engineering?",
    options: [
      "Building new software features",
      "Selecting and transforming variables for machine learning",
      "Engineering computer hardware",
      "Creating user interfaces"
    ],
    correctAnswer: "Selecting and transforming variables for machine learning",
    type: "single",
    explanation: "Feature engineering involves selecting, modifying, or creating input variables (features) to improve machine learning model performance.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/machine-learning/concept-automated-ml"
  },
  {
    id: "q24",
    question: "Which type of AI workload involves understanding and generating human language?",
    options: [
      "Computer Vision",
      "Natural Language Processing",
      "Speech Recognition",
      "Anomaly Detection"
    ],
    correctAnswer: "Natural Language Processing",
    type: "single",
    explanation: "Natural Language Processing (NLP) workloads focus on understanding, interpreting, and generating human language.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/language-service/"
  },
  {
    id: "q25",
    question: "What is anomaly detection?",
    options: [
      "Finding normal patterns in data",
      "Identifying unusual patterns that deviate from normal behavior",
      "Detecting programming errors",
      "Finding duplicate data"
    ],
    correctAnswer: "Identifying unusual patterns that deviate from normal behavior",
    type: "single",
    explanation: "Anomaly detection identifies data points, events, or observations that deviate significantly from normal patterns.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/anomaly-detector/"
  },
  {
    id: "q26",
    question: "Which Azure service provides anomaly detection capabilities?",
    options: [
      "Text Analytics",
      "Computer Vision",
      "Anomaly Detector",
      "Translator"
    ],
    correctAnswer: "Anomaly Detector",
    type: "single",
    explanation: "Azure Anomaly Detector service is specifically designed to detect anomalies in time series data and batch data.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/anomaly-detector/"
  },
  {
    id: "q27",
    question: "What is training data in machine learning?",
    options: [
      "Data used to test the model",
      "Data used to teach the model",
      "Data used in production",
      "Data used for visualization"
    ],
    correctAnswer: "Data used to teach the model",
    type: "single",
    explanation: "Training data is the dataset used to teach a machine learning model by showing it examples of inputs and expected outputs.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/machine-learning/concept-automated-ml"
  },
  {
    id: "q28",
    question: "Which Azure service should you use to analyze sentiment in social media posts?",
    options: [
      "Computer Vision",
      "Text Analytics",
      "Speech Services",
      "Translator"
    ],
    correctAnswer: "Text Analytics",
    type: "single",
    explanation: "Text Analytics provides sentiment analysis capabilities that can determine positive, negative, or neutral sentiment in text.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/language-service/sentiment-opinion-mining/overview"
  },
  {
    id: "q29",
    question: "What is overfitting in machine learning?",
    options: [
      "When a model performs perfectly",
      "When a model learns training data too specifically and fails on new data",
      "When a model is too simple",
      "When a model has too few features"
    ],
    correctAnswer: "When a model learns training data too specifically and fails on new data",
    type: "single",
    explanation: "Overfitting occurs when a model learns the training data too specifically, including noise, and fails to generalize to new, unseen data.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/machine-learning/concept-automated-ml"
  },
  {
    id: "q30",
    question: "Which Azure service provides form recognition capabilities?",
    options: [
      "Computer Vision",
      "Form Recognizer",
      "Text Analytics",
      "Custom Vision"
    ],
    correctAnswer: "Form Recognizer",
    type: "single",
    explanation: "Azure Form Recognizer extracts text, key-value pairs, and tables from documents using OCR and machine learning.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/applied-ai-services/form-recognizer/"
  },
  {
    id: "q31",
    question: "What is validation data used for in machine learning?",
    options: [
      "Training the model",
      "Testing the final model performance",
      "Tuning model parameters during training",
      "Storing the model"
    ],
    correctAnswer: "Tuning model parameters during training",
    type: "single",
    explanation: "Validation data is used to evaluate model performance during training and tune hyperparameters without using the test set.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/machine-learning/concept-automated-ml"
  },
  {
    id: "q32",
    question: "Which Azure service should you use to convert speech to text in real-time?",
    options: [
      "Text Analytics",
      "Translator",
      "Speech Services",
      "Language Understanding"
    ],
    correctAnswer: "Speech Services",
    type: "single",
    explanation: "Azure Speech Services provides real-time speech-to-text conversion capabilities for various languages and scenarios.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/"
  },
  {
    id: "q33",
    question: "What is test data used for in machine learning?",
    options: [
      "Training the model",
      "Validating during training",
      "Final evaluation of model performance",
      "Feature engineering"
    ],
    correctAnswer: "Final evaluation of model performance",
    type: "single",
    explanation: "Test data is used for final evaluation of the trained model's performance on completely unseen data to assess generalization.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/machine-learning/concept-automated-ml"
  },
  {
    id: "q34",
    question: "Which Azure Cognitive Service should you use to detect faces in images?",
    options: [
      "Computer Vision",
      "Face",
      "Custom Vision",
      "Form Recognizer"
    ],
    correctAnswer: "Face",
    type: "single",
    explanation: "Azure Face service is specifically designed for face detection, recognition, and analysis in images.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/face/"
  },
  {
    id: "q35",
    question: "What is cross-validation in machine learning?",
    options: [
      "Validating data quality",
      "A technique to assess model performance using multiple train-test splits",
      "Checking for errors in code",
      "Comparing different algorithms"
    ],
    correctAnswer: "A technique to assess model performance using multiple train-test splits",
    type: "single",
    explanation: "Cross-validation divides data into multiple folds, training and testing the model multiple times to get a more robust performance estimate.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/machine-learning/concept-automated-ml"
  },
  {
    id: "q36",
    question: "What is artificial intelligence (AI)?",
    options: [
      "Software that mimics human behavior",
      "Advanced computer hardware",
      "A programming language",
      "A database system"
    ],
    correctAnswer: "Software that mimics human behavior",
    type: "single",
    explanation: "Artificial Intelligence (AI) refers to software that can mimic human cognitive abilities such as learning, reasoning, and perception.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/machine-learning/"
  },
  {
    id: "q37",
    question: "Which Azure service should you use to build a knowledge base for a customer service bot?",
    options: [
      "QnA Maker",
      "Text Analytics",
      "Language Understanding",
      "Speech Services"
    ],
    correctAnswer: "QnA Maker",
    type: "single",
    explanation: "QnA Maker allows you to create a knowledge base from existing content and provides natural language answers to questions.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/qnamaker/"
  },
  {
    id: "q38",
    question: "What is machine learning?",
    options: [
      "Programming computers to follow rules",
      "A subset of AI that learns patterns from data",
      "Manual data analysis",
      "Cloud computing technology"
    ],
    correctAnswer: "A subset of AI that learns patterns from data",
    type: "single",
    explanation: "Machine learning is a subset of AI that enables computers to learn and make decisions from data without being explicitly programmed for every scenario.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/machine-learning/"
  },
  {
    id: "q39",
    question: "Which Azure service can you use to moderate content in images?",
    options: [
      "Computer Vision",
      "Content Moderator",
      "Custom Vision",
      "Face"
    ],
    correctAnswer: "Content Moderator",
    type: "single",
    explanation: "Azure Content Moderator helps detect potentially offensive or unwanted content in images, text, and videos.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/content-moderator/"
  },
  {
    id: "q40",
    question: "What is the purpose of Azure Machine Learning Studio?",
    options: [
      "To store machine learning models",
      "To provide a visual interface for building ML models",
      "To host websites",
      "To manage databases"
    ],
    correctAnswer: "To provide a visual interface for building ML models",
    type: "single",
    explanation: "Azure Machine Learning Studio provides a drag-and-drop visual interface for building, training, and deploying machine learning models.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q41",
    question: "Which type of machine learning is used when you have input data but no labeled output?",
    options: [
      "Supervised learning",
      "Unsupervised learning",
      "Reinforcement learning",
      "Deep learning"
    ],
    correctAnswer: "Unsupervised learning",
    type: "single",
    explanation: "Unsupervised learning is used when you have input data but no labeled outputs, typically for discovering hidden patterns or structures.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q42",
    question: "What is recall in machine learning?",
    options: [
      "True Positives / (True Positives + False Positives)",
      "True Positives / (True Positives + False Negatives)",
      "True Negatives / (True Negatives + False Positives)",
      "True Negatives / (True Negatives + False Negatives)"
    ],
    correctAnswer: "True Positives / (True Positives + False Negatives)",
    type: "single",
    explanation: "Recall (also called sensitivity) measures the proportion of actual positive cases that were correctly identified by the model.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q43",
    question: "Which Azure service should you use to extract key phrases from text?",
    options: [
      "Computer Vision",
      "Text Analytics",
      "Translator",
      "Speech Services"
    ],
    correctAnswer: "Text Analytics",
    type: "single",
    explanation: "Text Analytics service can extract key phrases from text documents to identify the main talking points.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q44",
    question: "What is the F1 score?",
    options: [
      "The harmonic mean of precision and recall",
      "The arithmetic mean of precision and recall",
      "The maximum of precision and recall",
      "The minimum of precision and recall"
    ],
    correctAnswer: "The harmonic mean of precision and recall",
    type: "single",
    explanation: "The F1 score is the harmonic mean of precision and recall, providing a single metric that balances both measures.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q45",
    question: "Which Azure service enables you to build conversational AI solutions?",
    options: [
      "Text Analytics",
      "Bot Framework",
      "Computer Vision",
      "Translator"
    ],
    correctAnswer: "Bot Framework",
    type: "single",
    explanation: "Azure Bot Framework provides tools and services to build, test, deploy, and manage intelligent bots.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q46",
    question: "What is a neural network?",
    options: [
      "A computer network",
      "A computational model inspired by biological neural networks",
      "A database structure",
      "A programming language"
    ],
    correctAnswer: "A computational model inspired by biological neural networks",
    type: "single",
    explanation: "A neural network is a computational model with interconnected nodes (neurons) that process information, inspired by biological neural networks.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q47",
    question: "Which Azure service should you use to detect named entities in text?",
    options: [
      "Computer Vision",
      "Text Analytics",
      "Speech Services",
      "Translator"
    ],
    correctAnswer: "Text Analytics",
    type: "single",
    explanation: "Text Analytics can identify and categorize named entities such as people, locations, organizations, and dates in text.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q48",
    question: "What is the purpose of Azure Cognitive Search?",
    options: [
      "To search for Azure resources",
      "To provide AI-powered search capabilities over content",
      "To search for machine learning models",
      "To search for users"
    ],
    correctAnswer: "To provide AI-powered search capabilities over content",
    type: "single",
    explanation: "Azure Cognitive Search is a cloud search service that uses AI to provide rich search experiences over private, heterogeneous content.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q49",
    question: "What is computer vision used for?",
    options: [
      "Processing text documents",
      "Analyzing and understanding visual content",
      "Converting speech to text",
      "Translating languages"
    ],
    correctAnswer: "Analyzing and understanding visual content",
    type: "single",
    explanation: "Computer vision enables computers to analyze, understand, and extract information from visual content like images and videos.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q50",
    question: "Which Azure service provides text-to-speech capabilities?",
    options: [
      "Text Analytics",
      "Computer Vision",
      "Speech Services",
      "Translator"
    ],
    correctAnswer: "Speech Services",
    type: "single",
    explanation: "Azure Speech Services includes text-to-speech capabilities that can convert written text into natural-sounding speech.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q51",
    question: "What is a confusion matrix?",
    options: [
      "A matrix showing input features",
      "A table showing correct vs predicted classifications",
      "A matrix of training data",
      "A table of hyperparameters"
    ],
    correctAnswer: "A table showing correct vs predicted classifications",
    type: "single",
    explanation: "A confusion matrix is a table that shows the performance of a classification model by comparing actual vs predicted classifications.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q52",
    question: "Which Azure service should you use to recognize handwritten text?",
    options: [
      "Text Analytics",
      "Computer Vision",
      "Form Recognizer",
      "Custom Vision"
    ],
    correctAnswer: "Computer Vision",
    type: "single",
    explanation: "Computer Vision service includes OCR capabilities that can recognize both printed and handwritten text in images.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q53",
    question: "What is the purpose of data preprocessing in machine learning?",
    options: [
      "To store data",
      "To clean and prepare data for training",
      "To visualize data",
      "To backup data"
    ],
    correctAnswer: "To clean and prepare data for training",
    type: "single",
    explanation: "Data preprocessing involves cleaning, transforming, and preparing raw data to make it suitable for machine learning algorithms.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q54",
    question: "Which Azure service should you use to detect the language of spoken audio?",
    options: [
      "Text Analytics",
      "Speech Services",
      "Translator",
      "Language Understanding"
    ],
    correctAnswer: "Speech Services",
    type: "single",
    explanation: "Azure Speech Services can automatically detect the language of spoken audio during speech recognition.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q55",
    question: "What is the purpose of hyperparameter tuning?",
    options: [
      "To clean data",
      "To optimize model performance by adjusting configuration settings",
      "To store models",
      "To visualize results"
    ],
    correctAnswer: "To optimize model performance by adjusting configuration settings",
    type: "single",
    explanation: "Hyperparameter tuning involves adjusting the configuration settings of machine learning algorithms to optimize model performance.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q56",
    question: "Which Azure service should you use to extract structured data from forms?",
    options: [
      "Computer Vision",
      "Form Recognizer",
      "Text Analytics",
      "Custom Vision"
    ],
    correctAnswer: "Form Recognizer",
    type: "single",
    explanation: "Azure Form Recognizer is specifically designed to extract structured data from forms and documents using OCR and machine learning.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q57",
    question: "What is gradient descent?",
    options: [
      "A data preprocessing technique",
      "An optimization algorithm used to minimize loss functions",
      "A type of neural network",
      "A data visualization method"
    ],
    correctAnswer: "An optimization algorithm used to minimize loss functions",
    type: "single",
    explanation: "Gradient descent is an optimization algorithm that iteratively adjusts model parameters to minimize the loss function during training.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/machine-learning/concept-automated-ml"
  },
  {
    id: "q58",
    question: "Which Azure service provides pre-trained models for common computer vision tasks?",
    options: [
      "Custom Vision",
      "Computer Vision",
      "Form Recognizer",
      "Face"
    ],
    correctAnswer: "Computer Vision",
    type: "single",
    explanation: "Azure Computer Vision provides pre-trained models for common tasks like object detection, image classification, and OCR.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q59",
    question: "What is the purpose of a loss function in machine learning?",
    options: [
      "To store training data",
      "To measure how well the model's predictions match actual values",
      "To clean data",
      "To visualize results"
    ],
    correctAnswer: "To measure how well the model's predictions match actual values",
    type: "single",
    explanation: "A loss function quantifies the difference between predicted and actual values, guiding the optimization process during training.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q60",
    question: "Which Azure service should you use to build custom speech recognition models?",
    options: [
      "Text Analytics",
      "Custom Speech",
      "Translator",
      "Language Understanding"
    ],
    correctAnswer: "Custom Speech",
    type: "single",
    explanation: "Custom Speech allows you to build custom speech recognition models tailored to specific vocabularies, speaking styles, or acoustic environments.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q61",
    question: "What is ensemble learning?",
    options: [
      "Learning from multiple datasets",
      "Combining multiple models to improve performance",
      "Learning multiple algorithms",
      "Using multiple computers"
    ],
    correctAnswer: "Combining multiple models to improve performance",
    type: "single",
    explanation: "Ensemble learning combines predictions from multiple models to create a more robust and accurate final prediction.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q62",
    question: "Which Azure service should you use to translate speech from one language to another?",
    options: [
      "Translator",
      "Speech Services",
      "Text Analytics",
      "Language Understanding"
    ],
    correctAnswer: "Speech Services",
    type: "single",
    explanation: "Azure Speech Services includes speech translation capabilities that can translate spoken language in real-time.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q63",
    question: "What is bias in machine learning?",
    options: [
      "Personal opinions of developers",
      "Systematic errors that lead to unfair or inaccurate results",
      "Random errors in data",
      "Hardware limitations"
    ],
    correctAnswer: "Systematic errors that lead to unfair or inaccurate results",
    type: "single",
    explanation: "Bias in machine learning refers to systematic errors or prejudices in models that can lead to unfair or inaccurate predictions for certain groups.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q64",
    question: "Which Azure service should you use to analyze business documents for insights?",
    options: [
      "Computer Vision",
      "Form Recognizer",
      "Text Analytics",
      "Custom Vision"
    ],
    correctAnswer: "Form Recognizer",
    type: "single",
    explanation: "Azure Form Recognizer can analyze business documents like invoices, receipts, and contracts to extract structured information and insights.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q65",
    question: "What is the purpose of regularization in machine learning?",
    options: [
      "To increase model complexity",
      "To prevent overfitting by penalizing complex models",
      "To speed up training",
      "To clean data"
    ],
    correctAnswer: "To prevent overfitting by penalizing complex models",
    type: "single",
    explanation: "Regularization techniques add penalties to complex models to prevent overfitting and improve generalization to new data.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q66",
    question: "Which Azure service should you use to build a custom image classification model with your own images?",
    options: [
      "Computer Vision",
      "Custom Vision",
      "Form Recognizer",
      "Face"
    ],
    correctAnswer: "Custom Vision",
    type: "single",
    explanation: "Custom Vision allows you to build custom image classification and object detection models using your own labeled images.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q67",
    question: "What is the difference between AI, machine learning, and deep learning?",
    options: [
      "They are the same thing",
      "AI is the broadest concept, ML is a subset of AI, and DL is a subset of ML",
      "ML is the broadest concept, AI is a subset of ML, and DL is a subset of AI",
      "They are completely unrelated concepts"
    ],
    correctAnswer: "AI is the broadest concept, ML is a subset of AI, and DL is a subset of ML",
    type: "single",
    explanation: "AI is the broadest field focusing on intelligent behavior, machine learning is a subset using data to learn patterns, and deep learning is a subset of ML using neural networks.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q68",
    question: "Which Azure service should you use to detect and recognize faces in images?",
    options: [
      "Computer Vision",
      "Face",
      "Custom Vision",
      "Form Recognizer"
    ],
    correctAnswer: "Face",
    type: "single",
    explanation: "Azure Face service is specifically designed for face detection, recognition, and analysis, including facial attribute detection.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q69",
    question: "What is transfer learning?",
    options: [
      "Moving data between systems",
      "Using a pre-trained model as starting point for a new task",
      "Transferring knowledge between humans",
      "Moving models between computers"
    ],
    correctAnswer: "Using a pre-trained model as starting point for a new task",
    type: "single",
    explanation: "Transfer learning involves using a pre-trained model as a starting point and adapting it for a new, related task, often requiring less data and training time.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q70",
    question: "Which Azure service provides optical character recognition (OCR) capabilities?",
    options: [
      "Text Analytics",
      "Computer Vision",
      "Speech Services",
      "Translator"
    ],
    correctAnswer: "Computer Vision",
    type: "single",
    explanation: "Azure Computer Vision service includes OCR capabilities to extract text from images and documents.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q71",
    question: "What is the purpose of Azure Machine Learning?",
    options: [
      "To store data",
      "To provide a cloud platform for building, training, and deploying ML models",
      "To host websites",
      "To manage databases"
    ],
    correctAnswer: "To provide a cloud platform for building, training, and deploying ML models",
    type: "single",
    explanation: "Azure Machine Learning is a comprehensive cloud platform that provides tools and services for the entire machine learning lifecycle.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q72",
    question: "Which type of learning is appropriate when you want to teach an AI system to play a game?",
    options: [
      "Supervised learning",
      "Unsupervised learning",
      "Reinforcement learning",
      "Transfer learning"
    ],
    correctAnswer: "Reinforcement learning",
    type: "single",
    explanation: "Reinforcement learning is ideal for game-playing scenarios where an agent learns through trial and error, receiving rewards or penalties based on its actions.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q73",
    question: "Which Azure service should you use to detect inappropriate content in text?",
    options: [
      "Text Analytics",
      "Content Moderator",
      "Language Understanding",
      "Translator"
    ],
    correctAnswer: "Content Moderator",
    type: "single",
    explanation: "Azure Content Moderator can detect potentially offensive, inappropriate, or unwanted content in text, images, and videos.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q74",
    question: "What is the purpose of a training set in machine learning?",
    options: [
      "To test the final model",
      "To train the model by learning from examples",
      "To store the model",
      "To deploy the model"
    ],
    correctAnswer: "To train the model by learning from examples",
    type: "single",
    explanation: "The training set contains labeled examples that the machine learning algorithm uses to learn patterns and relationships in the data.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q75",
    question: "Which Azure service should you use to understand the intent and entities in natural language?",
    options: [
      "Text Analytics",
      "Language Understanding (LUIS)",
      "Translator",
      "Speech Services"
    ],
    correctAnswer: "Language Understanding (LUIS)",
    type: "single",
    explanation: "Language Understanding (LUIS) is specifically designed to understand the intent and extract entities from natural language text.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q76",
    question: "What is the purpose of a test set in machine learning?",
    options: [
      "To train the model",
      "To validate during training",
      "To evaluate final model performance on unseen data",
      "To store the model"
    ],
    correctAnswer: "To evaluate final model performance on unseen data",
    type: "single",
    explanation: "The test set is used for final evaluation of the trained model's performance on completely unseen data to assess real-world performance.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q77",
    question: "Which Azure service should you use to create a searchable knowledge base from FAQ documents?",
    options: [
      "Text Analytics",
      "QnA Maker",
      "Language Understanding",
      "Computer Vision"
    ],
    correctAnswer: "QnA Maker",
    type: "single",
    explanation: "QnA Maker can automatically extract question-and-answer pairs from FAQ documents and create a searchable knowledge base.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q78",
    question: "What is feature selection in machine learning?",
    options: [
      "Selecting the best algorithm",
      "Choosing the most relevant input variables for the model",
      "Selecting training data",
      "Choosing evaluation metrics"
    ],
    correctAnswer: "Choosing the most relevant input variables for the model",
    type: "single",
    explanation: "Feature selection involves identifying and selecting the most relevant input variables (features) that contribute most to the model's predictive performance.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q79",
    question: "Which Azure service should you use to moderate user-generated content in real-time?",
    options: [
      "Text Analytics",
      "Content Moderator",
      "Computer Vision",
      "Face"
    ],
    correctAnswer: "Content Moderator",
    type: "single",
    explanation: "Azure Content Moderator provides real-time content moderation capabilities for text, images, and videos to detect inappropriate content.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q80",
    question: "What is underfitting in machine learning?",
    options: [
      "When a model is too complex",
      "When a model is too simple and fails to capture underlying patterns",
      "When a model performs perfectly",
      "When a model has too much data"
    ],
    correctAnswer: "When a model is too simple and fails to capture underlying patterns",
    type: "single",
    explanation: "Underfitting occurs when a model is too simple to capture the underlying patterns in the data, resulting in poor performance on both training and test data.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q81",
    question: "Which Azure service provides sentiment analysis capabilities?",
    options: [
      "Computer Vision",
      "Text Analytics",
      "Speech Services",
      "Translator"
    ],
    correctAnswer: "Text Analytics",
    type: "single",
    explanation: "Azure Text Analytics provides sentiment analysis capabilities to determine positive, negative, or neutral sentiment in text.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q82",
    question: "What is the purpose of activation functions in neural networks?",
    options: [
      "To store data",
      "To introduce non-linearity and enable learning complex patterns",
      "To clean data",
      "To visualize results"
    ],
    correctAnswer: "To introduce non-linearity and enable learning complex patterns",
    type: "single",
    explanation: "Activation functions introduce non-linearity into neural networks, allowing them to learn and model complex, non-linear relationships in data.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q83",
    question: "Which Azure service should you use to extract structured information from receipts?",
    options: [
      "Computer Vision",
      "Form Recognizer",
      "Text Analytics",
      "Custom Vision"
    ],
    correctAnswer: "Form Recognizer",
    type: "single",
    explanation: "Azure Form Recognizer has pre-built models specifically designed to extract structured information from receipts, including vendor, total, and line items.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q84",
    question: "What is the purpose of backpropagation in neural networks?",
    options: [
      "To move data forward through the network",
      "To adjust weights by propagating errors backward through the network",
      "To store the network",
      "To visualize the network"
    ],
    correctAnswer: "To adjust weights by propagating errors backward through the network",
    type: "single",
    explanation: "Backpropagation is an algorithm that calculates gradients and propagates errors backward through the network to update weights and improve performance.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q85",
    question: "Which Azure service should you use to detect and analyze faces for age, gender, and emotion?",
    options: [
      "Computer Vision",
      "Face",
      "Custom Vision",
      "Form Recognizer"
    ],
    correctAnswer: "Face",
    type: "single",
    explanation: "Azure Face service can detect faces and analyze facial attributes including age, gender, emotion, and other characteristics.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q86",
    question: "What is the curse of dimensionality?",
    options: [
      "Having too little data",
      "Performance degradation when working with high-dimensional data",
      "Having too many algorithms",
      "Computational limitations"
    ],
    correctAnswer: "Performance degradation when working with high-dimensional data",
    type: "single",
    explanation: "The curse of dimensionality refers to various phenomena that arise when analyzing data in high-dimensional spaces, often leading to performance degradation.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q87",
    question: "Which Azure service should you use to build custom text classification models?",
    options: [
      "Text Analytics",
      "Custom Text",
      "Language Understanding",
      "Translator"
    ],
    correctAnswer: "Custom Text",
    type: "single",
    explanation: "Azure Custom Text (part of Azure Cognitive Services) allows you to build custom text classification and named entity recognition models.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q88",
    question: "What is the purpose of dropout in neural networks?",
    options: [
      "To remove bad data",
      "To prevent overfitting by randomly deactivating neurons during training",
      "To speed up training",
      "To reduce network size"
    ],
    correctAnswer: "To prevent overfitting by randomly deactivating neurons during training",
    type: "single",
    explanation: "Dropout is a regularization technique that randomly deactivates neurons during training to prevent overfitting and improve generalization.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q89",
    question: "Which Azure service should you use to convert documents into searchable and analyzable data?",
    options: [
      "Computer Vision",
      "Form Recognizer",
      "Text Analytics",
      "Cognitive Search"
    ],
    correctAnswer: "Cognitive Search",
    type: "single",
    explanation: "Azure Cognitive Search can process documents, extract text and metadata, and make content searchable and analyzable using AI capabilities.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q90",
    question: "What is batch processing in machine learning?",
    options: [
      "Processing data one record at a time",
      "Processing large amounts of data in groups",
      "Processing data in real-time",
      "Processing only small datasets"
    ],
    correctAnswer: "Processing large amounts of data in groups",
    type: "single",
    explanation: "Batch processing involves processing large amounts of data in groups or batches, rather than processing individual records in real-time.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q91",
    question: "Which Azure service provides custom neural text-to-speech voices?",
    options: [
      "Text Analytics",
      "Custom Voice",
      "Translator",
      "Language Understanding"
    ],
    correctAnswer: "Custom Voice",
    type: "single",
    explanation: "Azure Custom Voice allows you to create custom neural text-to-speech voices that sound like specific speakers or match your brand.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q92",
    question: "What is the purpose of data augmentation?",
    options: [
      "To reduce dataset size",
      "To artificially increase dataset size and diversity",
      "To clean data",
      "To store data"
    ],
    correctAnswer: "To artificially increase dataset size and diversity",
    type: "single",
    explanation: "Data augmentation artificially increases the size and diversity of training datasets by applying transformations to existing data.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q93",
    question: "Which Azure service should you use to detect personal information in text?",
    options: [
      "Computer Vision",
      "Text Analytics",
      "Language Understanding",
      "Translator"
    ],
    correctAnswer: "Text Analytics",
    type: "single",
    explanation: "Azure Text Analytics includes PII (Personally Identifiable Information) detection capabilities to identify and redact personal information in text.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q94",
    question: "What is the difference between batch inference and real-time inference?",
    options: [
      "There is no difference",
      "Batch processes groups of data, real-time processes individual requests immediately",
      "Batch is faster than real-time",
      "Real-time uses more data than batch"
    ],
    correctAnswer: "Batch processes groups of data, real-time processes individual requests immediately",
    type: "single",
    explanation: "Batch inference processes large groups of data at scheduled intervals, while real-time inference processes individual requests immediately as they arrive.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q95",
    question: "Which Azure service should you use to build conversation flows for chatbots?",
    options: [
      "Text Analytics",
      "Power Virtual Agents",
      "Computer Vision",
      "Translator"
    ],
    correctAnswer: "Power Virtual Agents",
    type: "single",
    explanation: "Power Virtual Agents provides a visual interface to build conversation flows and deploy chatbots without requiring extensive coding.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q96",
    question: "What is the purpose of normalization in data preprocessing?",
    options: [
      "To remove outliers",
      "To scale features to similar ranges",
      "To add more data",
      "To visualize data"
    ],
    correctAnswer: "To scale features to similar ranges",
    type: "single",
    explanation: "Normalization scales features to similar ranges (typically 0-1) to ensure that features with larger scales don't dominate the learning algorithm.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q97",
    question: "Which Azure service should you use to extract business card information?",
    options: [
      "Computer Vision",
      "Form Recognizer",
      "Text Analytics",
      "Custom Vision"
    ],
    correctAnswer: "Form Recognizer",
    type: "single",
    explanation: "Azure Form Recognizer has pre-built models that can extract structured information from business cards, including names, titles, and contact information.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q98",
    question: "What is the purpose of a learning rate in machine learning?",
    options: [
      "To control how fast data is processed",
      "To control how much model parameters are adjusted during training",
      "To control model size",
      "To control data quality"
    ],
    correctAnswer: "To control how much model parameters are adjusted during training",
    type: "single",
    explanation: "The learning rate controls the step size when updating model parameters during training - too high can cause instability, too low can slow convergence.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q99",
    question: "Which Azure service should you use to detect and classify objects in real-time video streams?",
    options: [
      "Computer Vision",
      "Video Analyzer",
      "Custom Vision",
      "Form Recognizer"
    ],
    correctAnswer: "Video Analyzer",
    type: "single",
    explanation: "Azure Video Analyzer (formerly Video Indexer) can analyze live video streams and detect, classify, and track objects in real-time.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q100",
    question: "What is model deployment in machine learning?",
    options: [
      "Training a model",
      "Making a trained model available for use in production",
      "Storing a model",
      "Testing a model"
    ],
    correctAnswer: "Making a trained model available for use in production",
    type: "single",
    explanation: "Model deployment is the process of making a trained machine learning model available for use in production environments to make predictions on new data.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q101",
    question: "Which responsible AI principle focuses on ensuring AI systems work reliably and safely?",
    options: [
      "Fairness",
      "Reliability and Safety",
      "Privacy and Security",
      "Inclusiveness"
    ],
    correctAnswer: "Reliability and Safety",
    type: "single",
    explanation: "The Reliability and Safety principle ensures that AI systems perform reliably within defined parameters and fail safely when they encounter unexpected situations.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q102",
    question: "What is the main goal of clustering algorithms?",
    options: [
      "To predict future values",
      "To group similar data points together",
      "To classify data into predefined categories",
      "To reduce data size"
    ],
    correctAnswer: "To group similar data points together",
    type: "single",
    explanation: "Clustering algorithms aim to group similar data points together into clusters while keeping dissimilar points in different clusters, without using labeled data.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q103",
    question: "Which Azure service should you use to build custom language models?",
    options: [
      "Text Analytics",
      "Language Understanding",
      "Custom Language",
      "Translator"
    ],
    correctAnswer: "Custom Language",
    type: "single",
    explanation: "Azure Custom Language allows you to build custom models for text classification, named entity recognition, and conversational language understanding.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q104",
    question: "What is the purpose of the validation dataset?",
    options: [
      "To train the model",
      "To tune hyperparameters and monitor training progress",
      "To test final model performance",
      "To store the model"
    ],
    correctAnswer: "To tune hyperparameters and monitor training progress",
    type: "single",
    explanation: "The validation dataset is used during training to tune hyperparameters, select the best model, and monitor training progress without using the test set.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q105",
    question: "Which type of machine learning algorithm would you use to predict house prices?",
    options: [
      "Classification",
      "Clustering",
      "Regression",
      "Reinforcement learning"
    ],
    correctAnswer: "Regression",
    type: "single",
    explanation: "Regression algorithms are used to predict continuous numerical values like house prices, stock prices, or temperatures.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q106",
    question: "What is the purpose of Azure Applied AI Services?",
    options: [
      "To provide basic AI building blocks",
      "To provide task-specific AI solutions for common business scenarios",
      "To store AI models",
      "To train custom AI models"
    ],
    correctAnswer: "To provide task-specific AI solutions for common business scenarios",
    type: "single",
    explanation: "Azure Applied AI Services combine multiple AI capabilities into task-specific solutions for common business scenarios like document processing and content analysis.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q107",
    question: "Which metric is most appropriate for evaluating a model when classes are imbalanced?",
    options: [
      "Accuracy",
      "Precision",
      "F1-score",
      "All of the above"
    ],
    correctAnswer: "F1-score",
    type: "single",
    explanation: "F1-score is most appropriate for imbalanced classes as it balances precision and recall, providing a single metric that accounts for both false positives and false negatives.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q108",
    question: "What is the purpose of Azure OpenAI Service?",
    options: [
      "To provide open-source AI tools",
      "To provide access to OpenAI's language models through Azure",
      "To create AI-generated art",
      "To translate languages"
    ],
    correctAnswer: "To provide access to OpenAI's language models through Azure",
    type: "single",
    explanation: "Azure OpenAI Service provides REST API access to OpenAI's powerful language models including GPT-3, GPT-4, and other generative AI capabilities.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q109",
    question: "Which type of bias occurs when training data doesn't represent the target population?",
    options: [
      "Confirmation bias",
      "Selection bias",
      "Anchoring bias",
      "Availability bias"
    ],
    correctAnswer: "Selection bias",
    type: "single",
    explanation: "Selection bias occurs when the training data doesn't accurately represent the target population, leading to models that perform poorly on underrepresented groups.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q110",
    question: "What is the purpose of MLOps?",
    options: [
      "To develop machine learning algorithms",
      "To operationalize machine learning through automation and monitoring",
      "To store machine learning data",
      "To visualize machine learning results"
    ],
    correctAnswer: "To operationalize machine learning through automation and monitoring",
    type: "single",
    explanation: "MLOps (Machine Learning Operations) focuses on automating and monitoring the entire ML lifecycle from development to deployment and maintenance.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q111",
    question: "Which Azure service provides pre-built industry-specific AI models?",
    options: [
      "Cognitive Services",
      "Applied AI Services",
      "Machine Learning",
      "OpenAI Service"
    ],
    correctAnswer: "Applied AI Services",
    type: "single",
    explanation: "Azure Applied AI Services provide pre-built, industry-specific AI solutions that combine multiple AI capabilities for common business scenarios.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q112",
    question: "What is explainable AI (XAI)?",
    options: [
      "AI that can explain other AI systems",
      "AI techniques that provide insights into how models make decisions",
      "AI that uses natural language explanations",
      "AI that is easy to implement"
    ],
    correctAnswer: "AI techniques that provide insights into how models make decisions",
    type: "single",
    explanation: "Explainable AI (XAI) refers to techniques and methods that help humans understand and interpret the decisions made by AI models.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q113",
    question: "Which Azure service should you use to extract insights from customer support calls?",
    options: [
      "Speech Services",
      "Text Analytics",
      "Call Analytics",
      "All of the above"
    ],
    correctAnswer: "All of the above",
    type: "single",
    explanation: "Extracting insights from calls requires Speech Services for transcription, Text Analytics for sentiment and key phrase extraction, and Call Analytics for call-specific insights.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q114",
    question: "What is federated learning?",
    options: [
      "Learning from multiple datasets",
      "Training models across distributed devices without centralizing data",
      "Learning from government data",
      "Combining multiple algorithms"
    ],
    correctAnswer: "Training models across distributed devices without centralizing data",
    type: "single",
    explanation: "Federated learning trains machine learning models across distributed devices or servers while keeping data localized, enhancing privacy and security.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q115",
    question: "Which responsible AI principle focuses on protecting sensitive information?",
    options: [
      "Fairness",
      "Transparency",
      "Privacy and Security",
      "Accountability"
    ],
    correctAnswer: "Privacy and Security",
    type: "single",
    explanation: "The Privacy and Security principle ensures that AI systems protect sensitive information and maintain user privacy while providing secure, reliable service.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q116",
    question: "What is the purpose of A/B testing in AI deployments?",
    options: [
      "To test two different algorithms",
      "To compare model performance against a baseline in production",
      "To test data quality",
      "To test system security"
    ],
    correctAnswer: "To compare model performance against a baseline in production",
    type: "single",
    explanation: "A/B testing in AI deployments compares the performance of a new model against an existing baseline by routing traffic to both versions and measuring outcomes.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q117",
    question: "Which Azure service provides immersive reading capabilities for text?",
    options: [
      "Text Analytics",
      "Immersive Reader",
      "Speech Services",
      "Translator"
    ],
    correctAnswer: "Immersive Reader",
    type: "single",
    explanation: "Azure Immersive Reader helps improve reading comprehension by providing features like text-to-speech, syllable breaks, and visual highlighting.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q118",
    question: "What is continual learning in AI?",
    options: [
      "Learning that never stops",
      "The ability to learn new tasks without forgetting previous ones",
      "Learning from continuous data streams",
      "Learning multiple subjects"
    ],
    correctAnswer: "The ability to learn new tasks without forgetting previous ones",
    type: "single",
    explanation: "Continual learning enables AI systems to learn new tasks continuously while retaining knowledge from previously learned tasks, avoiding catastrophic forgetting.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q119",
    question: "Which Azure service should you use to analyze customer feedback for business insights?",
    options: [
      "Computer Vision",
      "Text Analytics",
      "Speech Services",
      "Translator"
    ],
    correctAnswer: "Text Analytics",
    type: "single",
    explanation: "Text Analytics can analyze customer feedback to extract sentiment, key phrases, entities, and opinions, providing valuable business insights.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q120",
    question: "What is model versioning?",
    options: [
      "Creating different versions of data",
      "Tracking and managing different versions of trained models",
      "Versioning the training code",
      "Creating model documentation"
    ],
    correctAnswer: "Tracking and managing different versions of trained models",
    type: "single",
    explanation: "Model versioning involves tracking and managing different versions of trained models, enabling rollback, comparison, and systematic model updates.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q121",
    question: "Which Azure service provides document intelligence capabilities?",
    options: [
      "Computer Vision",
      "Document Intelligence",
      "Text Analytics",
      "Form Recognizer"
    ],
    correctAnswer: "Document Intelligence",
    type: "single",
    explanation: "Azure Document Intelligence (formerly Form Recognizer) provides AI-powered document processing capabilities to extract information from various document types.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q122",
    question: "What is the purpose of confidence scores in AI predictions?",
    options: [
      "To measure model accuracy",
      "To indicate how certain the model is about its predictions",
      "To rank different models",
      "To measure training time"
    ],
    correctAnswer: "To indicate how certain the model is about its predictions",
    type: "single",
    explanation: "Confidence scores indicate how certain an AI model is about its predictions, helping users understand the reliability of individual predictions.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q123",
    question: "Which Azure service should you use to create personalized content recommendations?",
    options: [
      "Personalizer",
      "Text Analytics",
      "Computer Vision",
      "Language Understanding"
    ],
    correctAnswer: "Personalizer",
    type: "single",
    explanation: "Azure Personalizer uses reinforcement learning to provide personalized content recommendations based on user behavior and preferences.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q124",
    question: "What is prompt engineering?",
    options: [
      "Engineering software prompts",
      "The practice of crafting effective prompts for language models",
      "Building user interfaces",
      "Debugging AI systems"
    ],
    correctAnswer: "The practice of crafting effective prompts for language models",
    type: "single",
    explanation: "Prompt engineering is the practice of designing and refining prompts to effectively communicate with and elicit desired responses from language models.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q125",
    question: "Which responsible AI principle focuses on ensuring AI systems are accessible to everyone?",
    options: [
      "Fairness",
      "Inclusiveness",
      "Transparency",
      "Privacy"
    ],
    correctAnswer: "Inclusiveness",
    type: "single",
    explanation: "The Inclusiveness principle ensures that AI systems are designed to be accessible and beneficial to all people, regardless of ability, background, or circumstances.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q126",
    question: "What is the purpose of data lineage in machine learning?",
    options: [
      "To organize data alphabetically",
      "To track the origin and transformations of data throughout the ML pipeline",
      "To store data efficiently",
      "To visualize data relationships"
    ],
    correctAnswer: "To track the origin and transformations of data throughout the ML pipeline",
    type: "single",
    explanation: "Data lineage tracks the origin, movement, and transformations of data throughout the machine learning pipeline, ensuring reproducibility and compliance.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q127",
    question: "Which Azure service should you use to detect anomalies in IoT sensor data?",
    options: [
      "Text Analytics",
      "Anomaly Detector",
      "Computer Vision",
      "Speech Services"
    ],
    correctAnswer: "Anomaly Detector",
    type: "single",
    explanation: "Azure Anomaly Detector is specifically designed to detect anomalies in time-series data, making it ideal for IoT sensor data analysis.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q128",
    question: "What is the difference between weak AI and strong AI?",
    options: [
      "Weak AI has lower performance than strong AI",
      "Weak AI is designed for specific tasks, strong AI has general intelligence",
      "Weak AI uses less computing power",
      "There is no difference"
    ],
    correctAnswer: "Weak AI is designed for specific tasks, strong AI has general intelligence",
    type: "single",
    explanation: "Weak AI (narrow AI) is designed for specific tasks, while strong AI (general AI) would have general intelligence comparable to humans across all domains.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q129",
    question: "Which Azure service provides multi-modal AI capabilities?",
    options: [
      "Computer Vision",
      "Cognitive Services",
      "OpenAI Service",
      "All of the above"
    ],
    correctAnswer: "All of the above",
    type: "single",
    explanation: "Multiple Azure services provide multi-modal AI capabilities that can process and understand different types of data (text, images, audio) simultaneously.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q130",
    question: "What is the purpose of attention mechanisms in neural networks?",
    options: [
      "To focus computational resources on important parts of the input",
      "To make models pay attention to training",
      "To reduce model size",
      "To speed up training"
    ],
    correctAnswer: "To focus computational resources on important parts of the input",
    type: "single",
    explanation: "Attention mechanisms allow neural networks to focus on relevant parts of the input when making predictions, improving performance on complex tasks.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q131",
    question: "Which Azure service should you use to analyze and extract insights from videos?",
    options: [
      "Computer Vision",
      "Video Indexer",
      "Media Services",
      "Custom Vision"
    ],
    correctAnswer: "Video Indexer",
    type: "single",
    explanation: "Azure Video Indexer can analyze videos to extract insights like faces, emotions, objects, scenes, and generate searchable transcripts and metadata.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q132",
    question: "What is edge AI?",
    options: [
      "AI running on the latest technology",
      "AI processing that occurs on local devices rather than in the cloud",
      "AI with cutting-edge performance",
      "AI for network edge detection"
    ],
    correctAnswer: "AI processing that occurs on local devices rather than in the cloud",
    type: "single",
    explanation: "Edge AI refers to AI processing that happens locally on devices (at the edge of the network) rather than in centralized cloud servers, reducing latency and improving privacy.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q133",
    question: "An electricity utility company wants to develop a mobile app for its customers to monitor their energy use and to display their predicted energy use for the next 12 months. \nThe company wants to use machine learning to provide a reasonably accurate prediction of future energy use by using the customersâ€™ previous energy-use data. \nWhich type of machine learning is this?",
    options: [
      "classification",
      "clustering",
      "multiclass classification",
      "Regression"
    ],
    correctAnswer: "Regression",
    type: "single",
    explanation: "Regression is a machine learning scenario that is used to predict numeric values. In this example, regression will be able to predict future energy consumption based on analyzing historical time-series energy data based on factors, such as seasonal weather and holiday periods. Multiclass classification is used to predict categories of data. Clustering analyzes unlabeled data to find similarities present in the data. Classification is used to predict categories of data.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q134",
    question: "You need to predict the income range of a given customer by using the following information: age, education level, and employment status. What type of machine learning should you use?",
    options: [
      "Classification",
      "Clustering",
      "Regression",
      "Reinforcement learning"
    ],
    correctAnswer: "Classification",
    type: "single",
    explanation: "Classification is used to predict categories or discrete values. Since you're predicting income range (categories like low, medium, high), this is a classification problem.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q135",
    question: "Which Azure AI service should you use to analyze images and return image descriptions and tags?",
    options: [
      "Custom Vision",
      "Computer Vision",
      "Face API",
      "Form Recognizer"
    ],
    correctAnswer: "Computer Vision",
    type: "single",
    explanation: "Computer Vision can analyze images and provide descriptions, tags, and other insights about visual content.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q136",
    question: "You need to build a solution that will identify whether product reviews are positive or negative. Which type of AI workload is this?",
    options: [
      "Computer vision",
      "Natural language processing",
      "Knowledge mining",
      "Speech recognition"
    ],
    correctAnswer: "Natural language processing",
    type: "single",
    explanation: "Sentiment analysis of text reviews is a natural language processing (NLP) task.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q137",
    question: "Which Azure service provides pre-built machine learning models that enable applications to see, hear, speak, understand, and interpret user needs?",
    options: [
      "Azure Machine Learning",
      "Azure Cognitive Services",
      "Azure Bot Service",
      "Azure Databricks"
    ],
    correctAnswer: "Azure Cognitive Services",
    type: "single",
    explanation: "Azure Cognitive Services provides pre-built APIs for vision, speech, language, and decision-making capabilities.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q138",
    question: "You are designing an AI system that empowers everyone, including people who have hearing, visual, and other impairments. This is an example of which Microsoft guiding principle for responsible AI?",
    options: [
      "Fairness",
      "Inclusiveness",
      "Reliability and safety",
      "Privacy and security"
    ],
    correctAnswer: "Inclusiveness",
    type: "single",
    explanation: "Inclusiveness ensures that AI systems are designed to be accessible to everyone, including people with disabilities.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q139",
    question: "Which service should you use to automatically generate audio content from text?",
    options: [
      "Speech to Text",
      "Text to Speech",
      "Speech Translation",
      "Language Understanding"
    ],
    correctAnswer: "Text to Speech",
    type: "single",
    explanation: "Text to Speech service converts written text into natural-sounding audio content.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q168",
    question: "You need to scan 1000 documents for key phrases and sentiment. Which Azure service should you use?",
    options: [
      "Speech",
      "Language Understanding",
      "Text Analytics",
      "Translator"
    ],
    correctAnswer: "Text Analytics",
    type: "single",
    explanation: "Text Analytics can analyze large volumes of text for key phrases, sentiment, and other insights.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q140",
    question: "Which type of machine learning should you use to predict the price of a house based on its size, location, and age?",
    options: [
      "Classification",
      "Clustering",
      "Regression",
      "Reinforcement learning"
    ],
    correctAnswer: "Regression",
    type: "single",
    explanation: "Regression predicts continuous numerical values. House price prediction based on features is a typical regression problem.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q141",
    question: "You need to create a model that can identify objects in images. Which type of AI workload is this?",
    options: [
      "Natural language processing",
      "Computer vision",
      "Speech recognition",
      "Knowledge mining"
    ],
    correctAnswer: "Computer vision",
    type: "single",
    explanation: "Object detection and identification in images is a computer vision task.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q142",
    question: "Which Azure service should you use to detect faces in images?",
    options: [
      "Computer Vision",
      "Face API",
      "Custom Vision",
      "Form Recognizer"
    ],
    correctAnswer: "Face API",
    type: "single",
    explanation: "Face API is specifically designed for face detection, recognition, and analysis in images.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q143",
    question: "You need to create a chatbot that can understand user intentions. Which Azure service should you use?",
    options: [
      "Text Analytics",
      "Language Understanding (LUIS)",
      "Translator",
      "Speech to Text"
    ],
    correctAnswer: "Language Understanding (LUIS)",
    type: "single",
    explanation: "LUIS is designed to understand user intentions and extract entities from natural language input, making it ideal for chatbots.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q144",
    question: "Which metric is used to evaluate a regression model?",
    options: [
      "Accuracy",
      "Precision",
      "Recall",
      "Root Mean Square Error (RMSE)"
    ],
    correctAnswer: "Root Mean Square Error (RMSE)",
    type: "single",
    explanation: "RMSE measures the average prediction error in regression models. Accuracy, precision, and recall are classification metrics.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q145",
    question: "You need to translate text from English to Spanish in real-time. Which Azure service should you use?",
    options: [
      "Text Analytics",
      "Language Understanding",
      "Translator",
      "Speech Translation"
    ],
    correctAnswer: "Translator",
    type: "single",
    explanation: "Azure Translator provides real-time text translation between languages.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q146",
    question: "Which Azure service can extract key-value pairs from forms and documents?",
    options: [
      "Computer Vision",
      "Text Analytics",
      "Form Recognizer",
      "Custom Vision"
    ],
    correctAnswer: "Form Recognizer",
    type: "single",
    explanation: "Form Recognizer is specifically designed to extract key-value pairs, tables, and structure from forms and documents.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q147",
    question: "You need to group customers based on their purchasing behavior without knowing the categories in advance. Which type of machine learning should you use?",
    options: [
      "Classification",
      "Clustering",
      "Regression",
      "Reinforcement learning"
    ],
    correctAnswer: "Clustering",
    type: "single",
    explanation: "Clustering groups data points with similar characteristics without predefined categories, making it perfect for customer segmentation.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q148",
    question: "Which responsible AI principle focuses on ensuring AI systems operate consistently and safely?",
    options: [
      "Fairness",
      "Inclusiveness",
      "Reliability and safety",
      "Transparency"
    ],
    correctAnswer: "Reliability and safety",
    type: "single",
    explanation: "Reliability and safety ensures AI systems perform consistently and operate safely under normal and unexpected conditions.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q149",
    question: "You need to convert spoken words into text. Which Azure service should you use?",
    options: [
      "Text to Speech",
      "Speech to Text",
      "Language Understanding",
      "Speech Translation"
    ],
    correctAnswer: "Speech to Text",
    type: "single",
    explanation: "Speech to Text converts spoken audio into written text.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q150",
    question: "Which Azure service provides optical character recognition (OCR) capabilities?",
    options: [
      "Face API",
      "Computer Vision",
      "Custom Vision",
      "Video Indexer"
    ],
    correctAnswer: "Computer Vision",
    type: "single",
    explanation: "Computer Vision includes OCR capabilities to extract text from images and documents.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q151",
    question: "You need to determine whether an email is spam or not spam. Which type of machine learning problem is this?",
    options: [
      "Regression",
      "Binary classification",
      "Multiclass classification",
      "Clustering"
    ],
    correctAnswer: "Binary classification",
    type: "single",
    explanation: "Binary classification predicts one of two possible outcomes. Spam detection has two categories: spam or not spam.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q152",
    question: "Which Azure service should you use to extract insights from large volumes of unstructured data?",
    options: [
      "Azure Search",
      "Azure Cognitive Search",
      "Text Analytics",
      "Language Understanding"
    ],
    correctAnswer: "Azure Cognitive Search",
    type: "single",
    explanation: "Azure Cognitive Search can extract insights and structure from large volumes of unstructured data using AI enrichment.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q153",
    question: "You need to identify the language of a text document. Which Azure service should you use?",
    options: [
      "Translator",
      "Text Analytics",
      "Language Understanding",
      "Speech to Text"
    ],
    correctAnswer: "Text Analytics",
    type: "single",
    explanation: "Text Analytics includes language detection capabilities to identify the language of text documents.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q154",
    question: "Which type of AI workload involves understanding and generating human language?",
    options: [
      "Computer vision",
      "Natural language processing",
      "Speech recognition",
      "Knowledge mining"
    ],
    correctAnswer: "Natural language processing",
    type: "single",
    explanation: "Natural language processing (NLP) focuses on understanding, interpreting, and generating human language.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q155",
    question: "You need to train a custom model to classify images of different dog breeds. Which Azure service should you use?",
    options: [
      "Computer Vision",
      "Custom Vision",
      "Face API",
      "Form Recognizer"
    ],
    correctAnswer: "Custom Vision",
    type: "single",
    explanation: "Custom Vision allows you to train custom image classification models for specific scenarios like dog breed identification.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q156",
    question: "Which metric measures the proportion of actual positive cases that were correctly identified?",
    options: [
      "Accuracy",
      "Precision",
      "Recall",
      "F1-score"
    ],
    correctAnswer: "Recall",
    type: "single",
    explanation: "Recall (also called sensitivity) measures the proportion of actual positive cases that were correctly identified by the model.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q157",
    question: "You need to create a solution that can answer questions about company policies. Which type of AI solution should you build?",
    options: [
      "Computer vision",
      "Natural language processing",
      "Speech recognition",
      "Predictive analytics"
    ],
    correctAnswer: "Natural language processing",
    type: "single",
    explanation: "Question answering systems that understand and respond to queries about documents or policies use natural language processing.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q158",
    question: "Which Azure service can analyze video content and extract insights?",
    options: [
      "Computer Vision",
      "Video Indexer",
      "Custom Vision",
      "Face API"
    ],
    correctAnswer: "Video Indexer",
    type: "single",
    explanation: "Video Indexer analyzes video content to extract insights like faces, emotions, topics, and transcriptions.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q159",
    question: "You need to ensure that your AI model treats all groups of people fairly. Which responsible AI principle does this represent?",
    options: [
      "Transparency",
      "Accountability",
      "Fairness",
      "Privacy and security"
    ],
    correctAnswer: "Fairness",
    type: "single",
    explanation: "Fairness ensures that AI systems treat all groups of people equitably and don't discriminate against certain populations.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q160",
    question: "Which type of machine learning learns through trial and error by receiving rewards or penalties?",
    options: [
      "Supervised learning",
      "Unsupervised learning",
      "Reinforcement learning",
      "Semi-supervised learning"
    ],
    correctAnswer: "Reinforcement learning",
    type: "single",
    explanation: "Reinforcement learning uses a reward-penalty system where agents learn optimal actions through trial and error.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q161",
    question: "You need to detect anomalies in network traffic data. Which type of machine learning should you use?",
    options: [
      "Classification",
      "Regression",
      "Clustering",
      "Anomaly detection"
    ],
    correctAnswer: "Anomaly detection",
    type: "single",
    explanation: "Anomaly detection identifies unusual patterns or outliers in data, making it ideal for detecting abnormal network traffic.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q162",
    question: "Which Azure service provides a no-code/low-code environment for building machine learning models?",
    options: [
      "Azure Machine Learning designer",
      "Azure Databricks",
      "Azure Synapse Analytics",
      "Azure Data Factory"
    ],
    correctAnswer: "Azure Machine Learning designer",
    type: "single",
    explanation: "Azure Machine Learning designer provides a drag-and-drop interface for building ML models without extensive coding.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q163",
    question: "You need to transcribe a recorded meeting and translate it to multiple languages. Which Azure services should you use?",
    options: [
      "Speech to Text and Translator",
      "Text Analytics and Language Understanding",
      "Computer Vision and Custom Vision",
      "Face API and Form Recognizer"
    ],
    correctAnswer: "Speech to Text and Translator",
    type: "single",
    explanation: "Speech to Text converts audio to text, then Translator can translate the text to multiple languages.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q164",
    question: "Which responsible AI principle ensures that people can understand how AI systems make decisions?",
    options: [
      "Fairness",
      "Reliability and safety",
      "Transparency",
      "Inclusiveness"
    ],
    correctAnswer: "Transparency",
    type: "single",
    explanation: "Transparency ensures that AI systems are interpretable and that people can understand how decisions are made.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q165",
    question: "You need to extract text from scanned invoices and identify key information like amounts and dates. Which Azure service should you use?",
    options: [
      "Computer Vision",
      "Text Analytics",
      "Form Recognizer",
      "Custom Vision"
    ],
    correctAnswer: "Form Recognizer",
    type: "single",
    explanation: "Form Recognizer can extract text and identify structured information from documents like invoices, including key-value pairs.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q166",
    question: "What is the primary difference between supervised and unsupervised machine learning?",
    options: [
      "Supervised learning uses labeled training data, unsupervised learning does not",
      "Supervised learning is faster than unsupervised learning",
      "Supervised learning works with images, unsupervised learning works with text",
      "Supervised learning requires more computational power"
    ],
    correctAnswer: "Supervised learning uses labeled training data, unsupervised learning does not",
    type: "single",
    explanation: "The key difference is that supervised learning algorithms learn from labeled training data (input-output pairs), while unsupervised learning finds patterns in data without labeled examples.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q167",
    question: "In a regression machine learning algorithm, how are features and labels handled in a validation dataset?",
    options: [
      "Features are compared to the feature values in a training dataset.",
      "Features are used to generate predictions for the label, which is compared to the actual label values.",
      "Labels are compared to the label values in a training dataset.",
      "The label is used to generate predictions for features, which are compared to the actual feature values."
    ],
    correctAnswer: "Features are used to generate predictions for the label, which is compared to the actual label values.",
    type: "single",
    explanation: "In a regression machine learning algorithm, features are used to generate predictions for the label, which is compared to the actual label value. There is no direct comparison of features or labels between the validation and training datasets.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q171",
    question: "Which assumption of the multiple linear regression model should be satisfied to avoid misleading predictions?",
    options: [
      "Features are dependent on each other",
      "Features are independent of each other",
      "Labels are dependent on each other",
      "Labels are independent of each other"
    ],
    correctAnswer: "Features are independent of each other",
    type: "single",
    explanation: "Multiple linear regression models the relationship between several features and a single label. The features must be independent of each other, otherwise, the model's predictions will be misleading.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q169",
    question: "Which feature makes regression an example of supervised machine learning?",
    options: [
      "use of historical data with known label values to train a model",
      "use of historical data with unknown label values to train a model",
      "use of randomly generated data with known label values to train a model",
      "use of randomly generated data with unknown label values to train a model"
    ],
    correctAnswer: "use of historical data with known label values to train a model",
    type: "single",
    explanation: "Regression is an example of supervised machine learning due to the use of historical data with known label values to train a model. Regression does not rely on randomly generated data for training.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q170",
    question: "A company is using machine learning to predict various aspects of its e-scooter hire service dependent on weather. This includes predicting the number of hires, the average distance traveled, and the impact on e-scooter battery levels.\n\nFor the machine learning model, which two attributes are the features? Each correct answer presents a complete solution.\n\nSelect all answers that apply.",
    options: [
      "distance traveled",
      "e-scooter battery levels",
      "weather temperature",
      "weekday or weekend"
    ],
    correctAnswer: ["weather temperature", "weekday or weekend"],
    type: "multiple",
    explanation: "Weather temperature and weekday or weekend are features that provide a weather temperature for a given day and a value based on whether the day is on a weekend or weekday. These are input variables for the model to help predict the labels for e-scooter battery levels, number of hires, and distance traveled. E-scooter battery levels, number of hires, and distance traveled are numeric labels you are attempting to predict through the machine learning model.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q172",
    question: "What is the purpose of a validation dataset used for as part of the development of a machine learning model?",
    options: [
      "cleaning missing data",
      "evaluating the trained model",
      "feature engineering",
      "summarizing the data"
    ],
    correctAnswer: "evaluating the trained model",
    type: "single",
    explanation: "The validation dataset is a sample of data held back from a training dataset. It is then used to evaluate the performance of the trained model.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
    {
    id: "q173",
    question: "What should you do after preparing a dataset and before training the machine learning model?",
    options: [
      "clean missing data",
      "normalize the data",
      "split data into training and validation datasets",
      "summarize the data"
    ],
    correctAnswer: "split data into training and validation datasets",
    type: "single",
    explanation: "Splitting data into training and validation datasets leaves you with two datasets, the first and largest of which is the training dataset you use to train the model. The second, smaller dataset is the held back data and is called the validation dataset, as it is used to evaluate the trained model. If normalizing or summarizing the data is required, it will be carried out as part of data transformation. Cleaning missing data is part of preparing the data and the data transformation processes.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q174",
    question: "You need to create an automated machine learning (automated ML) model. Which resource should you create first in Azure Machine Learning studio?",
    options: [
      "a dataset",
      "a workspace",
      "an Azure container instance",
      "an Azure Kubernetes Service (AKS) cluster"
    ],
    correctAnswer: "a dataset",
    type: "single",
    explanation: "A dataset is required to create an automated machine learning (automated ML) run. A workspace must be created before you can access Machine Learning studio. An Azure container instance and an AKS cluster can be created as a deployment target, after training of a model is complete.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q175",
    question: "What should you do first in the Machine Learning designer?",
    options: [
      "Add a dataset",
      "Add training modules",
      "Create a pipeline",
      "Deploy a service"
    ],
    correctAnswer: "Create a pipeline",
    type: "single",
    explanation: "Before you can start training a machine learning model, you must first create a pipeline in the Machine Learning designer. This is followed by adding a dataset, adding training modules, and eventually deploying a service.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q176",
    question: "Which three supervised machine learning models can you train by using automated machine learning (automated ML) in the Azure Machine Learning studio?",
    options: [
      "Classification",
      "Clustering",
      "Inference pipeline",
      "Regression",
      "Time-series forecasting"
    ],
    correctAnswer: ["Classification", "Regression", "Time-series forecasting"],
    type: "multiple",
    explanation: "Time-series forecasting, regression, and classification are supervised machine learning models. Automated ML learning can predict categories or classes by using a classification algorithm, as well as numeric values as part of the regression algorithm, and at a future point in time by using time-series data. Inference pipeline is not a machine learning model. Clustering is unsupervised machine learning and automated ML only works with supervised learning algorithms.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q177",
    question: "Which three sources can be used to generate questions and answers for a knowledge base?",
    options: [
      "a webpage",
      "an audio file",
      "an existing FAQ document",
      "an image file",
      "manually entered data"
    ],
    correctAnswer: ["a webpage", "an existing FAQ document", "manually entered data"],
    type: "multiple",
    explanation: "A webpage or an existing document, such as a text file containing question and answer pairs, can be used to generate a knowledge base. You can also manually enter the knowledge base question-and-answer pairs. You cannot directly use an image or an audio file to import a knowledge base.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  

  {
    id: "q178",
    question: "Which option uses plugins to provide end users with the ability to get help with common tasks from a generative AI model?",
    options: [
      "Copilots",
      "Language Understanding solutions",
      "Question answering models",
      "RESTful API services"
    ],
    correctAnswer: "Copilots",
    type: "single",
    explanation: "Copilots are often integrated into applications to provide a way for users to get help with common tasks from a generative AI model.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q179",
    question: "At which layer can you apply content filters to suppress prompts and responses for a responsible generative AI solution?",
    options: [
      "metaprompt and grounding",
      "model",
      "safety system",
      "user experience"
    ],
    correctAnswer: "safety system",
    type: "single",
    explanation: "The safety system layer includes platform-level configurations and capabilities that help mitigate harm. For example, the Azure OpenAI service includes support for content filters that apply criteria to suppress prompts and responses based on the classification of content into four severity levels (safe, low, medium, and high) for four categories of potential harm (hate, sexual, violence, and self-harm).",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q180",
    question: "[Answer choice] can return responses, such as natural language, images, or code, based on natural language input.",
    options: [
      "Computer vision",
      "Deep learning",
      "Generative AI",
      "Machine learning",
      "Reinforcement learning"
    ],
    correctAnswer: "Generative AI",
    type: "single",
    explanation: "Generative AI models offer the capability of generating images based on a prompt by using DALL-E models, such as generating images from natural language. The other AI capabilities are used in different contexts to achieve other goals.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q181",
    question: "Which technique can be used to identify constraints and styles for the responses of a generative AI model?",
    options: [
      "Data grounding",
      "Embeddings",
      "System messages",
      "Tokenization"
    ],
    correctAnswer: "System messages",
    type: "single",
    explanation: "System messages should be used to set the context for the model by describing expectations. Based on system messages, the model knows how to respond to prompts. The other techniques are also used in generative AI models, but for other use cases.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q182",
    question: "As per the NIST AI Risk Management Framework, what is the first stage to consider when developing a responsible generative AI solution?",
    options: [
      "Identify potential harms",
      "Measure the presence of potential harms",
      "Mitigate potential harms",
      "Operate the solution"
    ],
    correctAnswer: "Identify potential harms",
    type: "single",
    explanation: "Identifying potential harms is the first stage when planning a responsible generative AI solution.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q183",
    question: "Which two capabilities are examples of a GPT model?",
    options: [
      "Create natural language",
      "Detect specific dialects of a language",
      "Generate closed captions in real-time from a video",
      "Synthesize speech",
      "Understand natural language"
    ],
    correctAnswer: ["Create natural language", "Understand natural language"],
    type: "multiple",
    explanation: "Azure OpenAI natural language models can take in natural language and generate responses. GPT models are excellent at both understanding and creating natural language.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q184",
    question: "Which three capabilities are examples of image generation features for a generative AI model?",
    options: [
      "animation of static images",
      "creating variations of an image",
      "editing an image",
      "extracting RGB values from an image",
      "new image creation"
    ],
    correctAnswer: ["creating variations of an image", "editing an image", "new image creation"],
    type: "multiple",
    explanation: "Image generation models can take a prompt, a base image, or both, and create something new. These generative AI models can create both realistic and artistic images, change the layout or style of an image, and create variations of a provided image.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  {
    id: "q185",
    question: "Which capability is NOT supported by the DALL-E model?",
    options: [
      "image description",
      "image editing",
      "image generation",
      "image variations"
    ],
    correctAnswer: "image description",
    type: "single",
    explanation: "Image description is not a capability included in the DALL-E model, therefore, it is not a use case that can be implemented by using DALL-E, while the other three capabilities are offered by DALL-E in Azure OpenAI.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
   {
    id: "q186",
    question: "Which artificial intelligence (AI) technique serves as the foundation for modern image classification solutions?",
    options: [
      "Semantic Segmentation",
      "Deep Learning",
      "Linear Regression",
      "Multiple Linear Regression"
    ],
    correctAnswer: "Deep Learning",
    type: "single",
    explanation: "Modern image classification solutions are based on deep learning techniques. Semantic segmentation provides the ability to classify individual pixels in an image depending on the object that they represent. Both linear regression and multiple linear regression use training and validating predictions to predict numeric values, so they are not part of image classification solutions.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
  },
  
  {
    id: "q187_mc",
    question: "What are three Microsoft guiding principles for responsible AI?",
    options: [
      "knowledgeability",
      "inclusiveness",
      "fairness",
      "opinionatedness",
      "reliability and safety"
    ],
    correctAnswer: ["inclusiveness", "fairness", "reliability and safety"],
    type: "multiple",
    explanation: "Microsoft's guiding principles for responsible AI include inclusiveness, fairness, and reliability and safety. These are outlined in the referenced documentation on responsible AI principles.",
    documentationUrl: "https://docs.microsoft.com/en-us/learn/modules/responsible-ai-principles/4-guiding-principles"
  },
  {
  id: "sp2_q1",
  question: "Which type of machine learning should you use to predict the number of mobile phones that will be sold next month?",
  options: ["Regression", "Classification", "Clustering"],
  correctAnswer: "Regression",
  type: "single",
  explanation: "Regression predicts a numeric label from features.",
  documentationUrl: "https://docs.microsoft.com/en-us/learn/modules/create-regression-model-azure-machine-learning-designer/introduction"
},
{
  id: "sp2_q2",
  question: "You are working on a classification model and currently examining the values of a confusion matrix. Which machine learning task most appropriately describes the scenario?",
  options: ["model evaluation", "feature selection", "model training", "model deployment", "feature engineering"],
  correctAnswer: "model evaluation",
  type: "single",
  explanation: "Confusion matrix is used to evaluate classification models.",
  documentationUrl: "https://docs.microsoft.com/en-us/learn/modules/create-classification-model-azure-machine-learning-designer/evaluate-model"
},
{
  id: "sp2_q3",
  question: "An automated chat to answer questions about the price of a product, orders, refunds, exchanges and returns is an example of ____.",
  options: ["Anomaly Detection", "Natural Language Processing", "Conversational AI", "Computer Vision", "Knowledge Mining"],
  correctAnswer: "Conversational AI",
  type: "single",
  documentationUrl: "https://docs.microsoft.com/en-us/learn/paths/explore-conversational-ai/"
},
{
  id: "sp2_q4",
  question: "Ensure that AI systems are not the final authority on decisions that impact people's lives and that humans maintain meaningful control over autonomous AI systems. Which Microsoft Responsible AI principle is this?",
  options: ["privacy and security", "accountability", "reliability and safety", "fairness", "inclusiveness"],
  correctAnswer: "accountability",
  type: "single",
  explanation: "Designers are accountable; humans maintain meaningful control.",
  documentationUrl: "https://docs.microsoft.com/en-us/learn/modules/responsible-ai-principles/4-guiding-principles"
},
{
  id: "sp2_q5",
  question: "You build a model using Automated ML UI. To meet the Microsoft transparency principle, what should you do?",
  options: [
    "set Max concurrent iterations to zero",
    "set validation type to auto",
    "enable explain best model",
    "set primary metric to accuracy"
  ],
  correctAnswer: "enable explain best model",
  type: "single",
  documentationUrl: "https://docs.microsoft.com/en-us/azure/machine-learning/how-to-machine-learning-interpretability-automl"
},
{
  id: "sp2_q6",
  question: "Which AI service should you use to determine if a photo contains a person?",
  options: ["Natural Language Processing", "Anomaly Detection", "Conversational AI", "Computer Vision", "Knowledge Mining"],
  correctAnswer: "Computer Vision",
  type: "single",
  documentationUrl: "https://docs.microsoft.com/en-us/learn/modules/analyze-images-computer-vision/2-image-analysis-azure"
},
{
  id: "sp2_q7",
  question: "Extract date/time, URLs, email addresses and phone numbers from text. Which workload?",
  options: [
    "Speech recognition and speech synthesis",
    "Entity recognition",
    "Translation",
    "Key phrase extraction",
    "Sentiment analysis",
    "Language modelling"
  ],
  correctAnswer: "Entity recognition",
  type: "single",
  documentationUrl: "https://docs.microsoft.com/en-us/learn/modules/analyze-text-with-text-analytics-service/2-get-started-azure"
},
{
  id: "sp2_q8",
  question: "Which Responsible AI principle is most important for a self-driving car?",
  options: ["accountability", "transparency", "reliability and safety", "fairness", "inclusiveness"],
  correctAnswer: "reliability and safety",
  type: "single",
  documentationUrl: "https://docs.microsoft.com/en-us/learn/modules/responsible-ai-principles/4-guiding-principles"
},
{
  id: "sp2_q9",
  question: "Match Text Analytics features to scenarios for a news website: (1) understand how upset a writer is; (2) summarize important information; (3) extract key names.",
  options: [
    "(1)language detection (2)entity recognition (3)sentiment analysis",
    "(1)entity recognition (2)sentiment analysis (3)keyphrase extraction",
    "(1)keyphrase extraction (2)language detection (3)language detection",
    "(1)sentiment analysis (2)key-phrase extraction (3)Entity recognition",
    "NONE"
  ],
  correctAnswer: "(1)sentiment analysis (2)key-phrase extraction (3)Entity recognition",
  type: "single",
  documentationUrl: "https://docs.microsoft.com/en-us/learn/modules/analyze-text-with-text-analytics-service/2-get-started-azure"
},
{
  id: "sp2_q10",
  question: "From an FAQ PDF file, which AI service should be used to create a conversational support system?",
  options: ["QnA Maker", "Text Analytics", "Language Understanding", "Computer Vision"],
  correctAnswer: "QnA Maker",
  type: "single",
  documentationUrl: "https://azure.microsoft.com/en-in/services/cognitive-services/qna-maker/"
},
{
  id: "sp2_q11",
  question: "To interpret the meaning of a voice message 'meet me at 9 pm', which Azure AI service is most appropriate?",
  options: ["Speech", "Text Analytics", "Translator Text", "Language Understanding"],
  correctAnswer: "Language Understanding",
  type: "single",
  documentationUrl: "https://docs.microsoft.com/en-us/learn/modules/create-language-model-with-luis/1-introduction"
},
{
  id: "sp2_q12",
  question: "Which metric can you use to evaluate a classification model?",
  options: [
    "Coefficient of determination R2",
    "Relative Squared Error (RSE)",
    "True Positive Rate and False Positive Rate",
    "Root Mean Square Error (RMSE)",
    "Mean Absolute Error (MAE)"
  ],
  correctAnswer: "True Positive Rate and False Positive Rate",
  type: "single",
  documentationUrl: "https://docs.microsoft.com/en-us/learn/modules/create-classification-model-azure-machine-learning-designer/evaluate-model"
},
{
  id: "sp2_q13",
  question: "Splitting the address field into country, city and street number maps to which ML task?",
  options: ["feature selection", "model deployment", "feature engineering", "model evaluation", "model training"],
  correctAnswer: "feature engineering",
  type: "single",
  documentationUrl: "https://docs.microsoft.com/en-us/azure/machine-learning/concept-automated-ml"
},
{
  id: "sp2_q14",
  question: "Analyze online text reviews and evaluate if the content is positive or negative. Which workload?",
  options: [
    "Language modelling",
    "Entity recognition",
    "Speech recognition and speech synthesis",
    "Sentiment analysis",
    "Translation",
    "Key phrase extraction"
  ],
  correctAnswer: "Sentiment analysis",
  type: "single",
  documentationUrl: "https://docs.microsoft.com/en-us/learn/modules/analyze-text-with-text-analytics-service/2-get-started-azure"
},
{
  id: "sp2_q15",
  question: "Clean Missing Data: replace only 80% of missing values in Product_detail Dataset.csv. Which parameter?",
  options: [
    "Set Maximum missing value ratio to 80",
    "Set Maximum missing value ratio to 0.8",
    "Set Minimum missing value ratio to 20",
    "Set Minimum missing value ratio to 0.2"
  ],
  correctAnswer: "Set Maximum missing value ratio to 0.8",
  type: "single",
  documentationUrl: "https://docs.microsoft.com/en-us/azure/machine-learning/studio-module-reference/clean-missing-data"
},
{
  id: "sp2_q16",
  question: "Which two scenarios are examples of conversational AI? (Select two)",
  options: [
    "a chatbot that provides users with the ability to find answers on a website by themselves",
    "a telephone answering service that has pre-recorded message",
    "an application that creates FAQs by visiting public websites",
    "telephone voice menus to reduce the load on human resources"
  ],
  correctAnswer: [
    "a chatbot that provides users with the ability to find answers on a website by themselves",
    "telephone voice menus to reduce the load on human resources"
  ],
  type: "multiple",
  documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
},
{
  id: "sp2_q17",
  question: "Which two services should you use to reduce the load on telephone operators with a chatbot for predefined answers?",
  options: ["QnA Maker", "Azure Bot Service", "Text Analytics", "Translator Text"],
  correctAnswer: ["QnA Maker", "Azure Bot Service"],
  type: "multiple",
  documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
},
{
  id: "sp2_q18",
  question: "17 images fed to a model to identify apples. Actual apples=12. Model predicted 9, with 6 correct apples and 3 bananas. What is precision and recall?",
  options: [
    "precision is 3/12 and recall is 3/9",
    "precision is 6/9 and recall is 6/12",
    "precision is 6/17 and recall is 9/17",
    "precision is 6/12 and recall is 6/9"
  ],
  correctAnswer: "precision is 6/9 and recall is 6/12",
  type: "single",
  documentationUrl: "https://docs.microsoft.com/en-us/azure/machine-learning/concept-automated-ml"
},
{
  id: "sp2_q19",
  question: "How should you split data for training and evaluation?",
  options: [
    "use feature for training and labels for evaluation",
    "randomly split the data into rows for training and rows for evaluation",
    "use labels for training and features for evaluation",
    "random split the data into columns for training and columns for evaluation"
  ],
  correctAnswer: "randomly split the data into rows for training and rows for evaluation",
  type: "single",
  documentationUrl: "https://docs.microsoft.com/en-us/azure/machine-learning/studio-module-reference/split-data"
},
{
  id: "sp2_q20",
  question: "Ideal sequence of modules to predict house price in AML designer?",
  options: [
    "train model -> score model -> evaluate model",
    "score model -> train model -> evaluate model",
    "train model -> evaluate model -> score model",
    "evaluate model -> train model -> score model"
  ],
  correctAnswer: "train model -> score model -> evaluate model",
  type: "single",
  documentationUrl: "https://docs.microsoft.com/en-us/azure/machine-learning/tutorial-designer-automobile-price-train-score"
},
{
  id: "sp2_q21",
  question: "AI systems must comply with privacy laws that require transparency about data collection/use/storage and give consumers controls. Which principle?",
  options: ["fairness", "reliability and safety", "inclusiveness", "accountability", "privacy and security"],
  correctAnswer: "privacy and security",
  type: "single",
  explanation: "The privacy and security principle ensures AI systems comply with privacy laws and protect personal information. It requires transparency about data collection, use, and storage, and gives consumers appropriate controls over their data.",
  documentationUrl: "https://docs.microsoft.com/en-us/learn/modules/get-started-ai-fundamentals/7-understand-responsible-ai"
},
{
  id: "sp2_q22",
  question: "You have scanned documents and need to extract text key/value pairs and tables automatically. Which service?",
  options: ["Custom Vision", "Ink Recognizer", "Text Analytics", "Form Recognizer"],
  correctAnswer: "Form Recognizer",
  type: "single",
  explanation: "Form Recognizer (now called Document Intelligence) is specifically designed to extract text, key-value pairs, tables, and other structured data from documents including scanned documents, forms, and invoices.",
  documentationUrl: "https://docs.microsoft.com/en-us/learn/modules/analyze-receipts-form-recognizer/1-introduction"
},
{
  id: "sp2_q23",
  question: "Logistic regression is mostly used for solving regression problems.",
  options: ["TRUE", "FALSE"],
  correctAnswer: "FALSE",
  type: "single",
  documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
},
{
  id: "sp2_q24",
  question: "Which CV service helps build a mobile app for employees to scan and store expenses while travelling?",
  options: ["Optical Character Recognition", "Semantic Segmentation", "Image Classification", "Object Detection"],
  correctAnswer: "Optical Character Recognition",
  type: "single",
  documentationUrl: "https://docs.microsoft.com/en-us/learn/modules/read-text-computer-vision/2-ocr-azure"
},
{
  id: "sp2_q25",
  question: "Two datasets (16x4 and 16x3) should combine to 16x7 in AML designer. Which module?",
  options: [
    "Add Rows",
    "Remove duplicate Rows",
    "Add Columns",
    "Select columns in Dataset"
  ],
  correctAnswer: "Add Columns",
  type: "single",
  documentationUrl: "https://docs.microsoft.com/en-us/azure/machine-learning/studio-module-reference/add-columns"
},
{
  id: "sp2_q26",
  question: "The prediction of a model is determined by which data values?",
  options: ["identifiers", "features", "labels", "dependent variables"],
  correctAnswer: "features",
  type: "single",
  documentationUrl: "https://docs.microsoft.com/en-us/learn/modules/use-automated-machine-learning/what-is-ml"
},
{
  id: "sp2_q27",
  question: "You can use the ______ service to train an object detection model by using your phone images.",
  options: ["Computer Vision", "Form Recognizer", "Custom Vision", "Video Indexer"],
  correctAnswer: "Custom Vision",
  type: "single",
  documentationUrl: "https://docs.microsoft.com/en-us/learn/modules/detect-objects-images-custom-vision/2-object-detection-azure"
},
{
  id: "sp2_q28",
  question: "A binary classification model has AUC = 0.25. What can be said?",
  options: [
    "The model is performing worse than random guessing.",
    "There is a 75% chance the model can distinguish classes.",
    "The model is performing better than random guessing."
  ],
  correctAnswer: "The model is performing worse than random guessing.",
  type: "single",
  documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
},
{
  id: "sp2_q29",
  question: "What is the minimum number of features required to perform clustering?",
  options: ["1", "2", "0", "3"],
  correctAnswer: "1",
  type: "single",
  documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
},
{
  id: "sp2_q30",
  question: "Training a model to predict taxi fare. Which is a feature?",
  options: [
    "the trip distance of individual taxi Journeys",
    "the name and age of the passengers",
    "the number of taxi Journeys in the data set",
    "the trip ID of individual taxi Journeys",
    "the fare of individual taxi Journeys"
  ],
  correctAnswer: "the trip distance of individual taxi Journeys",
  type: "single",
  documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
},
{
  id: "sp2_q31",
  question: "Website content in English to be published in multiple languages based on user location. Which service?",
  options: ["Translator Text", "Language Understanding", "Text Analytics", "Speech"],
  correctAnswer: "Translator Text",
  type: "single",
  documentationUrl: "https://docs.microsoft.com/en-us/learn/modules/translate-text-with-translation-service/1-introduction"
},
{
  id: "sp2_q32",
  question: "An application that intelligently and interactively answers user questions is an example of ____.",
  options: ["Conversational AI", "Computer Vision", "Forecasting", "Anomaly Detection"],
  correctAnswer: "Conversational AI",
  type: "single",
  documentationUrl: "https://docs.microsoft.com/en-us/learn/modules/build-faq-chatbot-qna-maker-azure-bot-service/1-introduction"
},
{
  id: "sp2_q33",
  question: "Which of the following are CORRECT? (Select all that apply.)",
  options: [
    "Identifying famous landmarks in an image is an example of natural language processing.",
    "With NLP, a developer can automatically blacklist/whitelist certain words in reviews.",
    "Analyse social media feeds to detect sentiment around a political campaign is NLP."
  ],
  correctAnswer: [
    "With NLP, a developer can automatically blacklist/whitelist certain words in reviews.",
    "Analyse social media feeds to detect sentiment around a political campaign is NLP."
  ],
  type: "multiple",
  documentationUrl: "https://docs.microsoft.com/en-us/learn/modules/analyze-text-with-text-analytics-service/2-get-started-azure"
},
{
  id: "sp2_q34",
  question: "You created a training pipeline and need scalable clusters of VMs to experiment. Which compute target?",
  options: ["Inference Clusters", "Compute Clusters", "Compute Instances"],
  correctAnswer: "Compute Clusters",
  type: "single",
  documentationUrl: "https://docs.microsoft.com/en-us/learn/modules/use-automated-machine-learning/create-compute"
},
{
  id: "sp2_q35",
  question: "In a group of people, which facial recognition task can identify who the person is?",
  options: ["identification", "verification", "grouping", "similarity"],
  correctAnswer: "identification",
  type: "single",
  documentationUrl: "https://docs.microsoft.com/en-us/learn/modules/detect-analyze-faces/2-face-analysis-azure"
},
{
  id: "sp2_q36",
  question: "Predict hours of overtime worked based on number of incidents received. Which ML model?",
  options: ["regression", "classification", "clustering"],
  correctAnswer: "regression",
  type: "single",
  documentationUrl: "https://docs.microsoft.com/en-us/learn/modules/create-regression-model-azure-machine-learning-designer/"
},
{
  id: "sp2_q37",
  question: "The ability to extract date, time, quantity and price from a receipt is a capability of which service?",
  options: ["Computer Vision", "Form Recognizer", "Ink Recognizer", "Text Analytics"],
  correctAnswer: "Form Recognizer",
  type: "single",
  documentationUrl: "https://docs.microsoft.com/en-us/learn/modules/analyze-receipts-form-recognizer/1-introduction"
},
{
  id: "sp2_q38",
  question: "AML designer Split Data with Relative expression: Price < 70 splits the dataset into:",
  options: [
    "rows where Price >= 70",
    "rows where Price < 30",
    "rows where Price >= 30",
    "rows where Price < 70"
  ],
  correctAnswer: [
    "rows where Price >= 70",
    "rows where Price < 70"
  ],
  type: "multiple",
  documentationUrl: "https://docs.microsoft.com/en-us/azure/machine-learning/studio-module-reference/split-data-using-relative-expression"
},
{
  id: "sp2_q39",
  question: "Estimate distance between cars by determining their locations in an image. Which CV service?",
  options: ["Face Detection", "Object Detection", "Image Classification", "OCR"],
  correctAnswer: "Object Detection",
  type: "single",
  documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
},
{
  id: "sp2_q40",
  question: "The AI system should operate as designed, respond safely to unanticipated conditions, and resist harmful manipulation. Which principle?",
  options: ["fairness", "reliability and safety", "accountability", "privacy and security", "inclusiveness"],
  correctAnswer: "reliability and safety",
  type: "single",
  documentationUrl: "https://www.microsoft.com/en-us/ai/our-approach-to-ai"
},
{
  id: "sp2_q41",
  question: "You are developing a chatbot solution in Azure. Which service should you use to determine a user's intent?",
  options: ["Translator Text", "Language Understanding (LUIS)", "QnA Maker", "Speech"],
  correctAnswer: "Language Understanding (LUIS)",
  type: "single",
  documentationUrl: "https://docs.microsoft.com/en-us/learn/modules/create-language-model-with-language-understanding/2-get-started"
},
{
  id: "sp2_q42",
  question: "You wish to develop a restaurant reservation system. Which services would you need?",
  options: ["Azure QnA", "LUIS", "Cognitive Services", "Azure Bot Service"],
  correctAnswer: ["LUIS", "Azure Bot Service"],
  type: "multiple",
  documentationUrl: "https://docs.microsoft.com/en-us/azure/architecture/example-scenario/ai/commerce-chatbot"
},
{
  id: "sp2_q43",
  question: "You have an FAQ document and want to create a QnA Maker KB with least effort. What should you do?",
  options: [
    "Create empty KB and manually copy/paste",
    "Import pre-defined chit-chat data source",
    "Import the existing FAQ document into a new knowledge base"
  ],
  correctAnswer: "Import the existing FAQ document into a new knowledge base",
  type: "single",
  documentationUrl: "https://docs.microsoft.com/en-us/learn/modules/build-faq-chatbot-qna-maker-azure-bot-service/2-get-started-qna-bot"
},
{
  id: "sp2_q44",
  question: "Match facial recognition tasks to questions (Do two images of a face belong to the same person? etc.)",
  options: [
    "Identification Similarity Grouping Verification",
    "Verification Similarity Grouping Identification",
    "Identification Grouping Similarity Verification",
    "Verification Grouping Similarity Identification"
  ],
  correctAnswer: "Verification Similarity Grouping Identification",
  type: "single",
  documentationUrl: "https://docs.microsoft.com/en-us/learn/modules/detect-analyze-faces/2-face-analysis-azure"
},
{
  id: "sp2_q45",
  question: "Youâ€™ll use Speech to transcribe phone calls and Text Analytics to extract key phrases. Manage access and billing for services in a single Azure resource. Which resource?",
  options: ["Text Analytics", "Speech", "Cognitive Services"],
  correctAnswer: "Cognitive Services",
  type: "single",
  documentationUrl: "https://docs.microsoft.com/en-us/learn/modules/analyze-text-with-text-analytics-service/2-get-started-azure"
},
{
  id: "sp2_q46",
  question: "AML designer model has AUC=0.3. What can you conclude?",
  options: [
    "The model predicts accurately for 70% of test cases.",
    "The model performs worse than random guessing.",
    "The model can explain 30% of the variance between true and predicted labels."
  ],
  correctAnswer: "The model performs worse than random guessing.",
  type: "single",
  explanation: "AUC (Area Under the Curve) measures a model's ability to distinguish between classes. An AUC of 0.5 represents random guessing, so an AUC of 0.3 indicates the model performs worse than random chance. Good models typically have AUC > 0.7.",
  documentationUrl: "https://docs.microsoft.com/en-us/azure/cognitive-services/"
},
{
  id: "sp2_q47",
  question: "NLP processed text shows recognized items like DateTime, Organization, Numbers, etc. Which NLP task?",
  options: ["sentiment analysis", "key phrase extraction", "entity recognition", "translation"],
  correctAnswer: "entity recognition",
  type: "single",
  explanation: "Entity recognition (also called Named Entity Recognition or NER) identifies and categorizes specific entities in text such as DateTime, Organization, Numbers, Person names, and other structured information.",
  documentationUrl: "https://docs.microsoft.com/en-us/learn/modules/analyze-text-with-text-analytics-service/2-get-started-azure"
},
{
  id: "sp2_q48",
  question: "Author a LUIS app for an international clock. Users ask 'What is the time in London?'. What should you do?",
  options: [
    "Define a \"city\" entity and a \"GetTime\" intent with representative utterances.",
    "Create an intent for each city with a specific utterance.",
    "Add the utterance 'What time is it in city' to the 'None' intent."
  ],
  correctAnswer: "Define a \"city\" entity and a \"GetTime\" intent with representative utterances.",
  type: "single",
  explanation: "LUIS best practices recommend using entities to capture variable information (like city names) and intents to capture the user's purpose (like getting time). This approach scales better than creating separate intents for each possible city.",
  documentationUrl: "https://docs.microsoft.com/en-us/learn/modules/create-language-model-with-language-understanding/2-get-started"
},
{
  id: "sp2_q49",
  question: "When categorizing an image, Computer Vision supports which specialized domain models?",
  options: ["Brands", "Landmarks", "Celebrities", "Monuments"],
  correctAnswer: ["Landmarks", "Celebrities"],
  type: "multiple",
  explanation: "Azure Computer Vision service supports two specialized domain models for image categorization: Landmarks (to identify famous landmarks) and Celebrities (to identify famous people). These models provide more detailed recognition than general image classification.",
  documentationUrl: "https://docs.microsoft.com/en-us/learn/modules/analyze-images-computer-vision/2-image-analysis-azure"
},
{
  id: "sp2_q50",
  question: "Develop a web-based AI solution for a customer support system. Which service should you use?",
  options: ["QnA Maker", "Translator Text", "Custom Vision", "Face"],
  correctAnswer: "QnA Maker",
  type: "single",
  explanation: "QnA Maker (now part of Azure Cognitive Service for Language) is specifically designed for building knowledge bases that can power FAQ bots and customer support systems by automatically generating question-answer pairs from existing content.",
  documentationUrl: "https://docs.microsoft.com/en-us/learn/modules/build-faq-chatbot-qna-maker-azure-bot-service/2-get-started-qna-bot"
},
{
  id: "sp2_q51",
  question: "For each statement, select Yes/No: (1) Labelling tags training data with known values (2) Evaluate on same data used for training (3) Accuracy is always the primary metric.",
  options: [
    "True, False, True",
    "True, True, False",
    "True, False, False"
  ],
  correctAnswer: "True, False, False",
  type: "single",
  explanation: "Statement 1 is true - labeling training data with known values is correct. Statement 2 is false - you should never evaluate on the same data used for training (this causes overfitting). Statement 3 is false - accuracy isn't always the primary metric (sometimes precision, recall, or F1-score are more important).",
  documentationUrl: "https://docs.microsoft.com/en-us/azure/machine-learning/studio/evaluate-model-performance"
},
{
  id: "sp2_q52",
  question: "K-Means clustering in AML designer should assign items to 3 clusters. Which configuration?",
  options: [
    "Set Number of Centroids to 3",
    "Set Random number seed to 3",
    "Set Iterations to 3"
  ],
  correctAnswer: "Set Number of Centroids to 3",
  type: "single",
  explanation: "In K-Means clustering, the number of centroids directly determines the number of clusters. To create 3 clusters, you must set the Number of Centroids parameter to 3. Random seed and iterations control randomness and convergence but not the cluster count.",
  documentationUrl: "https://docs.microsoft.com/en-us/learn/modules/create-clustering-model-azure-machine-learning-designer/introduction"
},
{
  id: "sp2_q53",
  question: "You want to read incoming email subjects aloud. Which API?",
  options: ["Translate", "Speech-to-Text", "Text-to-Speech"],
  correctAnswer: "Text-to-Speech",
  type: "single",
  explanation: "Text-to-Speech (TTS) converts written text into spoken words, which is exactly what's needed to read email subjects aloud. Speech-to-Text does the opposite (converts speech to text), and Translate converts between languages.",
  documentationUrl: "https://docs.microsoft.com/en-us/learn/modules/recognize-synthesize-speech/2-get-started-azure"
},
{
  id: "sp2_q54",
  question: "Tourist translator app (text or audio). Which services? (Select one or more)",
  options: ["Translator Text", "Text Analytics", "Azure Speech", "Speech Analytics"],
  correctAnswer: ["Translator Text", "Azure Speech"],
  type: "multiple",
  explanation: "A tourist translator app needs Translator Text (to translate between languages) and Azure Speech (for speech-to-text and text-to-speech capabilities to handle audio input/output). Text Analytics analyzes sentiment/entities but doesn't translate, and Speech Analytics isn't a real Azure service.",
  documentationUrl: "https://docs.microsoft.com/en-us/learn/modules/translate-text-with-translation-service/2-get-started-azure"
},
{
  id: "sp2_q55",
  question: "Deliver a support bot usable in Teams and Web Chat. What should you do?",
  options: [
    "Create two bots for the same KB (Teams and Web Chat)",
    "Create two KBs, one for each channel",
    "Create a KB and one bot, then connect both Web Chat and Teams channels"
  ],
  correctAnswer: "Create a KB and one bot, then connect both Web Chat and Teams channels",
  type: "single",
  explanation: "Azure Bot Service supports multiple channels from a single bot instance. You create one knowledge base and one bot, then configure multiple channels (Teams, Web Chat, etc.) to connect to the same bot. This approach reduces maintenance and ensures consistency.",
  documentationUrl: "https://docs.microsoft.com/en-us/learn/modules/build-faq-chatbot-qna-maker-azure-bot-service/2-get-started-qna-bot"
},
{
  id: "sp2_q56",
  question: "Sentiment analysis returns 0.99. What does it indicate?",
  options: ["The document is positive.", "The document is neutral.", "The document is negative."],
  correctAnswer: "The document is positive.",
  type: "single",
  explanation: "In Azure Text Analytics sentiment analysis, scores range from 0 to 1, where values close to 1 indicate positive sentiment, values around 0.5 indicate neutral sentiment, and values close to 0 indicate negative sentiment. A score of 0.99 indicates very positive sentiment.",
  documentationUrl: "https://docs.microsoft.com/en-us/learn/modules/analyze-text-with-text-analytics-service/2-get-started-azure"
}

];

export const seedQuestions: Question[] = rawQuestions.map(convertQuestion);
