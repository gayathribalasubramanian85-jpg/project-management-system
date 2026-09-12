/**
 * Dismissible success alert.
 * @param {string} message - Success message to display
 * @param {function} [onDismiss] - Called when the dismiss button is clicked
 */
export default function SuccessAlert({ message, onDismiss }) {
  if (!message) return null;

  return (
    <div className="alert alert-success alert-dismissible fade show" role="alert">
      {message}
      {onDismiss && (
        <button
          type="button"
          className="btn-close"
          aria-label="Close"
          onClick={onDismiss}
        />
      )}
    </div>
  );
}
