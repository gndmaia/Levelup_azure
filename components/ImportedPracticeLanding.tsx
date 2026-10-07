import Link from 'next/link';
import type { ImportedPracticeExam } from '@/lib/imported-practice';

export default function ImportedPracticeLanding({ exam }: { exam: ImportedPracticeExam }) {
  const practiceHref = `/practice?exam=${exam.id}`;
  const examHref = `/exam?exam=${exam.id}`;
  const modes = [
    {
      title: 'Practice Mode',
      image: '/practice.jpg',
      description: 'Learn at your own pace with instant feedback and helpful references for each question.',
      features: [
        'Untimed practice sessions',
        'Immediate feedback per question',
        'Choose how many questions to practice',
        'Mixed questions from the full certification bank',
      ],
      href: practiceHref,
      action: 'Start Practice',
      border: 'border-success',
      button: 'bg-success hover:bg-green-600',
      icon: 'text-success',
    },
    {
      title: 'Exam Mode',
      image: '/exam.png',
      description: 'Test your knowledge with a timed session and an end-of-exam score.',
      features: [
        `Timed sessions (${exam.timeLimitSec / 60} minutes)`,
        'Choose the number of questions',
        'Save answers and revisit questions',
        'Review your score at the end',
      ],
      href: examHref,
      action: 'Take Exam',
      border: 'border-primary-500',
      button: 'bg-primary-500 hover:bg-primary-600',
      icon: 'text-primary-500',
    },
  ];

  return (
    <div className="min-h-[calc(100vh-8rem)]">
      <div className="bg-gradient-to-br from-primary-600 via-primary-500 to-accent-teal text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <div className="flex justify-center mb-6">
            <img src="/logo.jpg" alt="LevelUp Azure" className="h-24 md:h-32" />
          </div>
          <h1 className="text-xl md:text-2xl mb-8 text-primary-50">
            Master {exam.id} {exam.title} with interactive practice and exam simulations
          </h1>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href={practiceHref} className="px-8 py-4 bg-white text-primary-600 rounded-lg font-semibold text-lg hover:bg-primary-50 transition-all transform hover:scale-105 shadow-lg min-w-[200px] text-center">
              Start Practicing
            </Link>
            <Link href={examHref} className="px-8 py-4 bg-primary-800 text-white rounded-lg font-semibold text-lg hover:bg-primary-900 transition-all transform hover:scale-105 shadow-lg min-w-[200px] text-center">
              Take Exam
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {modes.map((mode) => (
            <section key={mode.title} className={`bg-white rounded-xl shadow-lg p-8 border-t-4 ${mode.border}`}>
              <div className="flex items-center mb-4">
                <img src={mode.image} alt="" className="w-12 h-12 mr-4 rounded-lg object-cover" />
                <h2 className="text-2xl font-bold text-neutral-900">{mode.title}</h2>
              </div>
              <p className="text-neutral-600 mb-6">{mode.description}</p>
              <ul className="space-y-3 mb-6">
                {mode.features.map((feature) => (
                  <li key={feature} className="flex items-start text-neutral-700">
                    <svg className={`w-5 h-5 mr-2 mt-0.5 flex-shrink-0 ${mode.icon}`} fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href={mode.href} className={`block w-full text-white px-6 py-3 rounded-lg font-semibold transition-colors text-center ${mode.button}`}>
                {mode.action}
              </Link>
            </section>
          ))}
        </div>

        <section className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">About {exam.id} {exam.title}</h2>
          <p className="text-neutral-600 mb-6">{exam.description}.</p>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div><div className="text-4xl font-bold text-primary-500 mb-2">{exam.questionCount}</div><p className="text-neutral-600">Practice Questions</p></div>
            <div><div className="text-4xl font-bold text-primary-500 mb-2">2</div><p className="text-neutral-600">Learning Modes</p></div>
            <div><div className="text-4xl font-bold text-primary-500 mb-2">100%</div><p className="text-neutral-600">Free Practice</p></div>
          </div>
          <p className="mt-6 text-sm text-neutral-600">
            Unofficial training questions. Scores are practice percentages, not official certification scores.
            Original source references remain available with answer feedback.
          </p>
          <div className="mt-8 text-center">
            <a href={exam.certificationUrl} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700 font-semibold">
              Learn more about {exam.id} &rarr;
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
