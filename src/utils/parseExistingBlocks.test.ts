import { test, expect, describe } from 'vitest';
import { parseArithmetic } from './parseExistingBlocks';

describe('parseArithmetic', () => {
  test('should parse arithmetic', () => {
    const testInput = {
      '+': [
        2, 
        {
          '*': [3, 5]
        }
      ]
    }
    const expectedResult = '2 + 3 * 5'
    expect(parseArithmetic(testInput)).toBe(expectedResult)
  })

  test('should parse variable key', () => {
    const testInput = {
      '*': [3, {var: 'key'}] 
    }
    const expectedResult = '3 * key'
    expect(parseArithmetic(testInput)).toBe(expectedResult)
  })

  test('should use parentheses correctly', () => {
    const testInput = {
      '*': [
        2,
        {
          '+': [3, 4]
        }
      ]
    }
    const expectedResult = '2 * (3 + 4)'
    expect(parseArithmetic(testInput)).toBe(expectedResult)
    
  })
})