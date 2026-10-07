import Link from "next/link";

export default function AI103Page() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950">
      <div className="flex items-center justify-between gap-4 border-b border-slate-700 bg-slate-900 px-4 py-3 text-white sm:px-6">
        <div>
          <h1 className="text-lg font-semibold">AI-103 Practice Exam</h1>
          <p className="text-sm text-slate-300">
            226 original questions aligned to the April 2026 skills outline
          </p>
        </div>
        <div className="flex gap-3">
          <a
            href="https://github.com/sefstratiou-ai/ai-103-practice-exam"
            target="_blank"
            rel="noreferrer"
            className="hidden rounded-md border border-slate-500 px-4 py-2 text-sm font-semibold hover:bg-slate-800 sm:inline-block"
          >
            Source
          </a>
          <Link
            href="/"
            className="rounded-md border border-slate-500 px-4 py-2 text-sm font-semibold hover:bg-slate-800"
          >
            Certifications
          </Link>
          <a
            href="/ai-103-simulator/index.html"
            target="_blank"
            rel="noreferrer"
            className="rounded-md bg-cyan-600 px-4 py-2 text-sm font-semibold hover:bg-cyan-500"
          >
            Open full screen
          </a>
        </div>
      </div>
      <iframe
        src="/ai-103-simulator/index.html"
        title="AI-103 practice exam simulator"
        className="h-[calc(100vh-8.25rem)] min-h-[720px] w-full border-0 bg-white"
      />
    </div>
  );
}
