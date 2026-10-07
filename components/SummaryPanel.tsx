'use client';

import { SessionSummary } from '@/types';
import { formatTime, formatCategoryName } from '@/lib/scoring';
import Link from 'next/link';

interface SummaryPanelProps {
  summary: SessionSummary;
  showDetails?: boolean;
  examId?: string;
}

export default function SummaryPanel({ summary, showDetails = true, examId }: SummaryPanelProps) {
  const scoreColor = 
    summary.score >= 70 ? 'text-success' :
    summary.score >= 50 ? 'text-warning' :
    'text-error';

  const scoreMessage = 
    summary.score >= 70 ? 'Great job! You passed!' :
    summary.score >= 50 ? 'Good effort! Keep practicing to improve.' :
    'Keep studying. You can do this!';

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
      {/* Overall Score */}
      <div className="text-center border-b border-neutral-200 pb-6">
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">
          {summary.mode === 'exam' ? 'Exam Complete!' : 'Practice Session Complete!'}
        </h2>
        <div className={`text-6xl font-bold ${scoreColor} mb-2`}>
          {summary.score}%
        </div>
        <p className="text-lg text-neutral-600">
          {summary.correctAnswers} out of {summary.totalQuestions} correct
        </p>
        <p className="text-neutral-600 mt-2">{scoreMessage}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-neutral-50 rounded-lg p-4 text-center">
          <p className="text-sm text-neutral-600 mb-1">Questions</p>
          <p className="text-2xl font-bold text-neutral-900">{summary.totalQuestions}</p>
        </div>
        <div className="bg-neutral-50 rounded-lg p-4 text-center">
          <p className="text-sm text-neutral-600 mb-1">Correct</p>
          <p className="text-2xl font-bold text-success">{summary.correctAnswers}</p>
        </div>
        {summary.timeTakenSec && (
          <div className="bg-neutral-50 rounded-lg p-4 text-center">
            <p className="text-sm text-neutral-600 mb-1">Time Taken</p>
            <p className="text-2xl font-bold text-neutral-900">{formatTime(summary.timeTakenSec)}</p>
          </div>
        )}
      </div>

      {/* Per-Category Breakdown */}
      {showDetails && Object.keys(summary.perCategoryAccuracy).length > 0 && (
        <div className="border-t border-neutral-200 pt-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Performance by Topic</h3>
          <div className="space-y-3">
            {Object.entries(summary.perCategoryAccuracy)
              .sort((a, b) => b[1].percentage - a[1].percentage)
              .map(([category, stats]) => (
                <div key={category} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-neutral-700">
                      {formatCategoryName(category)}
                    </span>
                    <span className={`text-sm font-semibold ${
                      stats.percentage >= 70 ? 'text-success' :
                      stats.percentage >= 50 ? 'text-warning' :
                      'text-error'
                    }`}>
                      {stats.percentage}% ({stats.correct}/{stats.total})
                    </span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        stats.percentage >= 70 ? 'bg-success' :
                        stats.percentage >= 50 ? 'bg-warning' :
                        'bg-error'
                      }`}
                      style={{ width: `${stats.percentage}%` }}
                      role="progressbar"
                      aria-valuenow={stats.percentage}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${formatCategoryName(category)}: ${stats.percentage}%`}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-neutral-200">
        <Link
          href={`${summary.mode === 'exam' ? '/exam' : '/practice'}${examId ? `?exam=${encodeURIComponent(examId)}` : ''}`}
          className="flex-1 bg-primary-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors text-center"
        >
          Try Again
        </Link>
        <Link
          href="/"
          className="flex-1 border-2 border-neutral-300 text-neutral-700 px-6 py-3 rounded-lg font-semibold hover:border-neutral-400 transition-colors text-center"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
