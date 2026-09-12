import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProjectById, deleteProject } from '../services/projectService.js';
import { updateTask, deleteTask } from '../services/taskService.js';
import { useTasks } from '../hooks/useTasks.js';
import { useTheme } from '../context/ThemeContext.jsx';
import { toast } from '../components/common/Toast.jsx';
import TaskItem from '../components/tasks/TaskItem.jsx';
import TaskFilters from '../components/tasks/TaskFilters.jsx';
import { formatDate } from '../utils/formatDate.js';
import { slugify, slugToId } from '../utils/slugify.js';

/* ── Status config ── */
const STATUS_CFG = {
  NOT_STARTED: { label:'Not Started', dot:'#94a3b8', grad:'linear-gradient(135deg,#64748b,#475569)' },
  IN_PROGRESS: { label:'In Progress', dot:'#fbbf24', grad:'linear-gradient(135deg,#f59e0b,#d97706)' },
  COMPLETED:   { label:'Completed',   dot:'#34d399', grad:'linear-gradient(135deg,#10b981,#059669)' },
};

/* ── Icons ── */
const IconFolder   = ({ c }) => <svg viewBox="0 0 24 24" fill="none" width="18" height="18" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>;
const IconChevron  = ({ c }) => <svg viewBox="0 0 24 24" fill="none" width="14" height="14" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>;
const IconCalendar = ({ c }) => <svg viewBox="0 0 24 24" fill="none" width="14" height="14" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const IconEdit     = ({ c }) => <svg viewBox="0 0 24 24" fill="none" width="14" height="14" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const IconTrash    = ({ c }) => <svg viewBox="0 0 24 24" fill="none" width="14" height="14" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>;
const IconPlus     = ({ c }) => <svg viewBox="0 0 24 24" fill="none" width="16" height="16" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const IconTask     = ({ c }) => <svg viewBox="0 0 24 24" fill="none" width="18" height="18" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>;

