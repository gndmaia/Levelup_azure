import { NextResponse } from 'next/server';
import { dataStore } from '@/lib/data-store';
import { seedQuestions } from '@/lib/seed-data';

export async function GET() {
  try {
    const allQuestions = dataStore.getAllQuestions();
    const publishedQuestions = dataStore.getPublishedQuestions('AI-900');
    
    return NextResponse.json({
      success: true,
      seedQuestionsCount: seedQuestions.length,
      allQuestionsInStore: allQuestions.length,
      publishedQuestions: publishedQuestions.length,
      sampleQuestion: publishedQuestions[0] || null,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
    }, { status: 500 });
  }
}
