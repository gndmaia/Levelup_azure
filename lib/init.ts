// Initialize the application with seed data

import { dataStore } from "./data-store";
import { seedQuestions } from "./seed-data";
import { seedQuestionsAZ900 } from "./seed-data-az900";
import { seedQuestionsAB731 } from "./seed-data-ab731";
import { seedQuestionsAB730 } from "./seed-data-ab730";
import { seedQuestionsGH300 } from "./seed-data-gh300";

let initialized = false;

export function initializeData() {
  if (initialized) return;
  
  // Seed AI-900 questions
  dataStore.addQuestions(seedQuestions);
  
  // Seed AZ-900 questions
  dataStore.addQuestions(seedQuestionsAZ900);

  dataStore.addQuestions(seedQuestionsAB731);
  dataStore.addQuestions(seedQuestionsAB730);
  dataStore.addQuestions(seedQuestionsGH300);
  
  initialized = true;
  console.log(`[DataStore] Initialized with ${seedQuestions.length} AI-900 questions, ${seedQuestionsAZ900.length} AZ-900 questions, ${seedQuestionsAB731.length} AB-731 questions, ${seedQuestionsAB730.length} AB-730 questions, and ${seedQuestionsGH300.length} GH-300 questions`);
}

// Auto-initialize on import
initializeData();
