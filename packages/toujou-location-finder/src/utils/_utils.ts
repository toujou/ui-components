/**
 * Compare two arrays to see if they are the same
 *
 * @param a
 * @param b
 * @returns {boolean}
 */
export const areArraysEqual = (a, b) => {
  return Array.isArray(a)
  && Array.isArray(b)
  && a.length === b.length
  && a.every((val, index) => val === b[index]);
};

/**
 * Mapbox can (currently) not handle the modern color syntax will throw
 * "Could not parse color from value" error
 *
 * @param {string} rawColor
 *
 * @return {string}
 */
export const convertToLegacyColorString = (rawColor) => {
  const color = rawColor.trim();
  const regex = /((rgb|hsl)a?)\((.*)\)/gm;

  const matches =  regex.exec(color);

  if (matches == null) {
    return color;
  }

  if (matches[3].includes(',')) {
    return color;
  }

  return matches[1] + '(' + matches[3].split(' ').filter(e => e  != '').join(',') + ')';
};
