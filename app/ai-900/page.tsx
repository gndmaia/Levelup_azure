'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function HomePage() {
  const [questionCount, setQuestionCount] = useState<number>(737); // Default to current count

  useEffect(() => {
    const fetchQuestionCount = async () => {
      try {
        const response = await fetch('/api/questions/count');
        const data = await response.json();
        if (data.success) {
          setQuestionCount(data.count);
        }
      } catch (error) {
        console.error('Failed to fetch question count:', error);
        // Keep the default value
      }
    };

    fetchQuestionCount();
  }, []);
  return (
    <div className="min-h-[calc(100vh-8rem)]">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-600 via-primary-500 to-accent-teal text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <img
                src="/logo.jpg"
                alt="LevelUp Azure"
                className="h-24 md:h-32"
              />
            </div>
            <p className="text-xl md:text-2xl mb-8 text-primary-50">
              Master the Azure AI-900 certification with interactive practice and realistic exam simulations
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/practice"
                className="px-8 py-4 bg-white text-primary-600 rounded-lg font-semibold text-lg hover:bg-primary-50 transition-all transform hover:scale-105 shadow-lg min-w-[200px] text-center"
              >
                Start Practicing
              </Link>
              <Link
                href="/exam"
                className="px-8 py-4 bg-primary-800 text-white rounded-lg font-semibold text-lg hover:bg-primary-900 transition-all transform hover:scale-105 shadow-lg min-w-[200px] text-center"
              >
                Take Exam
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Practice Mode */}
          <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-success">
            <div className="flex items-center mb-4">
              <img src="/practice.jpg" alt="Practice Mode" className="w-12 h-12 mr-4 rounded-lg object-cover" />
              <h3 className="text-2xl font-bold text-neutral-900">Practice Mode</h3>
            </div>
            <p className="text-neutral-600 mb-6">
              Learn at your own pace with instant feedback, detailed explanations, and helpful references for each question.
            </p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="#10B981" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-neutral-700">Untimed practice sessions</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="#10B981" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-neutral-700">Immediate feedback per question</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="#10B981" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-neutral-700">Choose specific topics or mixed</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="#10B981" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-neutral-700">Detailed explanations & references</span>
              </li>
            </ul>
            <Link
              href="/practice"
              className="block w-full bg-success text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors text-center"
            >
              Start Practice
            </Link>
          </div>

          {/* Exam Mode */}
          <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-primary-500">
            <div className="flex items-center mb-4">
              <img src="/exam.png" alt="Exam Mode" className="w-12 h-12 mr-4 rounded-lg object-cover" />
              <h3 className="text-2xl font-bold text-neutral-900">Exam Mode</h3>
            </div>
            <p className="text-neutral-600 mb-6">
              Simulate the real certification exam experience with timed sessions and comprehensive end-of-exam review.
            </p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="#0078D4" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-neutral-700">Realistic exam simulation</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="#0078D4" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-neutral-700">Timed sessions (60 minutes)</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="#0078D4" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-neutral-700">45 questions (balanced by topic)</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="#0078D4" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-neutral-700">Detailed score & topic breakdown</span>
              </li>
            </ul>
            <Link
              href="/exam"
              className="block w-full bg-primary-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors text-center"
            >
              Take Exam
            </Link>
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-neutral-900 mb-4">About Azure AI-900</h3>
          <p className="text-neutral-600 mb-6">
            The Microsoft Azure AI Fundamentals certification validates your understanding of machine learning and artificial intelligence concepts and related Microsoft Azure services. This practice platform helps you prepare with:
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-500 mb-2">{questionCount}</div><p className="text-neutral-600">Exam Questions</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-500 mb-2">10+</div>
              <p className="text-neutral-600">Topic Areas</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-500 mb-2">100%</div>
              <p className="text-neutral-600">Free Practice</p>
            </div>
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/about/ai-900"
              className="text-primary-600 hover:text-primary-700 font-semibold"
            >
              Learn more about AI-900 &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
