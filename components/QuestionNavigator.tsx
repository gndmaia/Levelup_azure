'use client';

interface QuestionNavigatorProps {
  totalQuestions: number;
  currentQuestion: number;
  answeredQuestions: Set<number>;
  onNavigate: (questionNumber: number) => void;
}

export default function QuestionNavigator({
  totalQuestions,
  currentQuestion,
  answeredQuestions,
  onNavigate,
}: QuestionNavigatorProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      <h3 className="text-lg font-semibold text-neutral-900 mb-4">Question Navigator</h3>
      <p className="text-sm text-neutral-600 mb-4">
        Click on a question number to jump to that question. Answered questions are shown in green, unanswered in gray.
      </p>
      <div className="grid grid-cols-10 gap-2">
        {Array.from({ length: totalQuestions }, (_, i) => i + 1).map((num) => {
          const isAnswered = answeredQuestions.has(num);
          const isCurrent = num === currentQuestion;
          
          return (
            <button
              key={num}
              onClick={() => onNavigate(num)}
              className={`
                h-10 rounded-md font-semibold text-sm transition-all
                ${isCurrent 
                  ? 'ring-2 ring-primary-500 ring-offset-2' 
                  : ''
                }
                ${isAnswered
                  ? 'bg-success text-white hover:bg-success/80'
                  : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
                }
              `}
              aria-label={`Question ${num}${isAnswered ? ' (answered)' : ' (unanswered)'}${isCurrent ? ' (current)' : ''}`}
            >
              {num}
            </button>
          );
        })}
      </div>
      <div className="mt-4 flex items-center justify-between text-sm text-neutral-600">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-success"></div>
            <span>Answered ({answeredQuestions.size})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-neutral-200"></div>
            <span>Unanswered ({totalQuestions - answeredQuestions.size})</span>
          </div>
        </div>
      </div>
    </div>
  );
}
