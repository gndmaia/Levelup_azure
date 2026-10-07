import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseDetailedTest } from '../scripts/gh300-markdown.mjs';
import { parseStudyMarkdown, tokenizeStudyInline } from '../lib/study-markdown.mjs';

const bank = JSON.parse(readFileSync(new URL('../lib/gh300-question-bank.json', import.meta.url), 'utf8'));
const sources = JSON.parse(readFileSync(new URL('../lib/gh300-sets.json', import.meta.url), 'utf8'));
const fixture = `# Detailed Practice Test

**Question:** [001]
Choose the **safe** alternatives. (Choose two)

**Options:**
A. **Read a token from \`process.env\`**
B. Hardcode a token
C. **Fail clearly**

**Correct Answer(s):** A, C

**Explanation:**
Keep **secrets** out of source and logs.

**Tips and Tricks:**
- Use \`process.env\`.
- Fail clearly.

> [!IMPORTANT]
> Review the output.

**Correct and Wrong:**
Do not choose B.

**Source:**
[Official docs](https://docs.github.com/en/copilot)
`;

test('GH-300 imports all 255 available detailed items and preserves incomplete sets', () => {
  assert.equal(bank.questions.length, 255);
  assert.deepEqual(sources.map((source) => source.questionCount), [30, 30, 30, 30, 30, 30, 10, 5, 30, 30]);
  assert.equal(new Set(bank.questions.map((question) => question.id)).size, 255);
  for (const source of sources) {
    const questions = bank.questions.filter((question) => question.sourceSetId === source.id);
    assert.equal(questions.length, source.questionCount);
    assert.equal(questions[0].sourceQuestionNumber, source.firstQuestionNumber);
    assert.equal(questions.at(-1).sourceQuestionNumber, source.lastQuestionNumber);
    assert.match(source.filename, /^\d{2}-practice-test\.detailed\.md$/);
    assert.match(source.sha256, /^[0-9a-f]{64}$/);
    assert(source.url.includes(bank.sourceCommit));
  }
  assert(!bank.questions.some((question) => question.sourceQuestionNumber === 200));
  assert(!bank.questions.some((question) => question.sourceQuestionNumber === 230));
});

