import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseDetailedTest } from './gh300-markdown.mjs';

const [sourceDirectory, importedAt, sourceCommit] = process.argv.slice(2);
assert(sourceDirectory, 'Provide the detailed Markdown source directory.');
assert(/^\d{4}-\d{2}-\d{2}$/.test(importedAt ?? ''), 'Provide the import date as YYYY-MM-DD.');
assert(!Number.isNaN(Date.parse(importedAt)), 'Provide a valid import date.');
assert.equal(new Date(importedAt).toISOString().slice(0, 10), importedAt);
assert(/^[0-9a-f]{40}$/.test(sourceCommit ?? ''), 'Provide the full source Git commit.');

const filenames = readdirSync(sourceDirectory).filter((name) => /^\d{2}-practice-test\.detailed\.md$/.test(name)).sort();
const counts = [30, 30, 30, 30, 30, 30, 10, 5, 30, 30];
assert.deepEqual(filenames, counts.map((_, index) => `${String(index + 1).padStart(2, '0')}-practice-test.detailed.md`));
const repositoryUrl = 'https://github.com/ElmentorProgram/gh-300';
const sources = [];
const questions = [];
for (const [index, filename] of filenames.entries()) {
  const bytes = readFileSync(resolve(sourceDirectory, filename));
  const parsed = parseDetailedTest(bytes.toString('utf8'), filename);
  assert.equal(parsed.questions.length, counts[index], `${filename}: unexpected source question count.`);
  const id = `Detailed-Test-${String(index + 1).padStart(2, '0')}`;
  const url = `${repositoryUrl}/blob/${sourceCommit}/source/docs/practice/detailed/${filename}`;
  sources.push({
    id,
    title: `Detailed practice test ${String(index + 1).padStart(2, '0')}`,
    originalTitle: parsed.title,
    filename,
    url,
    questionCount: parsed.questions.length,
    multiSelectCount: parsed.questions.filter((question) => question.correctOptions.length > 1).length,
    firstQuestionNumber: parsed.questions[0].number,
    lastQuestionNumber: parsed.questions.at(-1).number,
    sha256: createHash('sha256').update(bytes).digest('hex'),
  });
  for (const question of parsed.questions) {
    questions.push({
      id: `gh300-${String(question.number).padStart(3, '0')}`,
      sourceSetId: id,
      sourceQuestionNumber: question.number,
      stem: question.stem,
      options: question.options,
      correctOptions: question.correctOptions,
      explanation: question.explanation,
      references: [{ title: `${parsed.title} - question ${question.number}`, url }, ...question.references],
    });
  }
}
assert.equal(questions.length, 255);
assert.equal(new Set(questions.map((question) => question.id)).size, questions.length);
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
writeFileSync(resolve(root, 'lib', 'gh300-sets.json'), JSON.stringify(sources, null, 2) + '\n');
writeFileSync(resolve(root, 'lib', 'gh300-question-bank.json'), JSON.stringify({
  importedAt,
  repositoryUrl,
  sourceCommit,
  answerKeyProvenance: 'Explicit Correct Answer(s) fields in the supplied detailed Markdown answer sheets.',
  questions,
}, null, 2) + '\n');
console.log(`Imported ${questions.length} GH-300 questions from ${sources.length} detailed files; raw files excluded.`);
