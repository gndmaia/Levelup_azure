export function getQuestionCounts(availableCount) {
  if (!Number.isInteger(availableCount) || availableCount <= 0) {
    throw new RangeError('Available question count must be a positive integer.');
  }
  return [...new Set([10, 30, 60, availableCount])]
    .filter((count) => count <= availableCount)
    .sort((a, b) => a - b);
}
