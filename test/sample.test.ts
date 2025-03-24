import { describe, expect, test } from '@jest/globals';

function sum(a: number, b: number) {
  return a + b;
}

describe('Sample sum function', () => {
  test('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3);
  });
});