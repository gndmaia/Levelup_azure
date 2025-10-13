# PDF Question Parser

## Overview
The PDF parser has been added to support importing exam questions from PDF files in addition to HTML files.

## Features
- Parses questions from PDF documents
- Extracts question text, options (A, B, C, D), correct answers, explanations, and references
- Automatically categorizes questions into AZ-900 exam objectives
- Supports multiple question formats and layouts

## How to Use

### 1. Access Admin Panel
Navigate to `/admin` in your application.

### 2. Select Exam
Use the dropdown in the header to select which exam you're importing questions for:
- **AI-900**: Microsoft Azure AI Fundamentals
- **AZ-900**: Microsoft Azure Fundamentals

### 3. Upload PDF File
1. Click "Choose HTML or PDF file"
2. Select your PDF file (must have .pdf extension)
3. Click "Upload & Parse Questions"

### 4. Review Parsed Questions
- The system will extract questions from the PDF
- Review each question's:
  - Question text
  - Options (A, B, C, D)
  - Correct answer
  - Explanation
  - Reference links
  - Category

### 5. Select Questions
- By default, all questions are selected
- Uncheck any questions you don't want to import
- You can edit question details before saving

### 6. Save Questions
Click "Save Selected Questions" to add them to the exam database.

## Expected PDF Format

The parser works best with PDFs that follow these patterns:

### Question Format
```
Question 1
What is Azure?
A. A cloud platform
B. A database
C. An operating system
D. A programming language

Answer: A
Explanation: Azure is Microsoft's cloud computing platform...
Reference: https://docs.microsoft.com/...
```

### Alternative Formats Supported
- "QUESTION 1" or "Question #1"
- Options labeled as "A.", "A)", or "(A)"
- Answers indicated by "Correct Answer:", "Answer:", or "The correct answer is:"
- Explanations after "Explanation:", "Rationale:", etc.
- References after "Reference:"

## Question Categories

Questions are automatically categorized based on keywords:

### AZ-900 Categories:
- **cloud-concepts**: Keywords like "cloud", "iaas", "paas", "saas"
- **core-services**: Keywords like "virtual machine", "storage", "compute", "network"
- **security-privacy-compliance**: Keywords like "security", "compliance", "privacy", "identity"
- **pricing-support**: Keywords like "cost", "pricing", "support", "sla"

## ID Assignment

- For **AI-900**: Questions get IDs like `ai900-1`, `ai900-2`, etc.
- For **AZ-900**: Questions get IDs like `az900-1`, `az900-2`, etc.

IDs are automatically incremented based on existing questions.

## Troubleshooting

### No Questions Found
If the parser doesn't find any questions:
1. Check if your PDF uses a different question numbering format
2. Ensure the PDF is searchable (not a scanned image)
3. Try converting the PDF to text first to verify the content

### Incorrect Parsing
If questions are parsed incorrectly:
1. Edit the questions manually in the admin panel
2. Adjust option letters or correct answers as needed
3. The parser works best with consistently formatted PDFs

### Missing Explanations or References
Some PDFs may not include explanations or references. The parser will:
- Show "No explanation provided" if none is found
- Leave reference field empty if none is found

## Technical Details

### API Endpoint
`POST /api/admin/parse-pdf`

### Libraries Used
- `pdf-parse`: Extracts text from PDF files
- `crypto`: Generates temporary IDs for questions

### File Size Limits
- Maximum file size depends on your server configuration
- Large PDFs may take longer to process

## Notes
- The parser uses pattern matching and may not work perfectly with all PDF formats
- Always review parsed questions before saving
- You can manually edit any field after parsing
- Questions are saved to the appropriate seed data file based on selected exam
