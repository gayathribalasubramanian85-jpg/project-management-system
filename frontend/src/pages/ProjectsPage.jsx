import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProjects } from '../hooks/useProjects.js';
import { useTheme } from '../context/ThemeContext.jsx';
import { deleteProject } from '../services/projectService.js';
import { toast } from '../components/common/Toast.jsx';
import ProjectFilters from '../components/projects/ProjectFilters.jsx';
import { formatDate } from '../utils/formatDate.js';
import { slugify } from '../utils/slugify.js';

/* ── Status config ── */
const STATUS_CFG = {
  NOT_STARTED: { label:'Not Started', dot:'#94a3b8', bg:'rgba(100,116,139,.12)', bdr:'rgba(100,116,139,.28)', bar:'#94a3b8' },
  IN_PROGRESS: { label:'In Progress', dot:'#fbbf24', bg:'rgba(245,158,11,.12)',  bdr:'rgba(245,158,11,.3)',  bar:'#f59e0b' },
  COMPLETED:   { label:'Completed',   dot:'#34d399', bg:'rgba(16,185,129,.12)',  bdr:'rgba(16,185,129,.3)',  bar:'#10b981' },
};

/* ── Icons ── */
const IconPlus    = ({ c }) => <svg viewBox="0 0 24 24" fill="none" width="17" height="17" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const IconFolder  = ({ c }) => <svg viewBox="0 0 24 24" fill="none" width="22" height="22" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>;
const IconSearch  = ({ c }) => <svg viewBox="0 0 24 24" fill="none" width="22" height="22" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const IconEdit    = ({ c }) => <svg viewBox="0 0 24 24" fill="none" width="13" height="13" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const IconTrash   = ({ c }) => <svg viewBox="0 0 24 24" fill="none" width="13" height="13" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>;
const IconEye     = ({ c }) => <svg viewBox="0 0 24 24" fill="none" width="13" height="13" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const IconCal     = ({ c }) => <svg viewBox="0 0 24 24" fill="none" width="12" height="12" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;

