// Test script to verify practice mode API
async function testPracticeMode() {
  const baseUrl = 'http://localhost:3001';
  
  try {
    // 1. Create session
    console.log('Creating practice session...');
    const sessionResponse = await fetch(`${baseUrl}/api/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mode: 'practice',
        questionCount: 1,
      }),
    });
    
    const sessionData = await sessionResponse.json();
    console.log('Session created:', sessionData);
    
    if (!sessionData.success) {
      throw new Error('Failed to create session');
    }
    
    const sessionId = sessionData.session.id;
    
    // 2. Get first question
    console.log('Getting first question...');
    const questionResponse = await fetch(`${baseUrl}/api/sessions/${sessionId}/next`);
    const questionData = await questionResponse.json();
    console.log('Question data:', questionData);
    
    if (questionData.completed) {
      throw new Error('Session completed immediately');
    }
    
    const question = questionData.question;
    const firstOption = question.options[0].id; // Just select first option
    
    // 3. Submit answer
    console.log('Submitting answer...');
    const answerResponse = await fetch(`${baseUrl}/api/sessions/${sessionId}/answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        questionId: question.id,
        selectedOptions: [firstOption],
      }),
    });
    
    const answerData = await answerResponse.json();
    console.log('Answer response:', answerData);
    
    if (answerData.feedback) {
      console.log('✅ API test successful - feedback received');
    } else {
      console.log('❌ API test failed - no feedback received');
    }
    
  } catch (error) {
    console.error('❌ API test failed:', error);
  }
}

testPracticeMode();