import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext.jsx';
import { toast } from '../components/common/Toast.jsx';
import { getTaskById, createTask, updateTask } from '../services/taskService.js';
import { getProjectById } from '../services/projectService.js';
import { slugToId } from '../utils/slugify.js';

const STATUSES   = ['PENDING', 'IN_PROGRESS', 'COMPLETED'];
const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH'];
const S_LABELS   = { PENDING: 'Pending', IN_PROGRESS: 'In Progress', COMPLETED: 'Completed' };
const P_LABELS   = { LOW: 'Low', MEDIUM: 'Medium', HIGH: 'High' };

const PRIORITY_CFG = {
  LOW:    { dot: '#38bdf8', bg: 'rgba(14,165,233,.12)',  bdr: 'rgba(14,165,233,.3)',  hov: 'rgba(14,165,233,.07)'  },
  MEDIUM: { dot: '#f59e0b', bg: 'rgba(245,158,11,.12)',  bdr: 'rgba(245,158,11,.3)',  hov: 'rgba(245,158,11,.07)'  },
  HIGH:   { dot: '#f43f5e', bg: 'rgba(244,63,94,.12)',   bdr: 'rgba(244,63,94,.3)',   hov: 'rgba(244,63,94,.07)'   },
};
const STATUS_CFG = {
  PENDING:     { dot: '#94a3b8', bg: 'rgba(100,116,139,.12)', bdr: 'rgba(100,116,139,.3)', hov: 'rgba(100,116,139,.07)' },
  IN_PROGRESS: { dot: '#f59e0b', bg: 'rgba(245,158,11,.12)',  bdr: 'rgba(245,158,11,.3)',  hov: 'rgba(245,158,11,.07)'  },
  COMPLETED:   { dot: '#10b981', bg: 'rgba(16,185,129,.12)',  bdr: 'rgba(16,185,129,.3)',  hov: 'rgba(16,185,129,.07)'  },
};

const EMPTY = { name: '', description: '', priority: '', status: '', dueDate: '' };

/* ── Icons ── */
const IconTask      = ({ c }) => <svg viewBox="0 0 24 24" fill="none" width="22" height="22" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>;
const IconChevron   = ({ c }) => <svg viewBox="0 0 24 24" fill="none" width="14" height="14" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>;
const IconChevronD  = ({ c }) => <svg viewBox="0 0 24 24" fill="none" width="15" height="15" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>;
const IconAlert     = ({ c }) => <svg viewBox="0 0 24 24" fill="none" width="14" height="14" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink:0 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;
const IconSave      = ({ c }) => <svg viewBox="0 0 24 24" fill="none" width="17" height="17" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>;
const IconArrowLeft = ({ c }) => <svg viewBox="0 0 24 24" fill="none" width="16" height="16" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>;
const IconCheck     = ({ c }) => <svg viewBox="0 0 24 24" fill="none" width="14" height="14" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;

