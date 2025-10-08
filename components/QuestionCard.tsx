'use client';

import { Question } from '@/types';
import { useState, useEffect } from 'react';

interface QuestionCardProps {
  question: Question;
  onAnswer?: (selectedOptions: string[]) => void;
  showFeedback?: boolean;
  isCorrect?: boolean;
  userAnswer?: string[];
  disabled?: boolean;
  questionNumber?: number;
  totalQuestions?: number;
}

export default function QuestionCard({
  question,
  onAnswer,
  showFeedback = false,
  isCorrect,
  userAnswer = [],
  disabled = false,
  questionNumber,
  totalQuestions,
}: QuestionCardProps) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>(userAnswer);
  const isMultiSelect = question.correctOptions.length > 1;

  // Reset selected options when question changes
  useEffect(() => {
    setSelectedOptions([]);
  }, [question.id]);

  const handleOptionClick = (optionId: string) => {
    if (disabled) return;

    let newSelection: string[];
    if (isMultiSelect) {
      // Multi-select: toggle checkbox
      if (selectedOptions.includes(optionId)) {
        newSelection = selectedOptions.filter((id) => id !== optionId);
      } else {
        newSelection = [...selectedOptions, optionId];
      }
    } else {
      // Single-select: radio behavior
      newSelection = [optionId];
    }

    setSelectedOptions(newSelection);
    if (onAnswer) {
      onAnswer(newSelection);
    }
  };

  const getOptionClass = (optionId: string) => {
    const isSelected = selectedOptions.includes(optionId);
    const isCorrectOption = question.correctOptions.includes(optionId);
    
    let baseClass = 'border-2 rounded-lg p-4 cursor-pointer transition-all hover:border-primary-400 focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2';
    
    if (disabled) {
      baseClass += ' cursor-not-allowed opacity-60';
    }
    
    if (showFeedback) {
      if (isCorrectOption) {
        return `${baseClass} border-success bg-success bg-opacity-10`;
      }
      if (isSelected && !isCorrectOption) {
        return `${baseClass} border-error bg-error bg-opacity-10`;
      }
    }
    
    if (isSelected) {
      return `${baseClass} border-primary-500 bg-primary-50`;
    }
    
    return `${baseClass} border-neutral-300 bg-white`;
  };

  const getOptionIcon = (optionId: string) => {
    const isSelected = selectedOptions.includes(optionId);
    const isCorrectOption = question.correctOptions.includes(optionId);

    if (showFeedback) {
      if (isCorrectOption) {
        return (
          <svg className="w-6 h-6 text-success" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      }
      if (isSelected && !isCorrectOption) {
        return (
          <svg className="w-6 h-6 text-error" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      }
    }

    if (isMultiSelect) {
      return (
        <div className={`w-6 h-6 border-2 rounded flex items-center justify-center ${isSelected ? 'bg-primary-500 border-primary-500' : 'border-neutral-400'}`}>
          {isSelected && (
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      );
    }

    return (
      <div className={`w-6 h-6 border-2 rounded-full flex items-center justify-center ${isSelected ? 'border-primary-500' : 'border-neutral-400'}`}>
        {isSelected && <div className="w-3 h-3 bg-primary-500 rounded-full" />}
      </div>
    );
  };

  // Extract images from question stem
  const extractImages = (questionText: string) => {
    // Try multiple formats
    let match = questionText.match(/\[📊 Image\/Diagram: ([^\]]+)\]/);
    if (!match) {
      match = questionText.match(/\[.*?Image\/Diagram: ([^\]]+)\]/i);
    }
    if (!match) {
      match = questionText.match(/\[IMAGE: ([^\]]+)\]/i);
    }
    if (match) {
      return match[1].split(', ').map(path => path.trim());
    }
    return [];
  };

  const images = extractImages(question.stem);
  const cleanQuestionText = question.stem
    .replace(/\[📊 Image\/Diagram: [^\]]+\]/g, '')
    .replace(/\[.*?Image\/Diagram: [^\]]+\]/gi, '')
    .replace(/\[IMAGE: [^\]]+\]/gi, '')
    .trim();

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      {/* Question Header */}
      <div className="flex justify-between items-start">
        <div className="flex-1">
          {questionNumber && totalQuestions && (
            <p className="text-sm text-neutral-500 mb-2">
              Question {questionNumber} of {totalQuestions}
            </p>
          )}
          <div className="flex items-center space-x-2 mb-4">
            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
              question.difficulty === 'easy' ? 'bg-success bg-opacity-20 text-success' :
              question.difficulty === 'medium' ? 'bg-warning bg-opacity-20 text-warning' :
              'bg-error bg-opacity-20 text-error'
            }`}>
              {question.difficulty.toUpperCase()}
            </span>
            <span className="px-3 py-1 text-xs font-semibold bg-neutral-100 text-neutral-700 rounded-full">
              {question.objectiveId}
            </span>
          </div>
        </div>
      </div>

      {/* Question Stem */}
      <div className="prose prose-lg max-w-none">
        <p className="text-neutral-900 text-lg font-medium">{cleanQuestionText}</p>
      </div>

      {/* Display Images if present */}
      {images.length > 0 && (
        <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-lg">
          <div className="space-y-3">
            {images.map((imgPath, idx) => (
              <div key={idx} className="flex justify-center">
                <img
                  src={imgPath}
                  alt={`Question diagram ${idx + 1}`}
                  className="max-w-full h-auto border border-neutral-300 rounded shadow-sm"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Selection Type Hint */}
      <p className="text-sm text-neutral-600 italic">
        {isMultiSelect ? '(Select all that apply)' : '(Select one)'}
      </p>

      {/* Options */}
      <div className="space-y-3" role="group" aria-label="Answer options">
        {question.options.map((option) => (
          <div
            key={option.id}
            className={getOptionClass(option.id)}
            onClick={() => handleOptionClick(option.id)}
            role={isMultiSelect ? 'checkbox' : 'radio'}
            aria-checked={selectedOptions.includes(option.id)}
            tabIndex={disabled ? -1 : 0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleOptionClick(option.id);
              }
            }}
          >
            <label className="flex items-start space-x-3 cursor-pointer">
              <div className="flex-shrink-0 mt-0.5">
                {getOptionIcon(option.id)}
              </div>
              <div className="flex-1">
                <span className="font-semibold text-neutral-700 mr-2">{option.id}.</span>
                <span className="text-neutral-800">{option.text}</span>
              </div>
            </label>
          </div>
        ))}
      </div>

      {/* Feedback Section */}
      {showFeedback && (
        <div className={`mt-6 p-4 rounded-lg border-2 ${
          isCorrect ? 'bg-success bg-opacity-10 border-success' : 'bg-error bg-opacity-10 border-error'
        }`}>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              {isCorrect ? (
                <svg className="w-6 h-6 text-success" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-error" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-lg mb-2">
                {isCorrect ? 'Correct!' : 'Incorrect'}
              </p>
              <p className="text-neutral-700 mb-3">{question.explanation}</p>
              {question.references.length > 0 && (
                <div className="mt-3">
                  <p className="font-medium text-sm text-neutral-700 mb-2">Learn more:</p>
                  <ul className="space-y-1">
                    {question.references.map((ref, idx) => (
                      <li key={idx}>
                        <a
                          href={ref.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary-600 hover:text-primary-700 underline"
                        >
                          {ref.title} →
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
