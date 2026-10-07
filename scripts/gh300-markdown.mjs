import assert from 'node:assert/strict';

const sectionNames = new Set([
  'Options', 'Correct Answer(s)', 'Explanation', 'Tips and Tricks', 'Correct and Wrong', 'Source',
]);

export function stripAnswerHighlight(text) {
  return text.replace(/\*\*([\s\S]+?)\*\*/g, '$1').trim();
}

export function parseDetailedTest(markdown, filename) {
  const text = markdown.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n');
  const title = text.match(/^# (.+)$/m)?.[1]?.trim();
  assert(title, `${filename}: missing document title.`);
  const markers = [...text.matchAll(/^\*\*Question:\*\*[ \t]*\[(\d+)\][ \t]*$/gm)];
  assert(markers.length > 0, `${filename}: no detailed question blocks.`);

  const questions = markers.map((marker, index) => {
    const number = Number(marker[1]);
    const context = `${filename} Q${number}`;
    const block = text.slice(marker.index + marker[0].length, markers[index + 1]?.index ?? text.length).trim();
    const headers = [...block.matchAll(/^\*\*([^*\n]+):\*\*[ \t]*/gm)];
    const sections = new Map();
    for (const [position, header] of headers.entries()) {
      const name = header[1];
      assert(sectionNames.has(name), `${context}: unsupported section "${name}".`);
      assert(!sections.has(name), `${context}: duplicate ${name} section.`);
      sections.set(name, block.slice(header.index + header[0].length,
        headers[position + 1]?.index ?? block.length).trim());
    }
    assert.equal(headers[0]?.[1], 'Options', `${context}: options must follow the question.`);
    const stem = block.slice(0, headers[0].index).trim();
    assert(stem.length > 0, `${context}: missing question text.`);
    for (const name of ['Options', 'Correct Answer(s)', 'Explanation', 'Source']) {
      assert(sections.get(name)?.length > 0, `${context}: missing ${name}.`);
    }

    const options = [];
    for (const line of sections.get('Options').split('\n')) {
      if (!line.trim()) continue;
      const option = line.match(/^([A-Z])\.\s+(.+)$/);
      if (option) {
        options.push({ id: option[1], text: option[2].trim() });
      } else {
        assert(options.length > 0, `${context}: unsupported option formatting.`);
        options.at(-1).text += '\n' + line.trim();
      }
    }
    assert(options.length >= 2, `${context}: fewer than two options.`);
    assert.deepEqual(options.map((option) => option.id),
      options.map((_, position) => String.fromCharCode(65 + position)),
      `${context}: option IDs must be unique and sequential.`);
    for (const option of options) {
      option.text = stripAnswerHighlight(option.text);
      assert(option.text.length > 0 && !option.text.includes('**'), `${context}: invalid option emphasis.`);
    }

    const key = sections.get('Correct Answer(s)').trim();
    assert(/^[A-Z](?:\s*,\s*[A-Z])*$/.test(key), `${context}: unsupported answer-key format.`);
    const correctOptions = key.split(',').map((answer) => answer.trim());
    assert.equal(new Set(correctOptions).size, correctOptions.length, `${context}: duplicate answer IDs.`);
    assert(correctOptions.every((answer) => options.some((option) => option.id === answer)),
      `${context}: answer references an absent option.`);

    const references = [...sections.get('Source').matchAll(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g)]
      .map((match) => {
        const url = new URL(match[2]);
        assert(['https:', 'http:'].includes(url.protocol), `${context}: unsupported reference URL.`);
        return { title: stripAnswerHighlight(match[1]), url: match[2] };
      });
    assert(references.length > 0, `${context}: no documentation references.`);
    const tips = sections.get('Tips and Tricks');
    const discussion = sections.get('Correct and Wrong');
    const explanation = [
      sections.get('Explanation'),
      tips ? `### Tips and Tricks\n${tips}` : undefined,
      discussion ? `### Correct and Wrong\n${discussion}` : undefined,
    ].filter(Boolean).join('\n\n');

    return { number, stem, options, correctOptions, explanation, references };
  });
  assert.equal(new Set(questions.map((question) => question.number)).size, questions.length,
    `${filename}: duplicate question numbers.`);
  return { title, questions };
}
