'use client';

import { useState, useEffect } from 'react';
import QuestionCard from '@/components/QuestionCard';
import Timer from '@/components/Timer';
import SummaryPanel from '@/components/SummaryPanel';
import QuestionNavigator from '@/components/QuestionNavigator';
import { Question, SessionSummary } from '@/types';

export default function ExamPage() {
  const [stage, setStage] = useState<'config' | 'exam' | 'summary'>('config');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [summary, setSummary] = useState<SessionSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(3600); // 60 minutes in seconds
  const [selectedAnswer, setSelectedAnswer] = useState<string[]>([]);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const startExam = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'exam',
          questionCount: 45,
          timeLimitSec: 3600, // 60 minutes
        }),
      });

      const data = await response.json();
      if (data.success) {
        setSessionId(data.session.id);
        setTotalQuestions(data.session.questionIds.length);
        setStage('exam');
        setCurrentQuestionIndex(0);
        loadQuestionByIndex(data.session.id, 1); // Load first question
      } else {
        alert(data.error || 'Failed to start exam');
      }
    } catch (error) {
      alert('Failed to start exam session');
    } finally {
      setLoading(false);
    }
  };

  const loadNextQuestion = async (sid: string) => {
    const nextIndex = currentQuestionIndex + 1;
    
    if (nextIndex >= totalQuestions) {
      // Reached the end
      alert('You have reached the end of the exam. Use the Question Navigator to review unanswered questions, or click "Finish Exam" to submit.');
      return;
    }
    
    setCurrentQuestionIndex(nextIndex);
    loadQuestionByIndex(sid, nextIndex + 1); // +1 because API uses 1-based indexing
  };

  const loadQuestionByIndex = async (sid: string, index: number) => {
    try {
      const response = await fetch(`/api/sessions/${sid}/question/${index}`);
      const data = await response.json();

      if (data.success) {
        setCurrentQuestion(data.question);
        setQuestionNumber(data.questionNumber);
        setTotalQuestions(data.totalQuestions);
        setSelectedAnswer(data.userAnswer || []); // Load previous answer if exists
      } else {
        alert('Failed to load question');
      }
    } catch (error) {
      alert('Failed to load question');
    }
  };

  const handleAnswerChange = (selectedOptions: string[]) => {
    setSelectedAnswer(selectedOptions);
  };

  const submitAnswer = async () => {
    if (!sessionId || !currentQuestion || selectedAnswer.length === 0) return;

    try {
      const response = await fetch(`/api/sessions/${sessionId}/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: currentQuestion.id,
          selectedOptions: selectedAnswer,
        }),
      });

      if (response.ok) {
        // Mark question as answered
        setAnsweredQuestions(prev => new Set(prev).add(questionNumber));
        // Move to next question
        await loadNextQuestion(sessionId);
      } else {
        alert('Failed to submit answer');
      }
    } catch (error) {
      alert('Failed to submit answer');
    }
  };

  const skipQuestion = () => {
    if (!sessionId) return;
    // Just move to next question without saving an answer
    loadNextQuestion(sessionId);
  };

  const navigateToQuestion = (questionNum: number) => {
    if (!sessionId) return;
    setCurrentQuestionIndex(questionNum - 1); // Update the index tracker
    loadQuestionByIndex(sessionId, questionNum);
  };

  const handleFinishExam = async () => {
    if (!sessionId) return;
    
    const unansweredCount = totalQuestions - answeredQuestions.size;
    if (unansweredCount > 0) {
      const confirmed = confirm(
        `You have ${unansweredCount} unanswered question${unansweredCount > 1 ? 's' : ''}. Are you sure you want to finish the exam?`
      );
      if (!confirmed) return;
    }
    
    await submitSession(sessionId);
  };

  const submitSession = async (sid: string) => {
    try {
      const response = await fetch(`/api/sessions/${sid}/submit`, {
        method: 'POST',
      });

      const data = await response.json();
      if (data.success) {
        setSummary(data.summary);
        setStage('summary');
      } else {
        alert('Failed to submit exam');
      }
    } catch (error) {
      alert('Failed to submit exam');
    }
  };

  const handleTimeUp = () => {
    if (sessionId) {
      alert('Time is up! Submitting your exam...');
      submitSession(sessionId);
    }
  };

  const handleRestart = () => {
    setStage('config');
    setSessionId(null);
    setCurrentQuestion(null);
    setQuestionNumber(0);
    setTotalQuestions(0);
    setSummary(null);
    setTimeRemaining(3600);
  };

  if (stage === 'summary' && summary) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <SummaryPanel summary={summary} />
        <div className="mt-6 text-center">
          <button
            onClick={handleRestart}
            className="bg-primary-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors"
          >
            Take Another Exam
          </button>
        </div>
      </div>
    );
  }

  if (stage === 'exam' && currentQuestion) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Timer and Progress */}
        <div className="mb-6 bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="text-neutral-700">
              Question <span className="font-bold">{questionNumber}</span> of{' '}
              <span className="font-bold">{totalQuestions}</span>
            </div>
            <Timer
              timeLimitSec={timeRemaining}
              onTimeUp={handleTimeUp}
            />
          </div>
          <div className="w-full bg-neutral-200 rounded-full h-2">
            <div
              className="bg-primary-500 h-2 rounded-full transition-all"
              style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <QuestionCard
          question={currentQuestion}
          onAnswer={handleAnswerChange}
          showFeedback={false}
          userAnswer={selectedAnswer}
          questionNumber={questionNumber}
          totalQuestions={totalQuestions}
        />

        {/* Action Buttons */}
        <div className="mt-6 flex justify-between gap-4">
          <button
            onClick={skipQuestion}
            className="px-6 py-3 border-2 border-neutral-300 text-neutral-700 rounded-lg font-semibold hover:bg-neutral-50 transition-colors"
          >
            Skip Question
          </button>
          <div className="flex gap-4">
            {questionNumber === totalQuestions ? (
              <button
                onClick={handleFinishExam}
                className="bg-success text-white px-8 py-3 rounded-lg font-semibold hover:bg-success/80 transition-colors"
              >
                Finish Exam
              </button>
            ) : (
              <>
                <button
                  onClick={submitAnswer}
                  disabled={selectedAnswer.length === 0}
                  className="bg-primary-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save & Next →
                </button>
              </>
            )}
          </div>
        </div>

        {/* Question Navigator */}
        <QuestionNavigator
          totalQuestions={totalQuestions}
          currentQuestion={questionNumber}
          answeredQuestions={answeredQuestions}
          onNavigate={navigateToQuestion}
        />

        {/* Exam Instructions */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-neutral-700">
            <strong>Exam Mode:</strong> You can now navigate between questions using the navigator below. 
            Skip questions you're unsure about and come back to them later. All unanswered questions will be marked in the navigator.
          </p>
        </div>
      </div>
    );
  }

  // Config stage
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-4">Exam Mode</h1>
        <p className="text-neutral-600 mb-8">
          Simulate the real Azure AI-900 certification exam with a timed session and realistic exam conditions.
        </p>

        <div className="space-y-6 mb-8">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-neutral-900">45 Questions</h3>
              <p className="text-neutral-600">
                Balanced across all AI-900 topic areas with realistic difficulty distribution
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-neutral-900">60 Minutes</h3>
              <p className="text-neutral-600">
                Same time limit as the actual Azure AI-900 certification exam
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-warning" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-neutral-900">No Feedback During Exam</h3>
              <p className="text-neutral-600">
                You won't see correct answers until the end. Cannot go back to previous questions.
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-success" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path
                  fillRule="evenodd"
                  d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-neutral-900">Detailed Results</h3>
              <p className="text-neutral-600">
                Get your score and per-category breakdown at the end of the exam
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={startExam}
            disabled={loading}
            className="flex-1 bg-primary-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Starting Exam...' : 'Start Exam'}
          </button>
          <button
            onClick={() => (window.location.href = '/')}
            className="px-8 py-4 border-2 border-neutral-300 text-neutral-700 rounded-lg font-semibold text-lg hover:bg-neutral-50 transition-colors"
          >
            Cancel
          </button>
        </div>

        <div className="mt-6 p-4 bg-primary-50 rounded-lg border border-primary-200">
          <p className="text-sm text-primary-900">
            <strong>Tip:</strong> The passing score for Azure AI-900 is 700 out of 1000 (approximately 70%).
            Make sure you're in a quiet environment before starting.
          </p>
        </div>
      </div>
    </div>
  );
}