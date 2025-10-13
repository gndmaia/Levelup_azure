'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function AZ900Page() {
  const [questionCount, setQuestionCount] = useState<number>(0); // Start with 0 since we haven't added questions yet

  useEffect(() => {
    const fetchQuestionCount = async () => {
      try {
        const response = await fetch('/api/questions/count?exam=AZ-900');
        const data = await response.json();
        if (data.success) {
          setQuestionCount(data.count);
        }
      } catch (error) {
        console.error('Failed to fetch question count:', error);
      }
    };

    fetchQuestionCount();
  }, []);

  return (
    <div className="min-h-[calc(100vh-8rem)]">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <img
                src="/logo.jpg"
                alt="LevelUp Azure"
                className="h-24 md:h-32"
              />
            </div>
            <p className="text-xl md:text-2xl mb-8 text-blue-50">
              Master the Azure AZ-900 certification with interactive practice and realistic exam simulations
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/practice?exam=AZ-900"
                className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg min-w-[200px] text-center"
              >
                Start Practicing
              </Link>
              <Link
                href="/exam?exam=AZ-900"
                className="px-8 py-4 bg-blue-800 text-white rounded-lg font-semibold text-lg hover:bg-blue-900 transition-all transform hover:scale-105 shadow-lg min-w-[200px] text-center"
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
                <span className="text-neutral-700">Immediate feedback after each question</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="#10B981" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-neutral-700">Detailed explanations and references</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="#10B981" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-neutral-700">Filter by topic and difficulty</span>
              </li>
            </ul>
            <Link
              href="/practice?exam=AZ-900"
              className="inline-block px-6 py-3 bg-success text-white rounded-lg font-semibold hover:bg-green-600 transition-colors"
            >
              Start Practice Session
            </Link>
          </div>

          {/* Exam Mode */}
          <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-primary-600">
            <div className="flex items-center mb-4">
              <img src="/exam.png" alt="Exam Mode" className="w-12 h-12 mr-4 rounded-lg object-cover" />
              <h3 className="text-2xl font-bold text-neutral-900">Exam Mode</h3>
            </div>
            <p className="text-neutral-600 mb-6">
              Test yourself with a full simulated exam experience that mirrors the real Azure AZ-900 certification exam.
            </p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="#0EA5E9" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-neutral-700">60 questions in 45 minutes</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="#0EA5E9" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-neutral-700">Real exam simulation</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="#0EA5E9" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-neutral-700">Score and review at the end</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="#0EA5E9" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-neutral-700">Track your progress</span>
              </li>
            </ul>
            <Link
              href="/exam?exam=AZ-900"
              className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Take Practice Exam
            </Link>
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl shadow-lg p-8 text-white">
          <h3 className="text-2xl font-bold mb-6 text-center">AZ-900 Question Bank</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{questionCount}</div>
              <div className="text-blue-100">Total Questions</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">60</div>
              <div className="text-blue-100">Exam Questions</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">45</div>
              <div className="text-blue-100">Minutes</div>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h3 className="text-2xl font-bold text-neutral-900 mb-6 text-center">About the AZ-900 Certification</h3>
          <div className="max-w-3xl mx-auto text-neutral-700 space-y-4">
            <p>
              The Microsoft Azure Fundamentals (AZ-900) certification is an entry-level certification that validates your foundational knowledge of cloud services and how those services are provided with Microsoft Azure.
            </p>
            <p>
              This exam is designed for candidates with non-technical or technical backgrounds who want to validate their knowledge of Azure cloud services. It covers cloud concepts, core Azure services, security, privacy, compliance, trust, and Azure pricing and support.
            </p>
            <p>
              Our practice platform provides you with comprehensive questions covering all exam objectives, helping you prepare effectively for the actual certification exam.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
