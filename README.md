# LevelUp Azure Certification Practice Platform

A comprehensive web application for practicing Azure certifications with interactive Practice and Exam modes.

![Azure AI-900 Practice Platform](public/logo.jpg)

## 🚀 Features

### Practice Mode
- **Untimed practice** with instant feedback
- **737 unique questions** covering all AI-900 topics
- **Detailed explanations** and reference links
- **Topic-based filtering** for focused study
- **Immediate feedback** after each question

### Exam Mode
- **Realistic exam simulation** with 60-minute timer
- **45 questions** balanced by topic and difficulty
- **Flag questions** for review
- **Comprehensive summary** with score breakdown

### AI-103 Simulator
- **226 original questions** aligned to the April 2026 AI-103 skills outline
- **51-question attempts** with timed and study modes
- **Case studies, code completion, ordering, matching, matrix, and decision items**
- **Immediate correct-answer feedback in study mode**
- Bundled from the MIT-licensed [AI-103 Practice Exam](https://github.com/sefstratiou-ai/ai-103-practice-exam) project

### Admin Features
- **Question import** from HTML files
- **Duplicate detection** and cleanup
- **Coverage analysis** by topic
- **Question management** interface

### AB-731 AI Transformation Leader
- **140 imported training questions** from four MSS AI First Forms quizzes: 58, 51, 15, and 16 questions.
- **Practice Mode and Exam Mode**, matching the AI-900 landing layout, with one combined bank and a question-count selector after choosing a mode. Exam mode defaults to 60 questions in 45 minutes.
- **11 multiple-select questions** with exact-match scoring and no partial credit.
- Correct answers come from the source Forms' normal **View results** answer markers. Random trial responses, respondent information, and submission scores are not included.
- Source wording, paragraph breaks, question numbers, and links are retained. Feedback identifies the source's correct options; it does not invent authored explanations.
- These are training questions, not live certification-exam content. Practice percentages do not reproduce Microsoft's scaled exam scores or the Forms' individual point weights.
- Imported question content remains subject to its source owners' permissions; the application's code license does not grant additional rights to third-party question content.

Open `/ab-731`, or use `/practice?exam=AB-731`. Choose 10, 30, 60, or all 140 questions. Historical `set` query parameters no longer restrict the bank. Original source information is retained in answer feedback, not exposed as separate homework or test menus.

To regenerate the imported bank from authorized source extracts and revealed reviews:

```bash
node scripts/import-ab731.mjs <source-directory> YYYY-MM-DD
npm run test:ab731
```

The source directory must contain `ab731-trial-responses.json`, `ab731-visible-stems.json`, and `ab731-form-1-review.json` through `ab731-form-4-review.json`. The importer checks source IDs, wording, choices, selection counts, and revealed correct-answer markers before writing the bank. Source extracts are not checked into the repository. The legacy admin text-import endpoint rejects AB-731 writes to avoid modifying an unrelated exam's seed file.

### AB-730 AI Business Professional
- **160 imported training questions** from four Forms quizzes: 50, 50, 30, and 30 questions, including **10 two-answer multiple-select questions**.
- Open `/ab-730` to choose Practice or Exam, then select 10, 30, 60, or all 160 questions from the combined bank. Exam mode retains its 45-minute timer and defaults to 60 questions.
- Source answer keys were collected through normal Forms results review. Trial selections, respondent details, and trial scores are not published. Question wording and source-set provenance are retained.
- The 160 count is source-set items, not unique stems: questions repeated across source quizzes are retained so each original set stays complete.
- The shared certification landing, import validation, seed conversion, and practice flow also serve AB-731 without changing its question bank.
- Source mistakes are not silently rewritten: Practice exam 2, question 10 repeats an incorrect distractor. Both options are retained under distinct IDs; the correct answer is unambiguous.
- These are unofficial training questions, not live exam content. Microsoft's AB-730 certification page lists an English syllabus update for **October 20, 2026**; review the latest official study guide rather than assuming these source quizzes cover the updated syllabus.
- Imported content remains subject to its source owners' permissions, not the application's code license.

Regenerate from the authorized AB-730 extracts using the same file naming convention as AB-731:

```bash
node scripts/import-ab730.mjs <source-directory> YYYY-MM-DD
npm run test:forms
```

Both wrappers use `scripts/import-forms-bank.mjs`, which validates source IDs, counts, original wording, option text, and revealed keys. Duplicate incorrect distractors are allowed, but an ambiguous correct-option mapping stops the import. The legacy admin import endpoint rejects both generated Forms banks. Pull-request builds run the data regressions for both exams without deploying production.

### GH-300 GitHub Copilot
- **255 detailed practice questions** imported from ten supplied Markdown files from [ElmentorProgram/gh-300](https://github.com/ElmentorProgram/gh-300), with user-confirmed reproduction permission.
- Open `/gh-300` to choose Practice or Exam, then select 10, 30, 60, or all 255 questions. Questions are drawn from the combined certification bank; the original detailed files are attribution, not separate test menus.
- **13 multiple-select questions**, including keys with more than two answers; scoring requires exactly the source's correct choices.
- Original explanations, tips, important callouts, correct/wrong discussions where present, and official documentation references are retained.
- Correct-choice bolding is stripped from displayed options. A safe text-only Markdown subset renders emphasis, inline code, paragraphs, headings, lists, and callouts through React nodes; raw HTML is never injected.
- Timed practice defaults to **60 questions in 100 minutes**, with an adjustable question count. The duration matches the official [GH-300 certification page](https://learn.microsoft.com/en-us/credentials/certifications/github-copilot/); the selected question count and practice percentage are not official exam scoring.
- The detailed files contain **255**, not the source README's advertised 300 items: tests 07 and 08 have only **10 and 5** questions. Missing questions are not fabricated, and the raw files in the same folder are excluded to avoid duplicate imports.
- Source commit, per-file SHA-256, original question numbering, and pinned source links are retained. The local source directory is never written to, and its absolute path is not published.
- The source repository has no published license. Permission to import was confirmed by the user; this does not grant additional reuse rights or apply the application's code license to the question content.

Regenerate from the authorized detailed directory:

```bash
node scripts/import-gh300.mjs <detailed-directory> YYYY-MM-DD <full-source-git-commit>
npm run test:practice
```

The importer strictly validates question sections, sequential option IDs, explicit answer mappings, authored explanations, reference URLs, source counts, and duplicate question IDs before writing the generated bank. The legacy admin import endpoint rejects GH-300 writes. Shared imported-exam metadata, landing, seed conversion, and full-bank mode flow serve AB-730, AB-731, and GH-300. Source references remain in answer feedback; source-group badges and summary breakdowns are hidden in these modes. Mode navigation and retry links retain the selected certification.

## 🎯 Current Statistics

- **737** Deduplicated practice questions
- **10+** Topic areas covered
- **100%** Free to use
- **Responsive** design for all devices

## 🛠️ Technology Stack

- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **React Hooks** for state management
- **Cookie-based authentication** (MVP)
- **In-memory data store** with full CRUD operations

## 🏗️ Project Structure

```
levelup-azure/
├── app/
│   ├── api/              # API routes
│   ├── practice/         # Practice mode
│   ├── exam/             # Exam mode  
│   ├── ai-103/           # Embedded full-fidelity AI-103 simulator
│   ├── ab-731/           # Imported Forms practice sets and source attribution
│   ├── ab-730/           # AI Business Professional Forms practice sets
│   ├── gh-300/           # Detailed GitHub Copilot practice bank
│   ├── sessions/         # Session history
│   ├── about/            # About pages
│   ├── auth/             # Authentication
│   └── admin/            # Admin pages
├── components/           # React components
├── public/
│   └── ai-103-simulator/ # Static AI-103 application bundle
├── lib/                  # Business logic
│   ├── data-store.ts    # In-memory database
│   ├── question-selector.ts
│   ├── scoring.ts
│   ├── auth.ts
│   └── seed-data.ts
└── types/               # TypeScript definitions
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/levelup-azure-ai900.git
   cd levelup-azure-ai900
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎮 Usage

### For Students

1. **Visit the home page** and select "Azure AI-900"
2. **Choose Practice Mode** for learning with instant feedback
3. **Select topics** you want to focus on (optional)
4. **Answer questions** and review explanations
5. **Track your progress** through the session summary

### For Exam Simulation

1. **Select Exam Mode** for timed practice
2. **Complete 45 questions** in 60 minutes
3. **Review flagged questions** before submitting
4. **Analyze results** by topic and difficulty

### For Administrators

1. **Access `/admin`** for question management
2. **Import questions** from HTML files
3. **Review and validate** parsed questions
4. **Monitor coverage** across topic areas

## 📊 Question Quality

All questions have been:
- ✅ **Deduplicated** - Removed 138+ duplicate entries
- ✅ **Validated** - Proper format and structure
- ✅ **Categorized** - Auto-assigned to topic areas
- ✅ **Explained** - Detailed explanations with references

## 🎨 Design System

- **Primary**: #0078D4 (Azure Blue)
- **Success**: #10B981
- **Warning**: #F59E0B  
- **Error**: #EF4444
- **Neutrals**: Full grayscale palette

## 🧪 Key Features Implemented

1. **Complete Practice Workflow** - Start to finish learning experience
2. **Question Selection Algorithms** - Smart question distribution
3. **Scoring System** - Detailed performance analytics
4. **Session Management** - Track progress across sessions
5. **Responsive UI** - Works on desktop, tablet, and mobile
6. **Accessibility** - WCAG AA compliant with keyboard navigation

## 📝 API Endpoints

### Public Endpoints
- `GET /api/questions/count` - Get total question count
- `POST /api/sessions` - Create practice/exam session
- `GET /api/sessions/[id]/next` - Get next question
- `POST /api/sessions/[id]/answer` - Submit answer

### Admin Endpoints
- `GET /api/admin/all-questions` - List all questions
- `POST /api/admin/parse-questions` - Parse HTML files
- `GET /api/admin/coverage` - Coverage analysis
- `GET /api/admin/find-duplicates` - Duplicate detection

## 🔧 Configuration

The app uses environment-based configuration. Key settings:

- **Question Pool**: Managed in `lib/seed-data.ts`
- **Exam Settings**: Configurable in `lib/question-selector.ts`
- **Styling**: Customizable via `tailwind.config.ts`

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
2. **Connect to Vercel**
3. **Deploy automatically**

### Other Platforms

The app is a standard Next.js application and can be deployed to:
- Netlify
- Railway
- Azure Static Web Apps
- AWS Amplify

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Microsoft Azure** for the AI-900 certification program
- **Next.js team** for the excellent framework
- **Tailwind CSS** for the utility-first CSS framework
- **Community contributors** for question validation and feedback

## 📞 Support

For support and questions:
- 📧 Email: your-email@domain.com
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/levelup-azure-ai900/issues)
- 📖 Documentation: [Project Wiki](https://github.com/your-username/levelup-azure-ai900/wiki)

---

**Made with ❤️ for the Azure certification community**