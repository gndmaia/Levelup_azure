# Read the source file
$sourceFile = "C:\Users\brunomaia\Downloads\Complete set of Azure AI-900 exam.txt"
$outputFile = "C:\Users\Public\Documents\levelup-azure\lib\seed-data-full.ts"

# Read content
$content = Get-Content $sourceFile -Raw

# Extract the array content between the brackets
$arrayMatch = [regex]::Match($content, 'export const azureQuestions = \[(.+)\];', [System.Text.RegularExpressions.RegexOptions]::Singleline)
if ($arrayMatch.Success) {
    $arrayContent = $arrayMatch.Groups[1].Value
    
    # Write output file header
    $output = @"
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
$arrayContent
];

export const seedQuestions: Question[] = rawQuestions.map(convertQuestion);
"@
    
    $output | Out-File -FilePath $outputFile -Encoding UTF8
    Write-Host " Created $outputFile with all questions"
    Write-Host "File size: $((Get-Item $outputFile).Length / 1KB) KB"
} else {
    Write-Host " Failed to extract questions array"
}
