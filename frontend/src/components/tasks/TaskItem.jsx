import { useTheme } from '../../context/ThemeContext.jsx';
import { formatDate } from '../../utils/formatDate.js';

/* ── Status & Priority config ── */
const STATUS_CFG = {
  PENDING:     { label:'Pending',     dot:'#94a3b8', bg:'rgba(100,116,139,.12)', bdr:'rgba(100,116,139,.25)' },
  IN_PROGRESS: { label:'In Progress', dot:'#fbbf24', bg:'rgba(245,158,11,.12)',  bdr:'rgba(245,158,11,.25)'  },
  COMPLETED:   { label:'Completed',   dot:'#34d399', bg:'rgba(16,185,129,.12)',  bdr:'rgba(16,185,129,.25)'  },
};
const PRIORITY_CFG = {
  LOW:    { label:'Low',    dot:'#38bdf8', bg:'rgba(14,165,233,.1)',   bdr:'rgba(14,165,233,.25)'  },
  MEDIUM: { label:'Medium', dot:'#fbbf24', bg:'rgba(245,158,11,.1)',   bdr:'rgba(245,158,11,.25)'  },
  HIGH:   { label:'High',   dot:'#fb7185', bg:'rgba(244,63,94,.1)',    bdr:'rgba(244,63,94,.25)'   },
};

