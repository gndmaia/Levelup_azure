import sources from './ab731-sets.json';

export const AB731_SETS = sources;
export const AB731_QUESTION_COUNT = sources.reduce((total, source) => total + source.questionCount, 0);
export const AB731_MULTI_SELECT_COUNT = sources.reduce((total, source) => total + source.multiSelectCount, 0);
export const AB731_CERTIFICATION_URL = 'https://learn.microsoft.com/en-us/credentials/certifications/ai-transformation-leader/';
