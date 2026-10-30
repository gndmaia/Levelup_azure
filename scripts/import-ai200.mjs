import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildAI200Bank } from './ai200-json.mjs';

const [sourceDirectory, importedAt] = process.argv.slice(2);
if (!sourceDirectory) throw new Error('Provide the directory containing the 13 authorized JSON attachments.');
const { bank, sources } = buildAI200Bank((filename) => readFileSync(resolve(sourceDirectory, filename)), importedAt);
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
writeFileSync(resolve(root, 'lib', 'ai200-question-bank.json'), JSON.stringify(bank, null, 2) + '\n');
writeFileSync(resolve(root, 'lib', 'ai200-sources.json'), JSON.stringify(sources, null, 2) + '\n');
console.log(`Imported ${bank.questions.length} AI-200 questions from ${sources.length} attachments.`);