test('all GH-300 keys resolve to options, including 13 multi-select items and an eight-option key', () => {
  assert.equal(bank.questions.filter((question) => question.correctOptions.length > 1).length, 13);
  const allEight = bank.questions.find((question) => question.correctOptions.length === 8);
  assert(allEight);
  assert.deepEqual(allEight.correctOptions, ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']);
  for (const question of bank.questions) {
    assert(question.correctOptions.length > 0, question.id);
    assert.equal(new Set(question.correctOptions).size, question.correctOptions.length);
    assert.equal(new Set(question.options.map((option) => option.id)).size, question.options.length);
    assert(question.correctOptions.every((id) => question.options.some((option) => option.id === id)), question.id);
    assert(question.options.every((option) => option.text.length > 0 && !option.text.includes('**')), question.id);
  }
});

test('authored explanations, documentation references, and source provenance exist for every item', () => {
  assert.match(bank.sourceCommit, /^[0-9a-f]{40}$/);
  assert.equal(bank.repositoryUrl, 'https://github.com/ElmentorProgram/gh-300');
  assert.match(bank.answerKeyProvenance, /Correct Answer/);
  for (const question of bank.questions) {
    assert(question.explanation.length > 0, question.id);
    assert(question.references.length >= 2, question.id);
    const source = sources.find((source) => source.id === question.sourceSetId);
    assert.equal(question.references[0].url, source.url);
    for (const reference of question.references) {
      assert(reference.title.trim().length > 0);
      assert(['http:', 'https:'].includes(new URL(reference.url).protocol));
    }
  }
  assert.deepEqual(bank.questions[0].correctOptions, ['C']);
  assert(bank.questions[0].explanation.includes('Fairness'));
});

test('the detailed parser preserves the authored explanation and strips choice-only answer highlighting', () => {
  const parsed = parseDetailedTest(fixture, 'fixture.detailed.md');
  assert.equal(parsed.questions.length, 1);
  const question = parsed.questions[0];
  assert.equal(question.stem, 'Choose the **safe** alternatives. (Choose two)');
  assert.equal(question.options[0].text, 'Read a token from `process.env`');
  assert.deepEqual(question.correctOptions, ['A', 'C']);
  assert(question.explanation.includes('### Tips and Tricks'));
  assert(question.explanation.includes('> [!IMPORTANT]'));
  assert(question.explanation.includes('### Correct and Wrong'));
  assert.deepEqual(question.references, [{ title: 'Official docs', url: 'https://docs.github.com/en/copilot' }]);
});

test('the detailed parser rejects unknown, duplicated, absent, and unmappable fields', () => {
  assert.throws(() => parseDetailedTest(fixture.replace('A, C', 'A, Z'), 'bad.md'), /absent option/);
  assert.throws(() => parseDetailedTest(fixture.replace('A, C', 'A, A'), 'bad.md'), /duplicate answer/);
  assert.throws(() => parseDetailedTest(fixture.replace('**Explanation:**', '**Unrecognized:**'), 'bad.md'), /unsupported section/);
  assert.throws(() => parseDetailedTest(fixture.replace('**Explanation:**', '**Explanation:**\n**Explanation:**'), 'bad.md'), /duplicate Explanation/);
  assert.throws(() => parseDetailedTest(fixture.replace('C. **Fail clearly**', 'A. **Fail clearly**'), 'bad.md'), /option IDs/);
  assert.throws(() => parseDetailedTest(fixture.replace('https://docs.github.com/en/copilot', 'javascript:alert(1)'), 'bad.md'), /no documentation references/);
});

test('the detailed parser rejects duplicate numbers and does not accept raw answer sheets', () => {
  assert.throws(() => parseDetailedTest(fixture + fixture.slice(fixture.indexOf('**Question:**')), 'bad.md'), /duplicate question numbers/);
  assert.throws(() => parseDetailedTest('# Raw sheet\nQ1: C', 'raw.md'), /no detailed question blocks/);
});

test('study Markdown preserves emphasis, inline code, paragraphs, lists, and important callouts', () => {
  assert.deepEqual(tokenizeStudyInline('Use **care** with `tokens`.'), [
    { type: 'text', value: 'Use ' },
    { type: 'strong', value: 'care' },
    { type: 'text', value: ' with ' },
    { type: 'code', value: 'tokens' },
    { type: 'text', value: '.' },
  ]);
  assert.deepEqual(parseStudyMarkdown('Overview.\n\n### Tips\n- One\n- Two\n\n> [!IMPORTANT]\n> Review.'), [
    { type: 'paragraph', text: 'Overview.' },
    { type: 'heading', text: 'Tips' },
    { type: 'list', items: ['One', 'Two'] },
    { type: 'quote', text: 'Important\nReview.' },
  ]);
});

test('raw HTML, scripts, and unsafe link syntax remain text instead of executable markup', () => {
  const unsafe = '<img src=x onerror=alert(1)> [click](javascript:alert(1)) <script>alert(1)</script>';
  assert.deepEqual(tokenizeStudyInline(unsafe), [{ type: 'text', value: unsafe }]);
  assert.deepEqual(parseStudyMarkdown(unsafe), [{ type: 'paragraph', text: unsafe }]);
});

test('GH-300 does not collide with either Forms bank or expose local source-directory paths', () => {
  const all = [...bank.questions];
  for (const name of ['ab730', 'ab731']) {
    all.push(...JSON.parse(readFileSync(new URL(`../lib/${name}-question-bank.json`, import.meta.url), 'utf8')).questions);
  }
  assert.equal(new Set(all.map((question) => question.id)).size, 555);
  assert(!JSON.stringify(bank).includes('C:\\\\Users\\\\'));
  assert(!JSON.stringify(sources).includes('C:\\\\Users\\\\'));
});
