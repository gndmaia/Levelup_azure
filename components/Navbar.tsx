'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { getImportedPracticeExam } from '@/lib/imported-practice';

function NavbarContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isAI103 = pathname.startsWith('/ai-103');
  const pageExam = pathname.split('/')[1]?.toUpperCase();
  const importedExam = getImportedPracticeExam(
    pathname.startsWith('/practice') || pathname.startsWith('/exam')
      ? searchParams.get('exam') ?? ''
      : pageExam ?? ''
  );
  const examQuery = importedExam ? `?exam=${importedExam.id}` : '';

  const isActive = (path: string) => {
    return pathname === path ? 'text-primary-500 border-b-2 border-primary-500' : 'text-neutral-600 hover:text-primary-500';
  };

  // Only show navigation links when not on the landing page
  const showNavLinks = pathname !== '/';

  return (
    <nav className="bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <img
                src="/logo-small.svg"
                alt="LevelUp Azure"
                className="h-10"
              />
            </Link>
          </div>
          {showNavLinks && (
            <div className="flex items-center space-x-8">
              {isAI103 ? (
                <>
                  <Link href="/ai-103" className={`px-3 py-2 text-sm font-medium transition-colors ${isActive('/ai-103')}`}>
                    AI-103 Simulator
                  </Link>
                  <Link href="/" className="px-3 py-2 text-sm font-medium text-neutral-600 transition-colors hover:text-primary-500">
                    All Certifications
                  </Link>
                </>
              ) : (
                <>
                  <Link href={`/practice${examQuery}`} className={`px-3 py-2 text-sm font-medium transition-colors ${isActive('/practice')}`}>
                    Practice
                  </Link>
                  <Link href={`/exam${examQuery}`} className={`px-3 py-2 text-sm font-medium transition-colors ${isActive('/exam')}`}>
                    Exam
                  </Link>
                  <Link href={importedExam ? `/${importedExam.id.toLowerCase()}` : '/about/ai-900'} className={`px-3 py-2 text-sm font-medium transition-colors ${isActive(importedExam ? `/${importedExam.id.toLowerCase()}` : '/about/ai-900')}`}>
                    {importedExam ? `About ${importedExam.id}` : 'About AI-900'}
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default function Navbar() {
  return (
    <Suspense fallback={<nav className="h-16 bg-white border-b border-neutral-200" aria-label="Loading navigation" />}>
      <NavbarContent />
    </Suspense>
  );
}