/* ── Reusable custom dropdown ── */
function CustomDropdown({ label, required, value, options, labels, cfg, placeholder, onChange, error, inputBg, inputBdr, inputC, inputPH, focusBg, cardBg, metaC, errC, isDark }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const selected = value ? cfg[value] : null;

  return (
    <div>
      <label style={{ display:'block', color: isDark ? 'rgba(255,255,255,0.65)' : '#374151', fontSize:'.75rem', fontWeight:700, letterSpacing:'.5px', textTransform:'uppercase', marginBottom:8 }}>
        {label} {required && <span style={{ color: errC }}>*</span>}
      </label>
      <div ref={ref} style={{ position:'relative' }}>
        {/* Trigger */}
        <div
          onClick={() => setOpen(o => !o)}
          style={{
            display:'flex', alignItems:'center', justifyContent:'space-between',
            background: open ? focusBg : inputBg,
            border: `1.5px solid ${error ? errC : open ? '#6366f1' : inputBdr}`,
            borderRadius: open ? '12px 12px 0 0' : 12,
            padding:'13px 16px', cursor:'pointer',
            boxShadow: open ? '0 0 0 3.5px rgba(99,102,241,.18)' : error ? '0 0 0 3px rgba(248,113,113,.15)' : 'none',
            transition:'all .2s', userSelect:'none',
          }}
        >
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            {selected ? (
              <>
                <span style={{ width:9, height:9, borderRadius:'50%', flexShrink:0, background:selected.dot, boxShadow:`0 0 6px ${selected.dot}` }}/>
                <span style={{ color:inputC, fontSize:'.93rem', fontWeight:600 }}>{labels[value]}</span>
              </>
            ) : (
              <span style={{ color:inputPH, fontSize:'.93rem' }}>{placeholder}</span>
            )}
          </div>
          <div style={{ transition:'transform .2s', transform: open ? 'rotate(180deg)' : 'none' }}>
            <IconChevronD c={metaC}/>
          </div>
        </div>

        {/* Panel */}
        {open && (
          <div style={{
            position:'absolute', left:0, right:0, zIndex:100,
            background:cardBg,
            border:`1.5px solid #6366f1`, borderTop:'none',
            borderRadius:'0 0 12px 12px',
            boxShadow: isDark ? '0 8px 24px rgba(0,0,0,.5)' : '0 8px 24px rgba(99,102,241,.18)',
            overflow:'hidden',
          }}>
            {options.map((opt, idx) => {
              const c = cfg[opt];
              const isSelected = value === opt;
              return (
                <div
                  key={opt}
                  onClick={() => { onChange(opt); setOpen(false); }}
                  style={{
                    display:'flex', alignItems:'center', gap:10,
                    padding:'11px 16px', cursor:'pointer',
                    background: isSelected ? (isDark ? 'rgba(99,102,241,.18)' : 'rgba(99,102,241,.07)') : 'transparent',
                    borderBottom: idx < options.length - 1 ? `1px solid ${isDark ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,.05)'}` : 'none',
                    transition:'background .15s',
                  }}
                  onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = c.hov; }}
                  onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}
                >
                  <span style={{ width:9, height:9, borderRadius:'50%', flexShrink:0, background:c.dot, boxShadow: isSelected ? `0 0 6px ${c.dot}` : 'none' }}/>
                  <span style={{ fontSize:'.9rem', fontWeight: isSelected ? 700 : 500, color: isSelected ? (isDark ? '#ffffff' : '#1e1b4b') : (isDark ? 'rgba(255,255,255,.7)' : '#374151') }}>
                    {labels[opt]}
                  </span>
                  {isSelected && <div style={{ marginLeft:'auto' }}><IconCheck c="#6366f1"/></div>}
                </div>
              );
            })}
          </div>
        )}
      </div>
      {error && (
        <div style={{ color:errC, fontSize:'.8rem', marginTop:6, display:'flex', alignItems:'center', gap:5 }}>
          <IconAlert c={errC}/> {error}
        </div>
      )}
    </div>
  );
}

