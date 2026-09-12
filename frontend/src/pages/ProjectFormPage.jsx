import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext.jsx';
import { toast } from '../components/common/Toast.jsx';
import { getProjectById, createProject, updateProject } from '../services/projectService.js';
import { slugToId } from '../utils/slugify.js';

/* ── Status options ── */
const STATUSES = ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'];
const STATUS_LABELS = { NOT_STARTED: 'Not Started', IN_PROGRESS: 'In Progress', COMPLETED: 'Completed' };
const STATUS_CFG = {
  NOT_STARTED: { dot: '#94a3b8', bg: 'rgba(100,116,139,.12)', bdr: 'rgba(100,116,139,.3)',  hov: 'rgba(100,116,139,.08)' },
  IN_PROGRESS: { dot: '#f59e0b', bg: 'rgba(245,158,11,.12)',  bdr: 'rgba(245,158,11,.3)',   hov: 'rgba(245,158,11,.08)'  },
  COMPLETED:   { dot: '#10b981', bg: 'rgba(16,185,129,.12)',  bdr: 'rgba(16,185,129,.3)',   hov: 'rgba(16,185,129,.08)'  },
};

const EMPTY = { name: '', description: '', status: '', startDate: '', endDate: '' };


/* ── Icons ── */
const IconFolder = ({ c }) => (
  <svg viewBox="0 0 24 24" fill="none" width="22" height="22" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
  </svg>
);
const IconChevron = ({ c }) => (
  <svg viewBox="0 0 24 24" fill="none" width="14" height="14" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);
const IconAlert = ({ c }) => (
  <svg viewBox="0 0 24 24" fill="none" width="14" height="14" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);
const IconSave = ({ c }) => (
  <svg viewBox="0 0 24 24" fill="none" width="17" height="17" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
    <polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
  </svg>
);
const IconArrowLeft = ({ c }) => (
  <svg viewBox="0 0 24 24" fill="none" width="16" height="16" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);

