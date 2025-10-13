import { NextRequest, NextResponse } from 'next/server';
import { dataStore } from '@/lib/data-store';
import { getSessionUser } from '@/lib/auth';
import { selectExamQuestions, selectPracticeQuestions } from '@/lib/question-selector';
import { Session } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import '@/lib/init';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('session')?.value || null;
    const user = getSessionUser(token);

    // Allow guest access - use a guest user ID if not authenticated
    const userId = user?.id || 'guest';

    const { mode, objectiveIds, questionCount, timeLimitSec, examId } = await request.json();

    if (!mode || !['practice', 'exam'].includes(mode)) {
      return NextResponse.json(
        { success: false, error: 'Invalid mode' },
        { status: 400 }
      );
    }

    // Default to AI-900 if not specified
    const selectedExam = examId || 'AI-900';

    // Select questions based on mode
    let questions;
    if (mode === 'exam') {
      questions = selectExamQuestions(selectedExam, {
        totalQuestions: questionCount || (selectedExam === 'AZ-900' ? 60 : 45),
        easyPercentage: 0.4,
        mediumPercentage: 0.4,
        hardPercentage: 0.2,
      });
    } else {
      questions = selectPracticeQuestions(
        userId,
        objectiveIds,
        questionCount || 10,
        selectedExam
      );
    }

    if (questions.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No questions available' },
        { status: 404 }
      );
    }

    const session: Session = {
      id: uuidv4(),
      userId: userId,
      mode,
      startedAt: new Date().toISOString(),
      timeLimitSec: mode === 'exam' ? (timeLimitSec || 3600) : undefined,
      questionIds: questions.map((q) => q.id),
      answers: {},
      flaggedQuestions: [],
      bookmarkedQuestions: [],
    };

    dataStore.createSession(session);

    console.log(`[Session] Created ${mode} session ${session.id} for user ${userId} with ${questions.length} questions`);

    return NextResponse.json({
      success: true,
      session,
    });
  } catch (error) {
    console.error('Create session error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('session')?.value || null;
    const user = getSessionUser(token);

    // Allow guest access - use a guest user ID if not authenticated
    const userId = user?.id || 'guest';

    const sessions = dataStore.getUserSessions(userId);

    return NextResponse.json({
      success: true,
      sessions,
    });
  } catch (error) {
    console.error('Get sessions error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
