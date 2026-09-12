import { Modal, Button } from 'react-bootstrap';

/**
 * Reusable confirmation modal for destructive actions (e.g. delete).
 *
 * @param {boolean}  show        - Controls visibility
 * @param {string}   title       - Modal heading
 * @param {string}   message     - Body text
 * @param {function} onConfirm   - Called when user confirms
 * @param {function} onCancel    - Called when user cancels or closes
 * @param {boolean}  [loading]   - Disables the confirm button while in-flight
 */
export default function ConfirmModal({
  show,
  title = 'Confirm',
  message = 'Are you sure?',
  onConfirm,
  onCancel,
  loading = false,
}) {
  return (
    <Modal show={show} onHide={onCancel} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm} disabled={loading}>
          {loading ? 'Deleting...' : 'Delete'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
