import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const [sourceDirectory, importedAt] = process.argv.slice(2);
assert(sourceDirectory, 'Provide the directory containing the four Forms reviews and source extracts.');
assert(/^\d{4}-\d{2}-\d{2}$/.test(importedAt ?? ''), 'Provide the import date as YYYY-MM-DD.');
assert(!Number.isNaN(Date.parse(importedAt)), 'The import date must be valid.');

const readJson = (name) => JSON.parse(readFileSync(resolve(sourceDirectory, name), 'utf8').replace(/^\uFEFF/, ''));
const normalize = (text) => text.replace(/\s/g, '');
const draft = readJson('ab731-trial-responses.json');
const visible = readJson('ab731-visible-stems.json');
const definitions = [
  { id: 'Practice-Exam-1', title: 'Practice exam 1', questionCount: 58 },
  { id: 'Practice-Exam-2', title: 'Practice exam 2', questionCount: 51 },
  { id: 'Homework-Day-1', title: 'Homework Day 1', questionCount: 15 },
  { id: 'Homework-Day-2', title: 'Homework Day 2', questionCount: 16 },
];
assert.equal(draft.forms.length, definitions.length);

const sources = [];
const questions = [];
for (const [index, definition] of definitions.entries()) {
  const source = draft.forms.find((form) => form.form === index + 1);
  const review = readJson(`ab731-form-${index + 1}-review.json`);
  const formatted = visible.forms.find((form) => form.form === index + 1);
  assert(source && formatted, `Missing source ${index + 1}.`);
  assert.equal(source.questions.length, definition.questionCount);
  assert.equal(review.questions.length, definition.questionCount);
  assert.equal(formatted.questions.length, definition.questionCount);
  assert.match(source.url, /^https:\/\/forms\.cloud\.microsoft\/pages\/responsepage\.aspx\?/);

  sources.push({
    ...definition,
    originalTitle: source.title,
    url: source.url,
    multiSelectCount: source.questions.filter((question) => question.multiple).length,
  });

  for (const question of source.questions) {
    assert.deepEqual(question.images, [], 'Image questions require a separate authorized asset import.');
    const reviewed = review.questions.filter((item) => item.id === question.id);
    const display = formatted.questions.filter((item) => item.id === question.id);
    assert.equal(reviewed.length, 1, `Ambiguous review for ${definition.id} Q${question.number}.`);
    assert.equal(display.length, 1, `Ambiguous question text for ${definition.id} Q${question.number}.`);
    const answer = reviewed[0];
    assert.equal(normalize(answer.stem), normalize(question.stem));
    assert.equal(normalize(display[0].stem), normalize(question.stem));
    assert.deepEqual(
      answer.options.map((option) => option.text).sort(),
      question.options.map((option) => option.text).sort()
    );
    const correctTexts = answer.options.filter((option) => option.correct).map((option) => option.text);
    assert.deepEqual(correctTexts, answer.correctAnswers);
    assert.equal(correctTexts.length, question.selectionCount);
    const options = question.options.map((option, optionIndex) => ({
      id: String.fromCharCode(65 + optionIndex),
      text: option.text,
    }));
    assert.equal(new Set(options.map((option) => option.text)).size, options.length);
    const correctOptions = options.filter((option) => correctTexts.includes(option.text)).map((option) => option.id);
    assert.equal(correctOptions.length, question.selectionCount);
    questions.push({
      id: `ab731-${index + 1}-${String(question.number).padStart(3, '0')}`,
      sourceSetId: definition.id,
      sourceQuestionNumber: question.number,
      stem: display[0].stem,
      options,
      correctOptions,
    });
  }
}

assert.equal(questions.length, 140);
assert.equal(new Set(questions.map((question) => question.id)).size, questions.length);
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
writeFileSync(resolve(root, 'lib', 'ab731-sets.json'), JSON.stringify(sources, null, 2) + '\n');
writeFileSync(resolve(root, 'lib', 'ab731-question-bank.json'), JSON.stringify({
  importedAt,
  answerKeyProvenance: 'Correct-answer markers exposed by the normal Microsoft Forms View results review.',
  questions,
}, null, 2) + '\n');
console.log(`Imported ${questions.length} AB-731 questions from ${sources.length} source quizzes.`);