/* ── Custom delete modal ── */
function ConfirmModal({ show, title, message, onConfirm, onCancel, loading, isDark }) {
  if (!show) return null;
  const bg  = isDark ? '#13132a' : '#ffffff';
  const bdr = isDark ? 'rgba(99,102,241,0.25)' : 'rgba(99,102,241,0.15)';
  const hdg = isDark ? '#ffffff' : '#1e1b4b';
  const sub = isDark ? 'rgba(255,255,255,0.5)' : '#6b7280';
  const ovr = isDark ? 'rgba(0,0,0,0.75)' : 'rgba(15,15,26,0.55)';

  return (
    <div style={{ position:'fixed',inset:0,background:ovr,zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center',padding:20,animation:'pd-bg-in .25s ease' }}>
      <div style={{ width:'100%',maxWidth:400,background:bg,border:`1px solid ${bdr}`,borderRadius:20,boxShadow:isDark?'0 30px 80px rgba(0,0,0,.7)':'0 30px 80px rgba(99,102,241,.2)',animation:'pd-modal-in .35s cubic-bezier(.16,1,.3,1) both',overflow:'hidden' }}>
        <div style={{ padding:'28px 24px 20px',textAlign:'center' }}>
          <div style={{ width:52,height:52,background:'rgba(244,63,94,.12)',border:'1px solid rgba(244,63,94,.25)',borderRadius:14,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 14px' }}>
            <svg viewBox="0 0 24 24" fill="none" width="24" height="24" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
          </div>
          <h5 style={{ color:hdg,fontWeight:800,margin:'0 0 8px',fontSize:'1rem' }}>{title}</h5>
          <p style={{ color:sub,margin:0,fontSize:'.875rem',lineHeight:1.5 }} dangerouslySetInnerHTML={{ __html: message }} />
        </div>
        <div style={{ display:'flex',gap:10,padding:'0 24px 24px' }}>
          <button onClick={onCancel} disabled={loading} style={{ flex:1,padding:'10px',background:isDark?'rgba(255,255,255,.07)':'rgba(0,0,0,.05)',border:`1px solid ${isDark?'rgba(255,255,255,.1)':'#e5e7eb'}`,borderRadius:11,color:isDark?'rgba(255,255,255,.7)':'#6b7280',fontWeight:600,fontSize:'.88rem',cursor:'pointer' }}>Cancel</button>
          <button onClick={onConfirm} disabled={loading} style={{ flex:1,padding:'10px',background:'linear-gradient(135deg,#f43f5e,#e11d48)',border:'none',borderRadius:11,color:'#fff',fontWeight:700,fontSize:'.88rem',cursor:'pointer',boxShadow:'0 4px 16px rgba(244,63,94,.4)',opacity:loading?.6:1 }}>
            {loading ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Spinner ── */
function Spinner({ isDark }) {
  const sub = isDark ? 'rgba(255,255,255,0.4)' : '#9ca3af';
  return (
    <div style={{ display:'flex',flexDirection:'column',alignItems:'center',padding:'70px 0',gap:14 }}>
      <svg viewBox="0 0 48 48" width="48" height="48">
        <circle cx="24" cy="24" r="20" fill="none" stroke={isDark?'rgba(99,102,241,.15)':'rgba(99,102,241,.1)'} strokeWidth="4"/>
        <circle cx="24" cy="24" r="20" fill="none" stroke="url(#pd-grad)" strokeWidth="4" strokeLinecap="round" strokeDasharray="32 94" transform="rotate(-90 24 24)" style={{ animation:'pd-spin .75s linear infinite' }}/>
        <defs><linearGradient id="pd-grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#6366f1"/><stop offset="100%" stopColor="#a855f7"/></linearGradient></defs>
      </svg>
      <span style={{ color:sub,fontSize:'.875rem' }}>Loading…</span>
    </div>
  );
}

/* ─────────────── Main page ─────────────────────────────────────────────── */
export default function ProjectDetailPage() {
  const { slug }  = useParams();
  const navigate  = useNavigate();
  const { isDark } = useTheme();
  const projectId = slugToId(slug);

  const [project, setProject]             = useState(null);
  const [projLoading, setProjLoading]     = useState(true);
  const [showDelProj, setShowDelProj]     = useState(false);
  const [delProjLoading, setDelProjLoading] = useState(false);

  const [taskSearch, setTaskSearch]     = useState('');
  const [taskStatus, setTaskStatus]     = useState('');
  const [taskPriority, setTaskPriority] = useState('');
  const { tasks, loading:tasksLoading, error:tasksFetchErr, refetch:refetchTasks } = useTasks({ projectId, search:taskSearch, status:taskStatus, priority:taskPriority });

  const [taskPage, setTaskPage] = useState(1);
  const TASK_PAGE_SIZE = 5;

  /* Reset to page 1 when filters change */
  const handleTaskSearch   = v => { setTaskSearch(v);   setTaskPage(1); };
  const handleTaskStatus   = v => { setTaskStatus(v);   setTaskPage(1); };
  const handleTaskPriority = v => { setTaskPriority(v); setTaskPage(1); };

  /* Pagination math */
  const taskTotalPages = Math.max(1, Math.ceil(tasks.length / TASK_PAGE_SIZE));
  const taskSafePage   = Math.min(taskPage, taskTotalPages);
  const taskStart      = (taskSafePage - 1) * TASK_PAGE_SIZE;
  const paginatedTasks = tasks.slice(taskStart, taskStart + TASK_PAGE_SIZE);

  const taskPageNumbers = () => {
    if (taskTotalPages <= 7) return Array.from({ length: taskTotalPages }, (_, i) => i + 1);
    const pages = [];
    pages.push(1);
    if (taskSafePage > 3) pages.push('…');
    for (let i = Math.max(2, taskSafePage - 1); i <= Math.min(taskTotalPages - 1, taskSafePage + 1); i++) pages.push(i);
    if (taskSafePage < taskTotalPages - 2) pages.push('…');
    pages.push(taskTotalPages);
    return pages;
  };

  const [deletingTask, setDeletingTask]     = useState(null);
  const [delTaskLoading, setDelTaskLoading] = useState(false);

  /* ── Fetch project ── */
  useEffect(() => {
    (async () => {
      setProjLoading(true);
      try   { const d = await getProjectById(projectId); setProject(d); }
      catch (err) { toast.error(err.response?.data?.message || 'Failed to load project.'); }
      finally { setProjLoading(false); }
    })();
  }, [projectId]);

  /* ── Handlers ── */

  const handleDeleteProject = async () => {
    setDelProjLoading(true);
    try { await deleteProject(projectId); navigate('/projects', { replace:true }); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed to delete.'); setShowDelProj(false); }
    finally { setDelProjLoading(false); }
  };

  const handleToggle = async (task) => {
    try {
      await updateTask(task.id, { status: task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED' });
      refetchTasks();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to update task.'); }
  };

  const handleDeleteTask = async () => {
    setDelTaskLoading(true);
    try { await deleteTask(deletingTask.id); setDeletingTask(null); toast.success('Task deleted.'); refetchTasks(); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed to delete task.'); setDeletingTask(null); }
    finally { setDelTaskLoading(false); }
  };

  /* ── Theme tokens ── */
  const headingC = isDark ? '#ffffff'                : '#1e1b4b';
  const subC     = isDark ? 'rgba(255,255,255,0.45)' : '#6b7280';
  const cardBg   = isDark ? '#1a1a35'                : '#ffffff';
  const cardBdr  = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(99,102,241,0.1)';
  const metaC    = isDark ? 'rgba(255,255,255,0.35)' : '#9ca3af';
  const divC     = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(99,102,241,0.08)';

  const sc = project ? (STATUS_CFG[project.status] || STATUS_CFG.NOT_STARTED) : null;

  if (projLoading) return <Spinner isDark={isDark} />;

  if (!project) return (
    <div style={{ textAlign:'center',padding:'60px 0' }}>
      <p style={{ color:subC,marginBottom:20 }}>Project not found.</p>
      <Link to="/projects" style={{ color:'#6366f1',fontWeight:700 }}>← Back to Projects</Link>
    </div>
  );

  return (
    <>
      <style>{`
        @keyframes pd-fadein  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
        @keyframes pd-card-in { from{opacity:0;transform:translateY(18px) scale(.97)} to{opacity:1;transform:none} }
        @keyframes pd-bg-in   { from{opacity:0} to{opacity:1} }
        @keyframes pd-modal-in{ from{opacity:0;transform:translateY(22px) scale(.96)} to{opacity:1;transform:none} }
        @keyframes pd-spin    { to{transform:rotate(360deg)} }
        @keyframes db-icon-pulse{ 0%,100%{box-shadow:0 0 8px rgba(99,102,241,.25)} 50%{box-shadow:0 0 18px rgba(99,102,241,.5)} }

        .pd-btn-edit{display:inline-flex;align-items:center;gap:6px;background:${isDark?'rgba(99,102,241,.15)':'rgba(99,102,241,.08)'};border:1px solid ${isDark?'rgba(99,102,241,.3)':'rgba(99,102,241,.2)'};border-radius:10px;padding:8px 16px;cursor:pointer;color:${isDark?'#818cf8':'#6366f1'};font-size:.83rem;font-weight:600;transition:all .18s;}
        .pd-btn-edit:hover{background:rgba(99,102,241,.25);transform:scale(1.04);}
        .pd-btn-del{display:inline-flex;align-items:center;gap:6px;background:${isDark?'rgba(244,63,94,.12)':'rgba(244,63,94,.07)'};border:1px solid ${isDark?'rgba(244,63,94,.25)':'rgba(244,63,94,.18)'};border-radius:10px;padding:8px 16px;cursor:pointer;color:${isDark?'#fb7185':'#f43f5e'};font-size:.83rem;font-weight:600;transition:all .18s;}
        .pd-btn-del:hover{background:rgba(244,63,94,.22);transform:scale(1.04);}
        .pd-new-task{display:inline-flex;align-items:center;gap:7px;background:linear-gradient(135deg,#6366f1,#8b5cf6);border:none;border-radius:11px;padding:10px 18px;color:#fff;font-size:.85rem;font-weight:700;cursor:pointer;box-shadow:0 4px 16px rgba(99,102,241,.4);transition:all .2s;position:relative;overflow:hidden;}
        .pd-new-task::after{content:'';position:absolute;inset:0;background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,.15) 50%,transparent 60%);transform:translateX(-100%);transition:transform .45s;}
        .pd-new-task:hover{transform:translateY(-2px);box-shadow:0 6px 22px rgba(99,102,241,.55);}
        .pd-new-task:hover::after{transform:translateX(100%);}
        .pd-empty-task{display:inline-flex;align-items:center;gap:7px;background:${isDark?'rgba(99,102,241,.12)':'rgba(99,102,241,.07)'};border:1px solid ${isDark?'rgba(99,102,241,.25)':'rgba(99,102,241,.2)'};border-radius:10px;padding:9px 18px;color:${isDark?'#818cf8':'#6366f1'};font-size:.85rem;font-weight:600;cursor:pointer;transition:all .2s;}
        .pd-empty-task:hover{background:rgba(99,102,241,.2);}
        .pd-bc-link{color:${isDark?'#818cf8':'#6366f1'};text-decoration:none;font-size:.85rem;font-weight:600;}
        .pd-bc-link:hover{text-decoration:underline;}
        .pd-bc-sep{color:${metaC};margin:0 6px;display:'flex';align-items:'center';}
        .pd-pg-btn{
          display:inline-flex;align-items:center;justify-content:center;
          width:34px;height:34px;border-radius:8px;
          font-size:.82rem;font-weight:700;cursor:pointer;
          border:1.5px solid ${isDark?'rgba(255,255,255,0.1)':'#e5e7eb'};
          background:${isDark?'rgba(255,255,255,0.05)':'#ffffff'};
          color:${isDark?'rgba(255,255,255,0.6)':'#6b7280'};
          transition:all .18s;
        }
        .pd-pg-btn:hover:not(:disabled){
          border-color:#6366f1;
          color:${isDark?'#818cf8':'#6366f1'};
          background:${isDark?'rgba(99,102,241,0.12)':'rgba(99,102,241,0.06)'};
          transform:scale(1.06);
        }
        .pd-pg-btn:disabled{opacity:.35;cursor:not-allowed;}
        .pd-pg-btn.active{
          background:linear-gradient(135deg,#6366f1,#8b5cf6);
          border-color:transparent;color:#fff;
          box-shadow:0 3px 10px rgba(99,102,241,.4);
        }
        .pd-pg-btn.active:hover{transform:scale(1.06);}
      `}</style>

      {/* ── Breadcrumb ── */}
      <div style={{ display:'flex',alignItems:'center',gap:4,marginBottom:22,animation:'pd-fadein .4s ease both' }}>
        <Link to="/projects" className="pd-bc-link">Projects</Link>
        <span className="pd-bc-sep"><IconChevron c={metaC}/></span>
        <span style={{ color:headingC,fontSize:'.85rem',fontWeight:600 }}>{project.name}</span>
      </div>

      {/* ── Project header card ── */}
      <div style={{
        background:cardBg, border:`1px solid ${cardBdr}`,
        borderRadius:20, overflow:'hidden', marginBottom:24,
        boxShadow:isDark?'0 4px 24px rgba(0,0,0,.4)':'0 4px 24px rgba(99,102,241,.09)',
        animation:'pd-card-in .55s cubic-bezier(.16,1,.3,1) both .05s',
        opacity:0, position:'relative',
      }}>
        {/* Status gradient top bar */}
        <div style={{ height:3, background:sc.grad }}/>

        <div style={{ padding:'22px 24px' }}>
          <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:12 }}>
            {/* Left: info */}
            <div style={{ flex:1 }}>
              <div style={{ display:'flex',alignItems:'center',gap:10,marginBottom:8,flexWrap:'wrap' }}>
                <div style={{ width:38,height:38,background:'linear-gradient(135deg,#6366f1,#a855f7)',borderRadius:11,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 0 12px rgba(99,102,241,.4)',animation:'db-icon-pulse 3s ease-in-out infinite',flexShrink:0 }}>
                  <IconFolder c="#fff"/>
                </div>
                <h4 style={{ color:headingC,fontWeight:800,fontSize:'1.3rem',margin:0,letterSpacing:'-.3px' }}>{project.name}</h4>
                {/* Status badge */}
                <span style={{ display:'inline-flex',alignItems:'center',gap:6,background:isDark?'rgba(255,255,255,.07)':'rgba(0,0,0,.04)',border:`1px solid ${isDark?'rgba(255,255,255,.1)':'rgba(0,0,0,.08)'}`,borderRadius:20,padding:'3px 11px 3px 8px' }}>
                  <span style={{ width:7,height:7,borderRadius:'50%',background:sc.dot,boxShadow:`0 0 6px ${sc.dot}`,display:'inline-block'}}/>
                  <span style={{ fontSize:'.72rem',fontWeight:700,color:sc.dot,letterSpacing:'.3px' }}>{sc.label}</span>
                </span>
              </div>

              {project.description && (
                <p style={{ color:subC,margin:'0 0 12px',fontSize:'.875rem',lineHeight:1.6 }}>{project.description}</p>
              )}

              <div style={{ display:'flex',flexWrap:'wrap',gap:16 }}>
                {[
                  { label:'Start', val:formatDate(project.startDate) },
                  { label:'End',   val:formatDate(project.endDate) },
                  { label:'Created', val:formatDate(project.createdAt) },
                ].filter(x=>x.val).map(({ label, val }) => (
                  <div key={label} style={{ display:'flex',alignItems:'center',gap:6 }}>
                    <IconCalendar c={metaC}/>
                    <span style={{ fontSize:'.78rem',color:metaC }}>{label}: <strong style={{color:isDark?'rgba(255,255,255,.65)':'#374151'}}>{val}</strong></span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display:'flex',gap:8,flexShrink:0 }}>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tasks section ── */}
      <div style={{ animation:'pd-card-in .55s cubic-bezier(.16,1,.3,1) both .15s', opacity:0 }}>
        {/* Tasks header */}
        <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16 }}>
          <div style={{ display:'flex',alignItems:'center',gap:10 }}>
            <div style={{ width:34,height:34,background:'linear-gradient(135deg,#6366f1,#a855f7)',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 0 10px rgba(99,102,241,.4)' }}>
              <IconTask c="#fff"/>
            </div>
            <div>
              <h5 style={{ color:headingC,fontWeight:800,margin:0,fontSize:'1.05rem' }}>Tasks</h5>
              <span style={{ color:subC,fontSize:'.78rem' }}>{tasksLoading ? '…' : `${tasks.length} task${tasks.length!==1?'s':''}`}</span>
            </div>
          </div>
        </div>

        {/* Task filters */}
        <div style={{ marginBottom:18 }}>
          <TaskFilters
            search={taskSearch} status={taskStatus} priority={taskPriority}
            onSearchChange={handleTaskSearch} onStatusChange={handleTaskStatus} onPriorityChange={handleTaskPriority}
            actions={
              <button className="pd-new-task" onClick={() => navigate(`/projects/${slugify(project.name, projectId)}/tasks/new`)}>
                <IconPlus c="#fff"/> New Task
              </button>
            }
          />
        </div>

        {/* Error */}
        {(tasksFetchErr) && (
          <div style={{ background:isDark?'rgba(248,113,113,.1)':'#fef2f2',border:`1px solid ${isDark?'rgba(248,113,113,.25)':'#fca5a5'}`,borderRadius:12,padding:'12px 16px',color:isDark?'#f87171':'#dc2626',fontSize:'.875rem',marginBottom:16 }}>
            {tasksFetchErr}
          </div>
        )}

        {/* Tasks list */}
        {tasksLoading ? (
          <Spinner isDark={isDark} />
        ) : tasks.length === 0 ? (
          <div style={{ textAlign:'center',padding:'48px 24px',background:cardBg,border:`1px solid ${cardBdr}`,borderRadius:18,boxShadow:isDark?'0 4px 20px rgba(0,0,0,.35)':'0 4px 20px rgba(99,102,241,.07)' }}>
            <div style={{ width:56,height:56,background:'linear-gradient(135deg,#6366f1,#a855f7)',borderRadius:16,margin:'0 auto 16px',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 0 20px rgba(99,102,241,.4)',animation:'db-icon-pulse 3s ease-in-out infinite' }}>
              <IconTask c="#fff"/>
            </div>
            <h6 style={{ color:headingC,fontWeight:700,marginBottom:8 }}>
              {taskSearch||taskStatus||taskPriority ? 'No tasks match your filters' : 'No tasks yet'}
            </h6>
            <p style={{ color:subC,marginBottom:20,fontSize:'.875rem' }}>
              {taskSearch||taskStatus||taskPriority ? 'Try adjusting your filters.' : 'Add your first task to get started.'}
            </p>
            {!taskSearch && !taskStatus && !taskPriority && (
              <button className="pd-empty-task" onClick={() => navigate(`/projects/${slugify(project.name, projectId)}/tasks/new`)}>
                <IconPlus c={isDark?'#818cf8':'#6366f1'}/> Add first task
              </button>
            )}
          </div>
        ) : (
          <>
            <div>
              {paginatedTasks.map((task, i) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  index={i}
                  onEdit={t => navigate(`/projects/${slugify(project.name, projectId)}/tasks/${t.id}/edit`)}
                  onDelete={t => setDeletingTask(t)}
                  onToggleComplete={handleToggle}
                />
              ))}
            </div>

            {/* ── Task pagination bar ── */}
            {taskTotalPages > 1 && (
              <div style={{
                display:'flex', alignItems:'center', justifyContent:'space-between',
                flexWrap:'wrap', gap:10,
                marginTop:16,
                padding:'14px 18px',
                background:cardBg,
                border:`1px solid ${cardBdr}`,
                borderRadius:14,
                boxShadow:isDark?'0 4px 16px rgba(0,0,0,.3)':'0 4px 16px rgba(99,102,241,.07)',
              }}>
                {/* Info */}
                <span style={{ fontSize:'.78rem', color:subC }}>
                  Showing{' '}
                  <strong style={{ color:isDark?'rgba(255,255,255,0.7)':'#374151' }}>
                    {taskStart + 1}–{Math.min(taskStart + TASK_PAGE_SIZE, tasks.length)}
                  </strong>{' '}of{' '}
                  <strong style={{ color:isDark?'rgba(255,255,255,0.7)':'#374151' }}>
                    {tasks.length}
                  </strong>{' '}tasks
                </span>

                {/* Buttons */}
                <div style={{ display:'flex', alignItems:'center', gap:5 }}>
                  <button
                    className="pd-pg-btn"
                    onClick={() => setTaskPage(p => Math.max(1, p - 1))}
                    disabled={taskSafePage === 1}
                    aria-label="Previous page"
                  >
                    <svg viewBox="0 0 24 24" fill="none" width="13" height="13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="15 18 9 12 15 6"/>
                    </svg>
                  </button>

                  {taskPageNumbers().map((n, idx) =>
                    n === '…'
                      ? <span key={`e-${idx}`} style={{ color:subC, fontSize:'.82rem', padding:'0 2px', userSelect:'none' }}>…</span>
                      : <button
                          key={n}
                          className={`pd-pg-btn${taskSafePage === n ? ' active' : ''}`}
                          onClick={() => setTaskPage(n)}
                          aria-label={`Page ${n}`}
                          aria-current={taskSafePage === n ? 'page' : undefined}
                        >
                          {n}
                        </button>
                  )}

                  <button
                    className="pd-pg-btn"
                    onClick={() => setTaskPage(p => Math.min(taskTotalPages, p + 1))}
                    disabled={taskSafePage === taskTotalPages}
                    aria-label="Next page"
                  >
                    <svg viewBox="0 0 24 24" fill="none" width="13" height="13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Modals ── */}
      <ConfirmModal
        show={!!deletingTask}
        title="Delete Task"
        message={`Delete task <strong>"${deletingTask?.name}"</strong>? This cannot be undone.`}
        onConfirm={handleDeleteTask}
        onCancel={() => setDeletingTask(null)}
        loading={delTaskLoading}
        isDark={isDark}
      />

      <ConfirmModal
        show={showDelProj}
        title="Delete Project"
        message={`Delete <strong>"${project?.name}"</strong>? This permanently removes all its tasks too.`}
        onConfirm={handleDeleteProject}
        onCancel={() => setShowDelProj(false)}
        loading={delProjLoading}
        isDark={isDark}
      />
    </>
  );
}
