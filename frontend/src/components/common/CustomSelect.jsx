import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useTheme } from '../../context/ThemeContext.jsx';

const IconChevron = ({ c, open }) => (
  <svg viewBox="0 0 24 24" fill="none" width="14" height="14" stroke={c} strokeWidth="2.5"
    strokeLinecap="round" strokeLinejoin="round"
    style={{ transition:'transform .2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink:0 }}>
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

/**
 * Fully custom themed select dropdown.
 * The dropdown panel is rendered via a React portal at document.body so it
 * is NEVER clipped by parent overflow:hidden or z-index stacking contexts.
 * Position is calculated from the trigger's bounding rect on open.
 */
export default function CustomSelect({
  value,
  onChange,
  options,
  placeholder = 'Select…',
  minWidth = '160px',
  icon,
}) {
  const { isDark }      = useTheme();
  const [open, setOpen] = useState(false);
  const [pos, setPos]   = useState({ top: 0, left: 0, width: 0 });
  const triggerRef      = useRef(null);
  const dropRef         = useRef(null);

  /* Calculate portal position from trigger rect */
  const openDropdown = useCallback(() => {
    if (triggerRef.current) {
      const r = triggerRef.current.getBoundingClientRect();
      setPos({
        top:   r.bottom + window.scrollY + 6,
        left:  r.left   + window.scrollX,
        width: r.width,
      });
    }
    setOpen(true);
  }, []);

  /* Close on outside click */
  useEffect(() => {
    if (!open) return;
    const handler = e => {
      if (
        triggerRef.current && !triggerRef.current.contains(e.target) &&
        dropRef.current    && !dropRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  /* Close on scroll / resize so position doesn't drift */
  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);
    return () => {
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
    };
  }, [open]);

  const selected = options.find(o => o.value === value);

  /* ── Theme tokens ── */
  const bg          = isDark ? 'rgba(255,255,255,0.05)' : '#ffffff';
  const bdr         = isDark ? 'rgba(255,255,255,0.1)'  : '#e5e7eb';
  const focusBdr    = '#6366f1';
  const focusBg     = isDark ? 'rgba(99,102,241,0.08)'  : '#eef2ff';
  const txt         = isDark ? '#ffffff'                : '#111827';
  const ph          = isDark ? 'rgba(255,255,255,0.35)' : '#9ca3af';
  const icoC        = isDark ? 'rgba(255,255,255,0.35)' : '#9ca3af';
  const dropBg      = isDark ? '#1e1e3f'                : '#ffffff';
  const dropBdr     = isDark ? 'rgba(99,102,241,0.28)'  : 'rgba(99,102,241,0.18)';
  const dropShadow  = isDark
    ? '0 16px 48px rgba(0,0,0,.7), 0 0 0 1px rgba(99,102,241,.15)'
    : '0 16px 48px rgba(99,102,241,.18), 0 0 0 1px rgba(99,102,241,.08)';
  const optHoverBg  = isDark ? 'rgba(99,102,241,0.15)'  : 'rgba(99,102,241,0.07)';
  const optActiveBg = isDark ? 'rgba(99,102,241,0.25)'  : 'rgba(99,102,241,0.12)';
  const optC        = isDark ? 'rgba(255,255,255,0.82)'  : '#374151';
  const optActC     = isDark ? '#a5b4fc'                 : '#6366f1';
  const divColor    = isDark ? 'rgba(255,255,255,0.06)'  : 'rgba(99,102,241,0.08)';

  return (
    <>
      <style>{`
        .cs-trigger {
          display:flex; align-items:center; gap:8px;
          background:${open ? focusBg : bg};
          border:1.5px solid ${open ? focusBdr : bdr};
          border-radius:12px; padding:10px 12px;
          cursor:pointer; min-width:${minWidth};
          box-shadow:${open ? '0 0 0 3px rgba(99,102,241,.15)' : 'none'};
          transition:border-color .2s, box-shadow .2s, background .2s;
          user-select:none;
        }
        .cs-trigger:hover { border-color:${focusBdr}; }
        .cs-value {
          flex:1; font-size:.88rem; font-weight:500;
          color:${selected ? txt : ph};
          white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
        }
        /* Portal dropdown — position is set via inline style */
        .cs-portal-drop {
          position:absolute;
          background:${dropBg};
          border:1px solid ${dropBdr};
          border-radius:12px;
          padding:6px;
          box-shadow:${dropShadow};
          z-index:99999;
          animation:cs-drop-in .18s cubic-bezier(.16,1,.3,1) both;
          overflow:hidden;
        }
        @keyframes cs-drop-in {
          from { opacity:0; transform:translateY(-6px) scale(.97); }
          to   { opacity:1; transform:none; }
        }
        .cs-opt {
          display:flex; align-items:center; gap:8px;
          padding:9px 12px; border-radius:8px; cursor:pointer;
          font-size:.87rem; font-weight:500; color:${optC};
          transition:background .15s, color .15s;
          white-space:nowrap;
        }
        .cs-opt:hover  { background:${optHoverBg}; color:${isDark ? '#c7d2fe' : '#4f46e5'}; }
        .cs-opt.cs-active { background:${optActiveBg}; color:${optActC}; font-weight:700; }
        .cs-divider    { height:1px; background:${divColor}; margin:4px 0; }
        .cs-dot        { width:7px; height:7px; border-radius:50%; flex-shrink:0; }
        .cs-check      { margin-left:auto; flex-shrink:0; }
      `}</style>

      {/* ── Trigger button ── */}
      <div
        ref={triggerRef}
        className="cs-trigger"
        onClick={() => open ? setOpen(false) : openDropdown()}
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        tabIndex={0}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open ? setOpen(false) : openDropdown(); }
          if (e.key === 'Escape') setOpen(false);
        }}
      >
        {icon && <span style={{ color: icoC, display:'flex', flexShrink:0 }}>{icon}</span>}
        <span className="cs-value">{selected ? selected.label : placeholder}</span>
        <IconChevron c={open ? '#6366f1' : icoC} open={open} />
      </div>

      {/* ── Dropdown via portal — renders at document.body, never clipped ── */}
      {open && createPortal(
        <div
          ref={dropRef}
          className="cs-portal-drop"
          role="listbox"
          style={{
            top:      pos.top,
            left:     pos.left,
            minWidth: Math.max(pos.width, parseInt(minWidth, 10) || 160),
          }}
        >
          {options.map((opt, i) => {
            const isActive = opt.value === value;
            return (
              <div key={opt.value}>
                {i > 0 && opt.value === '' && <div className="cs-divider" />}
                <div
                  className={`cs-opt${isActive ? ' cs-active' : ''}`}
                  role="option"
                  aria-selected={isActive}
                  onMouseDown={e => {
                    e.preventDefault(); // prevent blur before click registers
                    onChange(opt.value);
                    setOpen(false);
                  }}
                >
                  {opt.dot && (
                    <span
                      className="cs-dot"
                      style={{ background: opt.dot, boxShadow: `0 0 5px ${opt.dot}` }}
                    />
                  )}
                  {opt.label}
                  {isActive && (
                    <span className="cs-check">
                      <svg viewBox="0 0 16 16" fill="none" width="14" height="14"
                        stroke={optActC} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="2 8 6 12 14 4"/>
                      </svg>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>,
        document.body
      )}
    </>
  );
}