export default function TaskFormPage() {
  const { projectSlug, taskId } = useParams();
  const projectId = slugToId(projectSlug);
  const isEdit   = !!taskId;
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const [form, setForm]               = useState(EMPTY);
  const [createdAt, setCreatedAt]     = useState('');
  const [errors, setErrors]           = useState({});
  const [loading, setLoading]         = useState(false);
  const [fetching, setFetching]       = useState(isEdit);
  const [projectName, setProjectName] = useState('');
  const [focused, setFocused]         = useState('');

  useEffect(() => {
    getProjectById(Number(projectId)).then(p => setProjectName(p.name)).catch(() => {});
    if (!isEdit) return;
    (async () => {
      setFetching(true);
      try {
        const t = await getTaskById(Number(taskId));
        setCreatedAt(t.createdAt || '');
        setForm({
          name:        t.name        || '',
          description: t.description || '',
          priority:    t.priority    || '',
          status:      t.status      || '',
          dueDate:     t.dueDate     ? t.dueDate.slice(0, 10) : '',
        });
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to load task.');
        navigate(`/projects/${projectSlug}`, { replace: true });
      } finally {
        setFetching(false);
      }
    })();
  }, [projectId, taskId, isEdit]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name     = 'Task name is required.';
    if (!form.priority)    e.priority = 'Please select a priority.';
    if (!form.status)      e.status   = 'Please select a status.';
    if (!form.dueDate)     e.dueDate  = 'Due date is required.';
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
        await updateTask(Number(taskId), form);
        toast.success('Task updated successfully.');
      } else {
        await createTask({ ...form, projectId: Number(projectId) });
        toast.success('Task created successfully.');
      }
      navigate(`/projects/${projectSlug}`, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save task.');
    } finally {
      setLoading(false);
    }
  };

  /* ── Theme tokens ── */
  const headingC = isDark ? '#ffffff'                : '#1e1b4b';
  const subC     = isDark ? 'rgba(255,255,255,0.45)' : '#6b7280';
  const cardBg   = isDark ? '#1a1a35'                : '#ffffff';
  const cardBdr  = isDark ? 'rgba(99,102,241,0.2)'   : 'rgba(99,102,241,0.12)';
  const inputBg  = isDark ? 'rgba(255,255,255,0.05)' : '#f9fafb';
  const inputBdr = isDark ? 'rgba(255,255,255,0.08)' : '#e5e7eb';
  const inputC   = isDark ? '#ffffff'                : '#111827';
  const inputPH  = isDark ? 'rgba(255,255,255,0.2)'  : '#9ca3af';
  const focusBg  = isDark ? 'rgba(99,102,241,0.08)'  : '#eef2ff';
  const errC     = isDark ? '#f87171'                : '#dc2626';
  const divC     = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(99,102,241,0.08)';
  const metaC    = isDark ? 'rgba(255,255,255,0.35)' : '#9ca3af';
  const cancelBg = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.04)';
  const cancelBdr= isDark ? 'rgba(255,255,255,0.1)'  : '#e5e7eb';
  const cancelC  = isDark ? 'rgba(255,255,255,0.7)'  : '#6b7280';
  const lblC     = isDark ? 'rgba(255,255,255,0.65)' : '#374151';

  const focBdr = f => focused === f ? '#6366f1' : inputBdr;

  const dropdownProps = { inputBg, inputBdr, inputC, inputPH, focusBg, cardBg, metaC, errC, isDark };

  if (fetching) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:'80px 0', flexDirection:'column', gap:14 }}>
      <svg viewBox="0 0 48 48" width="48" height="48">
        <circle cx="24" cy="24" r="20" fill="none" stroke={isDark?'rgba(99,102,241,.15)':'rgba(99,102,241,.1)'} strokeWidth="4"/>
        <circle cx="24" cy="24" r="20" fill="none" stroke="url(#tf-grad)" strokeWidth="4" strokeLinecap="round" strokeDasharray="32 94" transform="rotate(-90 24 24)" style={{ animation:'tfp-spin .75s linear infinite' }}/>
        <defs><linearGradient id="tf-grad"><stop offset="0%" stopColor="#6366f1"/><stop offset="100%" stopColor="#a855f7"/></linearGradient></defs>
      </svg>
      <span style={{ color:subC, fontSize:'.875rem' }}>Loading task…</span>
    </div>
  );

  return (
    <>
      <style>{`
        @keyframes tfp-spin    { to { transform: rotate(360deg); } }
        @keyframes tfp-fadein  { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }
        @keyframes tfp-card-in { from{opacity:0;transform:translateY(20px) scale(.97)} to{opacity:1;transform:none} }
        @keyframes db-icon-pulse { 0%,100%{box-shadow:0 0 8px rgba(99,102,241,.3)} 50%{box-shadow:0 0 20px rgba(99,102,241,.6)} }
        @keyframes tfp-shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-4px)} 75%{transform:translateX(4px)} }
        @keyframes tfp-shimmer-bar { 0%{background-position:0% 0%} 100%{background-position:200% 0%} }
        .tfp-input {
          width:100%; background:${inputBg}; border:1.5px solid ${inputBdr};
          border-radius:12px; padding:13px 16px; color:${inputC}; font-size:.93rem; outline:none;
          transition:border-color .2s, box-shadow .2s, background .3s, transform .15s;
          box-sizing:border-box; font-family:inherit;
        }
        .tfp-input::placeholder { color:${inputPH}; }
        .tfp-input:focus { border-color:#6366f1; background:${focusBg}; box-shadow:0 0 0 3.5px rgba(99,102,241,.18); transform:translateY(-1px); }
        .tfp-input.err { border-color:${errC}; box-shadow:0 0 0 3px rgba(248,113,113,.15); }
        .tfp-label { display:block; color:${lblC}; font-size:.75rem; font-weight:700; letter-spacing:.5px; text-transform:uppercase; margin-bottom:8px; }
        .tfp-err { color:${errC}; font-size:.8rem; margin-top:6px; display:flex; align-items:center; gap:5px; animation:tfp-shake .35s ease; }
        .tfp-cancel { display:inline-flex; align-items:center; gap:7px; background:${cancelBg}; border:1px solid ${cancelBdr}; border-radius:12px; padding:12px 22px; color:${cancelC}; font-size:.9rem; font-weight:600; cursor:pointer; text-decoration:none; transition:all .2s; }
        .tfp-cancel:hover { opacity:.8; color:${cancelC}; }
        .tfp-submit { display:inline-flex; align-items:center; gap:8px; background:linear-gradient(135deg,#6366f1,#8b5cf6); border:none; border-radius:12px; color:#fff; font-size:.9rem; font-weight:700; padding:12px 28px; cursor:pointer; box-shadow:0 5px 20px rgba(99,102,241,.4); transition:transform .2s, box-shadow .2s, opacity .2s; position:relative; overflow:hidden; }
        .tfp-submit::after { content:''; position:absolute; inset:0; background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,.15) 50%,transparent 60%); transform:translateX(-100%); transition:transform .45s; }
        .tfp-submit:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 8px 28px rgba(99,102,241,.55); }
        .tfp-submit:hover:not(:disabled)::after { transform:translateX(100%); }
        .tfp-submit:disabled { opacity:.55; cursor:not-allowed; }
        .tfp-spin { display:inline-block; width:16px; height:16px; flex-shrink:0; border:2.5px solid rgba(255,255,255,.3); border-top-color:#fff; border-radius:50%; animation:tfp-spin .65s linear infinite; }
        .tfp-bc-link { color:${isDark?'#818cf8':'#6366f1'}; text-decoration:none; font-size:.85rem; font-weight:600; }
        .tfp-bc-link:hover { text-decoration:underline; }
        input[type="date"]::-webkit-calendar-picker-indicator { filter:${isDark?'invert(1) opacity(.4)':'opacity(.5)'}; cursor:pointer; }
        @media (max-width: 600px) { .tfp-grid-2 { grid-template-columns: 1fr !important; } }
      `}</style>

      {/* ── Breadcrumb ── */}
      <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:24, animation:'tfp-fadein .4s ease both' }}>
        <Link to="/projects" className="tfp-bc-link">Projects</Link>
        <IconChevron c={metaC}/>
        <Link to={`/projects/${projectSlug}`} className="tfp-bc-link">{projectName || `Project #${projectId}`}</Link>
        <IconChevron c={metaC}/>
        <span style={{ color:headingC, fontSize:'.85rem', fontWeight:600 }}>{isEdit ? 'Edit Task' : 'New Task'}</span>
      </div>

      {/* ── Page header ── */}
      <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:28, maxWidth:980, animation:'tfp-fadein .45s ease both .05s', opacity:0 }}>
        <div style={{ width:52, height:52, background:'linear-gradient(135deg,#6366f1,#a855f7)', borderRadius:15, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 0 18px rgba(99,102,241,.45)', animation:'db-icon-pulse 3s ease-in-out infinite', flexShrink:0 }}>
          <IconTask c="#fff"/>
        </div>
        <div>
          <h4 style={{ color:headingC, fontWeight:800, fontSize:'1.45rem', margin:0, letterSpacing:'-.3px' }}>{isEdit ? 'Edit Task' : 'Create New Task'}</h4>
          <p style={{ color:subC, margin:0, fontSize:'.875rem' }}>{isEdit ? 'Update your task details below.' : 'Fill in the details to add a new task.'}</p>
        </div>
      </div>

      {/* ── Form card ── */}
      <div style={{ width:'100%', maxWidth:980, background:cardBg, border:`1px solid ${cardBdr}`, borderRadius:22, overflow:'hidden', boxShadow:isDark?'0 8px 40px rgba(0,0,0,.45)':'0 8px 40px rgba(99,102,241,.12)', animation:'tfp-card-in .55s cubic-bezier(.16,1,.3,1) both .1s', opacity:0, position:'relative' }}>
        <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:'linear-gradient(90deg,#6366f1,#a855f7,#6366f1)', backgroundSize:'200% 100%', animation:'tfp-shimmer-bar 3s linear infinite' }}/>

        <form onSubmit={handleSubmit} noValidate>
          <div style={{ padding:'32px 36px 24px' }}>

            {/* Row 1: Task Name | Status */}
            <div className="tfp-grid-2" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px 28px', marginBottom:22 }}>
              <div>
                <label className="tfp-label" htmlFor="tfp-name">Task Name <span style={{ color:errC }}>*</span></label>
                <input
                  id="tfp-name" name="name"
                  className={`tfp-input${errors.name ? ' err' : ''}`}
                  value={form.name} onChange={handleChange}
                  onFocus={() => setFocused('name')} onBlur={() => setFocused('')}
                  placeholder="e.g. Design landing page wireframes"
                  maxLength={150}
                  style={{ borderColor: errors.name ? errC : focBdr('name') }}
                  autoFocus
                />
                {errors.name && <div className="tfp-err"><IconAlert c={errC}/> {errors.name}</div>}
              </div>

              <CustomDropdown
                label="Status" required
                value={form.status}
                options={STATUSES} labels={S_LABELS} cfg={STATUS_CFG}
                placeholder="Select status…"
                onChange={v => { setForm(p => ({ ...p, status: v })); setErrors(p => ({ ...p, status: '' })); }}
                error={errors.status}
                {...dropdownProps}
              />
            </div>

            {/* Row 2: Priority | Due Date */}
            <div className="tfp-grid-2" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px 28px', marginBottom:22 }}>
              <CustomDropdown
                label="Priority" required
                value={form.priority}
                options={PRIORITIES} labels={P_LABELS} cfg={PRIORITY_CFG}
                placeholder="Select priority…"
                onChange={v => { setForm(p => ({ ...p, priority: v })); setErrors(p => ({ ...p, priority: '' })); }}
                error={errors.priority}
                {...dropdownProps}
              />

              <div>
                <label className="tfp-label" htmlFor="tfp-due">Due Date <span style={{ color:errC }}>*</span></label>
                <input
                  id="tfp-due" type="date" name="dueDate"
                  className={`tfp-input${errors.dueDate ? ' err' : ''}`}
                  value={form.dueDate} onChange={handleChange}
                  onFocus={() => setFocused('due')} onBlur={() => setFocused('')}
                  style={{ borderColor: errors.dueDate ? errC : focBdr('due') }}
                />
                {errors.dueDate && <div className="tfp-err"><IconAlert c={errC}/> {errors.dueDate}</div>}
              </div>
            </div>

            {/* Row 3: Description (full width) */}
            <div style={{ marginBottom: 22 }}>
              <label className="tfp-label" htmlFor="tfp-desc">Description</label>
              <textarea
                id="tfp-desc" name="description"
                className="tfp-input"
                rows={4}
                value={form.description} onChange={handleChange}
                onFocus={() => setFocused('desc')} onBlur={() => setFocused('')}
                placeholder="Describe the task, acceptance criteria, notes…"
                style={{ resize:'vertical', borderColor: focBdr('desc') }}
              />
            </div>

            {/* Row 4: Created Date (read-only, edit only) */}
            {isEdit && createdAt && (
              <div className="tfp-grid-2" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px 28px' }}>
                <div>
                  <label className="tfp-label">Created Date</label>
                  <div style={{ display:'flex', alignItems:'center', gap:10, background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)', border:`1.5px solid ${inputBdr}`, borderRadius:12, padding:'13px 16px' }}>
                    <svg viewBox="0 0 24 24" fill="none" width="16" height="16" stroke={metaC} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink:0 }}>
                      <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    <span style={{ color: isDark ? 'rgba(255,255,255,0.55)' : '#6b7280', fontSize:'.88rem' }}>
                      {new Date(createdAt).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' })}
                    </span>
                    <span style={{ marginLeft:'auto', fontSize:'.7rem', fontWeight:700, letterSpacing:'.4px', textTransform:'uppercase', color:metaC, background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)', borderRadius:6, padding:'2px 8px' }}>Auto</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── Footer ── */}
          <div style={{ padding:'20px 36px 28px', borderTop:`1px solid ${divC}`, display:'flex', justifyContent:'flex-end', alignItems:'center', gap:12 }}>
            <Link to={`/projects/${projectSlug}`} className="tfp-cancel">
              <IconArrowLeft c={cancelC}/> Cancel
            </Link>
            <button type="submit" className="tfp-submit" disabled={loading}>
              {loading ? <><span className="tfp-spin"/> Saving…</> : <><IconSave c="#fff"/> {isEdit ? 'Save Changes' : 'Create Task'}</>}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
