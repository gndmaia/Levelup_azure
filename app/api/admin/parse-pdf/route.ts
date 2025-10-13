import { NextResponse } from 'next/server';
import crypto from 'crypto';

interface ParsedQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  correctAnswers?: number[];
  isMultipleChoice?: boolean;
  explanation: string;
  reference: string;
  category: string;
  tempId: string;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || typeof file === 'string') {
      return NextResponse.json({ success: false, error: 'No file uploaded' });
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Use pdf2json which is more Next.js friendly
    const PDFParser = (await import('pdf2json')).default;
    
    const text = await new Promise<string>((resolve, reject) => {
      const pdfParser = new (PDFParser as any)(null, 1);
      
      pdfParser.on('pdfParser_dataReady', (pdfData: any) => {
        try {
          // Extract text from all pages
          const pages = pdfData.Pages || [];
          const allText = pages.map((page: any) => {
            const texts = page.Texts || [];
            const pageText = texts.map((text: any) => {
              return decodeURIComponent(text.R?.[0]?.T || '');
            }).join('');
            
            // Remove extra spaces between characters (common pdf2json issue)
            return pageText.replace(/\s+/g, ' ').trim();
          }).join('\n\n');
          
          resolve(allText);
        } catch (e) {
          reject(e);
        }
      });
      
      pdfParser.on('pdfParser_dataError', (error: any) => {
        reject(error);
      });
      
      // Parse the buffer
      pdfParser.parseBuffer(buffer);
    });

    console.log('PDF parsed, text length:', text.length);
    console.log('First 500 chars:', text.substring(0, 500));

    // Parse questions from text
    const questions = parsePdfQuestions(text);

    console.log(`Parsed ${questions.length} questions from PDF`);

    return NextResponse.json({
      success: true,
      questions,
      message: `Successfully parsed ${questions.length} questions`,
    });
  } catch (error) {
    console.error('Error parsing PDF:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to parse PDF',
    });
  }
}

function parsePdfQuestions(text: string): ParsedQuestion[] {
  const questions: ParsedQuestion[] = [];
  
  // Common patterns for AZ-900 exam questions
  // Pattern 1: "Question #N" or "QUESTION N"
  const questionPattern = /(?:Question|QUESTION)\s*[#:]?\s*(\d+)/gi;
  
  // Split text into potential question blocks
  const splits = text.split(questionPattern);
  
  console.log('Split into', splits.length, 'parts');

  // Process each question block
  for (let i = 1; i < splits.length; i += 2) {
    const questionNumber = splits[i];
    const questionBlock = splits[i + 1];
    
    if (!questionBlock) continue;

    try {
      const parsed = parseQuestionBlock(questionBlock, parseInt(questionNumber));
      if (parsed) {
        questions.push(parsed);
      }
    } catch (error) {
      console.error(`Error parsing question ${questionNumber}:`, error);
    }
  }

  // If no questions found with pattern, try alternative parsing
  if (questions.length === 0) {
    console.log('No questions found with standard pattern, trying alternative parsing...');
    return parseAlternativeFormat(text);
  }

  return questions;
}

function parseQuestionBlock(block: string, questionNumber: number): ParsedQuestion | null {
  const lines = block.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  
  if (lines.length < 3) return null;

  // Extract question text (usually first few lines before options)
  let questionText = '';
  let optionStartIndex = -1;
  
  // Look for option markers: A., A), (A), or similar
  const optionPattern = /^[A-Z][\.)]/;
  
  for (let i = 0; i < lines.length; i++) {
    if (optionPattern.test(lines[i]) || /^\([A-Z]\)/.test(lines[i])) {
      optionStartIndex = i;
      break;
    }
  }

  if (optionStartIndex === -1) {
    // No clear options found, take first line as question
    questionText = lines[0];
    optionStartIndex = 1;
  } else {
    // Everything before options is the question
    questionText = lines.slice(0, optionStartIndex).join(' ');
  }

  // Extract options
  const options: string[] = [];
  let explanationStartIndex = optionStartIndex;
  
  for (let i = optionStartIndex; i < lines.length; i++) {
    const line = lines[i];
    
    // Check if this is an option
    if (optionPattern.test(line) || /^\([A-Z]\)/.test(line)) {
      // Remove the letter prefix
      const optionText = line.replace(/^[A-Z][\.)]\s*/, '').replace(/^\([A-Z]\)\s*/, '');
      options.push(optionText);
    } else if (options.length > 0) {
      // Found non-option line after options started
      explanationStartIndex = i;
      break;
    }
  }

  if (options.length < 2) {
    console.log(`Question ${questionNumber}: Not enough options found (${options.length})`);
    return null;
  }

  // Extract explanation and answer
  const remainingText = lines.slice(explanationStartIndex).join('\n');
  
  // Look for answer indicators
  const answerPatterns = [
    /(?:Correct Answer|Answer|ANSWER):\s*([A-Z])/i,
    /(?:The correct answer is|Correct option is):\s*([A-Z])/i,
  ];
  
  let correctAnswer = 0; // Default to first option
  let explanation = '';
  let reference = '';
  
  for (const pattern of answerPatterns) {
    const match = remainingText.match(pattern);
    if (match) {
      const answerLetter = match[1].toUpperCase();
      correctAnswer = answerLetter.charCodeAt(0) - 'A'.charCodeAt(0);
      break;
    }
  }

  // Extract explanation (text after "Explanation:" or similar)
  const explanationMatch = remainingText.match(/(?:Explanation|EXPLANATION|Rationale):\s*([\s\S]+?)(?=(?:Reference|REFERENCE|Question|$))/i);
  if (explanationMatch) {
    explanation = explanationMatch[1].trim();
  }

  // Extract reference
  const referenceMatch = remainingText.match(/(?:Reference|REFERENCE):\s*([\s\S]+?)(?=Question|$)/i);
  if (referenceMatch) {
    reference = referenceMatch[1].trim();
  }

  // Determine category based on keywords
  const category = determineCategory(questionText);

  const tempId = crypto.randomBytes(8).toString('hex');

  return {
    id: `az900-${questionNumber}`,
    question: questionText,
    options,
    correctAnswer,
    isMultipleChoice: false,
    explanation: explanation || 'No explanation provided',
    reference: reference || '',
    category,
    tempId,
  };
}

function parseAlternativeFormat(text: string): ParsedQuestion[] {
  // Try to parse questions in a more flexible way
  const questions: ParsedQuestion[] = [];
  
  // Split by double newlines or clear separators
  const blocks = text.split(/\n\s*\n/);
  
  console.log('Alternative parsing: found', blocks.length, 'blocks');
  
  let questionNumber = 1;
  for (const block of blocks) {
    if (block.length < 50) continue; // Skip short blocks
    
    const parsed = parseQuestionBlock(block, questionNumber);
    if (parsed) {
      questions.push(parsed);
      questionNumber++;
    }
  }
  
  return questions;
}

function determineCategory(questionText: string): string {
  const text = questionText.toLowerCase();
  
  if (text.includes('cloud') || text.includes('iaas') || text.includes('paas') || text.includes('saas')) {
    return 'cloud-concepts';
  }
  if (text.includes('virtual machine') || text.includes('storage') || text.includes('compute') || text.includes('network')) {
    return 'core-services';
  }
  if (text.includes('security') || text.includes('compliance') || text.includes('privacy') || text.includes('identity')) {
    return 'security-privacy-compliance';
  }
  if (text.includes('cost') || text.includes('pricing') || text.includes('support') || text.includes('sla')) {
    return 'pricing-support';
  }
  
  return 'cloud-concepts'; // Default category
}
