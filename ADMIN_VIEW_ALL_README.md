# Admin Panel - View All Questions Feature

## What's New

Added a new "View All Questions" tab to the admin panel that displays all questions currently in the database.

## Features

### Two Tabs:
1. **Import Questions** - Original functionality to upload and parse HTML files
2. **View All Questions** - NEW! Browse all questions in the database

### View All Questions Tab Shows:
- Question number and ID
- Difficulty level (easy/medium/hard)
- Objective ID
- Full question text
- All options with correct answers highlighted in green
- Explanation (if available)
- Total question count
- Refresh button to reload questions

## How to Use

1. Navigate to `/admin` in your browser
2. Click on the "View All Questions" tab
3. Browse through all questions - they load automatically
4. Use the "Refresh" button to reload if needed

## Technical Details

### New Files:
- `/app/api/admin/all-questions/route.ts` - API endpoint to fetch all questions from seed-data

### Modified Files:
- `/app/admin/page.tsx` - Added tabbed interface and view all questions functionality

### Components Added:
- Tab navigation with icons
- Question list view with color-coded difficulty and correct answers
- Loading state with spinner
- Empty state message
- Refresh functionality

## API Endpoint

**GET** `/api/admin/all-questions`

Returns:
```json
{
  "success": true,
  "questions": [...],
  "count": 311
}
```

## Visual Indicators

- ✅ Green background/border = Correct answer
- 🟢 Green badge = Easy difficulty
- 🟡 Yellow badge = Medium difficulty  
- 🔴 Red badge = Hard difficulty
- 🔵 Blue badge = Objective ID

## Future Enhancements

Potential additions:
- Search/filter by category, difficulty, or objective
- Edit questions directly from this view
- Delete questions
- Export questions to various formats
- Pagination for large question sets
- Sort by different criteria