export default function ProjectFormPage() {
  const { slug }   = useParams();       // present when editing
  const id         = slugToId(slug);    // extract numeric id from slug
  const isEdit     = !!slug;
  const navigate   = useNavigate();
  const { isDark } = useTheme();

  const [form, setForm]       = useState(EMPTY);
  const [createdAt, setCreatedAt] = useState('');
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [focused, setFocused] = useState('');
  const [statusOpen, setStatusOpen] = useState(false);
  const statusRef = useRef(null);

  /* Close dropdown on outside click */
  useEffect(() => {
    const handler = e => {
      if (statusRef.current && !statusRef.current.contains(e.target)) setStatusOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* ── Load existing project for edit ── */
  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      setFetching(true);
      try {
        const p = await getProjectById(Number(id));
        setCreatedAt(p.createdAt || '');
        setForm({
          name:        p.name        || '',
          description: p.description || '',
          status:      p.status      || 'NOT_STARTED',
          startDate:   p.startDate   ? p.startDate.slice(0, 10) : '',
          endDate:     p.endDate     ? p.endDate.slice(0, 10)   : '',
        });
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to load project.');
        navigate('/projects', { replace: true });
      } finally {
        setFetching(false);
      }
    })();
  }, [id, isEdit]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Project name is required.';
    if (!form.status)      e.status = 'Please select a status.';
    if (!form.startDate)   e.startDate = 'Start date is required.';
    if (!form.endDate)     e.endDate = 'End date is required.';
    if (form.endDate && form.startDate && form.endDate < form.startDate)
      e.endDate = 'End date must be after start date.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = e => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    setErrors(p => ({ ...p, [e.target.name]: '' }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      if (isEdit) {
        await updateProject(Number(id), form);
        toast.success('Project updated successfully.');
        navigate(`/projects/${id}`, { replace: true });
      } else {
        const created = await createProject(form);
        toast.success('Project created successfully.');
        navigate(`/projects/${created.id}`, { replace: true });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save project.');
    } finally {
      setLoading(false);
    }
  };

  /* ── Theme tokens ── */
  const headingC = isDark ? '#ffffff'                  : '#1e1b4b';
  const subC     = isDark ? 'rgba(255,255,255,0.45)'   : '#6b7280';
  const cardBg   = isDark ? '#1a1a35'                  : '#ffffff';
  const cardBdr  = isDark ? 'rgba(99,102,241,0.2)'     : 'rgba(99,102,241,0.12)';
  const lblC     = isDark ? 'rgba(255,255,255,0.65)'   : '#374151';
  const inputBg  = isDark ? 'rgba(255,255,255,0.05)'   : '#f9fafb';
  const inputBdr = isDark ? 'rgba(255,255,255,0.08)'   : '#e5e7eb';
  const inputC   = isDark ? '#ffffff'                  : '#111827';
  const inputPH  = isDark ? 'rgba(255,255,255,0.2)'    : '#9ca3af';
  const focusBg  = isDark ? 'rgba(99,102,241,0.08)'    : '#eef2ff';
  const errC     = isDark ? '#f87171'                  : '#dc2626';
  const divC     = isDark ? 'rgba(255,255,255,0.07)'   : 'rgba(99,102,241,0.08)';
  const metaC    = isDark ? 'rgba(255,255,255,0.35)'   : '#9ca3af';
  const cancelBg = isDark ? 'rgba(255,255,255,0.07)'   : 'rgba(0,0,0,0.04)';
  const cancelBdr= isDark ? 'rgba(255,255,255,0.1)'    : '#e5e7eb';
  const cancelC  = isDark ? 'rgba(255,255,255,0.7)'    : '#6b7280';

  const focBdr = f => focused === f ? '#6366f1' : inputBdr;

  if (fetching) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 0', flexDirection: 'column', gap: 14 }}>
        <svg viewBox="0 0 48 48" width="48" height="48">
          <circle cx="24" cy="24" r="20" fill="none" stroke={isDark ? 'rgba(99,102,241,.15)' : 'rgba(99,102,241,.1)'} strokeWidth="4"/>
          <circle cx="24" cy="24" r="20" fill="none" stroke="url(#pf-grad)" strokeWidth="4" strokeLinecap="round" strokeDasharray="32 94" transform="rotate(-90 24 24)" style={{ animation: 'pfp-spin .75s linear infinite' }}/>
          <defs><linearGradient id="pf-grad"><stop offset="0%" stopColor="#6366f1"/><stop offset="100%" stopColor="#a855f7"/></linearGradient></defs>
        </svg>
        <span style={{ color: subC, fontSize: '.875rem' }}>Loading project…</span>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes pfp-spin    { to { transform: rotate(360deg); } }
        @keyframes pfp-fadein  { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }
        @keyframes pfp-card-in { from{opacity:0;transform:translateY(20px) scale(.97)} to{opacity:1;transform:none} }
        @keyframes db-icon-pulse { 0%,100%{box-shadow:0 0 8px rgba(99,102,241,.3)} 50%{box-shadow:0 0 20px rgba(99,102,241,.6)} }
        @keyframes pfp-shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-4px)} 75%{transform:translateX(4px)} }

        .pfp-input {
          width: 100%;
          background: ${inputBg};
          border: 1.5px solid ${inputBdr};
          border-radius: 12px;
          padding: 13px 16px;
          color: ${inputC};
          font-size: .93rem;
          outline: none;
          transition: border-color .2s, box-shadow .2s, background .3s, transform .15s;
          box-sizing: border-box;
          font-family: inherit;
        }
        .pfp-input::placeholder { color: ${inputPH}; }
        .pfp-input:focus {
          border-color: #6366f1;
          background: ${focusBg};
          box-shadow: 0 0 0 3.5px rgba(99,102,241,.18);
          transform: translateY(-1px);
        }
        .pfp-input.err { border-color: ${errC}; box-shadow: 0 0 0 3px rgba(248,113,113,.15); }
        .pfp-label {
          display: block;
          color: ${lblC};
          font-size: .75rem;
          font-weight: 700;
          letter-spacing: .5px;
          text-transform: uppercase;
          margin-bottom: 8px;
          transition: color .3s;
        }
        .pfp-err {
          color: ${errC};
          font-size: .8rem;
          margin-top: 6px;
          display: flex;
          align-items: center;
          gap: 5px;
          animation: pfp-shake .35s ease;
        }
        .pfp-cancel {
          display: inline-flex; align-items: center; gap: 7px;
          background: ${cancelBg}; border: 1px solid ${cancelBdr};
          border-radius: 12px; padding: 12px 22px;
          color: ${cancelC}; font-size: .9rem; font-weight: 600;
          cursor: pointer; text-decoration: none;
          transition: all .2s;
        }
        .pfp-cancel:hover { opacity: .8; color: ${cancelC}; }
        .pfp-submit {
          display: inline-flex; align-items: center; gap: 8px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border: none; border-radius: 12px;
          color: #fff; font-size: .9rem; font-weight: 700;
          padding: 12px 28px; cursor: pointer;
          box-shadow: 0 5px 20px rgba(99,102,241,.4);
          transition: transform .2s, box-shadow .2s, opacity .2s;
          position: relative; overflow: hidden;
        }
        .pfp-submit::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,.15) 50%, transparent 60%);
          transform: translateX(-100%); transition: transform .45s;
        }
        .pfp-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(99,102,241,.55); }
        .pfp-submit:hover:not(:disabled)::after { transform: translateX(100%); }
        .pfp-submit:disabled { opacity: .55; cursor: not-allowed; }
        .pfp-spin {
          display: inline-block; width: 16px; height: 16px; flex-shrink: 0;
          border: 2.5px solid rgba(255,255,255,.3); border-top-color: #fff;
          border-radius: 50%; animation: pfp-spin .65s linear infinite;
        }
        .pfp-bc-link { color: ${isDark ? '#818cf8' : '#6366f1'}; text-decoration: none; font-size: .85rem; font-weight: 600; }
        .pfp-bc-link:hover { text-decoration: underline; }

        /* ── Responsive ── */
        @media (max-width: 600px) {
          .pfp-grid-2          { grid-template-columns: 1fr !important; }
          .pfp-card            { padding: 22px 16px !important; border-radius: 16px !important; }
          .pfp-card-footer     { padding: 16px !important; flex-direction: column !important; gap: 10px !important; }
          .pfp-card-footer > * { width: 100% !important; justify-content: center !important; }
          .pfp-page-title      { font-size: 1.15rem !important; }
          .pfp-page-sub        { font-size: .82rem !important; }
        }
        @media (max-width: 400px) {
          .pfp-card     { padding: 16px 12px !important; }
          .pfp-input    { padding: 11px 14px !important; font-size: .88rem !important; }
          .pfp-page-title { font-size: 1rem !important; }
        }
        .pfp-status-btn {
          display: flex; align-items: center; gap: 8px;
          padding: 10px 16px; border-radius: 10px;
          border: 1.5px solid transparent;
          cursor: pointer; font-size: .85rem; font-weight: 600;
          transition: all .18s; flex: 1; justify-content: center;
        }
        .pfp-status-btn:hover { transform: scale(1.03); }
      `}</style>

      {/* ── Breadcrumb ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        marginBottom: 24,
        maxWidth: 980,
        animation: 'pfp-fadein .4s ease both',
      }}>
        <Link to="/projects" className="pfp-bc-link">Projects</Link>
        <IconChevron c={metaC} />
        <span style={{ color: headingC, fontSize: '.85rem', fontWeight: 600 }}>
          {isEdit ? 'Edit Project' : 'New Project'}
        </span>
      </div>

      {/* ── Page header ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 14,
        marginBottom: 28,
        maxWidth: 980,
        animation: 'pfp-fadein .45s ease both .05s',
        opacity: 0,
      }}>
        <div style={{
          width: 52, height: 52,
          background: 'linear-gradient(135deg,#6366f1,#a855f7)',
          borderRadius: 15,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 18px rgba(99,102,241,.45)',
          animation: 'db-icon-pulse 3s ease-in-out infinite',
          flexShrink: 0,
        }}>
          <IconFolder c="#fff" />
        </div>
        <div>
          <h4 className="pfp-page-title" style={{ color: headingC, fontWeight: 800, fontSize: '1.45rem', margin: 0, letterSpacing: '-.3px' }}>
            {isEdit ? 'Edit Project' : 'Create New Project'}
          </h4>
          <p className="pfp-page-sub" style={{ color: subC, margin: 0, fontSize: '.875rem' }}>
            {isEdit ? 'Update your project details below.' : 'Fill in the details to create your project.'}
          </p>
        </div>
      </div>

      {/* ── Form card ── */}
      <div style={{
        width: '100%',
        maxWidth: 980,
        background: cardBg,
        border: `1px solid ${cardBdr}`,
        borderRadius: 22,
        overflow: 'hidden',
        boxShadow: isDark ? '0 8px 40px rgba(0,0,0,.45)' : '0 8px 40px rgba(99,102,241,.12)',
        animation: 'pfp-card-in .55s cubic-bezier(.16,1,.3,1) both .1s',
        opacity: 0,
        position: 'relative',
      }} className="pfp-card">
        {/* Top shimmer line */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 3,
          background: 'linear-gradient(90deg,#6366f1,#a855f7,#6366f1)',
          backgroundSize: '200% 100%',
          animation: 'pfp-shimmer-bar 3s linear infinite',
        }} />
        <style>{`@keyframes pfp-shimmer-bar { 0%{background-position:0% 0%} 100%{background-position:200% 0%} }`}</style>

        <form onSubmit={handleSubmit} noValidate>
          <div style={{ padding: '32px 36px 24px' }}>

            {/* ── Row 1: Project Name | Status ── */}
            <div className="pfp-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 28px', marginBottom: 22 }}>
              <div>
                <label className="pfp-label" htmlFor="pfp-name">Project Name <span style={{ color: errC }}>*</span></label>
                <input
                  id="pfp-name" name="name"
                  className={`pfp-input${errors.name ? ' err' : ''}`}
                  value={form.name} onChange={handleChange}
                  onFocus={() => setFocused('name')} onBlur={() => setFocused('')}
                  placeholder="e.g. Website Redesign"
                  maxLength={150}
                  style={{ borderColor: errors.name ? errC : focBdr('name') }}
                  autoFocus
                />
                {errors.name && <div className="pfp-err"><IconAlert c={errC} /> {errors.name}</div>}
              </div>

              <div>
                <label className="pfp-label">Status <span style={{ color: errC }}>*</span></label>
                <div ref={statusRef} style={{ position: 'relative' }}>
                  {/* Trigger */}
                  <div
                    onClick={() => setStatusOpen(o => !o)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      background: statusOpen ? focusBg : inputBg,
                      border: `1.5px solid ${errors.status ? errC : statusOpen ? '#6366f1' : inputBdr}`,
                      borderRadius: statusOpen ? '12px 12px 0 0' : 12,
                      padding: '13px 16px',
                      cursor: 'pointer',
                      boxShadow: statusOpen ? '0 0 0 3.5px rgba(99,102,241,.18)' : errors.status ? '0 0 0 3px rgba(248,113,113,.15)' : 'none',
                      transition: 'all .2s',
                      userSelect: 'none',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      {form.status ? (
                        <>
                          <span style={{
                            width: 9, height: 9, borderRadius: '50%', flexShrink: 0,
                            background: STATUS_CFG[form.status].dot,
                            boxShadow: `0 0 6px ${STATUS_CFG[form.status].dot}`,
                          }}/>
                          <span style={{ color: inputC, fontSize: '.93rem', fontWeight: 600 }}>
                            {STATUS_LABELS[form.status]}
                          </span>
                        </>
                      ) : (
                        <span style={{ color: inputPH, fontSize: '.93rem' }}>Select status…</span>
                      )}
                    </div>
                    <svg viewBox="0 0 24 24" fill="none" width="15" height="15"
                      stroke={metaC} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                      style={{ transition: 'transform .2s', transform: statusOpen ? 'rotate(180deg)' : 'none', flexShrink: 0 }}>
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </div>
                  {errors.status && <div className="pfp-err"><IconAlert c={errC} /> {errors.status}</div>}

                  {/* Dropdown panel */}
                  {statusOpen && (
                    <div style={{
                      position: 'absolute', left: 0, right: 0, zIndex: 100,
                      background: cardBg,
                      border: `1.5px solid #6366f1`,
                      borderTop: 'none',
                      borderRadius: '0 0 12px 12px',
                      boxShadow: isDark ? '0 8px 24px rgba(0,0,0,.5)' : '0 8px 24px rgba(99,102,241,.18)',
                      overflow: 'hidden',
                    }}>
                      {STATUSES.map((s, idx) => {
                        const cfg = STATUS_CFG[s];
                        const isSelected = form.status === s;
                        return (
                          <div
                            key={s}
                            onClick={() => { setForm(p => ({ ...p, status: s })); setStatusOpen(false); setErrors(p => ({ ...p, status: '' })); }}
                            style={{
                              display: 'flex', alignItems: 'center', gap: 10,
                              padding: '11px 16px',
                              cursor: 'pointer',
                              background: isSelected
                                ? (isDark ? 'rgba(99,102,241,.18)' : 'rgba(99,102,241,.07)')
                                : 'transparent',
                              borderBottom: idx < STATUSES.length - 1
                                ? `1px solid ${isDark ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,.05)'}` : 'none',
                              transition: 'background .15s',
                            }}
                            onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = cfg.hov; }}
                            onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}
                          >
                            <span style={{
                              width: 9, height: 9, borderRadius: '50%', flexShrink: 0,
                              background: cfg.dot,
                              boxShadow: isSelected ? `0 0 6px ${cfg.dot}` : 'none',
                            }}/>
                            <span style={{
                              fontSize: '.9rem',
                              fontWeight: isSelected ? 700 : 500,
                              color: isSelected ? (isDark ? '#ffffff' : '#1e1b4b') : (isDark ? 'rgba(255,255,255,.7)' : '#374151'),
                            }}>
                              {STATUS_LABELS[s]}
                            </span>
                            {isSelected && (
                              <svg viewBox="0 0 24 24" fill="none" width="14" height="14"
                                stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                                style={{ marginLeft: 'auto' }}>
                                <polyline points="20 6 9 17 4 12"/>
                              </svg>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ── Row 2: Start Date | End Date ── */}
            <div className="pfp-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 28px', marginBottom: 22 }}>
              <div>
                <label className="pfp-label" htmlFor="pfp-start">Start Date <span style={{ color: errC }}>*</span></label>
                <input
                  id="pfp-start" type="date" name="startDate"
                  className={`pfp-input${errors.startDate ? ' err' : ''}`}
                  value={form.startDate} onChange={handleChange}
                  onFocus={() => setFocused('start')} onBlur={() => setFocused('')}
                  style={{ borderColor: errors.startDate ? errC : focBdr('start') }}
                />
                {errors.startDate && <div className="pfp-err"><IconAlert c={errC} /> {errors.startDate}</div>}
              </div>

              <div>
                <label className="pfp-label" htmlFor="pfp-end">End Date <span style={{ color: errC }}>*</span></label>
                <input
                  id="pfp-end" type="date" name="endDate"
                  className={`pfp-input${errors.endDate ? ' err' : ''}`}
                  value={form.endDate} onChange={handleChange}
                  onFocus={() => setFocused('end')} onBlur={() => setFocused('')}
                  style={{ borderColor: errors.endDate ? errC : focBdr('end') }}
                />
                {errors.endDate && <div className="pfp-err"><IconAlert c={errC} /> {errors.endDate}</div>}
              </div>
            </div>

            {/* ── Row 3: Description (full width) ── */}
            <div style={{ marginBottom: 22 }}>
              <label className="pfp-label" htmlFor="pfp-desc">Description</label>
              <textarea
                id="pfp-desc" name="description"
                className="pfp-input"
                rows={4}
                value={form.description} onChange={handleChange}
                onFocus={() => setFocused('desc')} onBlur={() => setFocused('')}
                placeholder="Describe your project goals, scope, and deliverables…"
                style={{ resize: 'vertical', borderColor: focBdr('desc') }}
              />
            </div>

            {/* ── Row 4: Created Date (read-only, edit only, half width) ── */}
            {isEdit && createdAt && (
              <div className="pfp-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 28px' }}>
                <div>
                  <label className="pfp-label">Created Date</label>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
                    border: `1.5px solid ${inputBdr}`,
                    borderRadius: 12, padding: '13px 16px',
                  }}>
                    <svg viewBox="0 0 24 24" fill="none" width="16" height="16"
                      stroke={metaC} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                      <rect x="3" y="4" width="18" height="18" rx="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    <span style={{ color: isDark ? 'rgba(255,255,255,0.55)' : '#6b7280', fontSize: '.88rem' }}>
                      {new Date(createdAt).toLocaleDateString('en-GB', {
                        day: '2-digit', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit',
                      })}
                    </span>
                    <span style={{
                      marginLeft: 'auto', fontSize: '.7rem', fontWeight: 700,
                      letterSpacing: '.4px', textTransform: 'uppercase', color: metaC,
                      background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)',
                      borderRadius: 6, padding: '2px 8px',
                    }}>Auto</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── Footer ── */}
          <div className="pfp-card-footer" style={{
            padding: '20px 36px 28px',
            borderTop: `1px solid ${divC}`,
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: 12,
          }}>
            <Link to={isEdit ? `/projects/${id}` : '/projects'} className="pfp-cancel">
              <IconArrowLeft c={cancelC} /> Cancel
            </Link>
            <button type="submit" className="pfp-submit" disabled={loading}>
              {loading
                ? <><span className="pfp-spin" /> Saving…</>
                : <><IconSave c="#fff" /> {isEdit ? 'Save Changes' : 'Create Project'}</>
              }
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
