import { NextResponse } from 'next/server';
import { seedQuestions } from '@/lib/seed-data';

export async function GET() {
  try {
    console.log('Admin endpoint - seedQuestions.length:', seedQuestions.length);
    
    // Return all questions from seed data
    const questions = seedQuestions.map(q => ({
      id: q.id,
      stem: q.stem,
      options: q.options,
      correctOptions: q.correctOptions,
      explanation: q.explanation,
      difficulty: q.difficulty,
      objectiveId: q.objectiveId,
    }));

    console.log('Admin endpoint - mapped questions.length:', questions.length);

    return NextResponse.json({
      success: true,
      questions,
      count: questions.length,
    });
  } catch (error: any) {
    console.error('Error fetching questions:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch questions',
    }, { status: 500 });
  }
}
