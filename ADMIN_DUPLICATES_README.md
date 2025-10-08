# Admin Panel - Duplicate Detection Feature

## Overview

Added a powerful duplicate detection system to identify and manage duplicate questions in the database.

## Features

### Find Duplicates Tab
- **Automatic Detection**: Uses Levenshtein distance algorithm to find similar questions
- **Similarity Scoring**: Shows percentage match between duplicate questions (default 85% threshold)
- **Smart Grouping**: Groups similar questions together for easy comparison
- **Visual Indicators**: Color-coded interface with yellow highlights for duplicate groups

### Detection Algorithm
- Compares question text (stem) similarity
- Uses Levenshtein distance for accurate matching
- Threshold: 85% similarity (configurable in code)
- Ignores case and whitespace differences
- Prevents false positives with smart string comparison

### Deletion Workflow
1. **Review Duplicates**: Browse through grouped duplicates
2. **Select Questions**: Check boxes to mark questions for deletion
3. **Visual Feedback**: Selected questions highlighted in red with "MARKED FOR DELETION" badge
4. **Confirm Deletion**: Click "Delete Selected" button
5. **Safety Prompt**: Confirmation dialog before deletion
6. **Automatic Backup**: Creates backup file before any deletion

## How to Use

### Access the Feature
1. Navigate to `/admin`
2. Click the **"Find Duplicates"** tab (Copy icon)
3. System automatically scans all questions

### Review Duplicates
Each duplicate group shows:
- **Group number** and similarity percentage
- **Question count** in the group
- **Question details**: ID, difficulty, full text
- **Options** and correct answers
- **Checkbox** to select for deletion

### Delete Duplicates
1. **Select questions** to delete (check boxes)
   - Keep at least one question from each group
   - Selected questions turn red
2. **Click "Delete Selected (X)"** button
3. **Confirm** deletion in the prompt
4. Questions are permanently removed
5. Automatic backup created before deletion

## Safety Features

### Backup System
- **Auto-backup**: Creates timestamped backup before deletion
- **Backup location**: `lib/seed-data-backup-before-delete-[timestamp].ts`
- **Manual restore**: Copy backup file over seed-data.ts if needed

### Visual Indicators
- 🟡 **Yellow border**: Duplicate group container
- 🔴 **Red border**: Question marked for deletion
- 🟢 **Green badge**: Easy difficulty
- 🟡 **Yellow badge**: Medium difficulty
- 🔴 **Red badge**: Hard difficulty
- ⚠️ **Red label**: "MARKED FOR DELETION" badge

### Confirmation
- Requires explicit checkbox selection
- Shows count of questions to be deleted
- Confirmation dialog before deletion
- No accidental deletions

## API Endpoints

### GET `/api/admin/find-duplicates`
Analyzes all questions and returns duplicate groups.

**Response:**
```json
{
  "success": true,
  "duplicates": [
    {
      "questions": [...],
      "similarity": 0.95
    }
  ],
  "count": 5,
  "totalQuestionsAnalyzed": 246
}
```

### POST `/api/admin/delete-questions`
Deletes selected questions from seed-data.ts.

**Request:**
```json
{
  "questionIds": ["q1", "q5", "q10"]
}
```

**Response:**
```json
{
  "success": true,
  "count": 3,
  "message": "Successfully deleted 3 question(s)",
  "backupFile": "seed-data-backup-before-delete-1234567890.ts"
}
```

## Technical Details

### Similarity Algorithm
- **Levenshtein Distance**: Measures edit distance between strings
- **Normalized Score**: Returns 0-1 scale (1 = identical)
- **Threshold**: 85% default (0.85)
- **Case Insensitive**: Converts to lowercase before comparison
- **Whitespace Normalized**: Trims strings

### Performance
- Analyzes all questions in memory
- O(n²) complexity for comparison
- Optimized with early termination
- Processes ~250 questions in <2 seconds

### State Management
- `duplicateGroups`: Array of duplicate question groups
- `questionsToDelete`: Set of selected question IDs
- `loadingDuplicates`: Loading state during analysis
- Auto-refreshes after deletion

## Best Practices

### Reviewing Duplicates
1. **Read carefully**: Some questions may be similar but distinct
2. **Compare options**: Check if answer choices differ
3. **Check explanations**: Different explanations may indicate different questions
4. **Consider context**: Questions from different objectives may need both versions

### Selecting for Deletion
1. **Keep the best**: Select lower quality duplicates for deletion
2. **Check difficulty**: Keep questions with appropriate difficulty levels
3. **Review explanations**: Keep questions with better explanations
4. **Preserve coverage**: Ensure objective coverage isn't lost

### After Deletion
1. **Restart server**: Required for changes to take effect
2. **Verify count**: Check question count decreased correctly
3. **Test questions**: Verify remaining questions work properly
4. **Keep backup**: Don't delete backup files immediately

## Troubleshooting

**No duplicates found:**
- Good news! All questions are unique
- Click "Re-scan" to verify
- Lower threshold in code if needed (not recommended)

**Too many duplicates:**
- Threshold might be too low
- Review carefully before deleting
- Some similar questions may be intentional variations

**Deletion failed:**
- Check file permissions on seed-data.ts
- Verify backup was created
- Check console for error messages
- Restore from backup if needed

**Changes not visible:**
- Restart Next.js development server
- Clear browser cache
- Check seed-data.ts file was updated

## Future Enhancements

Potential improvements:
- Adjustable similarity threshold in UI
- Preview before/after deletion
- Merge duplicates (combine best parts)
- Export duplicates to CSV
- Batch operations
- Undo last deletion
- Compare specific questions side-by-side
- AI-powered duplicate detection
