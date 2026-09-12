import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { toast } from '../common/Toast.jsx';

/* ── Icons ── */
const IconSun = ({ c }) => (
  <svg viewBox="0 0 24 24" fill="none" width="17" height="17" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);
const IconMoon = ({ c }) => (
  <svg viewBox="0 0 24 24" fill="none" width="17" height="17" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);
const IconLogout = ({ c }) => (
  <svg viewBox="0 0 24 24" fill="none" width="15" height="15" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);
const IconLogo = () => (
  <svg viewBox="0 0 24 24" fill="none" width="22" height="22" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 17.5h7M17.5 14v7"/>
  </svg>
);
const IconUser = ({ c }) => (
  <svg viewBox="0 0 24 24" fill="none" width="18" height="18" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);

const IconHamburger = ({ c }) => (
  <svg viewBox="0 0 24 24" fill="none" width="20" height="20" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6"  x2="21" y2="6"/>
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);

export default function Navbar({ onMenuClick, showMenuBtn = false }) {
  const { user, logout } = useAuth();
  const { isDark, toggle } = useTheme();
  const navigate = useNavigate();
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  /* Close dropdown on outside click */
  useEffect(() => {
    const handler = e => {
      if (profileRef.current && !profileRef.current.contains(e.target))
        setProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    setLogoutLoading(true);
    setProfileOpen(false);
    await logout();
    toast.success('Logged out successfully.');
    navigate('/login', { replace: true });
  };

  /* Get initials for avatar */
  const initials = user?.fullName
    ? user.fullName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  const bg     = isDark ? '#13132a' : '#ffffff';
  const border = isDark ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.12)';
  const text   = isDark ? 'rgba(255,255,255,0.85)' : '#1e1b4b';
  const sub    = isDark ? 'rgba(255,255,255,0.45)' : '#6b7280';
  const btnBg  = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(99,102,241,0.08)';
  const btnBdr = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(99,102,241,0.2)';
  const iconC  = isDark ? 'rgba(255,255,255,0.6)'  : '#6366f1';
  const dropBg = isDark ? '#1a1a35' : '#ffffff';
  const dropBdr = isDark ? 'rgba(99,102,241,0.25)' : 'rgba(99,102,241,0.15)';
  const divC   = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(99,102,241,0.08)';

  return (
    <>
      <style>{`
        @keyframes nav-dropdown-in { from{opacity:0;transform:translateY(8px) scale(.97)} to{opacity:1;transform:none} }

        .pms-nav{
          display:flex;align-items:center;justify-content:space-between;
          padding:0 24px;height:62px;
          background:${bg};
          border-bottom:1px solid ${border};
          position:sticky;top:0;z-index:100;
          transition:background .3s,border-color .3s;
          box-shadow:0 2px 16px rgba(0,0,0,${isDark ? '.3' : '.06'});
        }
        .pms-nav-brand{display:flex;align-items:center;gap:10px;text-decoration:none;}

        /* Hamburger button (mobile only) */
        .pms-hamburger {
          display: inline-flex; align-items: center; justify-content: center;
          width: 36px; height: 36px;
          background: ${btnBg}; border: 1px solid ${btnBdr};
          border-radius: 10px; cursor: pointer;
          transition: all .2s; flex-shrink: 0;
        }
        .pms-hamburger:hover { opacity: .8; transform: scale(1.06); }
        .pms-nav-logo{
          width:36px;height:36px;
          background:linear-gradient(135deg,#6366f1,#a855f7);
          border-radius:10px;
          display:flex;align-items:center;justify-content:center;
          box-shadow:0 0 14px rgba(99,102,241,.4);
          flex-shrink:0;
        }
        .pms-nav-title{font-size:1.1rem;font-weight:800;color:${text};letter-spacing:-.3px;transition:color .3s;}
        .pms-nav-right{display:flex;align-items:center;gap:10px;}

        /* Theme toggle */
        .pms-nav-btn{
          display:inline-flex;align-items:center;gap:7px;
          background:${btnBg};border:1px solid ${btnBdr};
          border-radius:50px;padding:7px 14px;
          cursor:pointer;font-size:.8rem;font-weight:600;color:${iconC};
          transition:all .2s;
        }
        .pms-nav-btn:hover{opacity:.8;transform:scale(1.04);}
        .pms-nav-btn:active{transform:scale(.97);}

        /* Avatar button */
        .pms-avatar-btn{
          width:38px;height:38px;border-radius:50%;
          background:linear-gradient(135deg,#6366f1,#a855f7);
          border:2px solid ${isDark ? 'rgba(99,102,241,.4)' : 'rgba(99,102,241,.3)'};
          display:flex;align-items:center;justify-content:center;
          cursor:pointer;
          font-size:.78rem;font-weight:800;color:#fff;letter-spacing:.5px;
          box-shadow:0 0 10px rgba(99,102,241,.35);
          transition:all .2s;
          flex-shrink:0;
        }
        .pms-avatar-btn:hover{transform:scale(1.08);box-shadow:0 0 16px rgba(99,102,241,.55);}

        /* Dropdown */
        .pms-profile-dropdown{
          position:absolute;top:calc(100% + 10px);right:0;
          min-width:210px;
          background:${dropBg};
          border:1px solid ${dropBdr};
          border-radius:16px;
          box-shadow:${isDark ? '0 16px 48px rgba(0,0,0,.6)' : '0 16px 48px rgba(99,102,241,.18)'};
          overflow:hidden;
          animation:nav-dropdown-in .22s cubic-bezier(.16,1,.3,1) both;
          z-index:200;
        }

        /* Logout item */
        .pms-dropdown-logout{
          display:flex;align-items:center;gap:10px;
          width:100%;padding:11px 16px;
          background:none;border:none;cursor:pointer;
          font-size:.875rem;font-weight:600;
          color:${isDark ? '#f87171' : '#dc2626'};
          transition:background .15s;
          text-align:left;
        }
        .pms-dropdown-logout:hover{background:rgba(239,68,68,.08);}
        .pms-dropdown-logout:disabled{opacity:.5;cursor:not-allowed;}
      `}</style>

      <nav className="pms-nav">
        {/* Left: hamburger (mobile) + brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {showMenuBtn && (
            <button
              className="pms-hamburger"
              onClick={onMenuClick}
              aria-label="Open menu"
            >
              <IconHamburger c={iconC} />
            </button>
          )}
          <Link to="/" className="pms-nav-brand">
            <div className="pms-nav-logo"><IconLogo /></div>
            <span className="pms-nav-title">ProjectFlow</span>
          </Link>
        </div>

        {/* Right controls */}
        <div className="pms-nav-right">

          {/* Theme toggle */}
          <button className="pms-nav-btn" onClick={toggle} aria-label="Toggle theme">
            {isDark ? <IconSun c={iconC} /> : <IconMoon c={iconC} />}
            {isDark ? 'Light' : 'Dark'}
          </button>

          {/* Avatar + dropdown */}
          {user && (
            <div ref={profileRef} style={{ position:'relative' }}>
              <button
                className="pms-avatar-btn"
                onClick={() => setProfileOpen(o => !o)}
                aria-label="Profile menu"
                aria-expanded={profileOpen}
              >
                {initials}
              </button>

              {profileOpen && (
                <div className="pms-profile-dropdown">
                  {/* User info */}
                  <div style={{ padding:'14px 16px 12px', borderBottom:`1px solid ${divC}` }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <div style={{ width:36, height:36, borderRadius:'50%', background:'linear-gradient(135deg,#6366f1,#a855f7)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.75rem', fontWeight:800, color:'#fff', flexShrink:0 }}>
                        {initials}
                      </div>
                      <div style={{ minWidth:0 }}>
                        <div style={{ fontWeight:700, fontSize:'.9rem', color:text, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                          {user.fullName}
                        </div>
                        {user.email && (
                          <div style={{ fontSize:'.75rem', color:sub, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                            {user.email}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Logout */}
                  <button
                    className="pms-dropdown-logout"
                    onClick={handleLogout}
                    disabled={logoutLoading}
                  >
                    <IconLogout c={isDark ? '#f87171' : '#dc2626'} />
                    {logoutLoading ? 'Logging out…' : 'Logout'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
