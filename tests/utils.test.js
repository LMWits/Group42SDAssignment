/**
 * Tests for utility functions
 */
import { sum, isValidEmail } from '../utils.js';

describe('Utility functions', () => {
  test('sum adds two numbers correctly', () => {
    expect(sum(1, 2)).toBe(3);
    expect(sum(-1, 1)).toBe(0);
    expect(sum(5, 5)).toBe(10);
  });

  test('isValidEmail validates email formats correctly', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
    expect(isValidEmail('invalid-email')).toBe(false);
    expect(isValidEmail('test@domain')).toBe(false);
  });
});