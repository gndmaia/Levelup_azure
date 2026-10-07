import { NextResponse } from 'next/server';
import { getSeedQuestionsForExam } from '@/lib/question-banks';

export async function GET(request: Request) {
  try {
    // Get exam parameter from URL
    const { searchParams } = new URL(request.url);
    const exam = searchParams.get('exam') || 'AI-900'; // Default to AI-900
    
    const questions = getSeedQuestionsForExam(exam);
    
    return NextResponse.json({
      success: true,
      count: questions.length,
      exam: exam,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Get question count error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