/* ── Confirm delete modal ── */
function ConfirmDeleteModal({ project, onConfirm, onCancel, loading, isDark }) {
  if (!project) return null;
  const bg  = isDark ? '#13132a' : '#ffffff';
  const bdr = isDark ? 'rgba(99,102,241,0.25)' : 'rgba(99,102,241,0.15)';
  const hdg = isDark ? '#ffffff' : '#1e1b4b';
  const sub = isDark ? 'rgba(255,255,255,0.5)' : '#6b7280';
  const ovr = isDark ? 'rgba(0,0,0,0.75)' : 'rgba(15,15,26,0.55)';
  return (
    <div style={{ position:'fixed',inset:0,background:ovr,zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center',padding:20,animation:'pf-bg-in .25s ease' }}>
      <div style={{ width:'100%',maxWidth:420,background:bg,border:`1px solid ${bdr}`,borderRadius:20,boxShadow:isDark?'0 30px 80px rgba(0,0,0,.7)':'0 30px 80px rgba(99,102,241,.2)',animation:'pf-modal-in .35s cubic-bezier(.16,1,.3,1) both',overflow:'hidden' }}>
        <div style={{ padding:'28px 24px 20px',textAlign:'center' }}>
          <div style={{ width:56,height:56,background:'rgba(244,63,94,.12)',border:'1px solid rgba(244,63,94,.25)',borderRadius:16,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px' }}>
            <svg viewBox="0 0 24 24" fill="none" width="26" height="26" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
          </div>
          <h5 style={{ color:hdg,fontWeight:800,margin:'0 0 8px',fontSize:'1.05rem' }}>Delete Project</h5>
          <p style={{ color:sub,margin:0,fontSize:'.875rem',lineHeight:1.5 }}>Delete <strong style={{color:hdg}}>"{project.name}"</strong>? This will permanently remove all its tasks too.</p>
        </div>
        <div style={{ display:'flex',gap:10,padding:'0 24px 24px',justifyContent:'center' }}>
          <button onClick={onCancel} disabled={loading} style={{ flex:1,padding:'10px',background:isDark?'rgba(255,255,255,.07)':'rgba(0,0,0,.05)',border:`1px solid ${isDark?'rgba(255,255,255,.1)':'#e5e7eb'}`,borderRadius:11,color:isDark?'rgba(255,255,255,.7)':'#6b7280',fontWeight:600,fontSize:'.88rem',cursor:'pointer',transition:'all .2s' }}>Cancel</button>
          <button onClick={onConfirm} disabled={loading} style={{ flex:1,padding:'10px',background:'linear-gradient(135deg,#f43f5e,#e11d48)',border:'none',borderRadius:11,color:'#fff',fontWeight:700,fontSize:'.88rem',cursor:'pointer',boxShadow:'0 4px 16px rgba(244,63,94,.4)',transition:'all .2s',opacity:loading?.6:1 }}>{loading?'Deleting…':'Delete'}</button>
        </div>
      </div>
    </div>
  );
}

/* ── Spinning loader ── */
function PageSpinner({ isDark }) {
  const sub = isDark ? 'rgba(255,255,255,0.4)' : '#9ca3af';
  return (
    <div style={{ display:'flex',flexDirection:'column',alignItems:'center',padding:'80px 0',gap:16 }}>
      <svg viewBox="0 0 52 52" width="52" height="52">
        <circle cx="26" cy="26" r="22" fill="none" stroke={isDark?'rgba(99,102,241,.15)':'rgba(99,102,241,.1)'} strokeWidth="4"/>
        <circle cx="26" cy="26" r="22" fill="none" stroke="url(#pl-grad)" strokeWidth="4" strokeLinecap="round" strokeDasharray="36 100" transform="rotate(-90 26 26)" style={{ animation:'pj-spin .75s linear infinite' }}/>
        <defs><linearGradient id="pl-grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#6366f1"/><stop offset="100%" stopColor="#a855f7"/></linearGradient></defs>
      </svg>
      <span style={{ color:sub,fontSize:'.875rem',fontWeight:500 }}>Loading projects…</span>
    </div>
  );
}

/* ─────────────────── Main page ─────────────────────────────────────────── */
export default function ProjectsPage() {
  const { isDark } = useTheme();
  const navigate   = useNavigate();

  const [search, setSearch]             = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage]                 = useState(1);
  const PAGE_SIZE = 5;

  const { projects, loading, error: fetchError, refetch } = useProjects({ search, status: statusFilter });

  const [deletingProject, setDeletingProject] = useState(null);
  const [deleteLoading, setDeleteLoading]     = useState(false);

  const handleSearchChange = v => { setSearch(v);       setPage(1); };
  const handleStatusChange = v => { setStatusFilter(v); setPage(1); };

  /* ── Pagination ── */
  const totalPages = Math.max(1, Math.ceil(projects.length / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const pageStart  = (safePage - 1) * PAGE_SIZE;
  const paginated  = projects.slice(pageStart, pageStart + PAGE_SIZE);

  const pageNumbers = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages = [1];
    if (safePage > 3) pages.push('…');
    for (let i = Math.max(2, safePage - 1); i <= Math.min(totalPages - 1, safePage + 1); i++) pages.push(i);
    if (safePage < totalPages - 2) pages.push('…');
    pages.push(totalPages);
    return pages;
  };

  const handleDeleteConfirm = async () => {
    setDeleteLoading(true);
    try {
      await deleteProject(deletingProject.id);
      toast.success('Project deleted.');
      setDeletingProject(null);
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete project.');
      setDeletingProject(null);
    } finally {
      setDeleteLoading(false);
    }
  };

  /* ── Theme tokens ── */
  const headingC = isDark ? '#ffffff'                    : '#1e1b4b';
  const subC     = isDark ? 'rgba(255,255,255,0.45)'    : '#6b7280';
  const metaC    = isDark ? 'rgba(255,255,255,0.3)'     : '#9ca3af';
  const rowBg    = isDark ? '#1a1a35'                   : '#ffffff';
  const rowBdr   = isDark ? 'rgba(255,255,255,0.07)'    : 'rgba(99,102,241,0.09)';
  const emptyBg  = isDark ? '#1a1a35'                   : '#ffffff';
  const emptyBdr = isDark ? 'rgba(255,255,255,0.07)'    : 'rgba(99,102,241,0.1)';

  const notStarted = projects.filter(p => p.status === 'NOT_STARTED').length;
  const inProgress = projects.filter(p => p.status === 'IN_PROGRESS').length;
  const completed  = projects.filter(p => p.status === 'COMPLETED').length;

  return (
    <>
      <style>{`
        @keyframes pj-fadein   { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
        @keyframes pj-row-in   { from{opacity:0;transform:translateX(-10px)} to{opacity:1;transform:none} }
        @keyframes pj-spin     { to{transform:rotate(360deg)} }
        @keyframes pf-bg-in    { from{opacity:0} to{opacity:1} }
        @keyframes pf-modal-in { from{opacity:0;transform:translateY(22px) scale(.96)} to{opacity:1;transform:none} }
        @keyframes db-icon-pulse{ 0%,100%{box-shadow:0 0 8px rgba(99,102,241,.25)} 50%{box-shadow:0 0 18px rgba(99,102,241,.5)} }

        .pj-new-btn{display:inline-flex;align-items:center;gap:8px;background:linear-gradient(135deg,#6366f1,#8b5cf6);border:none;border-radius:12px;color:#fff;font-size:.88rem;font-weight:700;padding:11px 20px;cursor:pointer;box-shadow:0 4px 18px rgba(99,102,241,.4);transition:transform .2s,box-shadow .2s;position:relative;overflow:hidden;}
        .pj-new-btn::after{content:'';position:absolute;inset:0;background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,.15) 50%,transparent 60%);transform:translateX(-100%);transition:transform .45s;}
        .pj-new-btn:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(99,102,241,.55);}
        .pj-new-btn:hover::after{transform:translateX(100%);}

        .pj-pill{display:inline-flex;align-items:center;gap:6px;border-radius:20px;padding:5px 12px;font-size:.75rem;font-weight:700;}

        /* ── Table row hover ── */
        .pj-trow {
          background: ${rowBg};
          transition: background .18s;
          animation: pj-row-in .4s cubic-bezier(.16,1,.3,1) both;
          opacity: 0;
        }
        .pj-trow:hover { background: ${isDark ? 'rgba(99,102,241,0.07)' : 'rgba(99,102,241,0.04)'}; }

        .pj-btn-edit{display:inline-flex;align-items:center;gap:4px;background:${isDark?'rgba(99,102,241,.15)':'rgba(99,102,241,.08)'};border:1px solid ${isDark?'rgba(99,102,241,.3)':'rgba(99,102,241,.2)'};border-radius:7px;padding:5px 10px;cursor:pointer;color:${isDark?'#818cf8':'#6366f1'};font-size:.75rem;font-weight:600;transition:all .18s;}
        .pj-btn-edit:hover{background:rgba(99,102,241,.25);transform:scale(1.04);}
        .pj-btn-view{display:inline-flex;align-items:center;gap:4px;background:${isDark?'rgba(16,185,129,.12)':'rgba(16,185,129,.08)'};border:1px solid ${isDark?'rgba(16,185,129,.3)':'rgba(16,185,129,.2)'};border-radius:7px;padding:5px 10px;cursor:pointer;color:${isDark?'#34d399':'#059669'};font-size:.75rem;font-weight:600;transition:all .18s;text-decoration:none;}
        .pj-btn-view:hover{background:rgba(16,185,129,.22);transform:scale(1.04);}
        .pj-btn-add{display:inline-flex;align-items:center;gap:4px;background:${isDark?'rgba(99,102,241,.15)':'rgba(99,102,241,.08)'};border:1px solid ${isDark?'rgba(99,102,241,.3)':'rgba(99,102,241,.2)'};border-radius:7px;padding:5px 10px;cursor:pointer;color:${isDark?'#818cf8':'#6366f1'};font-size:.75rem;font-weight:600;transition:all .18s;text-decoration:none;}
        .pj-btn-add:hover{background:rgba(99,102,241,.25);transform:scale(1.04);}
        .pj-btn-del{display:inline-flex;align-items:center;gap:4px;background:${isDark?'rgba(244,63,94,.12)':'rgba(244,63,94,.07)'};border:1px solid ${isDark?'rgba(244,63,94,.25)':'rgba(244,63,94,.18)'};border-radius:7px;padding:5px 10px;cursor:pointer;color:${isDark?'#fb7185':'#f43f5e'};font-size:.75rem;font-weight:600;transition:all .18s;}
        .pj-btn-del:hover{background:rgba(244,63,94,.22);transform:scale(1.04);}
        /* Pagination */
        .pj-pg-btn{display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:8px;font-size:.82rem;font-weight:700;cursor:pointer;border:1.5px solid ${isDark?'rgba(255,255,255,0.1)':'#e5e7eb'};background:${isDark?'rgba(255,255,255,0.05)':'#ffffff'};color:${isDark?'rgba(255,255,255,0.6)':'#6b7280'};transition:all .18s;}
        .pj-pg-btn:hover:not(:disabled){border-color:#6366f1;color:${isDark?'#818cf8':'#6366f1'};background:${isDark?'rgba(99,102,241,0.12)':'rgba(99,102,241,0.06)'};transform:scale(1.06);}
        .pj-pg-btn:disabled{opacity:.35;cursor:not-allowed;}
        .pj-pg-btn.active{background:linear-gradient(135deg,#6366f1,#8b5cf6);border-color:transparent;color:#fff;box-shadow:0 3px 10px rgba(99,102,241,.4);}
        .pj-pg-btn.active:hover{transform:scale(1.06);}

        .pj-empty-btn{display:inline-flex;align-items:center;gap:8px;background:linear-gradient(135deg,#6366f1,#8b5cf6);border:none;border-radius:12px;color:#fff;font-size:.9rem;font-weight:700;padding:12px 26px;cursor:pointer;text-decoration:none;box-shadow:0 4px 18px rgba(99,102,241,.4);transition:transform .2s,box-shadow .2s;position:relative;overflow:hidden;}
        .pj-empty-btn::after{content:'';position:absolute;inset:0;background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,.15) 50%,transparent 60%);transform:translateX(-100%);transition:transform .45s;}
        .pj-empty-btn:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(99,102,241,.55);color:#fff;}
        .pj-empty-btn:hover::after{transform:translateX(100%);}

        /* ── Responsive ── */

        /* Tablet: hide less important columns */
        @media (max-width: 900px) {
          .pj-col-desc    { display: none; }
          .pj-col-start   { display: none; }
          .pj-col-created { display: none; }
        }

        /* Mobile: switch table to card stack */
        @media (max-width: 600px) {
          /* Hide table completely */
          .pj-table-wrap  { display: none !important; }
          /* Show card list */
          .pj-card-list   { display: flex !important; }
          /* Stack filters row */
          .pj-filters-row { flex-direction: column !important; align-items: stretch !important; }
          .pj-filters-row .pj-new-btn { width: 100%; justify-content: center; }
          /* Smaller header text */
          .pj-page-title  { font-size: 1.15rem !important; }
          /* Pills wrap tighter */
          .pj-pill        { font-size: .7rem !important; padding: 4px 10px !important; }
          /* Pagination info text hide on tiny screens */
          .pj-pg-info     { display: none; }
        }

        /* ── Mobile project card ── */
        .pj-card-list { display: none; flex-direction: column; gap: 12px; }
        .pj-mcard {
          background: ${rowBg};
          border: 1px solid ${rowBdr};
          border-radius: 14px;
          padding: 16px;
          animation: pj-row-in .4s cubic-bezier(.16,1,.3,1) both;
          opacity: 0;
        }
        .pj-mcard-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; gap: 8px; }
        .pj-mcard-name   { font-weight: 700; font-size: .95rem; color: ${headingC}; }
        .pj-mcard-meta   { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px; font-size: .78rem; color: ${metaC}; }
        .pj-mcard-actions{ display: flex; flex-wrap: wrap; gap: 6px; }
      `}</style>

      {/* ── Page header ── */}
      <div style={{ display:'flex',alignItems:'center',marginBottom:28,animation:'pj-fadein .5s ease both' }}>
        <div style={{ display:'flex',alignItems:'center',gap:14 }}>
          <div style={{ width:50,height:50,background:'linear-gradient(135deg,#6366f1,#a855f7)',borderRadius:14,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 0 18px rgba(99,102,241,.45)',animation:'db-icon-pulse 3s ease-in-out infinite',flexShrink:0 }}>
            <IconFolder c="#fff"/>
          </div>
          <div>
            <h4 className="pj-page-title" style={{ color:headingC,fontWeight:800,fontSize:'1.45rem',margin:0,letterSpacing:'-.3px' }}>Projects</h4>
            <p style={{ color:subC,margin:0,fontSize:'.875rem' }}>{loading?'…':`${projects.length} project${projects.length!==1?'s':''}`}</p>
          </div>
        </div>
      </div>

      {/* ── Status pills ── */}
      {!loading && projects.length > 0 && (
        <div style={{ display:'flex',flexWrap:'wrap',gap:8,marginBottom:20,animation:'pj-fadein .5s ease both .1s',opacity:0 }}>
          {[
            { label:'Not Started', count:notStarted, bg:isDark?'rgba(100,116,139,.15)':'rgba(100,116,139,.08)', bdr:isDark?'rgba(100,116,139,.3)':'rgba(100,116,139,.2)', c:'#94a3b8', dot:'#94a3b8' },
            { label:'In Progress', count:inProgress, bg:isDark?'rgba(245,158,11,.12)':'rgba(245,158,11,.08)',  bdr:isDark?'rgba(245,158,11,.3)':'rgba(245,158,11,.2)',  c:'#fbbf24', dot:'#fbbf24' },
            { label:'Completed',   count:completed,  bg:isDark?'rgba(16,185,129,.12)':'rgba(16,185,129,.08)', bdr:isDark?'rgba(16,185,129,.3)':'rgba(16,185,129,.2)', c:'#34d399', dot:'#34d399' },
          ].map(({ label, count, bg, bdr, c, dot }) => (
            <div key={label} className="pj-pill" style={{ background:bg,border:`1px solid ${bdr}` }}>
              <div style={{ width:7,height:7,borderRadius:'50%',background:dot,boxShadow:`0 0 5px ${dot}` }}/>
              <span style={{ color:c }}>{label}: {count}</span>
            </div>
          ))}
        </div>
      )}

      {/* ── Filters + New Project button ── */}
      <div className="pj-filters-row" style={{ marginBottom:20,animation:'pj-fadein .5s ease both .15s',opacity:0,display:'flex',alignItems:'center',gap:10,flexWrap:'wrap' }}>
        <ProjectFilters search={search} status={statusFilter} onSearchChange={handleSearchChange} onStatusChange={handleStatusChange}/>
        <button className="pj-new-btn" onClick={() => navigate('/projects/new')}>
          <IconPlus c="#fff"/> New Project
        </button>
      </div>

      {/* ── Error ── */}
      {fetchError && (
        <div style={{ background:isDark?'rgba(248,113,113,.1)':'#fef2f2',border:`1px solid ${isDark?'rgba(248,113,113,.25)':'#fca5a5'}`,borderRadius:12,padding:'12px 16px',color:isDark?'#f87171':'#dc2626',fontSize:'.875rem',marginBottom:20 }}>
          {fetchError}
        </div>
      )}

      {/* ── Loading ── */}
      {loading && <PageSpinner isDark={isDark}/>}

      {/* ── Empty state ── */}
      {!loading && projects.length === 0 && (
        <div style={{ textAlign:'center',padding:'64px 24px',background:emptyBg,border:`1px solid ${emptyBdr}`,borderRadius:22,boxShadow:isDark?'0 4px 24px rgba(0,0,0,.35)':'0 4px 24px rgba(99,102,241,.08)',animation:'pj-fadein .6s ease both .2s',opacity:0 }}>
          <div style={{ width:72,height:72,background:'linear-gradient(135deg,#6366f1,#a855f7)',borderRadius:20,margin:'0 auto 20px',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 0 28px rgba(99,102,241,.45)',animation:'db-icon-pulse 3s ease-in-out infinite' }}>
            {search||statusFilter?<IconSearch c="#fff"/>:<IconFolder c="#fff"/>}
          </div>
          <h5 style={{ color:headingC,fontWeight:800,marginBottom:8,fontSize:'1.1rem' }}>{search||statusFilter?'No projects match your filters':'No projects yet'}</h5>
          <p style={{ color:subC,marginBottom:28,fontSize:'.9rem',maxWidth:300,margin:'0 auto 28px' }}>{search||statusFilter?'Try adjusting your search or filter criteria.':'Create your first project and start organising your work.'}</p>
          {!search && !statusFilter && (
            <button className="pj-empty-btn" onClick={() => navigate('/projects/new')}><IconPlus c="#fff"/> Create your first project</button>
          )}
        </div>
      )}

      {/* ── Project list ── */}
      {!loading && projects.length > 0 && (
        <>
          {/* ── Table ── */}
          <div className="pj-table-wrap" style={{ overflowX: 'auto', borderRadius: 16, border: `1px solid ${rowBdr}`, boxShadow: isDark ? '0 4px 24px rgba(0,0,0,.35)' : '0 4px 24px rgba(99,102,241,.08)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              {/* Head */}
              <thead>
                <tr style={{ background: isDark ? 'rgba(99,102,241,0.1)' : 'rgba(99,102,241,0.05)', borderBottom: `1px solid ${rowBdr}` }}>
                  {[
                    { label:'Project',      cls:'' },
                    { label:'Description',  cls:'pj-col-desc' },
                    { label:'Status',       cls:'' },
                    { label:'Start Date',   cls:'pj-col-start' },
                    { label:'End Date',     cls:'' },
                    { label:'Created Date', cls:'pj-col-created' },
                    { label:'Actions',      cls:'' },
                  ].map(({ label, cls }) => (
                    <th key={label} className={cls} style={{
                      padding: '11px 12px',
                      textAlign: label === 'Actions' ? 'center' : 'left',
                      fontSize: '.7rem', fontWeight: 700,
                      letterSpacing: '.5px', textTransform: 'uppercase',
                      color: metaC, whiteSpace: 'nowrap',
                    }}>
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Body */}
              <tbody>
                {paginated.map((p, i) => {
                  const sc = STATUS_CFG[p.status] || STATUS_CFG.NOT_STARTED;
                  const isLast = i === paginated.length - 1;
                  return (
                    <tr key={p.id} className="pj-trow" style={{ borderBottom: isLast ? 'none' : `1px solid ${rowBdr}`, animationDelay: `${i * 0.04}s` }}>
                      <td style={{ padding: '12px 12px', whiteSpace: 'nowrap' }}>
                        <span style={{ fontWeight: 700, fontSize: '.88rem', color: headingC, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>{p.name}</span>
                      </td>
                      <td className="pj-col-desc" style={{ padding: '12px 12px', maxWidth: 160 }}>
                        {p.description ? <span style={{ fontSize: '.82rem', color: subC, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.description}</span> : <span style={{ fontSize: '.78rem', color: metaC, fontStyle: 'italic' }}>—</span>}
                      </td>
                      <td style={{ padding: '12px 12px', whiteSpace: 'nowrap' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: sc.bg, border: `1px solid ${sc.bdr}`, borderRadius: 20, padding: '3px 10px 3px 7px', fontSize: '.7rem', fontWeight: 700, color: sc.dot }}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: sc.dot, boxShadow: `0 0 5px ${sc.dot}`, display: 'inline-block', flexShrink: 0 }} />{sc.label}
                        </span>
                      </td>
                      <td className="pj-col-start" style={{ padding: '12px 12px', whiteSpace: 'nowrap' }}>
                        {p.startDate ? <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '.8rem', color: isDark ? 'rgba(255,255,255,.6)' : '#374151' }}><IconCal c={metaC} />{formatDate(p.startDate)}</span> : <span style={{ fontSize: '.78rem', color: metaC }}>—</span>}
                      </td>
                      <td style={{ padding: '12px 12px', whiteSpace: 'nowrap' }}>
                        {p.endDate ? <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '.8rem', color: isDark ? 'rgba(255,255,255,.6)' : '#374151' }}><IconCal c={metaC} />{formatDate(p.endDate)}</span> : <span style={{ fontSize: '.78rem', color: metaC }}>—</span>}
                      </td>
                      <td className="pj-col-created" style={{ padding: '12px 12px', whiteSpace: 'nowrap' }}>
                        {p.createdAt ? <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '.8rem', color: isDark ? 'rgba(255,255,255,.6)' : '#374151' }}><IconCal c={metaC} />{formatDate(p.createdAt)}</span> : <span style={{ fontSize: '.78rem', color: metaC }}>—</span>}
                      </td>
                      <td style={{ padding: '12px 12px', whiteSpace: 'nowrap', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: 7, justifyContent: 'center' }}>
                          <Link to={`/projects/${slugify(p.name, p.id)}`} className="pj-btn-view"><IconEye c={isDark?'#34d399':'#059669'}/> View</Link>
                          <Link to={`/projects/${slugify(p.name, p.id)}/tasks/new`} className="pj-btn-add"><IconPlus c={isDark?'#818cf8':'#6366f1'}/> Add Task</Link>
                          <button className="pj-btn-edit" onClick={() => navigate(`/projects/${slugify(p.name, p.id)}/edit`)}><IconEdit c={isDark?'#818cf8':'#6366f1'}/> Edit</button>
                          <button className="pj-btn-del" onClick={() => setDeletingProject(p)}><IconTrash c={isDark?'#fb7185':'#f43f5e'}/> Delete</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ── Mobile card list (shown only on < 600px via CSS) ── */}
          <div className="pj-card-list">
            {paginated.map((p, i) => {
              const sc = STATUS_CFG[p.status] || STATUS_CFG.NOT_STARTED;
              return (
                <div key={p.id} className="pj-mcard" style={{ animationDelay: `${i * 0.06}s` }}>
                  <div className="pj-mcard-header">
                    <span className="pj-mcard-name">{p.name}</span>
                    <span style={{ display:'inline-flex', alignItems:'center', gap:5, background:sc.bg, border:`1px solid ${sc.bdr}`, borderRadius:20, padding:'3px 10px 3px 7px', fontSize:'.7rem', fontWeight:700, color:sc.dot, flexShrink:0 }}>
                      <span style={{ width:6, height:6, borderRadius:'50%', background:sc.dot, display:'inline-block' }}/>
                      {sc.label}
                    </span>
                  </div>
                  {p.description && (
                    <p style={{ fontSize:'.82rem', color:subC, margin:'0 0 10px', lineHeight:1.5 }}>{p.description}</p>
                  )}
                  <div className="pj-mcard-meta">
                    {p.startDate  && <span><IconCal c={metaC}/> Start: {formatDate(p.startDate)}</span>}
                    {p.endDate    && <span><IconCal c={metaC}/> End: {formatDate(p.endDate)}</span>}
                    {p.createdAt  && <span><IconCal c={metaC}/> Created: {formatDate(p.createdAt)}</span>}
                  </div>
                  <div className="pj-mcard-actions">
                    <Link to={`/projects/${slugify(p.name, p.id)}`} className="pj-btn-view"><IconEye c={isDark?'#34d399':'#059669'}/> View</Link>
                    <Link to={`/projects/${slugify(p.name, p.id)}/tasks/new`} className="pj-btn-add"><IconPlus c={isDark?'#818cf8':'#6366f1'}/> Add Task</Link>
                    <button className="pj-btn-edit" onClick={() => navigate(`/projects/${slugify(p.name, p.id)}/edit`)}><IconEdit c={isDark?'#818cf8':'#6366f1'}/> Edit</button>
                    <button className="pj-btn-del" onClick={() => setDeletingProject(p)}><IconTrash c={isDark?'#fb7185':'#f43f5e'}/> Delete</button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Pagination bar ── */}
          {totalPages > 1 && (
            <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:12,marginTop:20,padding:'14px 18px',background:rowBg,border:`1px solid ${rowBdr}`,borderRadius:14,boxShadow:isDark?'0 4px 16px rgba(0,0,0,.3)':'0 4px 16px rgba(99,102,241,.07)' }}>
              <span className="pj-pg-info" style={{ fontSize:'.8rem',color:subC }}>
                Showing <strong style={{ color:isDark?'rgba(255,255,255,0.7)':'#374151' }}>{pageStart+1}–{Math.min(pageStart+PAGE_SIZE,projects.length)}</strong> of <strong style={{ color:isDark?'rgba(255,255,255,0.7)':'#374151' }}>{projects.length}</strong> projects
              </span>
              <div style={{ display:'flex',alignItems:'center',gap:5 }}>
                <button className="pj-pg-btn" onClick={() => setPage(p => Math.max(1,p-1))} disabled={safePage===1} aria-label="Previous page">
                  <svg viewBox="0 0 24 24" fill="none" width="13" height="13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                </button>
                {pageNumbers().map((n,idx) =>
                  n==='…'
                    ? <span key={`e-${idx}`} style={{ color:subC,fontSize:'.82rem',padding:'0 2px',userSelect:'none' }}>…</span>
                    : <button key={n} className={`pj-pg-btn${safePage===n?' active':''}`} onClick={() => setPage(n)} aria-label={`Page ${n}`} aria-current={safePage===n?'page':undefined}>{n}</button>
                )}
                <button className="pj-pg-btn" onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={safePage===totalPages} aria-label="Next page">
                  <svg viewBox="0 0 24 24" fill="none" width="13" height="13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── Modal ── */}
      <ConfirmDeleteModal project={deletingProject} onConfirm={handleDeleteConfirm} onCancel={() => setDeletingProject(null)} loading={deleteLoading} isDark={isDark}/>
    </>
  );
}