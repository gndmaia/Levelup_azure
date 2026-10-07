import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { getQuestionCounts } from '../lib/question-counts.mjs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('each certification offers 10, 30, 60, and its complete bank in either mode', () => {
  for (const [prefix, total] of [['ab731', 140], ['ab730', 160], ['gh300', 255]]) {
    const bank = JSON.parse(read(`lib/${prefix}-question-bank.json`));
    assert.equal(bank.questions.length, total);
    assert.deepEqual(getQuestionCounts(bank.questions.length), [10, 30, 60, total]);
  }
  assert.deepEqual(getQuestionCounts(5), [5]);
  assert.deepEqual(getQuestionCounts(30), [10, 30]);
  assert.throws(() => getQuestionCounts(0), RangeError);
  assert.throws(() => getQuestionCounts(1.5), RangeError);
});

test('the imported landing uses the AI-900 hero, assets, two mode cards, and no source menu', () => {
  const landing = read('components/ImportedPracticeLanding.tsx');
  const ai900 = read('app/ai-900/page.tsx');
  for (const token of ['from-primary-600 via-primary-500 to-accent-teal', '/logo.jpg', '/practice.jpg', '/exam.png', 'grid md:grid-cols-2 gap-8 mb-16']) {
    assert(ai900.includes(token));
    assert(landing.includes(token));
  }
  assert.deepEqual([...landing.matchAll(/title: '(Practice Mode|Exam Mode)'/g)].map((match) => match[1]),
    ['Practice Mode', 'Exam Mode']);
  assert(!landing.includes('exam.sources'));
  assert(!landing.includes('&set='));
  assert(!landing.includes('Homework'));
  assert(landing.includes('`/practice?exam=${exam.id}`'));
  assert(landing.includes('`/exam?exam=${exam.id}`'));
});

test('imported practice ignores old set URLs and draws from the full selected certification', () => {
  const practice = read('app/practice/page.tsx');
  assert(!practice.includes("searchParams.get('set')"));
  assert(!practice.includes('sourceSet'));
  assert(practice.includes('importedExam?.questionCount ?? availableQuestionCount'));
  assert(practice.includes('objectiveIds: !importedExam && selectedObjectives.length > 0'));
  assert(practice.includes('{!importedExam && <ObjectiveSelector'));
  assert(practice.includes('<QuestionCountSelector'));
});

test('exam selections are submitted and source group names are absent from the exam setup', () => {
  const exam = read('app/exam/page.tsx');
  assert(exam.includes('selectedCount={practiceQuestionCount} onSelect={setPracticeQuestionCount}'));
  assert(exam.includes('questionCount: practiceQuestionCount'));
  assert(exam.includes('timeLimitSec: practiceTimeLimit'));
  assert(!exam.includes('importedExam.sources'));
  const metadata = read('lib/imported-practice.ts');
  assert(metadata.includes('timeLimitSec: 6000'));
  assert.equal((metadata.match(/timeLimitSec: 2700/g) ?? []).length, 2);
});

test('retry links and mode navigation preserve the current imported certification', () => {
  for (const mode of ['practice', 'exam']) {
    assert(read(`app/${mode}/page.tsx`).includes('examId={examId} showDetails={!importedExam}'));
  }
  assert(read('components/SummaryPanel.tsx').includes('encodeURIComponent(examId)'));
  const nav = read('components/Navbar.tsx');
  assert(nav.includes('`?exam=${importedExam.id}`'));
  assert(nav.includes('href={`/practice${examQuery}`}'));
  assert(nav.includes('href={`/exam${examQuery}`}'));
  assert(nav.includes('<Suspense'));
});

test('all imported homepage feature rows include the existing green circular check icon', () => {
  const home = read('app/page.tsx');
  const cards = home.slice(home.indexOf('Object.values(IMPORTED_PRACTICE_EXAMS)'), home.indexOf('{/* AZ-900 Card'));
  assert(cards.includes('].map((feature) => ('));
  assert(cards.includes('w-5 h-5 text-success mr-3 flex-shrink-0'));
  assert(cards.includes('aria-hidden="true"'));
  assert(cards.includes('<span>{feature}</span>'));
  assert(cards.includes('M10 18a8 8 0 100-16'));
});
