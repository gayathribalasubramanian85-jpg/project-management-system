/**
 * Bootstrap badge coloured by task priority.
 * @param {string} priority - LOW | MEDIUM | HIGH
 */
const PRIORITY_COLOURS = {
  LOW: 'info',
  MEDIUM: 'warning',
  HIGH: 'danger',
};

export default function PriorityBadge({ priority }) {
  const colour = PRIORITY_COLOURS[priority] || 'light';
  const isLight = colour === 'warning' || colour === 'info';

  return (
    <span className={`badge bg-${colour} ${isLight ? 'text-dark' : 'text-white'}`}>
      {priority || '—'}
    </span>
  );
}