/* ── Icons ── */
const IconEdit  = ({ c }) => (
  <svg viewBox="0 0 24 24" fill="none" width="13" height="13" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const IconTrash = ({ c }) => (
  <svg viewBox="0 0 24 24" fill="none" width="13" height="13" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
);
const IconCal = ({ c }) => (
  <svg viewBox="0 0 24 24" fill="none" width="12" height="12" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

export default function TaskItem({ task, onEdit, onDelete, onToggleComplete, index = 0 }) {
  const { isDark }  = useTheme();
  const isCompleted = task.status === 'COMPLETED';
  const sc  = STATUS_CFG[task.status]   || STATUS_CFG.PENDING;
  const pc  = PRIORITY_CFG[task.priority] || PRIORITY_CFG.MEDIUM;

  const bg    = isDark ? '#1a1a35'                  : '#ffffff';
  const bdr   = isDark ? 'rgba(255,255,255,0.07)'   : 'rgba(99,102,241,0.08)';
  const hoverBdr = isDark ? 'rgba(99,102,241,0.25)' : 'rgba(99,102,241,0.2)';
  const ttl   = isDark ? '#ffffff'                  : '#1e1b4b';
  const sub   = isDark ? 'rgba(255,255,255,0.45)'   : '#6b7280';
  const metaC = isDark ? 'rgba(255,255,255,0.3)'    : '#9ca3af';

  /* Checkbox custom colours */
  const chkBdr = isDark ? 'rgba(255,255,255,0.2)' : '#d1d5db';

  return (
    <>
      <style>{`
        .ti-row {
          display:flex; align-items:flex-start; gap:14px;
          background:${bg}; border:1px solid ${bdr};
          border-radius:14px; padding:16px 18px;
          margin-bottom:10px;
          transition:transform .2s, box-shadow .2s, border-color .2s;
          animation:ti-in .45s cubic-bezier(.16,1,.3,1) both;
          animation-delay:${index * 0.06}s;
          opacity:0; position:relative; overflow:hidden;
        }
        @keyframes ti-in{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
        .ti-row:hover {
          transform:translateY(-2px);
          border-color:${hoverBdr};
          box-shadow:${isDark ? '0 8px 24px rgba(0,0,0,.4)' : '0 8px 24px rgba(99,102,241,.12)'};
        }
        /* shimmer */
        .ti-shimmer {
          position:absolute;top:0;left:0;bottom:0;width:50%;
          background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,.05) 50%,transparent 60%);
          transform:translateX(-100%) skewX(-12deg); pointer-events:none;
        }
        .ti-row:hover .ti-shimmer { animation:ti-shim .5s ease forwards; }
        @keyframes ti-shim{from{transform:translateX(-100%) skewX(-12deg)}to{transform:translateX(280%) skewX(-12deg)}}

        /* Custom checkbox */
        .ti-check {
          width:22px; height:22px; flex-shrink:0; margin-top:2px;
          border-radius:7px;
          background:${isCompleted ? 'linear-gradient(135deg,#10b981,#059669)' : (isDark ? 'rgba(255,255,255,0.05)' : '#f9fafb')};
          border:2px solid ${isCompleted ? '#10b981' : chkBdr};
          display:flex; align-items:center; justify-content:center;
          cursor:pointer; transition:all .2s;
          box-shadow:${isCompleted ? '0 0 10px rgba(16,185,129,.45)' : 'none'};
          font-size:13px; font-weight:900; line-height:1;
          color:#ffffff;
          user-select:none;
        }
        .ti-check:hover { border-color:#6366f1; transform:scale(1.1); }
        .ti-btn-edit {
          display:inline-flex; align-items:center; gap:5px;
          background:${isDark ? 'rgba(99,102,241,.15)' : 'rgba(99,102,241,.08)'};
          border:1px solid ${isDark ? 'rgba(99,102,241,.3)' : 'rgba(99,102,241,.2)'};
          border-radius:8px; padding:5px 11px; cursor:pointer;
          color:${isDark ? '#818cf8' : '#6366f1'}; font-size:.75rem; font-weight:600;
          transition:all .18s;
        }
        .ti-btn-edit:hover { background:rgba(99,102,241,.25); transform:scale(1.04); }
        .ti-btn-del {
          display:inline-flex; align-items:center; gap:5px;
          background:${isDark ? 'rgba(244,63,94,.12)' : 'rgba(244,63,94,.07)'};
          border:1px solid ${isDark ? 'rgba(244,63,94,.25)' : 'rgba(244,63,94,.18)'};
          border-radius:8px; padding:5px 11px; cursor:pointer;
          color:${isDark ? '#fb7185' : '#f43f5e'}; font-size:.75rem; font-weight:600;
          transition:all .18s;
        }
        .ti-btn-del:hover { background:rgba(244,63,94,.22); transform:scale(1.04); }
      `}</style>

      <div className="ti-row">
        <div className="ti-shimmer" />

        {/* Checkbox */}
        <div
          className="ti-check"
          role="checkbox"
          aria-checked={isCompleted}
          tabIndex={0}
          onClick={() => onToggleComplete(task)}
          onKeyDown={e => e.key === 'Enter' && onToggleComplete(task)}
          aria-label={`Mark "${task.name}" ${isCompleted ? 'incomplete' : 'complete'}`}
        >
          {isCompleted && (
            <span style={{
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: 900,
              lineHeight: 1,
              display: 'block',
            }}>✓</span>
          )}
        </div>

        {/* Content */}
        <div style={{ flex:1, minWidth:0 }}>
          {/* Name + badges */}
          <div style={{ display:'flex', flexWrap:'wrap', alignItems:'center', gap:7, marginBottom:6 }}>
            <span style={{
              fontWeight:700, fontSize:'.9rem',
              color: isCompleted ? (isDark ? 'rgba(255,255,255,0.35)' : '#9ca3af') : ttl,
              textDecoration: isCompleted ? 'line-through' : 'none',
              transition:'color .2s',
            }}>
              {task.name}
            </span>

            {/* Status badge */}
            <span style={{
              display:'inline-flex', alignItems:'center', gap:5,
              background:sc.bg, border:`1px solid ${sc.bdr}`,
              borderRadius:20, padding:'2px 9px 2px 6px',
              fontSize:'.7rem', fontWeight:700, color:sc.dot,
            }}>
              <span style={{ width:6, height:6, borderRadius:'50%', background:sc.dot, boxShadow:`0 0 5px ${sc.dot}`, display:'inline-block' }}/>
              {sc.label}
            </span>

            {/* Priority badge */}
            <span style={{
              display:'inline-flex', alignItems:'center', gap:5,
              background:pc.bg, border:`1px solid ${pc.bdr}`,
              borderRadius:20, padding:'2px 9px 2px 6px',
              fontSize:'.7rem', fontWeight:700, color:pc.dot,
            }}>
              <span style={{ width:6, height:6, borderRadius:'50%', background:pc.dot, display:'inline-block' }}/>
              {pc.label}
            </span>
          </div>

          {/* Description */}
          {task.description && (
            <p style={{ color:sub, fontSize:'.8rem', margin:'0 0 6px', lineHeight:1.5,
              overflow:'hidden', textOverflow:'ellipsis',
              display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical',
            }}>
              {task.description}
            </p>
          )}

          {/* Meta: due date + created date */}
          <div style={{ display:'flex', flexWrap:'wrap', alignItems:'center', gap:14 }}>
            {task.dueDate && (
              <div style={{ display:'flex', alignItems:'center', gap:5 }}>
                <IconCal c={metaC} />
                <span style={{ fontSize:'.75rem', color:metaC }}>Due: <strong style={{ color: isDark ? 'rgba(255,255,255,0.5)' : '#6b7280' }}>{formatDate(task.dueDate)}</strong></span>
              </div>
            )}
            {task.createdAt && (
              <div style={{ display:'flex', alignItems:'center', gap:5 }}>
                <IconCal c={metaC} />
                <span style={{ fontSize:'.75rem', color:metaC }}>Created: <strong style={{ color: isDark ? 'rgba(255,255,255,0.5)' : '#6b7280' }}>{formatDate(task.createdAt)}</strong></span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display:'flex', gap:7, flexShrink:0, alignItems:'flex-start' }}>
          <button className="ti-btn-edit" onClick={() => onEdit(task)} aria-label={`Edit ${task.name}`}>
            <IconEdit c={isDark ? '#818cf8' : '#6366f1'}/> Edit
          </button>
          <button className="ti-btn-del" onClick={() => onDelete(task)} aria-label={`Delete ${task.name}`}>
            <IconTrash c={isDark ? '#fb7185' : '#f43f5e'}/> Delete
          </button>
        </div>
      </div>
    </>
  );
}
