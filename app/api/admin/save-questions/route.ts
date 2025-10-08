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
    const { questions } = await request.json();

    if (!questions || questions.length === 0) {
      return NextResponse.json({ success: false, error: 'No questions provided' });
    }

    // Read the current seed-data.ts file
    const seedDataPath = path.join(process.cwd(), 'lib', 'seed-data.ts');
    const seedDataContent = await fs.readFile(seedDataPath, 'utf-8');

    // Find the rawQuestions array section
    const rawQuestionsMatch = seedDataContent.match(/const rawQuestions: RawQuestion\[\] = \[([\s\S]*?)\];[\s\S]*export const seedQuestions/);
    
    if (!rawQuestionsMatch) {
      return NextResponse.json({ success: false, error: 'Could not find rawQuestions array in seed-data.ts' });
    }

    // Extract existing question IDs to find max ID
    const idMatches = Array.from(seedDataContent.matchAll(/id:\s*['"]ai900-(\d+)['"]/g));
    let maxId = 246; // Start after existing questions
    
    for (const match of idMatches) {
      const idNum = parseInt(match[1]);
      if (idNum > maxId) maxId = idNum;
    }

    // Convert parsed questions to RawQuestion format
    const newRawQuestions: RawQuestion[] = questions.map((q: any, index: number) => ({
      id: `ai900-${maxId + index + 1}`,
      question: q.question,
      options: q.options,
      correctAnswer: String.fromCharCode(65 + q.correctAnswer), // Convert 0 -> 'A', 1 -> 'B', etc.
      type: 'single', // All SkillCertPro questions are single-choice
      explanation: q.explanation || '',
      documentationUrl: q.reference || '',
    }));

    // Format the new questions as TypeScript code
    const newQuestionsCode = newRawQuestions.map(q => `  {
    id: '${q.id}',
    question: ${JSON.stringify(q.question)},
    options: ${JSON.stringify(q.options)},
    correctAnswer: '${q.correctAnswer}',
    type: '${q.type}',
    explanation: ${JSON.stringify(q.explanation || '')},
    documentationUrl: ${JSON.stringify(q.documentationUrl || '')},
  }`).join(',\n');

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
