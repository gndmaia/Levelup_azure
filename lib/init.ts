// Initialize the application with seed data

import { dataStore } from "./data-store";
import { seedQuestions } from "./seed-data";

let initialized = false;

export function initializeData() {
  if (initialized) return;
  
  // Seed questions
  dataStore.addQuestions(seedQuestions);
  
  initialized = true;
  console.log(`[DataStore] Initialized with ${seedQuestions.length} seed questions`);
}

// Auto-initialize on import
initializeData();
