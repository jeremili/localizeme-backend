import assert from './assert';

/**
 * Maps an iterable of values using a mapper function with a concurrency limit.
 * @param iterable - An iterable of values to process.
 * @param mapper - A function that processes each value and returns a promise.
 * @param options - Options for concurrency control.
 * @returns A promise that resolves to an array of results.
 */
export const PromiseMap = async <T, U>(
  iterable: Iterable<T>,
  mapper: (value: T, index: number) => Promise<U>,
  options: { concurrency?: number } = {}
): Promise<U[]> => {
  assert.areNotNil({ iterable, mapper });
  assert(typeof mapper === 'function', 'Mapper must be a function');
  assert(typeof iterable[Symbol.iterator] === 'function', 'Iterable must implement Symbol.iterator');
  const arrayLength = Array.from(iterable).length;
  const concurrency = Math.min(options.concurrency || arrayLength, arrayLength);
  const results: U[] = [];
  const pending: Promise<void>[] = [];
  const iterator = iterable[Symbol.iterator]();
  let index = 0;

  // Helper function to process each item
  const processNext = async (): Promise<void> => {
    const next = iterator.next();
    if (next.done) return;

    const currentIndex = index++;
    try {
      const result = await mapper(next.value, currentIndex);
      results[currentIndex] = result;
    } finally {
      // Continue processing the next item
      await processNext();
    }
  };

  // Start processing with the specified concurrency
  for (let i = 0; i < concurrency; i++) {
    pending.push(processNext());
  }

  return Promise.all(pending).then(() => results);
};