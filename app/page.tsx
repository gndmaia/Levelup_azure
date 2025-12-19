'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function HomePage() {
  const [questionCount, setQuestionCount] = useState<number>(737); // Default fallback

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
    <div className="min-h-[calc(100vh-8rem)] relative overflow-hidden">
      {/* Christmas Snowflakes */}
      <div className="fixed inset-0 pointer-events-none z-50">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute text-white opacity-70 animate-snowfall"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-${Math.random() * 20}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
              fontSize: `${10 + Math.random() * 20}px`,
            }}
          >
            ❄
          </div>
        ))}
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-red-600 via-green-600 to-red-500 text-white relative">
        {/* Christmas Lights Border */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-500 via-yellow-400 via-green-500 via-blue-500 to-red-500 animate-pulse"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            {/* Christmas Greeting */}
            <div className="mb-4 flex justify-center items-center gap-3">
              <span className="text-3xl animate-bounce">🎄</span>
              <p className="text-2xl font-bold text-yellow-300">Happy Holidays!</p>
              <span className="text-3xl animate-bounce" style={{ animationDelay: '0.2s' }}>🎅</span>
            </div>
            
            <div className="flex justify-center mb-6">
              <img
                src="/logo.jpg"
                alt="LevelUp Azure"
                className="h-24 md:h-32 rounded-lg shadow-xl border-4 border-yellow-300"
              />
            </div>
            <p className="text-xl md:text-2xl mb-4 text-yellow-100">
              Master Azure Certifications with Confidence 🌟
            </p>
            <p className="text-lg text-yellow-50 max-w-2xl mx-auto">
              Choose your certification path and start practicing with real exam questions
            </p>
          </div>
        </div>
      </div>

      {/* Certification Selection */}
      <section className="py-16 bg-gradient-to-b from-white to-red-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              🎁 Select Your Certification 🎁
            </h2>
            <p className="text-red-600 font-semibold">Special Holiday Season - Level Up Your Skills! ⭐</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* AI-900 Card - Available */}
            <Link href="/ai-900" className="group">
              <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-green-600 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer h-full relative overflow-hidden">
                {/* Christmas decoration corner */}
                <div className="absolute top-2 right-2 text-2xl">🎄</div>
                
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-2xl font-bold text-gray-900">Azure AI-900</h3>
                  <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                    Available Now ✨
                  </span>
                </div>
                
                <p className="text-gray-600 mb-6">
                  Azure AI Fundamentals - Master the fundamentals of AI and machine learning on Azure
                </p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-success mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>{questionCount} Practice Questions</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-success mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Practice & Exam Modes</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-success mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Detailed Explanations</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-success mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Instant Feedback</span>
                  </div>
                </div>

                <div className="flex items-center text-green-600 font-semibold group-hover:text-green-700">
                  Start Learning 🎯 &rarr;
                </div>
              </div>
            </Link>

            {/* AI-102 Card - Coming Soon */}
            <div className="opacity-75">
              <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-warning h-full relative">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-2xl font-bold text-gray-900">Azure AI-102</h3>
                  <span className="bg-warning text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Coming Soon
                  </span>
                </div>
                
                <p className="text-gray-600 mb-6">
                  Azure AI Engineer Associate - Advanced AI solutions and cognitive services
                </p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-500">
                    <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <span>Comprehensive Question Bank</span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <span>Practice & Exam Modes</span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <span>Detailed Explanations</span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <span>Real Exam Scenarios</span>
                  </div>
                </div>

                <div className="flex items-center text-gray-500 font-semibold">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  Coming Soon
                </div>
              </div>
            </div>

            {/* AZ-900 Card - Available */}
            <Link href="/az-900" className="group">
              <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-blue-600 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer h-full relative overflow-hidden">
                {/* Christmas decoration corner */}
                <div className="absolute top-2 right-2 text-2xl">⛄</div>
                
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-2xl font-bold text-gray-900">Azure AZ-900</h3>
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                    Available Now ✨
                  </span>
                </div>
                
                <p className="text-gray-600 mb-6">
                  Azure Fundamentals - Master cloud concepts and Azure core services
                </p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 mr-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>135 Practice Questions</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 mr-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Practice & Exam Modes</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 mr-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Detailed Explanations</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 mr-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Cloud Fundamentals Coverage</span>
                  </div>
                </div>

                <div className="flex items-center text-blue-600 font-semibold group-hover:text-blue-700">
                  Start Learning 🎯 &rarr;
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose LevelUp Azure?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Real Exam Questions</h3>
              <p className="text-gray-600">
                Practice with questions that mirror actual Azure certification exams
              </p>
            </div>

            <div className="text-center">
              <div className="bg-success/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Instant Feedback</h3>
              <p className="text-gray-600">
                Get immediate explanations and learn from your mistakes
              </p>
            </div>

            <div className="text-center">
              <div className="bg-warning/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Flexible Practice</h3>
              <p className="text-gray-600">
                Choose practice mode for learning or exam mode for testing
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}