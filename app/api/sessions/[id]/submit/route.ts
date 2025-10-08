import { NextRequest, NextResponse } from 'next/server';
import { dataStore } from '@/lib/data-store';
import { getSessionUser } from '@/lib/auth';
import { calculateSessionSummary, isAnswerCorrect } from '@/lib/scoring';
import '@/lib/init';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    if (session.completedAt) {
      return NextResponse.json(
        { success: false, error: 'Session already completed' },
        { status: 400 }
      );
    }

    // Calculate per-category accuracy
    const questions = session.questionIds
      .map((id) => dataStore.getQuestion(id))
      .filter((q): q is NonNullable<typeof q> => q !== undefined);

    const categoryStats = new Map<string, { correct: number; total: number }>();

    questions.forEach((question) => {
      const userAnswer = session.answers[question.id] || [];
      const correct = isAnswerCorrect(question, userAnswer);

      if (!categoryStats.has(question.objectiveId)) {
        categoryStats.set(question.objectiveId, { correct: 0, total: 0 });
      }
      const stats = categoryStats.get(question.objectiveId)!;
      stats.total++;
      if (correct) stats.correct++;
    });

    const perCategoryAccuracy = Object.fromEntries(categoryStats);

    // Mark session as completed
    const updatedSession = dataStore.updateSession(id, {
      completedAt: new Date().toISOString(),
      perCategoryAccuracy,
    });

    if (!updatedSession) {
      return NextResponse.json(
        { success: false, error: 'Failed to update session' },
        { status: 500 }
      );
    }

    // Calculate and return summary
    const summary = calculateSessionSummary(updatedSession);

    console.log(`[Session] Completed session ${id} with score ${summary.score}%`);

    return NextResponse.json({
      success: true,
      summary,
    });
  } catch (error) {
    console.error('Submit session error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
