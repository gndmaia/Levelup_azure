// Script to delete questions 245 to 737
const fs = require('fs');
const path = require('path');

// Read the seed data file
const seedDataPath = path.join(__dirname, 'lib', 'seed-data.ts');
const seedDataContent = fs.readFileSync(seedDataPath, 'utf8');

console.log('Removing questions 245 to 737...');

// Find the rawQuestions array
const rawQuestionsMatch = seedDataContent.match(/const rawQuestions: RawQuestion\[\] = \[([\s\S]*?)\];\s*export/);
if (!rawQuestionsMatch) {
  console.error('Could not find rawQuestions array');
  process.exit(1);
}

// Extract question objects
const questionsRegex = /\{\s*id:\s*["`'][^"`']*["`'],[\s\S]*?\}/g;
const questionMatches = seedDataContent.match(questionsRegex);

if (!questionMatches) {
  console.error('Could not find question objects');
  process.exit(1);
}

console.log(`Total questions found: ${questionMatches.length}`);

// Keep only questions 1-244 (array indices 0-243)
const questionsToKeep = questionMatches.slice(0, 244);
const questionsToRemove = questionMatches.slice(244);

console.log(`Questions to keep: ${questionsToKeep.length} (questions 1-244)`);
console.log(`Questions to remove: ${questionsToRemove.length} (questions 245-${questionMatches.length})`);

// Create backup
const backupPath = path.join(__dirname, 'lib', `seed-data-backup-before-delete-${Date.now()}.ts`);
fs.writeFileSync(backupPath, seedDataContent);
console.log(`Created backup: ${backupPath}`);

// Get the parts of the file before and after the rawQuestions array
const beforeQuestions = seedDataContent.substring(0, seedDataContent.indexOf('const rawQuestions'));
const afterQuestions = seedDataContent.substring(seedDataContent.indexOf('export const seedQuestions'));

// Format the remaining questions
const formattedQuestions = questionsToKeep.map(q => '  ' + q).join(',\n');

// Build new content
const newContent = beforeQuestions + 
  'const rawQuestions: RawQuestion[] = [\n' + 
  formattedQuestions + 
  '\n];\n\n' + 
  afterQuestions;

// Write the updated file
fs.writeFileSync(seedDataPath, newContent);

console.log(`\nSuccessfully updated seed-data.ts`);
console.log(`Remaining questions: ${questionsToKeep.length}`);
console.log(`Removed questions: ${questionsToRemove.length}`);

// Show some examples of what was removed
console.log('\nFirst few removed questions:');
questionsToRemove.slice(0, 5).forEach((questionObj, i) => {
  const idMatch = questionObj.match(/id:\s*["`']([^"`']*)["`']/);
  const questionMatch = questionObj.match(/question:\s*["`']([^"`']*)["`']/);
  const id = idMatch ? idMatch[1] : 'unknown';
  const question = questionMatch ? questionMatch[1].substring(0, 80) + '...' : 'unknown';
  console.log(`${245 + i}. ${id}: ${question}`);
});

console.log(`\nDone! Questions database reduced from ${questionMatches.length} to ${questionsToKeep.length} questions.`);