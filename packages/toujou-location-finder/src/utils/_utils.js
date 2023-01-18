/**
 * Compare two arrays to see if they are the same
 *
 * @param a
 * @param b
 * @returns {boolean}
 */
export const areArraysEqual = (a, b) => {
  Array.isArray(a)
  && Array.isArray(b)
  && a.length === b.length
  && a.every((val, index) => val === b[index]);
};
