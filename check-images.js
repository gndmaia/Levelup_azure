// Check if images are properly referenced in questions
const fs = require('fs');
const path = require('path');

// Read seed-data.ts
const seedDataPath = path.join(__dirname, 'lib', 'seed-data.ts');
const seedData = fs.readFileSync(seedDataPath, 'utf8');

// Find all IMAGE markers
const imageRegex = /\[IMAGE: ([^\]]+)\]/g;
const matches = [...seedData.matchAll(imageRegex)];

console.log(`Found ${matches.length} image references in seed-data.ts:\n`);

matches.forEach((match, idx) => {
  const imagePath = match[1];
  console.log(`${idx + 1}. ${imagePath}`);
  
  // Check if file exists
  const fullPath = path.join(__dirname, 'public', imagePath);
  const exists = fs.existsSync(fullPath);
  console.log(`   File exists: ${exists ? '✓ YES' : '✗ NO'}`);
  
  if (!exists) {
    console.log(`   Expected at: ${fullPath}`);
  }
  console.log('');
});

// List all files in public/question-images
const imagesDir = path.join(__dirname, 'public', 'question-images');
if (fs.existsSync(imagesDir)) {
  const files = fs.readdirSync(imagesDir);
  console.log(`\nFiles in public/question-images directory (${files.length}):`);
  files.forEach(file => {
    if (file !== 'README.md') {
      const isReferenced = matches.some(m => m[1].includes(file));
      console.log(`  ${isReferenced ? '✓' : '✗'} ${file}`);
    }
  });
}
