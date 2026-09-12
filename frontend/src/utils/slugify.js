/**
 * Convert a project name + id into a URL-friendly slug.
 * e.g. slugify('Javascript Project', 15) → '15-javascript-project'
 */
export const slugify = (name = '', id) => {
  const namePart = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')   // remove special chars
    .replace(/\s+/g, '-')            // spaces → hyphens
    .replace(/-+/g, '-');            // collapse multiple hyphens
  return `${id}-${namePart}`;
};

/**
 * Extract the numeric ID from a slug like '15-javascript-project'.
 * Returns NaN if the slug is invalid.
 */
export const slugToId = (slug = '') => {
  const id = parseInt(slug.split('-')[0], 10);
  return isNaN(id) ? null : id;
};
