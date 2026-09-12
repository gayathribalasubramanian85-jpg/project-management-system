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

/* Options with coloured dots */
const STATUS_OPTIONS = [
  { value: '',            label: 'All Statuses' },
  { value: 'PENDING',     label: 'Pending',     dot: '#94a3b8' },
  { value: 'IN_PROGRESS', label: 'In Progress', dot: '#fbbf24' },
  { value: 'COMPLETED',   label: 'Completed',   dot: '#34d399' },
];

const PRIORITY_OPTIONS = [
  { value: '',       label: 'All Priorities' },
  { value: 'LOW',    label: 'Low',    dot: '#38bdf8' },
  { value: 'MEDIUM', label: 'Medium', dot: '#fbbf24' },
  { value: 'HIGH',   label: 'High',   dot: '#fb7185' },
];

export default function TaskFilters({ search, status, priority, onSearchChange, onStatusChange, onPriorityChange, actions }) {
  const { isDark } = useTheme();

  const bg      = isDark ? 'rgba(255,255,255,0.05)' : '#ffffff';
  const bdr     = isDark ? 'rgba(255,255,255,0.1)'  : '#e5e7eb';
  const focusBg = isDark ? 'rgba(99,102,241,0.08)'  : '#eef2ff';
  const txt     = isDark ? '#ffffff'                : '#111827';
  const ph      = isDark ? 'rgba(255,255,255,0.25)' : '#9ca3af';
  const icoC    = isDark ? 'rgba(255,255,255,0.3)'  : '#9ca3af';

  return (
    <>
      <style>{`
        .tfl-search {
          width: 280px; max-width: 100%; min-width: 180px;
          display:flex; align-items:center; gap:10px;
          background:${bg}; border:1.5px solid ${bdr};
          border-radius:12px; padding:10px 14px;
          transition:border-color .2s, box-shadow .2s, background .3s;
        }
        .tfl-search:focus-within {
          border-color:#6366f1; background:${focusBg};
          box-shadow:0 0 0 3px rgba(99,102,241,.15);
        }
        .tfl-search input {
          flex:1; background:none; border:none; outline:none;
          color:${txt}; font-size:.88rem; transition:color .3s;
        }
        .tfl-search input::placeholder { color:${ph}; }
      `}</style>

      <div style={{ display:'flex', flexWrap:'wrap', gap:10, alignItems:'center' }}>
        {/* Search */}
        <div className="tfl-search">
          <IconSearch c={icoC} />
          <input
            type="search"
            value={search}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Search tasks…"
            aria-label="Search tasks"
          />
        </div>

        {/* Status filter */}
        <CustomSelect
          value={status}
          onChange={onStatusChange}
          options={STATUS_OPTIONS}
          placeholder="All Statuses"
          minWidth="168px"
          icon={<IconFilter c={icoC} />}
        />

        {/* Priority filter */}
        <CustomSelect
          value={priority}
          onChange={onPriorityChange}
          options={PRIORITY_OPTIONS}
          placeholder="All Priorities"
          minWidth="168px"
          icon={<IconFilter c={icoC} />}
        />

        {/* Injected actions (e.g. New Task button) */}
        {actions && <div>{actions}</div>}
      </div>
    </>
  );
}
