import Link from 'next/link';
import type { FormsPracticeExam } from '@/lib/forms-practice';

export default function FormsPracticeLanding({ exam }: { exam: FormsPracticeExam }) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <Link href="/" className="text-primary-600 hover:underline">All certifications</Link>
      <header className="mt-6 rounded-xl border-t-4 border-emerald-600 bg-white p-8 shadow-lg">
        <p className="font-semibold text-emerald-700">Microsoft {exam.id}</p>
        <h1 className="mt-2 text-3xl font-bold text-neutral-900">{exam.title}</h1>
        <p className="mt-4 text-neutral-600">
          {exam.description} with {exam.questionCount} training questions from four source quizzes.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href={`/practice?exam=${exam.id}`} className="rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700">
            Start mixed practice
          </Link>
          <Link href={`/exam?exam=${exam.id}`} className="rounded-lg border border-primary-600 px-6 py-3 font-semibold text-primary-600 hover:bg-primary-50">
            Take a timed practice exam
          </Link>
        </div>
        <p className="mt-5 text-sm text-neutral-600">
          Instant source-answer feedback in practice mode. {exam.multiSelectCount} questions
          require multiple answers; choose every correct option for credit.
        </p>
      </header>

      <section className="mt-10" aria-labelledby="source-sets">
        <h2 id="source-sets" className="text-2xl font-bold text-neutral-900">Choose a question set</h2>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          {exam.sources.map((source) => (
            <article key={source.id} className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-neutral-900">{source.title}</h3>
              <p className="mt-2 text-neutral-600">
                {source.questionCount} questions
                {source.multiSelectCount > 0 && `, including ${source.multiSelectCount} multiple-select questions`}
              </p>
              <p className="mt-3 text-sm text-neutral-500">{source.originalTitle}</p>
              <div className="mt-5 flex flex-wrap gap-4">
                <Link
                  href={`/practice?exam=${exam.id}&set=${source.id}`}
                  className="font-semibold text-emerald-700 hover:underline"
                >
                  Practice this set
                </Link>
                <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary-600 hover:underline">
                  Original Form
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <aside className="mt-8 rounded-lg border border-neutral-200 bg-neutral-50 p-6 text-sm text-neutral-700">
        <p>
          This is an unofficial training bank, not live certification-exam content. Correct answers
          are the source Forms&apos; revealed answer keys, not the random trial responses used to obtain
          the results views. Source question wording is preserved.
        </p>
        <p className="mt-3">
          LevelUp scores each question equally, with no partial credit for multiple selections.
          Timed mode uses 60 sampled questions and 45 minutes; the source Forms&apos; point weights and
          Microsoft&apos;s scaled certification score are not reproduced.
        </p>
        {exam.syllabusNotice && <p className="mt-3">{exam.syllabusNotice}</p>}
        <a href={exam.certificationUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-primary-600 hover:underline">
          Official {exam.id} certification and study resources
        </a>
      </aside>
    </div>
  );
}
