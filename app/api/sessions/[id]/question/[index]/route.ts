import { NextRequest, NextResponse } from 'next/server';
import { dataStore } from '@/lib/data-store';
import { getSessionUser } from '@/lib/auth';
import '@/lib/init';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; index: string }> }
) {
  try {
    const token = request.cookies.get('session')?.value || null;
    const user = getSessionUser(token);

    // Allow guest access - use a guest user ID if not authenticated
    const userId = user?.id || 'guest';

    const { id } = await params;
    const { index: indexStr } = await params;
    const index = parseInt(indexStr, 10) - 1; // Convert to 0-based index

    const session = dataStore.getSession(id);

    if (!session || session.userId !== userId) {
      return NextResponse.json(
        { success: false, error: 'Session not found' },
        { status: 404 }
      );
    }

    if (index < 0 || index >= session.questionIds.length) {
      return NextResponse.json(
        { success: false, error: 'Invalid question index' },
        { status: 400 }
      );
    }

    const questionId = session.questionIds[index];
    const question = dataStore.getQuestion(questionId);

    if (!question) {
      return NextResponse.json(
        { success: false, error: 'Question not found' },
        { status: 404 }
      );
    }

    // Return the question and whether it's already been answered
    const userAnswer = session.answers[questionId] || [];

    return NextResponse.json({
      success: true,
      question,
      questionNumber: index + 1,
      totalQuestions: session.questionIds.length,
      userAnswer, // Send back the user's previous answer if they had one
      isAnswered: userAnswer.length > 0,
    });
  } catch (error) {
    console.error('Get question by index error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
