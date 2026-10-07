export interface StudyInlineToken {
  type: 'text' | 'strong' | 'code';
  value: string;
}

export type StudyBlock =
  | { type: 'paragraph' | 'quote' | 'heading'; text: string }
  | { type: 'list'; items: string[] };

export function tokenizeStudyInline(text: string): StudyInlineToken[];
export function parseStudyMarkdown(text: string): StudyBlock[];
