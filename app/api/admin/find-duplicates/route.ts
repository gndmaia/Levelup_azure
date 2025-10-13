import { NextResponse } from 'next/server';
import { seedQuestions } from '@/lib/seed-data';
import { seedQuestionsAZ900 } from '@/lib/seed-data-az900';

interface DuplicateGroup {
  questions: any[];
  similarity: number;
}

// Clean text and extract all words
function cleanAndGetWords(text: string): string[] {
  // Remove any HTML tags, image markers, and extra whitespace
  const cleaned = text
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/\[.*?\]/g, '') // Remove image markers
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
  
  return cleaned.split(' ').filter(word => word.length > 0);
}

// Get all consecutive N-word sequences from text
function getWordSequences(words: string[], sequenceLength: number = 10): Set<string> {
  const sequences = new Set<string>();
  
  if (words.length < sequenceLength) {
    return sequences;
  }
  
  // Generate all consecutive sequences
  for (let i = 0; i <= words.length - sequenceLength; i++) {
    const sequence = words.slice(i, i + sequenceLength).join(' ').toLowerCase();
    sequences.add(sequence);
  }
  
  return sequences;
}

// Check if two questions share any 10 consecutive words
function hasMatchingSequence(str1: string, str2: string): boolean {
  const words1 = cleanAndGetWords(str1);
  const words2 = cleanAndGetWords(str2);
  
  // Get all 10-word sequences from both questions
  const sequences1 = getWordSequences(words1, 10);
  const sequences2 = getWordSequences(words2, 10);
  
  // Check if any sequences match
  for (const seq of sequences1) {
    if (sequences2.has(seq)) {
      return true;
    }
  }
  
  return false;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const exam = searchParams.get('exam') || 'AI-900';
    
    // Select the appropriate question set
    const questions = exam === 'AZ-900' ? seedQuestionsAZ900 : seedQuestions;
    
    const duplicates: DuplicateGroup[] = [];
    const processedQuestions = new Set<string>();

    // Compare each question with every other question
    for (let i = 0; i < questions.length; i++) {
      if (processedQuestions.has(questions[i].id)) continue;

      const currentGroup: any[] = [questions[i]];

      for (let j = i + 1; j < questions.length; j++) {
        if (processedQuestions.has(questions[j].id)) continue;

        // Check if questions share any 10 consecutive words
        const isMatch = hasMatchingSequence(
          questions[i].stem,
          questions[j].stem
        );

        if (isMatch) {
          currentGroup.push(questions[j]);
          processedQuestions.add(questions[j].id);
        }
      }

      // If we found duplicates, add to results
      if (currentGroup.length > 1) {
        processedQuestions.add(questions[i].id);
        duplicates.push({
          questions: currentGroup.map(q => ({
            id: q.id,
            stem: q.stem,
            options: q.options,
            correctOptions: q.correctOptions,
            explanation: q.explanation,
            difficulty: q.difficulty,
            objectiveId: q.objectiveId,
          })),
          similarity: 1.0, // Exact match on first 6 words
        });
      }
    }

    return NextResponse.json({
      success: true,
      duplicates,
      count: duplicates.length,
      totalQuestionsAnalyzed: seedQuestions.length,
    });
  } catch (error: any) {
    console.error('Error finding duplicates:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to find duplicates',
    }, { status: 500 });
  }
}
