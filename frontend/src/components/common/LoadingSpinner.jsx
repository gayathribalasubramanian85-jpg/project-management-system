/**
 * Centered Bootstrap loading spinner.
 * @param {string} [message] - Optional text below the spinner
 */
export default function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5">
      <div className="spinner-border text-primary" role="status" aria-label="Loading">
        <span className="visually-hidden">{message}</span>
      </div>
      {message && <p className="mt-2 text-muted small">{message}</p>}
    </div>
  );
}
