import { useTheme } from '../../context/ThemeContext.jsx';
import CustomSelect from '../common/CustomSelect.jsx';

/* ── Icons ── */
const IconSearch = ({ c }) => (
  <svg viewBox="0 0 24 24" fill="none" width="16" height="16" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const IconFilter = ({ c }) => (
  <svg viewBox="0 0 24 24" fill="none" width="15" height="15" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
  </svg>
);

/* Status options with coloured dots */
const STATUS_OPTIONS = [
  { value: '',            label: 'All Statuses' },
  { value: 'NOT_STARTED', label: 'Not Started', dot: '#94a3b8' },
  { value: 'IN_PROGRESS', label: 'In Progress', dot: '#fbbf24' },
  { value: 'COMPLETED',   label: 'Completed',   dot: '#34d399' },
];

export default function ProjectFilters({ search, status, onSearchChange, onStatusChange }) {
  const { isDark } = useTheme();

  const bg   = isDark ? 'rgba(255,255,255,0.05)' : '#ffffff';
  const bdr  = isDark ? 'rgba(255,255,255,0.1)'  : '#e5e7eb';
  const focusBg = isDark ? 'rgba(99,102,241,0.08)' : '#eef2ff';
  const txt  = isDark ? '#ffffff'                : '#111827';
  const ph   = isDark ? 'rgba(255,255,255,0.25)' : '#9ca3af';
  const icoC = isDark ? 'rgba(255,255,255,0.3)'  : '#9ca3af';

  return (
    <>
      <style>{`
        .pf-search {
          width: 320px; max-width: 100%; min-width: 200px;
          display:flex; align-items:center; gap:10px;
          background:${bg}; border:1.5px solid ${bdr};
          border-radius:12px; padding:10px 14px;
          transition:border-color .2s, box-shadow .2s, background .3s;
        }
        .pf-search:focus-within {
          border-color:#6366f1; background:${focusBg};
          box-shadow:0 0 0 3px rgba(99,102,241,.15);
        }
        .pf-search input {
          flex:1; background:none; border:none; outline:none;
          color:${txt}; font-size:.88rem; transition:color .3s;
        }
        .pf-search input::placeholder { color:${ph}; }
      `}</style>

      <div style={{ display:'flex', flexWrap:'wrap', gap:10, alignItems:'center' }}>
        {/* Search */}
        <div className="pf-search">
          <IconSearch c={icoC} />
          <input
            type="search"
            value={search}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Search projects…"
            aria-label="Search projects"
          />
        </div>

        {/* Status filter — custom themed dropdown */}
        <CustomSelect
          value={status}
          onChange={onStatusChange}
          options={STATUS_OPTIONS}
          placeholder="All Statuses"
          minWidth="185px"
          icon={<IconFilter c={icoC} />}
        />
      </div>
    </>
  );
}
