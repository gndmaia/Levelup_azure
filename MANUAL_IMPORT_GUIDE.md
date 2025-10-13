# Manual Question Import Guide

## Overview
The Manual Import feature allows you to copy and paste questions directly from quiz websites into your admin panel, without needing to save files first.

## How to Use

### Step 1: Access the Manual Import Tab
1. Go to `/admin` in your application
2. Select your target exam (AI-900 or AZ-900) from the dropdown
3. Click on the **"Manual Import"** tab

### Step 2: Copy Questions from Source
1. Visit a quiz website (e.g., insidethemicrosoftcloud.com/az900quiz)
2. Select all text on the page:
   - **Windows/Linux**: `Ctrl + A`
   - **Mac**: `Cmd + A`
3. Copy the text:
   - **Windows/Linux**: `Ctrl + C`
   - **Mac**: `Cmd + C`

### Step 3: Paste and Parse
1. Paste the copied text into the large text area in the admin panel
2. Click **"Parse Questions"**
3. The system will automatically extract questions, options, correct answers, and explanations

### Step 4: Review and Edit
- Review each parsed question
- Edit any field (question text, options, explanation, reference)
- Uncheck questions you don't want to import
- All questions are selected by default

### Step 5: Save
- Click **"Save Selected Questions"**
- Questions will be added to your exam database with auto-generated IDs

## Supported Format

The parser recognizes questions in this format:

```
Question 1 of 50

What are two basic services provided by all cloud providers?

☐ application development
☐ colocation
☑ compute
☑ storage

✓ This answer is correct.

All cloud providers provide compute and storage services. Colocation is when a business 
rents space in a shared physical datacenter. Application development is the responsibility 
of the customer and is typically done either in-house or through a third party.

Describe cloud computing - Training | Microsoft Learn
```

### Key Elements:
1. **Question Header**: "Question X of Y" or "Question X"
2. **Question Text**: The actual question
3. **Options**: Marked with checkboxes (☐ unchecked, ☑ checked, or ✓)
4. **Correct Answer Indicator**: "This answer is correct" or checked checkbox
5. **Explanation** (optional): Descriptive text after options
6. **Reference** (optional): Links to documentation

## Features

### Automatic Detection
- **Single Choice**: One correct answer
- **Multiple Choice**: Multiple correct answers
- **Category Assignment**: Based on question keywords

### Category Mapping

#### AI-900:
- `ai-workloads`: AI services, workloads
- `ml-principles`: Machine learning, models
- `computer-vision`: Images, vision
- `nlp-workloads`: Language, text, NLP
- `conversational-ai`: Bots, conversational AI

#### AZ-900:
- `cloud-concepts`: Cloud, IaaS, PaaS, SaaS
- `core-services`: VMs, storage, compute, networking
- `security-privacy-compliance`: Security, compliance, identity
- `pricing-support`: Cost, pricing, SLA, support

### ID Generation
- Questions get unique IDs based on exam type:
  - AI-900: `ai900-manual-1`, `ai900-manual-2`, etc.
  - AZ-900: `az900-manual-1`, `az900-manual-2`, etc.

## Tips for Best Results

### ✅ Do:
- Copy entire question blocks including headers
- Include the explanation sections
- Copy multiple questions at once
- Review parsed results before saving

### ❌ Don't:
- Mix questions from different exams
- Copy incomplete questions
- Forget to select the correct exam before saving

## Troubleshooting

### "No questions found"
**Causes:**
- Text doesn't contain "Question X of Y" headers
- Format is significantly different from expected

**Solutions:**
- Try copying from a different section of the page
- Ensure you copied the actual question content, not navigation menus
- Check that checkboxes or answer indicators are present

### Missing Explanations
**Not an error** - The parser will show "No explanation provided" if none is found. You can manually add explanations after parsing.

### Wrong Correct Answers
**Check the source** - If checkboxes aren't clearly marked in the original text, the parser may default to the first option. Review and correct before saving.

### Duplicate Questions
After importing, use the **"Find Duplicates"** tab to identify and remove any duplicate questions.

## Example Workflow

1. **Visit** quiz website
2. **Copy** 5-10 questions at a time
3. **Paste** into Manual Import
4. **Parse** and review
5. **Edit** any incorrect fields
6. **Save** selected questions
7. **Repeat** for more questions
8. **Verify** in "View All Questions" tab

## Advantages Over File Import

- ✅ **Faster**: No need to download and save files
- ✅ **Flexible**: Works with any text source
- ✅ **Edit-Friendly**: Review and edit before saving
- ✅ **No File Management**: Copy-paste directly
- ✅ **Incremental**: Import a few questions at a time

## Notes

- The parser is optimized for the format shown in the example
- Some formatting variations may require manual editing after parsing
- Always review questions before saving
- Questions are immediately added to the selected exam's database
- Use the exam selector dropdown to ensure questions go to the right exam
