'use client';

import { useEffect, useState } from 'react';
import { formatTime } from '@/lib/scoring';

interface TimerProps {
  timeLimitSec: number;
  onTimeUp: () => void;
  isPaused?: boolean;
}

export default function Timer({ timeLimitSec, onTimeUp, isPaused = false }: TimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(timeLimitSec);

  useEffect(() => {
    if (isPaused || timeRemaining <= 0) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, timeRemaining, onTimeUp]);

  const percentage = (timeRemaining / timeLimitSec) * 100;
  const isLowTime = percentage < 20;
  const isCriticalTime = percentage < 10;

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-neutral-700">Time Remaining</span>
        <span className={`text-2xl font-bold tabular-nums ${
          isCriticalTime ? 'text-error animate-pulse' :
          isLowTime ? 'text-warning' :
          'text-neutral-900'
        }`}>
          {formatTime(timeRemaining)}
        </span>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-neutral-200 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full transition-all duration-1000 ease-linear ${
            isCriticalTime ? 'bg-error' :
            isLowTime ? 'bg-warning' :
            'bg-primary-500'
          }`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={timeRemaining}
          aria-valuemin={0}
          aria-valuemax={timeLimitSec}
          aria-label={`${formatTime(timeRemaining)} remaining`}
        />
      </div>
      
      {isLowTime && (
        <div className="mt-2 flex items-center space-x-1 text-xs text-warning">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>Running low on time!</span>
        </div>
      )}
    </div>
  );
}
