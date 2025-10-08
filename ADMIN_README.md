# Admin Question Manager

This admin tool allows you to easily import questions from HTML files (like those from SkillCertPro) into the LevelUp Azure AI-900 question database.

## How to Use

### 1. Access the Admin Page
Navigate to `/admin` in your browser (e.g., `http://localhost:3000/admin`)

### 2. Upload HTML File
- Click "Choose HTML file" button
- Select an HTML file (.htm or .html) from SkillCertPro containing AI-900 questions
- The file should have the wpProQuiz format (questions with options, correct answers, and explanations)

### 3. Parse Questions
- Click "Upload & Parse Questions" button
- The system will extract all questions from the HTML file
- Questions will be automatically categorized based on keywords in the question text

### 4. Review and Edit
For each parsed question, you can:
- **Select/Deselect**: Check or uncheck the checkbox to include/exclude from import
- **Edit Question Text**: Modify the question if needed
- **Edit Options**: Change answer options (correct answer is highlighted in green)
- **Change Category**: Select the appropriate category from the dropdown
- **Edit Explanation**: Modify or add explanation text
- **Review Reference**: Check the documentation URL (if available)

### 5. Save to Database
- Review the selected questions (counter shows how many are selected)
- Click "Save X Questions" button
- Questions will be added to `/lib/seed-data.ts` with unique IDs
- A success message will confirm the import

## Question Categories

The system supports these categories:
- **AI-Workloads** - General AI concepts and workloads
- **Computer-Vision** - Image processing, object detection, OCR
- **NLP** - Natural Language Processing, Text Analytics
- **Conversational-AI** - Bots, QnA Maker, LUIS
- **Speech** - Speech recognition and synthesis
- **Document-Intelligence** - Form Recognizer, OCR
- **Responsible-AI** - Fairness, transparency, bias
- **ML-Fundamentals** - Machine learning basics
- **Azure-ML** - Azure Machine Learning service
- **Custom-Vision** - Custom Vision service
- **Anomaly-Detection** - Anomaly detector service

## Auto-Categorization

The parser automatically assigns categories based on keywords found in questions and explanations:
- Keywords like "computer vision", "image", "object detection" → Computer-Vision
- Keywords like "nlp", "natural language", "text analytics" → NLP
- Keywords like "bot", "conversational", "qna maker" → Conversational-AI
- And so on...

You can always manually change the category before saving.

## Technical Details

### File Format
The system parses HTML files with this structure:
- Questions in `<li class="wpProQuiz_listItem">` elements
- Question text in `.wpProQuiz_question_text`
- Options in `.wpProQuiz_questionListItem`
- Correct answer marked with `.wpProQuiz_answerCorrect` class
- Explanations in `.wpProQuiz_correct` or `.wpProQuiz_unattempted`
- Reference URLs in anchor tags within response sections

### ID Generation
New questions are assigned IDs sequentially:
- Format: `ai900-XXX` (e.g., `ai900-247`, `ai900-248`)
- IDs start after the highest existing ID in the database
- IDs are preserved when questions are saved

### Data Storage
Questions are stored in `/lib/seed-data.ts` as TypeScript objects in the `rawQuestions` array. The system:
1. Reads existing questions
2. Finds the maximum ID
3. Adds new questions with sequential IDs
4. Preserves all existing data

## API Endpoints

### POST /api/admin/parse-questions
Accepts: FormData with HTML file
Returns: Array of parsed questions with temporary IDs

### POST /api/admin/save-questions
Accepts: JSON array of validated questions
Returns: Success status and count of saved questions

## Security Note

**Important:** This admin page has no authentication. In production, you should:
1. Add authentication (e.g., NextAuth.js)
2. Restrict access to admin users only
3. Add CSRF protection
4. Validate file uploads more strictly

## Example Workflow

1. Download HTML files from SkillCertPro (Pages 1-15)
2. For each file:
   - Upload to /admin
   - Review auto-parsed questions
   - Adjust categories if needed
   - Fix any parsing errors
   - Save selected questions
3. Questions are immediately available in practice and exam modes
4. Restart dev server if questions don't appear (to reload seed-data.ts)

## Troubleshooting

**Questions not parsing:**
- Check if HTML file has wpProQuiz format
- Open browser console for error messages
- Verify file is not corrupted

**Questions not saving:**
- Check server console for errors
- Verify seed-data.ts file permissions
- Ensure file is not locked by another process

**Questions not appearing in app:**
- Restart the development server
- Check `/lib/seed-data.ts` was updated
- Verify question format is correct
