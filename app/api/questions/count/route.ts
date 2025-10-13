import { NextResponse } from 'next/server';
import { seedQuestions } from '@/lib/seed-data';
import { seedQuestionsAZ900 } from '@/lib/seed-data-az900';

export async function GET(request: Request) {
  try {
    // Get exam parameter from URL
    const { searchParams } = new URL(request.url);
    const exam = searchParams.get('exam') || 'AI-900'; // Default to AI-900
    
    let questions;
    if (exam === 'AZ-900') {
      questions = seedQuestionsAZ900;
    } else {
      questions = seedQuestions; // AI-900
    }
    
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
