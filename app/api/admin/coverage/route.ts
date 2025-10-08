import { NextRequest, NextResponse } from 'next/server';
import { dataStore } from '@/lib/data-store';
import { getSessionUser } from '@/lib/auth';
import '@/lib/init';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('session')?.value || null;
    const user = getSessionUser(token);

    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const examId = searchParams.get('examId') || 'AI-900';

    const coverage = dataStore.getCoverage(examId);

    return NextResponse.json({
      success: true,
      coverage,
    });
  } catch (error) {
    console.error('Coverage error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
