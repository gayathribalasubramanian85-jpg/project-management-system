import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

/* ── Icons ── */
const IconSuccess = () => (
  <svg viewBox="0 0 24 24" fill="none" width="22" height="22" strokeWidth="2.5"
    stroke="white" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" fill="rgba(255,255,255,0.2)"/>
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IconError = () => (
  <svg viewBox="0 0 24 24" fill="none" width="22" height="22" strokeWidth="2.5"
    stroke="white" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" fill="rgba(255,255,255,0.2)"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);
const IconClose = () => (
  <svg viewBox="0 0 24 24" fill="none" width="16" height="16"
    stroke="white" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const COLOURS = {
  success: { bg: '#2e7d32', bar: '#1b5e20' },
  error:   { bg: '#d32f2f', bar: '#b71c1c' },
};

/**
 * Single Toast item.
 * Slides in from the right, auto-dismisses after `duration` ms,
 * shows a shrinking progress bar at the bottom.
 */
function ToastItem({ id, type = 'success', message, duration = 3500, onRemove }) {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const col = COLOURS[type] || COLOURS.success;

  const dismiss = useCallback(() => {
    setLeaving(true);
    setTimeout(() => onRemove(id), 350);
  }, [id, onRemove]);

  /* Trigger enter animation */
  useEffect(() => {
    const t = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(t);
  }, []);

  /* Auto-dismiss */
  useEffect(() => {
    const t = setTimeout(dismiss, duration);
    return () => clearTimeout(t);
  }, [dismiss, duration]);

  return (
    <div
      role="alert"
      aria-live="assertive"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        background: col.bg,
        color: '#fff',
        borderRadius: '10px',
        padding: '14px 16px',
        minWidth: '280px',
        maxWidth: '380px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'default',
        transform: visible && !leaving ? 'translateX(0) scale(1)' : 'translateX(110%) scale(0.95)',
        opacity: visible && !leaving ? 1 : 0,
        transition: 'transform 0.35s cubic-bezier(.16,1,.3,1), opacity 0.35s ease',
        marginBottom: '10px',
      }}
    >
      {/* Icon */}
      <span style={{ flexShrink: 0 }}>
        {type === 'success' ? <IconSuccess /> : <IconError />}
      </span>

      {/* Message */}
      <span style={{ flex: 1, fontSize: '0.95rem', fontWeight: 500, lineHeight: 1.4 }}>
        {message}
      </span>

      {/* Close button */}
      <button
        onClick={dismiss}
        aria-label="Dismiss"
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          padding: '2px', display: 'flex', flexShrink: 0,
          opacity: 0.75, transition: 'opacity .2s',
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = '1'}
        onMouseLeave={e => e.currentTarget.style.opacity = '0.75'}
      >
        <IconClose />
      </button>

      {/* Progress bar */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, height: '3px',
        background: col.bar,
        width: visible && !leaving ? '0%' : '100%',
        transition: `width ${duration}ms linear`,
      }} />
    </div>
  );
}

/* ── Toast container (portal, top-right) ── */
let _addToast = null;

export function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  const add = useCallback((toast) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { ...toast, id }]);
  }, []);

  const remove = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  /* Expose globally */
  useEffect(() => { _addToast = add; return () => { _addToast = null; }; }, [add]);

  return createPortal(
    <div
      aria-label="Notifications"
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        pointerEvents: 'none',
      }}
    >
      {toasts.map(t => (
        <div key={t.id} style={{ pointerEvents: 'auto' }}>
          <ToastItem {...t} onRemove={remove} />
        </div>
      ))}
    </div>,
    document.body
  );
}

/**
 * Programmatic toast API — call anywhere after mounting <ToastContainer />.
 *
 * toast.success('Login successful!')
 * toast.error('Invalid email or password.')
 */
export const toast = {
  success: (message, duration) => _addToast?.({ type: 'success', message, duration }),
  error:   (message, duration) => _addToast?.({ type: 'error',   message, duration }),
};
