import { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext.jsx';

const STATUSES = ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'];
const STATUS_LABELS = { NOT_STARTED: 'Not Started', IN_PROGRESS: 'In Progress', COMPLETED: 'Completed' };

const EMPTY = { name: '', description: '', status: 'NOT_STARTED', startDate: '', endDate: '' };

/* ── Icons ── */
const IconX = ({ c }) => (
  <svg viewBox="0 0 24 24" fill="none" width="18" height="18" stroke={c} strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const IconFolder = ({ c }) => (
  <svg viewBox="0 0 24 24" fill="none" width="20" height="20" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
  </svg>
);
const IconAlert = ({ c }) => (
  <svg viewBox="0 0 24 24" fill="none" width="14" height="14" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}>
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

export default function ProjectForm({ show, project, onSubmit, onClose, loading = false }) {
  const { isDark } = useTheme();
  const [form, setForm]     = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [focused, setFocused] = useState('');

  useEffect(() => {
    if (project) {
      setForm({
        name:        project.name        || '',
        description: project.description || '',
        status:      project.status      || 'NOT_STARTED',
        startDate:   project.startDate   ? project.startDate.slice(0, 10) : '',
        endDate:     project.endDate     ? project.endDate.slice(0, 10)   : '',
      });
    } else {
      setForm(EMPTY);
    }
    setErrors({});
    setFocused('');
  }, [project, show]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Project name is required.';
    if (form.endDate && form.startDate && form.endDate < form.startDate)
      e.endDate = 'End date must be after start date.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));
  const handleSubmit = e => { e.preventDefault(); if (validate()) onSubmit(form); };

  if (!show) return null;

  /* ── Theme tokens ── */
  const overlay  = isDark ? 'rgba(0,0,0,0.75)'  : 'rgba(15,15,26,0.55)';
  const modalBg  = isDark ? '#13132a'            : '#ffffff';
  const modalBdr = isDark ? 'rgba(99,102,241,0.25)' : 'rgba(99,102,241,0.15)';
  const hdgC     = isDark ? '#ffffff'            : '#1e1b4b';
  const lblC     = isDark ? 'rgba(255,255,255,.65)' : '#374151';
  const inputBg  = isDark ? 'rgba(255,255,255,.05)' : '#f9fafb';
  const inputBdr = isDark ? 'rgba(255,255,255,.08)'  : '#e5e7eb';
  const inputC   = isDark ? '#ffffff'            : '#111827';
  const inputPH  = isDark ? 'rgba(255,255,255,.2)' : '#9ca3af';
  const focusBg  = isDark ? 'rgba(99,102,241,.08)' : '#eef2ff';
  const errC     = isDark ? '#f87171'            : '#dc2626';
  const divC     = isDark ? 'rgba(255,255,255,.07)' : 'rgba(99,102,241,.08)';
  const cancelBg = isDark ? 'rgba(255,255,255,.07)' : 'rgba(0,0,0,.05)';
  const cancelBdr= isDark ? 'rgba(255,255,255,.1)'  : '#e5e7eb';
  const cancelC  = isDark ? 'rgba(255,255,255,.7)'  : '#6b7280';

  const ic = (f) => focused === f ? '#6366f1' : (isDark ? 'rgba(255,255,255,0.25)' : '#e5e7eb');

  return (
    <>
      <style>{`
        .pf-overlay{position:fixed;inset:0;background:${overlay};z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px;animation:pf-bg-in .25s ease;}
        @keyframes pf-bg-in{from{opacity:0}to{opacity:1}}
        .pf-modal{
          width:100%;max-width:520px;
          background:${modalBg};
          border:1px solid ${modalBdr};
          border-radius:22px;
          box-shadow:${isDark ? '0 30px 80px rgba(0,0,0,.7)' : '0 30px 80px rgba(99,102,241,.2)'};
          animation:pf-modal-in .35s cubic-bezier(.16,1,.3,1) both;
          position:relative;overflow:hidden;
        }
        @keyframes pf-modal-in{from{opacity:0;transform:translateY(24px) scale(.96)}to{opacity:1;transform:none}}
        /* top shimmer */
        .pf-modal::before{
          content:'';position:absolute;top:0;left:-100%;width:60%;height:2px;
          background:linear-gradient(90deg,transparent,rgba(99,102,241,.8),transparent);
          animation:pf-shimmer-line 3s ease-in-out infinite 1s;
        }
        @keyframes pf-shimmer-line{0%{left:-60%}100%{left:160%}}

        .pf-label{display:block;color:${lblC};font-size:.75rem;font-weight:700;letter-spacing:.5px;text-transform:uppercase;margin-bottom:7px;transition:color .3s;}
        .pf-input{
          width:100%;background:${inputBg};border:1.5px solid ${inputBdr};
          border-radius:11px;padding:11px 14px;
          color:${inputC};font-size:.9rem;outline:none;
          transition:border-color .2s,box-shadow .2s,background .3s;
          box-sizing:border-box;font-family:inherit;
        }
        .pf-input::placeholder{color:${inputPH};}
        .pf-input:focus{border-color:#6366f1;background:${focusBg};box-shadow:0 0 0 3px rgba(99,102,241,.15);}
        .pf-input.err{border-color:${errC};}
        .pf-select{appearance:none;-webkit-appearance:none;cursor:pointer;}
        .pf-select option{background:${isDark ? '#1a1a35' : '#fff'};color:${inputC};}
        .pf-err{color:${errC};font-size:.78rem;margin-top:5px;display:flex;align-items:center;gap:5px;animation:pf-shake .3s ease;}
        @keyframes pf-shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-4px)}75%{transform:translateX(4px)}}
        .pf-cancel-btn{
          display:inline-flex;align-items:center;gap:6px;
          background:${cancelBg};border:1px solid ${cancelBdr};
          border-radius:11px;padding:10px 20px;
          color:${cancelC};font-size:.88rem;font-weight:600;
          cursor:pointer;transition:all .2s;
        }
        .pf-cancel-btn:hover{opacity:.8;}
        .pf-submit-btn{
          display:inline-flex;align-items:center;gap:6px;
          background:linear-gradient(135deg,#6366f1,#8b5cf6);
          border:none;border-radius:11px;padding:10px 22px;
          color:#fff;font-size:.88rem;font-weight:700;
          cursor:pointer;
          box-shadow:0 4px 16px rgba(99,102,241,.4);
          transition:all .2s;position:relative;overflow:hidden;
        }
        .pf-submit-btn::after{content:'';position:absolute;inset:0;background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,.15) 50%,transparent 60%);transform:translateX(-100%);transition:transform .4s;}
        .pf-submit-btn:hover{transform:translateY(-1px);box-shadow:0 6px 22px rgba(99,102,241,.55);}
        .pf-submit-btn:hover::after{transform:translateX(100%);}
        .pf-submit-btn:disabled{opacity:.55;cursor:not-allowed;}
        .pf-spin{display:inline-block;width:14px;height:14px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:pf-spin .65s linear infinite;flex-shrink:0;}
        @keyframes pf-spin{to{transform:rotate(360deg)}}
      `}</style>

      <div className="pf-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
        <div className="pf-modal">
          {/* Header */}
          <div style={{
            padding: '22px 24px 18px',
            borderBottom: `1px solid ${divC}`,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{
                width:36, height:36,
                background:'linear-gradient(135deg,#6366f1,#a855f7)',
                borderRadius:10,
                display:'flex', alignItems:'center', justifyContent:'center',
                boxShadow:'0 0 12px rgba(99,102,241,.4)',
              }}>
                <IconFolder c="#fff" />
              </div>
              <h5 style={{ color:hdgC, fontWeight:800, margin:0, fontSize:'1.05rem' }}>
                {project ? 'Edit Project' : 'New Project'}
              </h5>
            </div>
            <button
              onClick={onClose}
              style={{
                background: isDark ? 'rgba(255,255,255,.07)' : 'rgba(0,0,0,.05)',
                border: 'none', borderRadius: 8,
                padding: 6, cursor: 'pointer', display:'flex',
                transition:'background .2s',
              }}
              aria-label="Close"
            >
              <IconX c={isDark ? 'rgba(255,255,255,0.6)' : '#6b7280'} />
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} noValidate>
            <div style={{ padding: '20px 24px', display:'flex', flexDirection:'column', gap:16 }}>
              {/* Name */}
              <div>
                <label className="pf-label" htmlFor="pf-name">Project Name *</label>
                <input
                  id="pf-name" name="name"
                  className={`pf-input${errors.name ? ' err' : ''}`}
                  value={form.name} onChange={handleChange}
                  onFocus={() => setFocused('name')} onBlur={() => setFocused('')}
                  placeholder="Enter project name" maxLength={150}
                  style={{ borderColor: errors.name ? errC : focused==='name' ? '#6366f1' : inputBdr }}
                />
                {errors.name && <div className="pf-err"><IconAlert c={errC}/> {errors.name}</div>}
              </div>

              {/* Description */}
              <div>
                <label className="pf-label" htmlFor="pf-desc">Description</label>
                <textarea
                  id="pf-desc" name="description"
                  className="pf-input"
                  rows={3} value={form.description} onChange={handleChange}
                  onFocus={() => setFocused('desc')} onBlur={() => setFocused('')}
                  placeholder="Optional description…"
                  style={{ resize:'vertical', borderColor: focused==='desc' ? '#6366f1' : inputBdr }}
                />
              </div>

              {/* Status */}
              <div>
                <label className="pf-label" htmlFor="pf-status">Status</label>
                <select
                  id="pf-status" name="status"
                  className="pf-input pf-select"
                  value={form.status} onChange={handleChange}
                >
                  {STATUSES.map(s => (
                    <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                  ))}
                </select>
              </div>

              {/* Dates */}
              <div style={{ display:'flex', gap:12 }}>
                <div style={{ flex:1 }}>
                  <label className="pf-label" htmlFor="pf-start">Start Date</label>
                  <input
                    id="pf-start" type="date" name="startDate"
                    className="pf-input"
                    value={form.startDate} onChange={handleChange}
                    onFocus={() => setFocused('start')} onBlur={() => setFocused('')}
                    style={{ borderColor: focused==='start' ? '#6366f1' : inputBdr }}
                  />
                </div>
                <div style={{ flex:1 }}>
                  <label className="pf-label" htmlFor="pf-end">End Date</label>
                  <input
                    id="pf-end" type="date" name="endDate"
                    className={`pf-input${errors.endDate ? ' err' : ''}`}
                    value={form.endDate} onChange={handleChange}
                    onFocus={() => setFocused('end')} onBlur={() => setFocused('')}
                    style={{ borderColor: errors.endDate ? errC : focused==='end' ? '#6366f1' : inputBdr }}
                  />
                  {errors.endDate && <div className="pf-err"><IconAlert c={errC}/> {errors.endDate}</div>}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={{
              padding: '16px 24px 22px',
              borderTop: `1px solid ${divC}`,
              display:'flex', justifyContent:'flex-end', gap:10,
            }}>
              <button type="button" className="pf-cancel-btn" onClick={onClose} disabled={loading}>
                Cancel
              </button>
              <button type="submit" className="pf-submit-btn" disabled={loading}>
                {loading ? <><span className="pf-spin"/> Saving…</> : (project ? 'Save Changes' : 'Create Project')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
