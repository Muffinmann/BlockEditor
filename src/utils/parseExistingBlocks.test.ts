import { test, expect, describe } from 'vitest';
import { parseArithmetic } from './parseExistingBlocks';

describe('parseArithmetic', () => {
  const testInput = {
    '+': [
      2, 
      {
        '*': [3, 5]
      }
    ]
  }
  test('should parse arithmetic', () => {
    expect(parseArithmetic(testInput)).toBe('2 + 3 * 5')
  })
})