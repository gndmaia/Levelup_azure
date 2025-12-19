'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ObjectiveSelector from '@/components/ObjectiveSelector';
import QuestionCard from '@/components/QuestionCard';
import SummaryPanel from '@/components/SummaryPanel';
import { Question, SessionSummary } from '@/types';

function PracticePageContent() {
  const searchParams = useSearchParams();
  const examId = searchParams.get('exam') || 'AI-900';
  
  const [stage, setStage] = useState<'config' | 'practice' | 'summary'>('config');
  const [objectives, setObjectives] = useState<string[]>([]);
  const [selectedObjectives, setSelectedObjectives] = useState<string[]>([]);
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [feedback, setFeedback] = useState<any>(null);
  const [summary, setSummary] = useState<SessionSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [availableQuestionCount, setAvailableQuestionCount] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string[]>([]);

  // Load objectives and available question count
  useEffect(() => {
    // Define objectives based on exam
    const examObjectives: Record<string, string[]> = {
      'AI-900': [
        'AI-Workloads',
        'Computer-Vision',
        'NLP',
        'Conversational-AI',
        'Speech',
        'Document-Intelligence',
        'Responsible-AI',
        'ML-Fundamentals',
        'Azure-ML',
        'Custom-Vision',
        'Anomaly-Detection',
      ],
      'AZ-900': [
        'Cloud-Concepts',
        'Azure-Architecture-Services',
        'Management-Governance',
        'Security-Compliance-Trust',
      ],
    };
    
    setObjectives(examObjectives[examId] || examObjectives['AI-900']);
    
    // Fetch available question count
    fetch(`/api/questions/count?exam=${examId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setAvailableQuestionCount(data.count);
        }
      })
      .catch(() => {
        // Default to 20 if API fails
        setAvailableQuestionCount(20);
      });
  }, [examId]);

  const startPractice = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'practice',
          examId: examId,
          objectiveIds: selectedObjectives.length > 0 ? selectedObjectives : undefined,
          questionCount: questionCount,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setSessionId(data.session.id);
        setStage('practice');
        loadNextQuestion(data.session.id);
      } else {
        alert(data.error || 'Failed to start practice');
      }
    } catch (error) {
      alert('Failed to start practice session');
    } finally {
      setLoading(false);
    }
  };

  const loadNextQuestion = async (sid: string) => {
    try {
      const response = await fetch(`/api/sessions/${sid}/next`);
      const data = await response.json();

      if (data.completed) {
        await submitSession(sid);
      } else {
        setCurrentQuestion(data.question);
        setQuestionNumber(data.questionNumber);
        setTotalQuestions(data.totalQuestions);
        setFeedback(null);
        setSelectedAnswer([]); // Reset selected answer for new question
      }
    } catch (error) {
      alert('Failed to load question');
    }
  };

  const handleAnswerChange = (selectedOptions: string[]) => {
    // Just store the selection, don't submit yet
    setSelectedAnswer(selectedOptions);
  };

  const checkAnswer = async () => {
    // Add immediate visual feedback
    const button = document.querySelector('.check-answer-btn') as HTMLButtonElement;
    if (button) {
      button.textContent = 'Checking...';
      button.disabled = true;
    }

    if (!sessionId || !currentQuestion || feedback || selectedAnswer.length === 0) {
      alert('Cannot check answer - missing data');
      if (button) {
        button.textContent = 'Check Answer';
        button.disabled = selectedAnswer.length === 0;
      }
      return;
    }

    try {
      const response = await fetch(`/api/sessions/${sessionId}/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: currentQuestion.id,
          selectedOptions: selectedAnswer,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      if (data.success && data.feedback) {
        setFeedback(data.feedback);
      } else {
        alert('No feedback received from server');
      }
    } catch (error) {
      console.error('Answer submission error:', error);
      alert(`Failed to submit answer: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      if (button) {
        button.textContent = 'Check Answer';
        button.disabled = selectedAnswer.length === 0;
      }
    }
  };

  const nextQuestion = () => {
    if (sessionId) {
      loadNextQuestion(sessionId);
    }
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
      }
    } catch (error) {
      alert('Failed to submit session');
    }
  };

  if (stage === 'config') {
    const questionOptions = [10, 30, 60, availableQuestionCount].filter((n, i, arr) => n <= availableQuestionCount && arr.indexOf(n) === i).sort((a, b) => a - b);
    
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Practice Mode</h1>
          <p className="text-neutral-600 mb-8">
            Choose your topics and practice at your own pace with instant feedback.
          </p>

          <ObjectiveSelector
            objectives={objectives}
            onSelect={setSelectedObjectives}
            selectedObjectives={selectedObjectives}
          />

          {/* Question Count Selector */}
          <div className="mt-8 border-t border-neutral-200 pt-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
              Number of Questions
            </h3>
            <p className="text-sm text-neutral-600 mb-4">
              Available questions: {availableQuestionCount}
            </p>
            <div className="grid grid-cols-4 gap-3">
              {questionOptions.map((count) => (
                <button
                  key={count}
                  onClick={() => setQuestionCount(count)}
                  className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                    questionCount === count
                      ? 'bg-primary-500 text-white ring-2 ring-primary-500 ring-offset-2'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            <button
              onClick={() => window.history.back()}
              className="px-6 py-3 border-2 border-neutral-300 text-neutral-700 rounded-lg font-semibold hover:border-neutral-400 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={startPractice}
              disabled={loading}
              className="px-6 py-3 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition-colors disabled:opacity-50"
            >
              {loading ? 'Starting...' : 'Start Practice'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'practice' && currentQuestion) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <QuestionCard
          question={currentQuestion}
          onAnswer={handleAnswerChange}
          showFeedback={!!feedback}
          isCorrect={feedback?.isCorrect}
          questionNumber={questionNumber}
          totalQuestions={totalQuestions}
          disabled={!!feedback}
        />

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end">
          {!feedback ? (
            <button
              onClick={checkAnswer}
              disabled={selectedAnswer.length === 0}
              className="check-answer-btn px-8 py-3 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Check Answer
            </button>
          ) : (
            <button
              onClick={nextQuestion}
              className="px-8 py-3 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition-colors"
            >
              Next Question →
            </button>
          )}
        </div>
      </div>
    );
  }

  const handleRestart = () => {
    setStage('config');
    setSessionId(null);
    setCurrentQuestion(null);
    setQuestionNumber(0);
    setTotalQuestions(0);
    setFeedback(null);
    setSummary(null);
    setSelectedObjectives([]);
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
            Practice Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
        <p className="mt-4 text-neutral-600">Loading...</p>
      </div>
    </div>
  );
}

export default function PracticePage() {
  return (
    <Suspense fallback={
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-neutral-600">Loading practice session...</p>
        </div>
      </div>
    }>
      <PracticePageContent />
    </Suspense>
  );
}
