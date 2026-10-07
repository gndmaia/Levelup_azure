'use client';

import { getQuestionCounts } from '@/lib/question-counts.mjs';

interface QuestionCountSelectorProps {
  availableCount: number;
  selectedCount: number;
  onSelect: (count: number) => void;
}

export default function QuestionCountSelector({ availableCount, selectedCount, onSelect }: QuestionCountSelectorProps) {
  const counts = getQuestionCounts(availableCount);

  return (
    <fieldset className="mt-8 border-t border-neutral-200 pt-6">
      <legend className="text-lg font-semibold text-neutral-900">Number of Questions</legend>
      <p className="text-sm text-neutral-600 my-4">Available questions: {availableCount}</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {counts.map((count) => (
          <button key={count} type="button" onClick={() => onSelect(count)} aria-pressed={selectedCount === count}
            className={`py-3 px-4 rounded-lg font-semibold transition-all ${
              selectedCount === count
                ? 'bg-primary-500 text-white ring-2 ring-primary-500 ring-offset-2'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}>
            {count === availableCount ? `All (${count})` : count}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
