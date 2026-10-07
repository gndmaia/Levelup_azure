import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const bank = JSON.parse(readFileSync(new URL('../lib/ab731-question-bank.json', import.meta.url), 'utf8'));
const sources = JSON.parse(readFileSync(new URL('../lib/ab731-sets.json', import.meta.url), 'utf8'));

test('all four Forms and all 140 source questions are present', () => {
  assert.deepEqual(sources.map((source) => source.questionCount), [58, 51, 15, 16]);
  assert.equal(bank.questions.length, 140);
  assert.equal(new Set(bank.questions.map((question) => question.id)).size, 140);
  for (const source of sources) {
    const questions = bank.questions.filter((question) => question.sourceSetId === source.id);
    assert.equal(questions.length, source.questionCount);
    assert.deepEqual(questions.map((question) => question.sourceQuestionNumber),
      Array.from({ length: source.questionCount }, (_, index) => index + 1));
    assert.match(source.url, /^https:\/\/forms\.cloud\.microsoft\/pages\/responsepage\.aspx\?id=/);
  }
});

test('every revealed answer maps to an existing, unique option', () => {
  for (const question of bank.questions) {
    assert(question.stem.trim().length > 0, question.id);
    assert(question.options.length >= 2, question.id);
    assert.equal(new Set(question.options.map((option) => option.id)).size, question.options.length);
    assert.equal(new Set(question.options.map((option) => option.text)).size, question.options.length);
    assert(question.correctOptions.length > 0, question.id);
    assert.equal(new Set(question.correctOptions).size, question.correctOptions.length);
    for (const answer of question.correctOptions) {
      assert(question.options.some((option) => option.id === answer), `${question.id}: ${answer}`);
    }
  }
});

test('all eleven multiple-select keys retain both correct answers', () => {
  assert.deepEqual(sources.map((source) => source.multiSelectCount), [0, 5, 0, 6]);
  const multiple = bank.questions.filter((question) => question.correctOptions.length > 1);
  assert.equal(multiple.length, 11);
  assert(multiple.every((question) => question.correctOptions.length === 2));
});

test('representative source keys are preserved instead of random trial choices', () => {
  const single = bank.questions.find((question) => question.id === 'ab731-1-002');
  assert.deepEqual(single.correctOptions, ['B']);
  assert.equal(single.options.find((option) => option.id === 'B').text, 'Encrypting data at rest and in transit.');
  const multiple = bank.questions.find((question) => question.id === 'ab731-4-002');
  assert.deepEqual(multiple.options
    .filter((option) => multiple.correctOptions.includes(option.id))
    .map((option) => option.text).sort(), ['Fairness', 'Transparency']);
});

test('the published bank contains no submitted answers or respondent metadata', () => {
  assert.match(bank.answerKeyProvenance, /View results/);
  for (const question of bank.questions) {
    assert.deepEqual(Object.keys(question).sort(),
      ['correctOptions', 'id', 'options', 'sourceQuestionNumber', 'sourceSetId', 'stem']);
    for (const option of question.options) {
      assert.deepEqual(Object.keys(option).sort(), ['id', 'text']);
    }
  }
});
