export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-500 rounded flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
            <span className="font-semibold">LevelUp Azure</span>
          </div>
          
          <div className="text-sm text-center md:text-left">
            <p>© 2025 LevelUp Azure. Practice platform for Azure certifications.</p>
          </div>
          
          <div className="flex space-x-6 text-sm">
            <a href="#" className="hover:text-primary-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary-400 transition-colors">Terms</a>
            <a href="https://docs.microsoft.com/en-us/certifications/" target="_blank" rel="noopener noreferrer" className="hover:text-primary-400 transition-colors">
              Official Docs
            </a>
            <a href="/admin" className="hover:text-primary-400 transition-colors text-neutral-500 hover:text-neutral-400" title="Admin Panel">
              ⚙
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
