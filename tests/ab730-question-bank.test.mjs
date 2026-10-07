import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const bank = JSON.parse(readFileSync(new URL('../lib/ab730-question-bank.json', import.meta.url), 'utf8'));
const sources = JSON.parse(readFileSync(new URL('../lib/ab730-sets.json', import.meta.url), 'utf8'));
const ab731 = JSON.parse(readFileSync(new URL('../lib/ab731-question-bank.json', import.meta.url), 'utf8'));

test('AB-730 retains all 160 source questions in four complete sets', () => {
  assert.deepEqual(sources.map((source) => source.questionCount), [50, 50, 30, 30]);
  assert.equal(bank.questions.length, 160);
  assert.equal(new Set(bank.questions.map((question) => question.id)).size, 160);
  for (const source of sources) {
    const questions = bank.questions.filter((question) => question.sourceSetId === source.id);
    assert.equal(questions.length, source.questionCount);
    assert.deepEqual(questions.map((question) => question.sourceQuestionNumber),
      Array.from({ length: source.questionCount }, (_, index) => index + 1));
    assert.match(source.url, /^https:\/\/forms\.cloud\.microsoft\/pages\/responsepage\.aspx\?id=/);
  }
});

test('AB-730 keys are unambiguous and reference existing unique option IDs', () => {
  for (const question of bank.questions) {
    assert(question.stem.trim().length > 0, question.id);
    assert(question.options.length >= 2, question.id);
    assert.equal(new Set(question.options.map((option) => option.id)).size, question.options.length);
    assert(question.correctOptions.length > 0, question.id);
    assert.equal(new Set(question.correctOptions).size, question.correctOptions.length);
    for (const answer of question.correctOptions) {
      const option = question.options.find((item) => item.id === answer);
      assert(option, `${question.id}: ${answer}`);
      assert.equal(question.options.filter((item) => item.text === option.text).length, 1);
    }
  }
});

test('AB-730 retains all ten two-answer multiple-select questions', () => {
  assert.deepEqual(sources.map((source) => source.multiSelectCount), [0, 7, 2, 1]);
  const multiple = bank.questions.filter((question) => question.correctOptions.length > 1);
  assert.equal(multiple.length, 10);
  assert(multiple.every((question) => question.correctOptions.length === 2));
  const controls = bank.questions.find((question) => question.id === 'ab730-2-017');
  assert.deepEqual(controls.options.filter((option) => controls.correctOptions.includes(option.id))
    .map((option) => option.text).sort(), [
    'Apply sensitivity labels to content that contains sensitive information.',
    'Configure Microsoft Purview data loss prevention (DLP) policies.',
  ]);
});

test('a repeated incorrect source distractor is preserved without changing the correct key', () => {
  const question = bank.questions.find((item) => item.id === 'ab730-2-010');
  assert.equal(question.options.length, 4);
  assert.equal(question.options.filter((option) => option.text === 'Process B involves fewer total users.').length, 2);
  assert.deepEqual(question.correctOptions, ['D']);
});

test('AB-730 does not collide with AB-731 or include trial responses or respondent details', () => {
  assert.equal(new Set([...bank.questions, ...ab731.questions].map((question) => question.id)).size, 300);
  assert.match(bank.answerKeyProvenance, /View results/);
  for (const question of bank.questions) {
    assert.deepEqual(Object.keys(question).sort(),
      ['correctOptions', 'id', 'options', 'sourceQuestionNumber', 'sourceSetId', 'stem']);
    for (const option of question.options) {
      assert.deepEqual(Object.keys(option).sort(), ['id', 'text']);
    }
  }
});
