import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { questionIds } = await request.json();

    if (!questionIds || !Array.isArray(questionIds) || questionIds.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'No question IDs provided' 
      }, { status: 400 });
    }

    // Read the current seed-data.ts file
    const seedDataPath = path.join(process.cwd(), 'lib', 'seed-data.ts');
    let content = await fs.readFile(seedDataPath, 'utf-8');

    // Create backup before deleting
    const backupPath = path.join(
      process.cwd(), 
      'lib', 
      `seed-data-backup-before-delete-${Date.now()}.ts`
    );
    await fs.writeFile(backupPath, content, 'utf-8');

    let deletedCount = 0;

    // Delete each question by ID
    for (const questionId of questionIds) {
      // Find and remove the question object
      // Pattern matches: { id: "questionId", ... }, (including the comma and newline)
      const questionPattern = new RegExp(
        `\\s*\\{[^}]*id:\\s*["']${questionId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["'][^}]*\\},?\\n`,
        'gs'
      );

      const beforeLength = content.length;
      content = content.replace(questionPattern, '');
      
      if (content.length < beforeLength) {
        deletedCount++;
      }
    }

    // Clean up any double commas or trailing commas before closing bracket
    content = content.replace(/,(\s*,)+/g, ','); // Remove double commas
    content = content.replace(/,(\s*)\]/g, '$1]'); // Remove trailing comma before ]

    // Write back to file
    await fs.writeFile(seedDataPath, content, 'utf-8');

    return NextResponse.json({
      success: true,
      count: deletedCount,
      message: `Successfully deleted ${deletedCount} question(s)`,
      backupFile: path.basename(backupPath),
    });
  } catch (error: any) {
    console.error('Error deleting questions:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to delete questions',
    }, { status: 500 });
  }
}
