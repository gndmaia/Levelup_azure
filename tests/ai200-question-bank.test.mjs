import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { AI200_FILES, buildAI200Bank, parseAI200File } from '../scripts/ai200-json.mjs';
import { parseStudyMarkdown } from '../lib/study-markdown.mjs';
import { getQuestionCounts } from '../lib/question-counts.mjs';

const read = (name) => JSON.parse(readFileSync(new URL(`../lib/${name}`, import.meta.url), 'utf8'));
const bank = read('ai200-question-bank.json');
const sources = read('ai200-sources.json');
const example = {
  id: 'example',
  domain: 'containers',
  type: 'scenario',
  question: 'Choose two safe release actions.',
  options: ['Pin a digest', 'Reuse a mutable tag', 'Lock a version tag'],
  answer: [0, 2],
  explanation: 'Use immutable versions.\n\n```bash\naz acr repository update --write-enabled false\n```',
  difficulty: 'Hard',
  relatedService: 'Azure Container Registry',
};

test('all 309 AI-200 questions come from the 13 specified files without duplicates', () => {
  assert.equal(bank.questions.length, 309);
  assert.deepEqual(sources.map((source) => [source.filename, source.questionCount]), AI200_FILES);
  assert.equal(new Set(bank.questions.map((question) => question.id)).size, 309);
  assert.equal(new Set(bank.questions.map((question) => question.stem.replace(/\s+/g, ' ').trim().toLowerCase())).size, 309);
  for (const source of sources) {
    const questions = bank.questions.filter((question) => question.sourceFilename === source.filename);
    assert.equal(questions.length, source.questionCount);
    assert.match(source.sha256, /^[0-9a-f]{64}$/);
    assert.deepEqual(questions.map((question) => question.sourceQuestionNumber),
      Array.from({ length: source.questionCount }, (_, index) => index + 1));
  }
});

test('all zero-based answer indices map to exact existing choices, including four multi-select keys', () => {
  assert.equal(bank.questions.filter((question) => question.correctOptions.length > 1).length, 4);
  for (const question of bank.questions) {
    assert(question.stem.trim());
    assert(question.explanation.trim());
    assert(question.correctOptions.length > 0);
    assert.equal(new Set(question.correctOptions).size, question.correctOptions.length);
    assert(question.correctOptions.every((id) => question.options.some((option) => option.id === id)));
  }
  assert.deepEqual(bank.questions.find((question) => question.sourceId === 'sdk-001').correctOptions, ['A']);
  const multi = bank.questions.find((question) => question.sourceId === 'gen-acr-images-03');
  assert.deepEqual(multi.correctOptions, ['B', 'D']);
  const parsed = parseAI200File(JSON.stringify([example]), 'fixture.json', 1)[0];
  assert.deepEqual(parsed.correctOptions, ['A', 'C']);
  assert.deepEqual(parsed.options.map((option) => option.text), example.options);
  assert.equal(parsed.explanation, example.explanation);
  assert.equal(parsed.metadata.relatedService, example.relatedService);
});

test('source difficulties and domains are preserved; 61 absent difficulty values are explicitly flagged', () => {
  const counts = (field) => bank.questions.reduce((result, question) => {
    result[question[field]] = (result[question[field]] ?? 0) + 1;
    return result;
  }, {});
  assert.deepEqual(counts('domain'), {
    'sdk-cli': 63, 'secure-monitor': 51, containers: 72, 'data-management': 78, 'azure-services': 45,
  });
  assert.deepEqual(counts('difficulty'), { easy: 36, medium: 192, hard: 81 });
  assert.equal(bank.questions.filter((question) => question.difficultyDefaulted).length, 61);
  assert(bank.questions.filter((question) => question.difficultyDefaulted).every((question) => question.difficulty === 'medium'));
  const withoutDifficulty = { ...example };
  delete withoutDifficulty.difficulty;
  const parsed = parseAI200File(JSON.stringify([withoutDifficulty]), 'fixture.json', 1)[0];
  assert.equal(parsed.difficulty, 'medium');
  assert.equal(parsed.difficultyDefaulted, true);
});

test('the importer rejects missing, ambiguous, or unsupported records rather than guessing', () => {
  const parse = (item) => parseAI200File(JSON.stringify([item]), 'bad.json', 1);
  assert.throws(() => parse({ ...example, answer: 3 }), /answer index/);
  assert.throws(() => parse({ ...example, answer: -1 }), /answer index/);
  assert.throws(() => parse({ ...example, answer: 'A' }), /answer index/);
  assert.throws(() => parse({ ...example, answer: [0, 0] }), /repeated answer/);
  assert.throws(() => parse({ ...example, answer: [] }), /missing answer/);
  assert.throws(() => parse({ ...example, options: ['one', 'one'] }), /duplicate options/);
  assert.throws(() => parse({ ...example, difficulty: 'Impossible' }), /difficulty/);
  assert.throws(() => parse({ ...example, domain: 'unknown' }), /unknown domain/);
  assert.throws(() => parse({ ...example, type: 'ordering' }), /unsupported question type/);
  assert.throws(() => parse({ ...example, explanation: '' }), /missing explanation/);
  assert.throws(() => parseAI200File(JSON.stringify([example, example]), 'bad.json', 2), /duplicate IDs/);
  assert.throws(() => buildAI200Bank(() => Buffer.from('[]'), '2026-02-30'), /strictly equal/);
});

test('fenced SDK, CLI, Python, Docker, and Bicep examples remain literal code with indentation intact', () => {
  for (const language of ['bash', 'python', 'dockerfile', 'bicep', 'json']) {
    const code = '  <tag> **literal** `value`\n\n    nested = 1';
    const blocks = parseStudyMarkdown(`Intro.\n\`\`\`${language}\n${code}\n\`\`\`\nAfter.`);
    assert.deepEqual(blocks, [
      { type: 'paragraph', text: 'Intro.' },
      { type: 'code', text: code, language },
      { type: 'paragraph', text: 'After.' },
    ]);
  }
  assert.deepEqual(parseStudyMarkdown('~~~python\nprint("safe")\n~~~'), [
    { type: 'code', text: 'print("safe")', language: 'python' },
  ]);
  assert.deepEqual(parseStudyMarkdown('```bash\nunfinished\n'), [
    { type: 'code', text: 'unfinished\n', language: 'bash' },
  ]);
  const snippets = bank.questions.flatMap((question) =>
    [...parseStudyMarkdown(question.stem), ...parseStudyMarkdown(question.explanation)]
      .filter((block) => block.type === 'code'));
  assert(snippets.length > 50);
  assert(snippets.some((snippet) => snippet.language === 'python'));
  assert(snippets.some((snippet) => snippet.language === 'bicep'));
});

test('AI-200 uses the existing full-bank count selector and IDs cannot collide with other imports', () => {
  assert.deepEqual(getQuestionCounts(bank.questions.length), [10, 30, 60, 309]);
  const all = [...bank.questions];
  for (const name of ['ab730', 'ab731', 'gh300']) all.push(...read(`${name}-question-bank.json`).questions);
  assert.equal(new Set(all.map((question) => question.id)).size, 864);
  assert(!JSON.stringify(bank).includes('C:\\\\Users\\\\'));
  assert(!JSON.stringify(sources).includes('C:\\\\Users\\\\'));
  assert.match(bank.answerKeyProvenance, /not independently certified/);
});
