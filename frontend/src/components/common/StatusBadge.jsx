/**
 * Bootstrap badge coloured by project/task status value.
 * @param {string} status - NOT_STARTED | IN_PROGRESS | COMPLETED | PENDING
 */
const STATUS_COLOURS = {
  NOT_STARTED: 'secondary',
  IN_PROGRESS: 'warning',
  COMPLETED: 'success',
  PENDING: 'secondary',
};

export default function StatusBadge({ status }) {
  const colour = STATUS_COLOURS[status] || 'light';
  const label = status?.replace('_', ' ') || '—';

  return (
    <span className={`badge bg-${colour} text-${colour === 'warning' ? 'dark' : 'white'}`}>
      {label}
    </span>
  );
}
