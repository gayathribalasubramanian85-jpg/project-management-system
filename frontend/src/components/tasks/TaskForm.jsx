import { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext.jsx';

const STATUSES   = ['PENDING','IN_PROGRESS','COMPLETED'];
const PRIORITIES = ['LOW','MEDIUM','HIGH'];
const S_LABELS   = { PENDING:'Pending', IN_PROGRESS:'In Progress', COMPLETED:'Completed' };
const EMPTY = { name:'', description:'', priority:'MEDIUM', status:'PENDING', dueDate:'' };

/* ── Icons ── */
const IconX = ({ c }) => (
  <svg viewBox="0 0 24 24" fill="none" width="18" height="18" stroke={c} strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const IconTask = ({ c }) => (
  <svg viewBox="0 0 24 24" fill="none" width="20" height="20" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
  </svg>
);
const IconAlert = ({ c }) => (
  <svg viewBox="0 0 24 24" fill="none" width="14" height="14" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}>
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

export default function TaskForm({ show, task, projectId, onSubmit, onClose, loading = false }) {
  const { isDark } = useTheme();
  const [form, setForm]     = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [focused, setFocused] = useState('');

  useEffect(() => {
    if (task) {
      setForm({
        name:        task.name        || '',
        description: task.description || '',
        priority:    task.priority    || 'MEDIUM',
        status:      task.status      || 'PENDING',
        dueDate:     task.dueDate     ? task.dueDate.slice(0,10) : '',
      });
    } else {
      setForm(EMPTY);
    }
    setErrors({}); setFocused('');
  }, [task, show]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Task name is required.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));
  const handleSubmit = e => { e.preventDefault(); if (validate()) onSubmit({ ...form, projectId }); };

  if (!show) return null;

  /* Theme tokens */
  const overlay  = isDark ? 'rgba(0,0,0,0.75)'         : 'rgba(15,15,26,0.55)';
  const modalBg  = isDark ? '#13132a'                   : '#ffffff';
  const modalBdr = isDark ? 'rgba(99,102,241,0.25)'     : 'rgba(99,102,241,0.15)';
  const hdgC     = isDark ? '#ffffff'                   : '#1e1b4b';
  const lblC     = isDark ? 'rgba(255,255,255,.65)'     : '#374151';
  const inputBg  = isDark ? 'rgba(255,255,255,.05)'     : '#f9fafb';
  const inputBdr = isDark ? 'rgba(255,255,255,.08)'     : '#e5e7eb';
  const inputC   = isDark ? '#ffffff'                   : '#111827';
  const inputPH  = isDark ? 'rgba(255,255,255,.2)'      : '#9ca3af';
  const focusBg  = isDark ? 'rgba(99,102,241,.08)'      : '#eef2ff';
  const errC     = isDark ? '#f87171'                   : '#dc2626';
  const divC     = isDark ? 'rgba(255,255,255,.07)'     : 'rgba(99,102,241,.08)';
  const cancelBg = isDark ? 'rgba(255,255,255,.07)'     : 'rgba(0,0,0,.05)';
  const cancelBdr= isDark ? 'rgba(255,255,255,.1)'      : '#e5e7eb';
  const cancelC  = isDark ? 'rgba(255,255,255,.7)'      : '#6b7280';
  const optBg    = isDark ? '#1a1a35'                   : '#ffffff';

  const focBdr = f => focused === f ? '#6366f1' : inputBdr;

  return (
    <>
      <style>{`
        .tf-overlay{position:fixed;inset:0;background:${overlay};z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px;animation:tf-bg-in .25s ease;}
        @keyframes tf-bg-in{from{opacity:0}to{opacity:1}}
        .tf-modal{
          width:100%;max-width:500px;
          background:${modalBg};border:1px solid ${modalBdr};
          border-radius:22px;
          box-shadow:${isDark?'0 30px 80px rgba(0,0,0,.7)':'0 30px 80px rgba(99,102,241,.2)'};
          animation:tf-modal-in .35s cubic-bezier(.16,1,.3,1) both;
          position:relative;overflow:hidden;
        }
        @keyframes tf-modal-in{from{opacity:0;transform:translateY(22px) scale(.96)}to{opacity:1;transform:none}}
        .tf-modal::before{content:'';position:absolute;top:0;left:-100%;width:60%;height:2px;background:linear-gradient(90deg,transparent,rgba(99,102,241,.8),transparent);animation:tf-shim-line 3s ease-in-out infinite 1s;}
        @keyframes tf-shim-line{0%{left:-60%}100%{left:160%}}
        .tf-label{display:block;color:${lblC};font-size:.75rem;font-weight:700;letter-spacing:.5px;text-transform:uppercase;margin-bottom:7px;}
        .tf-input{width:100%;background:${inputBg};border:1.5px solid ${inputBdr};border-radius:11px;padding:11px 14px;color:${inputC};font-size:.9rem;outline:none;transition:border-color .2s,box-shadow .2s,background .3s;box-sizing:border-box;font-family:inherit;}
        .tf-input::placeholder{color:${inputPH};}
        .tf-input:focus{border-color:#6366f1;background:${focusBg};box-shadow:0 0 0 3px rgba(99,102,241,.15);}
        .tf-input.err{border-color:${errC};}
        .tf-select{appearance:none;-webkit-appearance:none;cursor:pointer;}
        .tf-select option{background:${optBg};color:${inputC};}
        .tf-err{color:${errC};font-size:.78rem;margin-top:5px;display:flex;align-items:center;gap:5px;animation:tf-shake .3s ease;}
        @keyframes tf-shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-4px)}75%{transform:translateX(4px)}}
        .tf-cancel{display:inline-flex;align-items:center;gap:6px;background:${cancelBg};border:1px solid ${cancelBdr};border-radius:11px;padding:10px 20px;color:${cancelC};font-size:.88rem;font-weight:600;cursor:pointer;transition:all .2s;}
        .tf-cancel:hover{opacity:.8;}
        .tf-submit{display:inline-flex;align-items:center;gap:6px;background:linear-gradient(135deg,#6366f1,#8b5cf6);border:none;border-radius:11px;padding:10px 22px;color:#fff;font-size:.88rem;font-weight:700;cursor:pointer;box-shadow:0 4px 16px rgba(99,102,241,.4);transition:all .2s;position:relative;overflow:hidden;}
        .tf-submit::after{content:'';position:absolute;inset:0;background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,.15) 50%,transparent 60%);transform:translateX(-100%);transition:transform .4s;}
        .tf-submit:hover{transform:translateY(-1px);box-shadow:0 6px 22px rgba(99,102,241,.55);}
        .tf-submit:hover::after{transform:translateX(100%);}
        .tf-submit:disabled{opacity:.55;cursor:not-allowed;}
        .tf-spin{display:inline-block;width:14px;height:14px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:tf-spin .65s linear infinite;flex-shrink:0;}
        @keyframes tf-spin{to{transform:rotate(360deg)}}
      `}</style>

      <div className="tf-overlay" onClick={e => { if(e.target===e.currentTarget) onClose(); }}>
        <div className="tf-modal">
          {/* Header */}
          <div style={{ padding:'22px 24px 18px', borderBottom:`1px solid ${divC}`, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:36,height:36,background:'linear-gradient(135deg,#6366f1,#a855f7)',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 0 12px rgba(99,102,241,.4)' }}>
                <IconTask c="#fff"/>
              </div>
              <h5 style={{ color:hdgC,fontWeight:800,margin:0,fontSize:'1.05rem' }}>
                {task ? 'Edit Task' : 'New Task'}
              </h5>
            </div>
            <button onClick={onClose} style={{ background:isDark?'rgba(255,255,255,.07)':'rgba(0,0,0,.05)',border:'none',borderRadius:8,padding:6,cursor:'pointer',display:'flex',transition:'background .2s' }} aria-label="Close">
              <IconX c={isDark?'rgba(255,255,255,0.6)':'#6b7280'}/>
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} noValidate>
            <div style={{ padding:'20px 24px', display:'flex', flexDirection:'column', gap:15 }}>
              {/* Name */}
              <div>
                <label className="tf-label" htmlFor="tf-name">Task Name *</label>
                <input id="tf-name" name="name"
                  className={`tf-input${errors.name?' err':''}`}
                  value={form.name} onChange={handleChange}
                  onFocus={()=>setFocused('name')} onBlur={()=>setFocused('')}
                  placeholder="Enter task name" maxLength={150}
                  style={{ borderColor: errors.name ? errC : focBdr('name') }}
                />
                {errors.name && <div className="tf-err"><IconAlert c={errC}/> {errors.name}</div>}
              </div>

              {/* Description */}
              <div>
                <label className="tf-label" htmlFor="tf-desc">Description</label>
                <textarea id="tf-desc" name="description" rows={2}
                  className="tf-input"
                  value={form.description} onChange={handleChange}
                  onFocus={()=>setFocused('desc')} onBlur={()=>setFocused('')}
                  placeholder="Optional description…"
                  style={{ resize:'vertical', borderColor:focBdr('desc') }}
                />
              </div>

              {/* Priority + Status row */}
              <div style={{ display:'flex', gap:12 }}>
                <div style={{ flex:1 }}>
                  <label className="tf-label" htmlFor="tf-priority">Priority</label>
                  <select id="tf-priority" name="priority" className="tf-input tf-select"
                    value={form.priority} onChange={handleChange}
                    style={{ borderColor:focBdr('priority') }}
                    onFocus={()=>setFocused('priority')} onBlur={()=>setFocused('')}>
                    {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div style={{ flex:1 }}>
                  <label className="tf-label" htmlFor="tf-status">Status</label>
                  <select id="tf-status" name="status" className="tf-input tf-select"
                    value={form.status} onChange={handleChange}
                    style={{ borderColor:focBdr('status') }}
                    onFocus={()=>setFocused('status')} onBlur={()=>setFocused('')}>
                    {STATUSES.map(s => <option key={s} value={s}>{S_LABELS[s]}</option>)}
                  </select>
                </div>
              </div>

              {/* Due date */}
              <div>
                <label className="tf-label" htmlFor="tf-due">Due Date</label>
                <input id="tf-due" type="date" name="dueDate"
                  className="tf-input"
                  value={form.dueDate} onChange={handleChange}
                  onFocus={()=>setFocused('due')} onBlur={()=>setFocused('')}
                  style={{ borderColor:focBdr('due') }}
                />
              </div>
            </div>

            {/* Footer */}
            <div style={{ padding:'16px 24px 22px', borderTop:`1px solid ${divC}`, display:'flex', justifyContent:'flex-end', gap:10 }}>
              <button type="button" className="tf-cancel" onClick={onClose} disabled={loading}>Cancel</button>
              <button type="submit" className="tf-submit" disabled={loading}>
                {loading ? <><span className="tf-spin"/> Saving…</> : (task ? 'Save Changes' : 'Create Task')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
