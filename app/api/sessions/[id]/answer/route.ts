import { NextRequest, NextResponse } from 'next/server';
import { dataStore } from '@/lib/data-store';
import { getSessionUser } from '@/lib/auth';
import { isAnswerCorrect } from '@/lib/scoring';
import '@/lib/init';

export async function POST(
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

    const { questionId, selectedOptions } = await request.json();

    if (!questionId || !Array.isArray(selectedOptions)) {
      return NextResponse.json(
        { success: false, error: 'Invalid request' },
        { status: 400 }
      );
    }

    const question = dataStore.getQuestion(questionId);

    if (!question) {
      return NextResponse.json(
        { success: false, error: 'Question not found' },
        { status: 404 }
      );
    }

    // Store the answer
    const updatedSession = dataStore.updateSession(id, {
      answers: {
        ...session.answers,
        [questionId]: selectedOptions,
      },
    });

    if (!updatedSession) {
      return NextResponse.json(
        { success: false, error: 'Failed to update session' },
        { status: 500 }
      );
    }

    console.log(`[Session] Answer recorded for question ${questionId} in session ${id}`);

    // For practice mode, return immediate feedback
    if (session.mode === 'practice') {
      const correct = isAnswerCorrect(question, selectedOptions);
      return NextResponse.json({
        success: true,
        feedback: {
          isCorrect: correct,
          explanation: question.explanation,
          references: question.references,
          correctOptions: question.correctOptions,
        },
      });
    }

    // For exam mode, don't return feedback
    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error('Answer submission error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
