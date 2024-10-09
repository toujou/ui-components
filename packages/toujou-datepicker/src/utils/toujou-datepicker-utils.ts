/**
 * Pads a number or string with leading zeros to ensure it is two digits
 * @param t = The number or string to pad
 * @returns A string representing the padded value
 */
const add0 = (t: string | number) => String(t).padStart(2, '0');

/**
 * Checks is the month input type is supported by the browser.
 * @returns True if the month input type is supported, otherwise false
 */
export function monthIsSupported(): boolean{
  const test = document.createElement('input');
  test.setAttribute('type', 'month');
  return test.type === 'month'; // test.type will return 'month' or 'text'
}

/**
 * Formats a Date object into an ISO date string (YYY-MM-DD)
 * @param date - The Date object to format
 * @returns A string formated as ISO date
 */
export function formatDateToIsoDateString(date: Date): string {
  return `${date.getFullYear()}-${add0(date.getMonth() + 1)}-${add0(date.getDate())}`;
}

/**
 * Parses an ISO date string and returns a Date object
 * @param isoDateString - The ISO date string (YYYY-MM-DD) to parse
 * @returns a Date object representing the parsed date
 * @throws Error if the input string is not a valid ISO date
 */
export function dateFromIso(isoDateString: string): Date {
  const parts = isoDateString.match(/\d+/g) as RegExpMatchArray | null;

  if (!parts || parts.length < 3) {
    throw new Error('Invalid ISO date string');
  }

  return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
}
