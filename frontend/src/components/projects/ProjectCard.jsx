import { useTheme } from '../../context/ThemeContext.jsx';
import { formatDate } from '../../utils/formatDate.js';

/* ── Status config ── */
const STATUS_CFG = {
  NOT_STARTED: { label: 'Not Started', grad: 'linear-gradient(135deg,#64748b,#475569)', glow: 'rgba(100,116,139,.3)',  dot: '#94a3b8' },
  IN_PROGRESS: { label: 'In Progress', grad: 'linear-gradient(135deg,#f59e0b,#d97706)', glow: 'rgba(245,158,11,.35)', dot: '#fbbf24' },
  COMPLETED:   { label: 'Completed',   grad: 'linear-gradient(135deg,#10b981,#059669)', glow: 'rgba(16,185,129,.35)', dot: '#34d399' },
};

/* ── Icons ── */
const IconEdit = ({ c }) => (
  <svg viewBox="0 0 24 24" fill="none" width="14" height="14" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const IconTrash = ({ c }) => (
  <svg viewBox="0 0 24 24" fill="none" width="14" height="14" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
);
const IconCalendar = ({ c }) => (
  <svg viewBox="0 0 24 24" fill="none" width="13" height="13" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const IconTask = ({ c }) => (
  <svg viewBox="0 0 24 24" fill="none" width="13" height="13" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
  </svg>
);
const IconArrow = ({ c }) => (
  <svg viewBox="0 0 24 24" fill="none" width="14" height="14" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);

export default function ProjectCard({ project, onEdit, onDelete, index = 0 }) {
  const { isDark } = useTheme();
  const s   = STATUS_CFG[project.status] || STATUS_CFG.NOT_STARTED;
  const bg  = isDark ? '#1a1a35' : '#ffffff';
  const bdr = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(99,102,241,0.1)';
  const ttl = isDark ? '#ffffff' : '#1e1b4b';
  const sub = isDark ? 'rgba(255,255,255,0.45)' : '#6b7280';
  const metaC = isDark ? 'rgba(255,255,255,0.35)' : '#9ca3af';
  const divC  = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(99,102,241,0.08)';

  return (
    <>
      <style>{`
        .pc-card{
          background:${bg};
          border:1px solid ${bdr};
          border-radius:18px;
          overflow:hidden;
          position:relative;
          transition:transform .22s cubic-bezier(.16,1,.3,1), box-shadow .22s;
          box-shadow:${isDark ? '0 4px 20px rgba(0,0,0,.35)' : '0 4px 20px rgba(99,102,241,.07)'};
          animation:pc-in .5s cubic-bezier(.16,1,.3,1) both;
          animation-delay:${index * 0.07}s;
          opacity:0;
        }
        @keyframes pc-in{from{opacity:0;transform:translateY(18px) scale(.97)}to{opacity:1;transform:none}}
        .pc-card:hover{
          transform:translateY(-5px) scale(1.01);
          box-shadow:${isDark ? '0 16px 40px rgba(0,0,0,.5), 0 0 0 1px rgba(99,102,241,.2)' : '0 16px 40px rgba(99,102,241,.18)'};
        }
        /* shimmer */
        .pc-shimmer{
          position:absolute;top:0;left:0;bottom:0;width:55%;
          background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,.06) 50%,transparent 60%);
          transform:translateX(-100%) skewX(-12deg);
          pointer-events:none;transition:none;
        }
        .pc-card:hover .pc-shimmer{animation:pc-shim .55s ease forwards;}
        @keyframes pc-shim{from{transform:translateX(-100%) skewX(-12deg)}to{transform:translateX(280%) skewX(-12deg)}}
        /* action buttons */
        .pc-btn-edit{
          display:inline-flex;align-items:center;gap:5px;
          background:${isDark ? 'rgba(99,102,241,.15)' : 'rgba(99,102,241,.08)'};
          border:1px solid ${isDark ? 'rgba(99,102,241,.3)' : 'rgba(99,102,241,.2)'};
          border-radius:8px;padding:6px 12px;cursor:pointer;
          color:${isDark ? '#818cf8' : '#6366f1'};font-size:.78rem;font-weight:600;
          transition:all .18s;
        }
        .pc-btn-edit:hover{background:rgba(99,102,241,.25);transform:scale(1.04);}
        .pc-btn-del{
          display:inline-flex;align-items:center;gap:5px;
          background:${isDark ? 'rgba(244,63,94,.12)' : 'rgba(244,63,94,.07)'};
          border:1px solid ${isDark ? 'rgba(244,63,94,.25)' : 'rgba(244,63,94,.18)'};
          border-radius:8px;padding:6px 12px;cursor:pointer;
          color:${isDark ? '#fb7185' : '#f43f5e'};font-size:.78rem;font-weight:600;
          transition:all .18s;
        }
        .pc-btn-del:hover{background:rgba(244,63,94,.22);transform:scale(1.04);}
        .pc-arrow-wrap{
          width:28px;height:28px;
          background:${isDark ? 'rgba(255,255,255,.07)' : 'rgba(99,102,241,.08)'};
          border-radius:50%;
          display:flex;align-items:center;justify-content:center;
          transition:transform .2s,background .2s;flex-shrink:0;
        }
        .pc-card:hover .pc-arrow-wrap{transform:translateX(3px);background:rgba(99,102,241,.2);}
      `}</style>

      <div className="pc-card">
        <div className="pc-shimmer" />

        {/* Top gradient accent */}
        <div style={{ height: 3, background: s.grad }} />

        <div style={{ padding: '18px 20px' }}>
          {/* Header row */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:8, marginBottom:10 }}>
            <h5 style={{
              color: ttl, fontWeight: 700, fontSize: '1rem',
              margin: 0, lineHeight: 1.3,
              overflow:'hidden', textOverflow:'ellipsis',
              display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical',
            }}>
              {project.name}
            </h5>
            <div style={{ display:'flex', alignItems:'center', flexShrink:0 }}>
              <div className="pc-arrow-wrap">
                <IconArrow c={isDark ? 'rgba(255,255,255,0.5)' : '#6366f1'} />
              </div>
            </div>
          </div>

          {/* Status badge */}
          <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:10 }}>
            <div style={{
              display:'inline-flex', alignItems:'center', gap:6,
              background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.04)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
              borderRadius: 20, padding: '3px 10px 3px 7px',
            }}>
              <div style={{
                width: 7, height: 7, borderRadius: '50%',
                background: s.dot,
                boxShadow: `0 0 6px ${s.glow}`,
                animation: 'db-icon-pulse 2.5s ease-in-out infinite',
              }} />
              <span style={{ fontSize: '.72rem', fontWeight: 700, color: s.dot, letterSpacing: '.3px' }}>
                {s.label}
              </span>
            </div>
          </div>

          {/* Description */}
          {project.description && (
            <p style={{
              color: sub, fontSize: '.82rem', lineHeight: 1.5,
              margin: '0 0 12px',
              overflow:'hidden', textOverflow:'ellipsis',
              display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical',
            }}>
              {project.description}
            </p>
          )}

          {/* Meta row */}
          <div style={{
            display:'flex', gap:14, flexWrap:'wrap',
            padding:'10px 0', borderTop:`1px solid ${divC}`,
            marginBottom:14,
          }}>
            <div style={{ display:'flex', alignItems:'center', gap:5 }}>
              <IconTask c={metaC} />
              <span style={{ fontSize:'.75rem', color:metaC, fontWeight:500 }}>
                {project._count?.tasks ?? 0} task{(project._count?.tasks ?? 0) !== 1 ? 's' : ''}
              </span>
            </div>
            {project.startDate && (
              <div style={{ display:'flex', alignItems:'center', gap:5 }}>
                <IconCalendar c={metaC} />
                <span style={{ fontSize:'.75rem', color:metaC }}>
                  {formatDate(project.startDate)}
                </span>
              </div>
            )}
            {project.endDate && (
              <div style={{ display:'flex', alignItems:'center', gap:5 }}>
                <IconCalendar c={metaC} />
                <span style={{ fontSize:'.75rem', color:metaC }}>
                  {formatDate(project.endDate)}
                </span>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div style={{ display:'flex', gap:8 }}>
            <button
              className="pc-btn-edit"
              onClick={onEdit}
              aria-label={`Edit ${project.name}`}
            >
              <IconEdit c={isDark ? '#818cf8' : '#6366f1'} /> Edit
            </button>
            <button
              className="pc-btn-del"
              onClick={onDelete}
              aria-label={`Delete ${project.name}`}
            >
              <IconTrash c={isDark ? '#fb7185' : '#f43f5e'} /> Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
