const add0 = t => (String(t).padStart(2, '0'));

/**
 * @param {String} dateString
 * @param {String} format
 *
 * @return {boolean}
 */
export const validateDate = (dateString, format) => {
  try {
    parseDateFromFormat(dateString, format);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 *
 * @param {String} dateString
 * @param {String} format
 *
 * @return {Date}
 */
export const parseDateFromFormat = (dateString, format) => {

  const delimiterRegex = /[/\-.]/;

  const formatArray = (format || 'yyyy-mm-dd').split(delimiterRegex);
  const dateArray = dateString.split(delimiterRegex);

  if (dateArray.length !== 3 || formatArray.length !== 3) {
    throw new Error('Invalid date or format');
  }

  let year = null;
  let month = null;
  let day = null;
  formatArray.forEach((key, index) => {
    switch (key) {
    case 'yyyy': {
      year = parseInt(dateArray[index]);
      if (year < 1000 || year > 9999) {
        year = null;
      }
      break;
    }
    case 'mm': {
      month = parseInt(dateArray[index]) - 1;
      if (month < 0 || month > 11) {
        month = null;
      }
      break;
    }
    case 'dd': {
      day = parseInt(dateArray[index]);
      if (day < 0 || day > 31) {
        day = null;
      }
      break;
    }
    }
  });

  if (year === null || month === null || day === null) {
    throw new Error('Invalid date');
  }

  return new Date(year, month, day);
};

/**
 * @param {Date} date
 *
 * @return {string}
 */
export function dateToISO8601(date) {
  return `${date.getFullYear()}-${add0(date.getMonth() + 1)}-${add0(date.getDate())}`;
}

/**
 * @param {String} isoDateString
 *
 * @param {String} format
 *
 * @return {string}
 */
export function formatIsoDateToFormatDate(isoDateString, format) {
  const parts = isoDateString.match(/\d+/g);

  return format
    .replace('yyyy', parts[0])
    .replace('mm', parts[1])
    .replace('dd', parts[2]);
}
