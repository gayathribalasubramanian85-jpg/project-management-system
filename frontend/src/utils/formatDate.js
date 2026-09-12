/**
 * Format an ISO date string or Date object to a readable locale string.
 * Returns null if the value is null/undefined/empty.
 *
 * @param {string|Date|null|undefined} value
 * @param {string} [locale] - BCP 47 locale tag (default: 'en-GB')
 * @returns {string|null}
 *
 * @example
 * formatDate('2024-12-31') // "31 Dec 2024"
 */
export const formatDate = (value, locale = 'en-GB') => {
  if (!value) return null;
  try {
    return new Date(value).toLocaleDateString(locale, {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return null;
  }
};
