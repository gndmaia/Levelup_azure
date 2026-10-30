import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';

export const AI200_FILES = [
  ['sdk-cli-part1.json', 33],
  ['sdk-cli-part2.json', 30],
  ['secure-monitor.json', 12],
  ['secure-monitor-160.json', 24],
  ['advanced-scenarios.json', 30],
  ['ai200-practice-set.json', 60],
  ['azure-services-160.json', 24],
  ['containers.json', 13],
  ['containers-160.json', 22],
  ['data-management.json', 15],
  ['data-management-160.json', 27],
  ['generated-azure-services.json', 6],
  ['generated-containers.json', 13],
];

const domains = new Set(['sdk-cli', 'secure-monitor', 'containers', 'data-management', 'azure-services']);
const difficulties = new Map([['Easy', 'easy'], ['Medium', 'medium'], ['Hard', 'hard']]);

export function parseAI200File(text, filename, expectedCount) {
  const items = JSON.parse(text.replace(/^\uFEFF/, ''));
  assert(Array.isArray(items), `${filename}: expected an array.`);
  assert.equal(items.length, expectedCount, `${filename}: unexpected question count.`);
  const questions = items.map((item, index) => {
    const context = `${filename} item ${index + 1}`;
    for (const field of ['id', 'question', 'explanation']) {
      assert(typeof item[field] === 'string' && item[field].trim(), `${context}: missing ${field}.`);
    }
    assert(/^[a-zA-Z0-9_-]+$/.test(item.id), `${context}: unsupported source ID.`);
    assert(domains.has(item.domain), `${context}: unknown domain.`);
    assert(['mcq', 'scenario'].includes(item.type), `${context}: unsupported question type.`);
    assert(item.difficulty === undefined || difficulties.has(item.difficulty), `${context}: invalid difficulty.`);
    assert(Array.isArray(item.options) && item.options.length >= 2 && item.options.length <= 26,
      `${context}: invalid options.`);
    assert(item.options.every((option) => typeof option === 'string' && option.trim()),
      `${context}: empty or unsupported option.`);
    assert.equal(new Set(item.options).size, item.options.length, `${context}: duplicate options.`);
    const indices = Array.isArray(item.answer) ? item.answer : [item.answer];
    assert(indices.length > 0, `${context}: missing answer.`);
    assert.equal(new Set(indices).size, indices.length, `${context}: repeated answer index.`);
    assert(indices.every((answer) => Number.isInteger(answer) && answer >= 0 && answer < item.options.length),
      `${context}: answer index outside options.`);
    const metadata = {};
    for (const field of ['relatedService', 'relatedObjective', 'category', 'source', 'objective']) {
      if (item[field] !== undefined) {
        assert(typeof item[field] === 'string', `${context}: invalid ${field}.`);
        metadata[field] = item[field];
      }
    }
    return {
      id: `ai200-${item.id}`,
      sourceId: item.id,
      sourceSetId: filename.replace(/\.json$/, ''),
      sourceQuestionNumber: index + 1,
      sourceFilename: filename,
      domain: item.domain,
      questionType: item.type,
      difficulty: difficulties.get(item.difficulty) ?? 'medium',
      difficultyDefaulted: item.difficulty === undefined,
      stem: item.question,
      options: item.options.map((option, optionIndex) => ({ id: String.fromCharCode(65 + optionIndex), text: option })),
      correctOptions: indices.map((answer) => String.fromCharCode(65 + answer)).sort(),
      explanation: item.explanation,
      metadata,
    };
  });
  assert.equal(new Set(questions.map((question) => question.id)).size, questions.length, `${filename}: duplicate IDs.`);
  return questions;
}

export function buildAI200Bank(readSource, importedAt) {
  assert(/^\d{4}-\d{2}-\d{2}$/.test(importedAt ?? ''), 'Provide the import date as YYYY-MM-DD.');
  assert(!Number.isNaN(Date.parse(importedAt)), 'Provide a valid import date.');
  assert.equal(new Date(importedAt).toISOString().slice(0, 10), importedAt);
  const questions = [];
  const sources = [];
  for (const [filename, count] of AI200_FILES) {
    const bytes = readSource(filename);
    const parsed = parseAI200File(bytes.toString('utf8'), filename, count);
    sources.push({
      id: filename.replace(/\.json$/, ''),
      title: filename,
      originalTitle: filename,
      filename,
      questionCount: parsed.length,
      multiSelectCount: parsed.filter((question) => question.correctOptions.length > 1).length,
      sha256: createHash('sha256').update(bytes).digest('hex'),
      url: 'https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-cloud-developer-associate/',
    });
    questions.push(...parsed);
  }
  assert.equal(questions.length, 309);
  assert.equal(new Set(questions.map((question) => question.id)).size, questions.length, 'Duplicate IDs across files.');
  assert.equal(new Set(questions.map((question) => question.stem.replace(/\s+/g, ' ').trim().toLowerCase())).size,
    questions.length, 'Duplicate question text across files requires review.');
  return {
    sources,
    bank: {
      importedAt,
      answerKeyProvenance: 'Explicit zero-based answer indices in the 13 user-supplied JSON attachments; imported as supplied, not independently certified.',
      difficultyPolicy: 'Preserve supplied Easy/Medium/Hard values; missing difficulty uses the application sampling default medium and is flagged per item.',
      questions,
    },
  };
}
