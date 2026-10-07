'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { IMPORTED_PRACTICE_EXAMS } from '@/lib/imported-practice';

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
    <>
      {/* Rain Effect */}
      <div className="rain-container" aria-hidden="true">
        {[...Array(50)].map((_, i) => (
          <div key={i} className="rain" />
        ))}
      </div>

      <div className="content-wrapper min-h-[calc(100vh-8rem)]">
        {/* Hero Section - Winter Theme */}
        <div className="bg-gradient-to-br from-slate-700 via-blue-900 to-slate-600 text-white relative overflow-hidden">
          {/* Winter overlay effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/20 to-slate-800/40" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <img
                  src="/logo.jpg"
                  alt="LevelUp Azure"
                  className="h-24 md:h-32 drop-shadow-2xl"
                />
              </div>
              <p className="text-xl md:text-2xl mb-4 text-blue-100 drop-shadow-lg">
                ❄️ Master Azure Certifications with Confidence ❄️
              </p>
              <p className="text-lg text-blue-200 max-w-2xl mx-auto drop-shadow-md">
                Choose your certification path and start practicing with real exam questions
              </p>
              <p className="text-sm text-blue-300 mt-2 italic">Winter Edition - Stay warm while you learn</p>
            </div>
          </div>
        </div>

        {/* Certification Selection */}
        <section className="py-16 bg-gradient-to-b from-slate-50/95 to-blue-50/90 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-slate-800 mb-12 drop-shadow-sm">
              ❄️ Select Your Certification ❄️
            </h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* AI-900 Card - Available */}
            <Link href="/ai-900" className="group">
              <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-8 border-t-4 border-cyan-600 hover:shadow-2xl hover:bg-white transition-all duration-300 transform hover:-translate-y-1 cursor-pointer h-full">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-2xl font-bold text-slate-900">Azure AI-900</h3>
                  <span className="bg-cyan-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-md">
                    Available Now
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

                <div className="flex items-center text-primary-600 font-semibold group-hover:text-primary-700">
                  Start Learning &rarr;
                </div>
              </div>
            </Link>

            {/* AI-103 Card - Available */}
            <Link href="/ai-103" className="group">
              <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-8 border-t-4 border-violet-600 hover:shadow-2xl hover:bg-white transition-all duration-300 transform hover:-translate-y-1 cursor-pointer h-full">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-2xl font-bold text-gray-900">Azure AI-103</h3>
                  <span className="bg-violet-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Available Now
                  </span>
                </div>
                
                <p className="text-gray-600 mb-6">
                  Azure AI Apps and Agents Developer Associate - Build generative AI, agents, vision, text, and information extraction solutions
                </p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 mr-3 text-violet-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>226 Original Practice Questions</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 mr-3 text-violet-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>51-Question Timed & Study Modes</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 mr-3 text-violet-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Case Studies & Interactive Formats</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 mr-3 text-violet-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 10-1.414-1.414L10 8.586 8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293z" clipRule="evenodd" />
                    </svg>
                    <span>Original Content - Not Live Exam Questions</span>
                  </div>
                </div>

                <div className="flex items-center text-violet-600 font-semibold group-hover:text-violet-700">
                  Start Learning &rarr;
                </div>
              </div>
            </Link>

            {Object.values(IMPORTED_PRACTICE_EXAMS).map((exam) => (
              <Link key={exam.id} href={`/${exam.id.toLowerCase()}`} className="group">
                <div className="h-full cursor-pointer rounded-xl border-t-4 border-emerald-600 bg-white/95 p-8 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-2xl">
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <h3 className="text-2xl font-bold text-gray-900">{exam.id === 'GH-300' ? 'GitHub' : 'Microsoft'} {exam.id}</h3>
                    <span className="rounded-full bg-emerald-600 px-3 py-1 text-sm font-semibold text-white">
                      Available Now
                    </span>
                  </div>
                  <p className="mb-6 text-gray-600">
                    {exam.title} - {exam.description}.
                  </p>
                  <div className="mb-6 space-y-3 text-gray-700">
                    <p>{exam.questionCount} Imported Training Questions</p>
                    <p>{exam.sources.length} {exam.sourceKind === 'markdown' ? 'Detailed Practice Tests' : 'Practice & Homework Sets'}</p>
                    <p>Single-Choice &amp; Multiple-Select Questions</p>
                    <p>{exam.sourceKind === 'markdown' ? 'Detailed Explanations & Reference Links' : 'Source Answer Keys & Timed Practice'}</p>
                  </div>
                  <div className="font-semibold text-emerald-700 group-hover:text-emerald-800">
                    Start Learning &rarr;
                  </div>
                </div>
              </Link>
            ))}

            {/* AZ-900 Card - Available */}
            <Link href="/az-900" className="group">
              <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-8 border-t-4 border-blue-700 hover:shadow-2xl hover:bg-white transition-all duration-300 transform hover:-translate-y-1 cursor-pointer h-full">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-2xl font-bold text-gray-900">Azure AZ-900</h3>
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Available Now
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
                  Start Learning &rarr;
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-16 bg-gradient-to-b from-blue-50/90 to-slate-100/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-slate-800 mb-12 drop-shadow-sm">
            ❄️ Why Choose LevelUp Azure? ❄️
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100/80 backdrop-blur-sm w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
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
              <div className="bg-cyan-100/80 backdrop-blur-sm w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
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
              <div className="bg-amber-100/80 backdrop-blur-sm w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
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
    </>
  );
}