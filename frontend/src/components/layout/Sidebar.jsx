import { NavLink } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext.jsx';

/* ── Icons ── */
const IconGrid = ({ c }) => (
  <svg viewBox="0 0 24 24" fill="none" width="18" height="18" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
  </svg>
);
const IconFolder = ({ c }) => (
  <svg viewBox="0 0 24 24" fill="none" width="18" height="18" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
  </svg>
);
const IconClose = ({ c }) => (
  <svg viewBox="0 0 24 24" fill="none" width="20" height="20" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const NAV_ITEMS = [
  { to: '/',         end: true,  label: 'Dashboard', Icon: IconGrid   },
  { to: '/projects', end: false, label: 'Projects',  Icon: IconFolder },
];

/**
 * isOpen      — controlled by MainLayout (mobile drawer open/close)
 * onClose     — called when user clicks overlay or close button
 * isCollapsed — true on tablet (icon-only mode)
 */
export default function Sidebar({ isOpen = false, onClose, isCollapsed = false }) {
  const { isDark } = useTheme();

  const bg        = isDark ? '#0f0f22' : '#f8f7ff';
  const border    = isDark ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.1)';
  const labelCol  = isDark ? 'rgba(255,255,255,0.3)'  : '#9ca3af';
  const textInact = isDark ? 'rgba(255,255,255,0.55)' : '#6b7280';
  const hoverBg   = isDark ? 'rgba(99,102,241,0.1)'   : 'rgba(99,102,241,0.07)';
  const overlay   = isDark ? 'rgba(0,0,0,0.65)' : 'rgba(15,15,26,0.45)';

  return (
    <>
      <style>{`
        /* ── Base sidebar ── */
        .pms-sidebar {
          width: 220px; flex-shrink: 0;
          background: ${bg};
          border-right: 1px solid ${border};
          display: flex; flex-direction: column;
          padding: 20px 12px;
          transition: background .3s, border-color .3s, width .25s, transform .3s;
          min-height: 100%;
          position: relative;
          z-index: 50;
        }

        /* ── Tablet: icon-only collapsed ── */
        .pms-sidebar.collapsed {
          width: 64px;
          padding: 20px 8px;
          align-items: center;
        }
        .pms-sidebar.collapsed .pms-sidebar-label { display: none; }
        .pms-sidebar.collapsed .pms-nav-label     { display: none; }
        .pms-sidebar.collapsed .pms-nav-link      { justify-content: center; padding: 10px; }
        .pms-sidebar.collapsed .pms-sidebar-footer{ display: none; }

        /* ── Mobile: drawer off-screen by default ── */
        @media (max-width: 767px) {
          .pms-sidebar {
            position: fixed;
            top: 0; left: 0; bottom: 0;
            z-index: 300;
            transform: translateX(-100%);
            box-shadow: 4px 0 32px rgba(0,0,0,.25);
            padding-top: 16px;
          }
          .pms-sidebar.mobile-open {
            transform: translateX(0);
          }
        }

        /* ── Overlay backdrop (mobile only) ── */
        .pms-sidebar-overlay {
          display: none;
          position: fixed; inset: 0;
          background: ${overlay};
          z-index: 299;
          animation: sb-fade-in .25s ease;
        }
        @keyframes sb-fade-in { from { opacity: 0; } to { opacity: 1; } }
        @media (max-width: 767px) {
          .pms-sidebar-overlay.visible { display: block; }
        }

        /* ── Close button (mobile header row) ── */
        .pms-sidebar-close {
          display: none;
          align-items: center; justify-content: space-between;
          padding: 0 4px 16px;
          margin-bottom: 4px;
          border-bottom: 1px solid ${border};
        }
        @media (max-width: 767px) {
          .pms-sidebar-close { display: flex; }
        }

        /* ── Nav items ── */
        .pms-sidebar-label {
          font-size: .68rem; font-weight: 700; letter-spacing: .8px;
          text-transform: uppercase; color: ${labelCol};
          padding: 0 10px; margin-bottom: 8px; margin-top: 4px;
          transition: color .3s;
        }
        .pms-nav-link {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 12px; border-radius: 10px;
          font-size: .875rem; font-weight: 500;
          color: ${textInact};
          text-decoration: none;
          transition: background .2s, color .2s, transform .15s;
          margin-bottom: 2px;
          border: 1px solid transparent;
          white-space: nowrap;
        }
        .pms-nav-link:hover {
          background: ${hoverBg};
          color: ${isDark ? '#c7d2fe' : '#4f46e5'};
          transform: translateX(3px);
        }
        .pms-sidebar.collapsed .pms-nav-link:hover { transform: scale(1.1); }
        .pms-nav-link.active {
          background: linear-gradient(135deg,rgba(99,102,241,.2),rgba(168,85,247,.15));
          color: ${isDark ? '#a5b4fc' : '#4f46e5'};
          font-weight: 700;
          border-color: ${isDark ? 'rgba(99,102,241,.3)' : 'rgba(99,102,241,.2)'};
        }
        .pms-nav-link.active svg { filter: drop-shadow(0 0 4px rgba(99,102,241,.6)); }

        /* ── Tooltip for collapsed icons ── */
        .pms-nav-wrap { position: relative; width: 100%; }
        .pms-nav-wrap .pms-tooltip {
          display: none;
          position: absolute; left: calc(100% + 10px); top: 50%;
          transform: translateY(-50%);
          background: ${isDark ? '#1e1e3f' : '#1e1b4b'};
          color: #fff; font-size: .75rem; font-weight: 600;
          padding: 5px 10px; border-radius: 7px;
          white-space: nowrap; pointer-events: none;
          box-shadow: 0 4px 14px rgba(0,0,0,.3);
          z-index: 999;
        }
        .pms-nav-wrap .pms-tooltip::before {
          content: '';
          position: absolute; right: 100%; top: 50%;
          transform: translateY(-50%);
          border: 5px solid transparent;
          border-right-color: ${isDark ? '#1e1e3f' : '#1e1b4b'};
        }
        .pms-sidebar.collapsed .pms-nav-wrap:hover .pms-tooltip { display: block; }

        /* ── Footer ── */
        .pms-sidebar-footer {
          margin-top: auto; padding: 12px 10px 0;
          border-top: 1px solid ${border};
          font-size: .75rem; color: ${labelCol};
          text-align: center;
          transition: color .3s, border-color .3s;
        }
      `}</style>

      {/* Backdrop overlay (mobile) */}
      <div
        className={`pms-sidebar-overlay${isOpen ? ' visible' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside className={`pms-sidebar${isCollapsed ? ' collapsed' : ''}${isOpen ? ' mobile-open' : ''}`}>

        {/* Mobile close button row */}
        <div className="pms-sidebar-close">
          <span style={{ fontSize: '.85rem', fontWeight: 800, color: isDark ? '#fff' : '#1e1b4b', letterSpacing: '-.2px' }}>
            ProjectFlow
          </span>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center', borderRadius: 8 }}
            aria-label="Close menu"
          >
            <IconClose c={isDark ? 'rgba(255,255,255,0.6)' : '#6b7280'} />
          </button>
        </div>

        {!isCollapsed && <p className="pms-sidebar-label">Menu</p>}

        <nav style={{ width: '100%' }}>
          {NAV_ITEMS.map(({ to, end, label, Icon }) => (
            <div key={to} className="pms-nav-wrap">
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) => `pms-nav-link${isActive ? ' active' : ''}`}
                onClick={onClose}
              >
                {({ isActive }) => (
                  <>
                    <Icon c={isActive
                      ? (isDark ? '#a5b4fc' : '#6366f1')
                      : (isDark ? 'rgba(255,255,255,0.45)' : '#9ca3af')
                    } />
                    <span className="pms-nav-label">{label}</span>
                  </>
                )}
              </NavLink>
              {/* Tooltip shown only in collapsed mode */}
              <span className="pms-tooltip">{label}</span>
            </div>
          ))}
        </nav>

        <div className="pms-sidebar-footer">
          ProjectFlow v1.0
        </div>
      </aside>
    </>
  );
}
