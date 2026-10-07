'use client';

import { useEffect, useState } from 'react';

interface ObjectiveSelectorProps {
  objectives: string[];
  onSelect: (selected: string[]) => void;
  selectedObjectives?: string[];
  selectionName?: string;
}

const EMPTY_SELECTION: string[] = [];

export default function ObjectiveSelector({ objectives, onSelect, selectedObjectives = EMPTY_SELECTION, selectionName = 'topic' }: ObjectiveSelectorProps) {
  const [selected, setSelected] = useState<string[]>(selectedObjectives);

  useEffect(() => {
    setSelected(selectedObjectives);
  }, [selectedObjectives]);

  const toggleObjective = (objective: string) => {
    const newSelected = selected.includes(objective)
      ? selected.filter((o) => o !== objective)
      : [...selected, objective];
    
    setSelected(newSelected);
    onSelect(newSelected);
  };

  const selectAll = () => {
    setSelected(objectives);
    onSelect(objectives);
  };

  const clearAll = () => {
    setSelected([]);
    onSelect([]);
  };

  const formatObjectiveName = (objective: string) => {
    return objective
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-neutral-900">
          Select {selectionName === 'topic' ? 'Topics' : 'Question Sets'}
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={selectAll}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Select All
          </button>
          <span className="text-neutral-400">|</span>
          <button
            onClick={clearAll}
            className="text-sm text-neutral-600 hover:text-neutral-700 font-medium"
          >
            Clear All
          </button>
        </div>
      </div>

      <p className="text-sm text-neutral-600">
        {selected.length === 0 
          ? `Select ${selectionName}s to practice, or leave empty for mixed questions`
          : `${selected.length} ${selectionName}${selected.length > 1 ? 's' : ''} selected`}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {objectives.map((objective) => {
          const isSelected = selected.includes(objective);
          return (
            <button
              key={objective}
              onClick={() => toggleObjective(objective)}
              className={`p-4 rounded-lg border-2 text-left transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                isSelected
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-neutral-300 bg-white hover:border-primary-300'
              }`}
              role="checkbox"
              aria-checked={isSelected}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-0.5">
                  <div className={`w-5 h-5 border-2 rounded flex items-center justify-center ${
                    isSelected ? 'bg-primary-500 border-primary-500' : 'border-neutral-400'
                  }`}>
                    {isSelected && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-neutral-900">{formatObjectiveName(objective)}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
