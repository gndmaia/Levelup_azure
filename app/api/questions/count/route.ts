import { NextResponse } from 'next/server';
import { seedQuestions } from '@/lib/seed-data';

export async function GET() {
  try {
    // Return count from seed data directly, same as admin endpoint
    return NextResponse.json({
      success: true,
      count: seedQuestions.length,
      timestamp: new Date().toISOString(),
      debug: 'Using seedQuestions.length directly'
    });
  } catch (error) {
    console.error('Get question count error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
