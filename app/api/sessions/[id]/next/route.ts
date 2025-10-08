import { NextRequest, NextResponse } from 'next/server';
import { dataStore } from '@/lib/data-store';
import { getSessionUser } from '@/lib/auth';
import '@/lib/init';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.cookies.get('session')?.value || null;
    const user = getSessionUser(token);

    // Allow guest access - use a guest user ID if not authenticated
    const userId = user?.id || 'guest';

    const { id } = await params;
    const session = dataStore.getSession(id);

    if (!session || session.userId !== userId) {
      return NextResponse.json(
        { success: false, error: 'Session not found' },
        { status: 404 }
      );
    }

    // Find the next unanswered question
    const nextQuestionId = session.questionIds.find(
      (qId) => !session.answers[qId]
    );

    if (!nextQuestionId) {
      return NextResponse.json({
        success: true,
        completed: true,
      });
    }

    const question = dataStore.getQuestion(nextQuestionId);

    if (!question) {
      return NextResponse.json(
        { success: false, error: 'Question not found' },
        { status: 404 }
      );
    }

    const currentIndex = session.questionIds.indexOf(nextQuestionId);
    const userAnswer = session.answers[nextQuestionId] || [];

    return NextResponse.json({
      success: true,
      question,
      questionNumber: currentIndex + 1,
      totalQuestions: session.questionIds.length,
      userAnswer,
      completed: false,
    });
  } catch (error) {
    console.error('Get next question error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
