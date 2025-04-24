/**
 * Simple utility functions for testing
 */

/**
 * Adds two numbers together
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} Sum of a and b
 */
export function sum(a, b) {
  return a + b;
}

/**
 * Validates if a string is a valid email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if email is valid, false otherwise
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}