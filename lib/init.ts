// Initialize the application with seed data

import { dataStore } from "./data-store";
import { seedQuestions } from "./seed-data";
import { seedQuestionsAZ900 } from "./seed-data-az900";
import { seedQuestionsAB731 } from "./seed-data-ab731";

let initialized = false;

export function initializeData() {
  if (initialized) return;
  
  // Seed AI-900 questions
  dataStore.addQuestions(seedQuestions);
  
  // Seed AZ-900 questions
  dataStore.addQuestions(seedQuestionsAZ900);

  dataStore.addQuestions(seedQuestionsAB731);
  
  initialized = true;
  console.log(`[DataStore] Initialized with ${seedQuestions.length} AI-900 questions, ${seedQuestionsAZ900.length} AZ-900 questions, and ${seedQuestionsAB731.length} AB-731 questions`);
}

// Auto-initialize on import
initializeData();
