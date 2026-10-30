export function tokenizeStudyInline(text) {
  const tokens = [];
  const pattern = /`([^`\n]+)`|\*\*([^*]+)\*\*/g;
  let position = 0;
  for (const match of text.matchAll(pattern)) {
    if (match.index > position) tokens.push({ type: 'text', value: text.slice(position, match.index) });
    tokens.push({ type: match[1] === undefined ? 'strong' : 'code', value: match[1] ?? match[2] });
    position = match.index + match[0].length;
  }
  if (position < text.length) tokens.push({ type: 'text', value: text.slice(position) });
  return tokens;
}

export function parseStudyMarkdown(text) {
  const lines = text.replace(/\r\n?/g, '\n').split('\n');
  const blocks = [];
  let index = 0;
  const startsBlock = (line) => /^(?:#{1,6}\s|>\s?|- |[ \t]{0,3}(?:`{3,}|~{3,}))/.test(line);
  while (index < lines.length) {
    const line = lines[index].trimEnd();
    if (!line.trim()) {
      index++;
      continue;
    }
    const fence = line.match(/^[ \t]{0,3}(`{3,}|~{3,})(.*)$/);
    const heading = line.match(/^#{1,6}\s+(.+)$/);
    if (fence) {
      const marker = fence[1][0];
      const width = fence[1].length;
      const code = [];
      index++;
      while (index < lines.length) {
        const closing = lines[index].match(/^[ \t]{0,3}(`{3,}|~{3,})[ \t]*$/);
        if (closing && closing[1][0] === marker && closing[1].length >= width) {
          index++;
          break;
        }
        code.push(lines[index++]);
      }
      blocks.push({ type: 'code', text: code.join('\n'), language: fence[2].trim().split(/\s+/)[0] });
    } else if (heading) {
      blocks.push({ type: 'heading', text: heading[1] });
      index++;
    } else if (line.startsWith('>')) {
      const quoted = [];
      while (index < lines.length && lines[index].startsWith('>')) {
        quoted.push(lines[index++].replace(/^>\s?/, '').replace(/^\[!IMPORTANT\]\s*$/, 'Important'));
      }
      blocks.push({ type: 'quote', text: quoted.join('\n') });
    } else if (line.startsWith('- ')) {
      const items = [];
      while (index < lines.length && lines[index].startsWith('- ')) {
        items.push(lines[index++].slice(2).trimEnd());
      }
      blocks.push({ type: 'list', items });
    } else {
      const paragraph = [line];
      index++;
      while (index < lines.length && lines[index].trim() && !startsBlock(lines[index])) {
        paragraph.push(lines[index++].trimEnd());
      }
      blocks.push({ type: 'paragraph', text: paragraph.join('\n') });
    }
  }
  return blocks;
}
