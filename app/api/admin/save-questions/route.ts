import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

interface RawQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string | string[];
  type: string;
  explanation?: string;
  documentationUrl?: string;
}

export async function POST(request: Request) {
  try {
    const { questions, examId } = await request.json();

    if (examId === 'AB-730' || examId === 'AB-731' || examId === 'GH-300') {
      return NextResponse.json(
        { success: false, error: `${examId} is a generated source bank. Update it with scripts/import-${examId.toLowerCase().replace('-', '')}.mjs and verified source material.` },
        { status: 400 }
      );
    }

    if (!questions || questions.length === 0) {
      return NextResponse.json({ success: false, error: 'No questions provided' });
    }

    // Determine which file to update based on examId
    const isAZ900 = examId === 'AZ-900';
    const fileName = isAZ900 ? 'seed-data-az900.ts' : 'seed-data.ts';
    const exportName = isAZ900 ? 'seedQuestionsAZ900' : 'seedQuestions';
    const idPrefix = isAZ900 ? 'az900' : 'ai900';
    
    // Read the current seed data file
    const seedDataPath = path.join(process.cwd(), 'lib', fileName);
    const seedDataContent = await fs.readFile(seedDataPath, 'utf-8');

    // Find the rawQuestions array section
    const rawQuestionsMatch = seedDataContent.match(/const rawQuestions: RawQuestion\[\] = \[([\s\S]*?)\];[\s\S]*export const/);
    
    if (!rawQuestionsMatch) {
      return NextResponse.json({ success: false, error: `Could not find rawQuestions array in ${fileName}` });
    }

    // Extract existing question IDs to find max ID
    const idPattern = new RegExp(`id:\\s*['"]${idPrefix}-(\\d+)['"]`, 'g');
    const idMatches = Array.from(seedDataContent.matchAll(idPattern));
    let maxId = isAZ900 ? 0 : 246; // Start from 0 for AZ-900, 246 for AI-900
    
    for (const match of idMatches) {
      const idNum = parseInt(match[1]);
      if (idNum > maxId) maxId = idNum;
    }

    // Convert parsed questions to RawQuestion format
    const newRawQuestions: RawQuestion[] = questions.map((q: any, index: number) => {
      // Handle multiple-choice questions
      let correctAnswer: string | string[];
      let type: string;
      
      if (q.isMultipleChoice && q.correctAnswers && q.correctAnswers.length > 1) {
        // Multiple correct answers - convert array of indices to array of letters
        correctAnswer = q.correctAnswers.map((idx: number) => String.fromCharCode(65 + idx));
        type = 'multiple';
      } else {
        // Single correct answer - convert index to letter
        const answerIndex = q.correctAnswers?.[0] ?? q.correctAnswer;
        correctAnswer = String.fromCharCode(65 + answerIndex);
        type = 'single';
      }
      
      return {
        id: `${idPrefix}-${maxId + index + 1}`,
        question: q.question,
        options: q.options,
        correctAnswer,
        type,
        explanation: q.explanation || '',
        documentationUrl: q.reference || '',
      };
    });

    // Format the new questions as TypeScript code
    const newQuestionsCode = newRawQuestions.map(q => {
      // Format correctAnswer - either single string or array
      const correctAnswerStr = Array.isArray(q.correctAnswer) 
        ? `[${q.correctAnswer.map(a => `'${a}'`).join(', ')}]`
        : `'${q.correctAnswer}'`;
      
      return `  {
    id: '${q.id}',
    question: ${JSON.stringify(q.question)},
    options: ${JSON.stringify(q.options)},
    correctAnswer: ${correctAnswerStr},
    type: '${q.type}',
    explanation: ${JSON.stringify(q.explanation || '')},
    documentationUrl: ${JSON.stringify(q.documentationUrl || '')},
  }`;
    }).join(',\n');

    // Find where to insert (before the closing bracket of rawQuestions array)
    const insertPosition = seedDataContent.lastIndexOf('];', seedDataContent.indexOf('export const seedQuestions'));
    
    // Insert the new questions
    const beforeInsert = seedDataContent.substring(0, insertPosition);
    const afterInsert = seedDataContent.substring(insertPosition);
    
    // Add comma if there are existing questions
    const comma = beforeInsert.trim().endsWith('}') ? ',\n' : '\n';
    const newContent = beforeInsert + comma + newQuestionsCode + '\n' + afterInsert;

    // Write back to the file
    await fs.writeFile(seedDataPath, newContent, 'utf-8');

    return NextResponse.json({
      success: true,
      count: newRawQuestions.length,
      message: `Successfully added ${newRawQuestions.length} questions to the database`,
    });
  } catch (error: any) {
    console.error('Error saving questions:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to save questions',
    });
  }
}
