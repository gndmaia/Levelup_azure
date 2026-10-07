import { parseStudyMarkdown, tokenizeStudyInline } from '@/lib/study-markdown.mjs';
import type { ReactNode } from 'react';

function inline(text: string): ReactNode[] {
  return tokenizeStudyInline(text).map((token, index) => {
    if (token.type === 'strong') return <strong key={index}>{inline(token.value)}</strong>;
    if (token.type === 'code') {
      return <code key={index} className="rounded bg-neutral-100 px-1 font-mono text-sm">{token.value}</code>;
    }
    return token.value;
  });
}

export function StudyInline({ text }: { text: string }) {
  return <>{inline(text)}</>;
}

export default function StudyMarkdown({ text }: { text: string }) {
  return (
    <div className="space-y-3 text-neutral-700">
      {parseStudyMarkdown(text).map((block, index) => {
        if (block.type === 'list') {
          return (
            <ul key={index} className="list-disc space-y-1 pl-5">
              {block.items.map((item, itemIndex) => <li key={itemIndex}>{inline(item)}</li>)}
            </ul>
          );
        }
        if (block.type === 'heading') {
          return <h3 key={index} className="font-semibold text-neutral-900">{inline(block.text)}</h3>;
        }
        if (block.type === 'quote') {
          return <blockquote key={index} className="whitespace-pre-line border-l-4 border-neutral-300 pl-4">{inline(block.text)}</blockquote>;
        }
        return <p key={index} className="whitespace-pre-line">{inline(block.text)}</p>;
      })}
    </div>
  );
}
