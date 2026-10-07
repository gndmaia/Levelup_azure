import { importFormsBank } from './import-forms-bank.mjs';

const [sourceDirectory, importedAt] = process.argv.slice(2);
importFormsBank({
  sourceDirectory,
  importedAt,
  examId: 'AB-730',
  prefix: 'ab730',
  counts: [50, 50, 30, 30],
});
