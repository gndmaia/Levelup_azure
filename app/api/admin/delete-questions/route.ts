import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { seedQuestions } from '@/lib/seed-data';

export async function POST(request: Request) {
  try {
    const { questionIds } = await request.json();

    if (!questionIds || !Array.isArray(questionIds) || questionIds.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'No question IDs provided' 
      }, { status: 400 });
    }

    const indicesToDelete: number[] = [];
    seedQuestions.forEach((q, index) => {
      if (questionIds.includes(q.id)) {
        indicesToDelete.push(index);
      }
    });
    
    if (indicesToDelete.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No matching questions found'
      }, { status: 404 });
    }

    const seedDataPath = path.join(process.cwd(), 'lib', 'seed-data.ts');
    let content = await fs.readFile(seedDataPath, 'utf-8');

    const backupPath = path.join(
      process.cwd(), 
      'lib', 
      `seed-data-backup-before-delete-${Date.now()}.ts`
    );
    await fs.writeFile(backupPath, content, 'utf-8');

    const arrayMatch = content.match(/const rawQuestions: RawQuestion\[\] = \[/);
    if (!arrayMatch) {
      return NextResponse.json({
        success: false,
        error: 'Could not find rawQuestions array in file'
      }, { status: 500 });
    }

    // Find the opening bracket position
    const arrayDeclStart = arrayMatch.index!;
    const openBracketPos = arrayMatch.index! + arrayMatch[0].length;
    
    // Find the closing bracket and semicolon
    const closingPattern = /\];[\s]*$/m;
    const closingMatch = closingPattern.exec(content.substring(openBracketPos));
    
    if (!closingMatch) {
      return NextResponse.json({
        success: false,
        error: 'Could not find end of rawQuestions array'
      }, { status: 500 });
    }
    
    const closeBracketPos = openBracketPos + closingMatch.index!;
    const arrayContent = content.substring(openBracketPos, closeBracketPos);

    const questions: string[] = [];
    let braceCount = 0;
    let currentQuestion = '';
    let inString = false;
    let stringChar = '';

    for (let i = 0; i < arrayContent.length; i++) {
      const char = arrayContent[i];
      const prevChar = i > 0 ? arrayContent[i - 1] : '';

      if ((char === '"' || char === "'") && prevChar !== '\\') {
        if (!inString) {
          inString = true;
          stringChar = char;
        } else if (char === stringChar) {
          inString = false;
        }
      }

      if (!inString) {
        if (char === '{') {
          if (braceCount === 0) {
            currentQuestion = '';
          }
          braceCount++;
        } else if (char === '}') {
          braceCount--;
          if (braceCount === 0) {
            currentQuestion += char;
            questions.push(currentQuestion.trim());
            currentQuestion = '';
            continue;
          }
        }
      }

      if (braceCount > 0) {
        currentQuestion += char;
      }
    }

    const sortedIndices = indicesToDelete.sort((a, b) => b - a);
    let deletedCount = 0;
    
    for (const index of sortedIndices) {
      if (index >= 0 && index < questions.length) {
        questions.splice(index, 1);
        deletedCount++;
      }
    }

    const newArrayContent = questions.map(q => `  ${q}`).join(',\n');
    const newContent = 
      content.substring(0, openBracketPos) +
      '\n' + newArrayContent + '\n' +
      content.substring(closeBracketPos);

    await fs.writeFile(seedDataPath, newContent, 'utf-8');

    return NextResponse.json({
      success: true,
      count: deletedCount,
      message: `Successfully deleted ${deletedCount} question(s)`,
      backupFile: path.basename(backupPath),
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to delete questions',
    }, { status: 500 });
  }
}
