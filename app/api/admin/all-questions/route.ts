import { NextResponse } from 'next/server';
import { seedQuestions } from '@/lib/seed-data';
import { seedQuestionsAZ900 } from '@/lib/seed-data-az900';
import { seedQuestionsAB731 } from '@/lib/seed-data-ab731';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const exam = searchParams.get('exam') || 'AI-900';
    
    // Select the appropriate question set
    const sourceQuestions = exam === 'AB-731' ? seedQuestionsAB731
      : exam === 'AZ-900' ? seedQuestionsAZ900 : seedQuestions;
    
    console.log(`Admin endpoint - ${exam} questions:`, sourceQuestions.length);
    
    // Return all questions from seed data
    const questions = sourceQuestions.map(q => ({
      id: q.id,
      stem: q.stem,
      options: q.options,
      correctOptions: q.correctOptions,
      explanation: q.explanation,
      difficulty: q.difficulty,
      objectiveId: q.objectiveId,
    }));

    return NextResponse.json({
      success: true,
      questions,
      count: questions.length,
      exam: exam,
    });
  } catch (error: any) {
    console.error('Error fetching questions:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch questions',
    }, { status: 500 });
  }
}
