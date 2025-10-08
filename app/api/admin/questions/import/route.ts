import { NextRequest, NextResponse } from 'next/server';
import { dataStore } from '@/lib/data-store';
import { getSessionUser } from '@/lib/auth';
import { Question } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import '@/lib/init';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('session')?.value || null;
    const user = getSessionUser(token);

    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { questions } = await request.json();

    if (!Array.isArray(questions)) {
      return NextResponse.json(
        { success: false, error: 'Invalid format' },
        { status: 400 }
      );
    }

    const errors: Array<{ row: number; message: string }> = [];
    const warnings: Array<{ row: number; message: string }> = [];
    let imported = 0;

    questions.forEach((q, index) => {
      const row = index + 1;

      // Validate required fields
      if (!q.examId || !q.objectiveId || !q.stem || !q.options || !q.correctOptions) {
        errors.push({ row, message: 'Missing required fields' });
        return;
      }

      if (!Array.isArray(q.options) || q.options.length === 0) {
        errors.push({ row, message: 'Options must be a non-empty array' });
        return;
      }

      if (!Array.isArray(q.correctOptions) || q.correctOptions.length === 0) {
        errors.push({ row, message: 'correctOptions must be a non-empty array' });
        return;
      }

      // Validate correct options are in options
      const optionIds = q.options.map((o: any) => o.id);
      const invalidCorrect = q.correctOptions.filter((c: string) => !optionIds.includes(c));
      if (invalidCorrect.length > 0) {
        errors.push({ row, message: `Invalid correct options: ${invalidCorrect.join(', ')}` });
        return;
      }

      try {
        const question: Question = {
          id: q.id || uuidv4(),
          examId: q.examId,
          objectiveId: q.objectiveId,
          difficulty: q.difficulty || 'medium',
          stem: q.stem,
          options: q.options,
          correctOptions: q.correctOptions,
          explanation: q.explanation || '',
          references: q.references || [],
          tags: q.tags || [],
          status: q.status || 'published',
          lastUpdated: new Date().toISOString(),
        };

        dataStore.addQuestion(question);
        imported++;
      } catch (err) {
        errors.push({ row, message: 'Failed to import question' });
      }
    });

    console.log(`[Admin] Imported ${imported} questions with ${errors.length} errors`);

    return NextResponse.json({
      success: errors.length === 0,
      imported,
      errors,
      warnings,
    });
  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
