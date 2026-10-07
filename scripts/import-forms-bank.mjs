import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

export function importFormsBank({ sourceDirectory, importedAt, examId, prefix, counts }) {
  assert(sourceDirectory, 'Provide the directory containing the four Forms reviews and source extracts.');
  assert(/^\d{4}-\d{2}-\d{2}$/.test(importedAt ?? ''), 'Provide the import date as YYYY-MM-DD.');
  assert(!Number.isNaN(Date.parse(importedAt)), 'The import date must be valid.');
  assert.equal(new Date(importedAt).toISOString().slice(0, 10), importedAt);
  assert.equal(counts.length, 4);

  const readJson = (name) => JSON.parse(readFileSync(resolve(sourceDirectory, name), 'utf8').replace(/^\uFEFF/, ''));
  const normalize = (text) => text.replace(/\s/g, '');
  const draft = readJson(`${prefix}-trial-responses.json`);
  const visible = readJson(`${prefix}-visible-stems.json`);
  const definitions = [
    { id: 'Practice-Exam-1', title: 'Practice exam 1', questionCount: counts[0] },
    { id: 'Practice-Exam-2', title: 'Practice exam 2', questionCount: counts[1] },
    { id: 'Homework-Day-1', title: 'Homework Day 1', questionCount: counts[2] },
    { id: 'Homework-Day-2', title: 'Homework Day 2', questionCount: counts[3] },
  ];
  assert.equal(draft.forms.length, definitions.length);
  assert.equal(visible.forms.length, definitions.length);

  const sources = [];
  const questions = [];
  for (const [index, definition] of definitions.entries()) {
    const source = draft.forms.find((form) => form.form === index + 1);
    const review = readJson(`${prefix}-form-${index + 1}-review.json`);
    const formatted = visible.forms.find((form) => form.form === index + 1);
    assert(source && formatted, `Missing source ${index + 1}.`);
    assert.equal(source.questions.length, definition.questionCount);
    assert.equal(review.questions.length, definition.questionCount);
    assert.equal(formatted.questions.length, definition.questionCount);
    assert.deepEqual(source.questions.map((question) => question.number),
      Array.from({ length: definition.questionCount }, (_, number) => number + 1));
    const sourceUrl = new URL(source.url);
    assert.equal(sourceUrl.origin, 'https://forms.cloud.microsoft');
    assert.equal(sourceUrl.pathname.toLowerCase(), '/pages/responsepage.aspx');
    assert(sourceUrl.searchParams.get('id'), 'Missing Form ID.');
    assert.equal(review.form, index + 1);
    assert.equal(review.title, source.title);

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
      // Forms can repeat an incorrect distractor; never map an ambiguous correct answer.
      for (const correctText of correctTexts) {
        assert.equal(options.filter((option) => option.text === correctText).length, 1,
          `Ambiguous correct option text for ${definition.id} Q${question.number}.`);
      }
      const correctOptions = options.filter((option) => correctTexts.includes(option.text)).map((option) => option.id);
      assert.equal(correctOptions.length, question.selectionCount);
      questions.push({
        id: `${prefix}-${index + 1}-${String(question.number).padStart(3, '0')}`,
        sourceSetId: definition.id,
        sourceQuestionNumber: question.number,
        stem: display[0].stem,
        options,
        correctOptions,
      });
    }
  }

  assert.equal(questions.length, counts.reduce((total, count) => total + count, 0));
  assert.equal(new Set(questions.map((question) => question.id)).size, questions.length);
  const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
  writeFileSync(resolve(root, 'lib', `${prefix}-sets.json`), JSON.stringify(sources, null, 2) + '\n');
  writeFileSync(resolve(root, 'lib', `${prefix}-question-bank.json`), JSON.stringify({
    importedAt,
    answerKeyProvenance: 'Correct-answer markers exposed by the normal Microsoft Forms View results review.',
    questions,
  }, null, 2) + '\n');
  console.log(`Imported ${questions.length} ${examId} questions from ${sources.length} source quizzes.`);
}
