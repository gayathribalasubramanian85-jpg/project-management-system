import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardStats } from '../services/dashboardService.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

/* ─────────────────────────── SVG Icons ─────────────────────────────────── */
const IconFolder      = ({ c }) => <svg viewBox="0 0 24 24" fill="none" width="22" height="22" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>;
const IconPause       = ({ c }) => <svg viewBox="0 0 24 24" fill="none" width="22" height="22" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>;
const IconClock       = ({ c }) => <svg viewBox="0 0 24 24" fill="none" width="22" height="22" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const IconCheckCircle = ({ c }) => <svg viewBox="0 0 24 24" fill="none" width="22" height="22" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
const IconList        = ({ c }) => <svg viewBox="0 0 24 24" fill="none" width="22" height="22" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>;
const IconTrendingUp  = ({ c }) => <svg viewBox="0 0 24 24" fill="none" width="22" height="22" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>;
const IconArrow       = ({ c }) => <svg viewBox="0 0 24 24" fill="none" width="14" height="14" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;
const IconPlus        = ({ c }) => <svg viewBox="0 0 24 24" fill="none" width="18" height="18" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const IconActivity    = ({ c }) => <svg viewBox="0 0 24 24" fill="none" width="18" height="18" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>;
const IconTarget      = ({ c }) => <svg viewBox="0 0 24 24" fill="none" width="18" height="18" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>;

/* ─────────────────── Animated counter hook ─────────────────────────────── */
function useCounter(target, duration = 1200, delay = 0) {
  const [count, setCount] = useState(0);
  const rafRef = useRef(null);
  useEffect(() => {
    if (target === null || target === undefined) return;
    const startTime = performance.now() + delay;
    const animate = (now) => {
      if (now < startTime) { rafRef.current = requestAnimationFrame(animate); return; }
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration, delay]);
  return count;
}

/* ─────────────────────── Card palettes ─────────────────────────────────── */
const PALETTES = {
  indigo:  { grad:'linear-gradient(135deg,#6366f1,#4f46e5)', glow:'rgba(99,102,241,.4)',   iconBg:'rgba(99,102,241,.15)',  iconC:'#818cf8',  bar:'#6366f1' },
  violet:  { grad:'linear-gradient(135deg,#8b5cf6,#7c3aed)', glow:'rgba(139,92,246,.4)',   iconBg:'rgba(139,92,246,.15)',  iconC:'#a78bfa',  bar:'#8b5cf6' },
  amber:   { grad:'linear-gradient(135deg,#f59e0b,#d97706)', glow:'rgba(245,158,11,.35)',  iconBg:'rgba(245,158,11,.15)',  iconC:'#fbbf24',  bar:'#f59e0b' },
  emerald: { grad:'linear-gradient(135deg,#10b981,#059669)', glow:'rgba(16,185,129,.35)',  iconBg:'rgba(16,185,129,.15)',  iconC:'#34d399',  bar:'#10b981' },
  sky:     { grad:'linear-gradient(135deg,#0ea5e9,#0284c7)', glow:'rgba(14,165,233,.35)',  iconBg:'rgba(14,165,233,.15)',  iconC:'#38bdf8',  bar:'#0ea5e9' },
  slate:   { grad:'linear-gradient(135deg,#64748b,#475569)', glow:'rgba(100,116,139,.3)',  iconBg:'rgba(100,116,139,.15)', iconC:'#94a3b8',  bar:'#64748b' },
  rose:    { grad:'linear-gradient(135deg,#f43f5e,#e11d48)', glow:'rgba(244,63,94,.35)',   iconBg:'rgba(244,63,94,.15)',   iconC:'#fb7185',  bar:'#f43f5e' },
  teal:    { grad:'linear-gradient(135deg,#14b8a6,#0d9488)', glow:'rgba(20,184,166,.35)',  iconBg:'rgba(20,184,166,.15)',  iconC:'#2dd4bf',  bar:'#14b8a6' },
};

/* ─────────────────────────── StatCard ──────────────────────────────────── */
function StatCard({ label, value, palette, Icon, to, delay = 0, isDark, total }) {
  const p     = PALETTES[palette] || PALETTES.indigo;
  const count = useCounter(value, 1000, delay * 1000);
  const bg    = isDark ? '#1a1a35' : '#ffffff';
  const bdr   = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(99,102,241,0.1)';
  const valC  = isDark ? '#ffffff' : '#1e1b4b';
  const lblC  = isDark ? 'rgba(255,255,255,0.5)' : '#6b7280';
  const pct   = total > 0 ? Math.round((value / total) * 100) : 0;
  const showBar = total !== undefined;

  const inner = (
    <div className="db-stat-card" style={{
      background: bg,
      border: `1px solid ${bdr}`,
      borderRadius: 18,
      padding: '22px',
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
      boxShadow: isDark ? '0 4px 24px rgba(0,0,0,.4)' : '0 4px 24px rgba(99,102,241,.08)',
      cursor: to ? 'pointer' : 'default',
      animation: 'db-card-in .6s cubic-bezier(.16,1,.3,1) both',
      animationDelay: `${delay}s`,
      opacity: 0,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Shimmer sweep on hover */}
      <div className="db-shimmer" />

      {/* Top accent gradient bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 3,
        background: p.grad, borderRadius: '18px 18px 0 0',
      }} />

      {/* Top row: icon + arrow */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{
          width: 48, height: 48, flexShrink: 0,
          background: p.iconBg,
          borderRadius: 13,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 0 16px ${p.glow}`,
          animation: 'db-icon-pulse 3s ease-in-out infinite',
          animationDelay: `${delay + 0.5}s`,
        }}>
          <Icon c={p.iconC} />
        </div>
        {to && (
          <div style={{
            width: 30, height: 30,
            background: p.iconBg, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'transform .2s',
          }} className="db-arrow">
            <IconArrow c={p.iconC} />
          </div>
        )}
      </div>

      {/* Number + label */}
      <div>
        <div style={{
          fontSize: '2.1rem', fontWeight: 900, color: valC,
          lineHeight: 1, letterSpacing: '-1px',
          fontVariantNumeric: 'tabular-nums',
        }}>
          {count}
        </div>
        <div style={{ fontSize: '.82rem', color: lblC, marginTop: 5, fontWeight: 500 }}>
          {label}
        </div>
      </div>

      {/* Progress bar (only when total provided) */}
      {showBar && (
        <div>
          <div style={{
            height: 4, background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
            borderRadius: 4, overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              background: p.grad,
              borderRadius: 4,
              width: '0%',
              animation: 'db-bar-fill .9s cubic-bezier(.4,0,.2,1) both',
              animationDelay: `${delay + 0.3}s`,
              '--target-width': `${pct}%`,
            }} className="db-progress-fill" />
          </div>
          <div style={{ fontSize: '.72rem', color: lblC, marginTop: 4, textAlign: 'right' }}>
            {pct}%
          </div>
        </div>
      )}
    </div>
  );

  return to
    ? <Link to={to} style={{ textDecoration: 'none', display: 'block' }}>{inner}</Link>
    : inner;
}

/* ─────────────── Section label with animated line ──────────────────────── */
function SectionLabel({ text, isDark, delay = 0 }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      marginBottom: 16, marginTop: 4,
      animation: 'db-fadein .5s ease both',
      animationDelay: `${delay}s`,
      opacity: 0,
    }}>
      <div style={{
        width: 3, height: 18,
        background: 'linear-gradient(180deg,#6366f1,#a855f7)',
        borderRadius: 4,
        boxShadow: '0 0 8px rgba(99,102,241,.5)',
      }} />
      <span style={{
        fontSize: '.7rem', fontWeight: 700, letterSpacing: '1px',
        textTransform: 'uppercase',
        color: isDark ? 'rgba(255,255,255,0.38)' : '#9ca3af',
      }}>
        {text}
      </span>
      {/* Animated separator line */}
      <div style={{
        flex: 1, height: 1,
        background: isDark
          ? 'linear-gradient(90deg,rgba(99,102,241,.3),transparent)'
          : 'linear-gradient(90deg,rgba(99,102,241,.15),transparent)',
        animation: 'db-line-expand .8s ease both',
        animationDelay: `${delay + 0.1}s`,
        transformOrigin: 'left',
      }} />
    </div>
  );
}

/* ─────────────────── Floating background orbs ───────────────────────────── */
function BackgroundOrbs({ isDark }) {
  if (!isDark) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      <div className="db-orb db-orb1" />
      <div className="db-orb db-orb2" />
      <div className="db-orb db-orb3" />
    </div>
  );
}

/* ─────────────────── Summary progress ring ─────────────────────────────── */
function CompletionRing({ done, total, isDark, delay = 0 }) {
  const pct   = total > 0 ? Math.round((done / total) * 100) : 0;
  const r     = 38;
  const circ  = 2 * Math.PI * r;
  const dash  = circ - (pct / 100) * circ;
  const textC = isDark ? '#fff' : '#1e1b4b';
  const subC  = isDark ? 'rgba(255,255,255,0.45)' : '#6b7280';
  const bg    = isDark ? '#1a1a35' : '#ffffff';
  const bdr   = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(99,102,241,0.1)';

  return (
    <div style={{
      background: bg,
      border: `1px solid ${bdr}`,
      borderRadius: 18,
      padding: '22px 24px',
      display: 'flex',
      alignItems: 'center',
      gap: 20,
      animation: 'db-card-in .6s cubic-bezier(.16,1,.3,1) both',
      animationDelay: `${delay}s`,
      opacity: 0,
      boxShadow: isDark ? '0 4px 24px rgba(0,0,0,.4)' : '0 4px 24px rgba(99,102,241,.08)',
      position: 'relative', overflow: 'hidden',
    }}>
      <div className="db-shimmer" />

      {/* SVG Ring */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <svg width="96" height="96" viewBox="0 0 96 96">
          {/* Track */}
          <circle cx="48" cy="48" r={r} fill="none"
            stroke={isDark ? 'rgba(255,255,255,0.07)' : 'rgba(99,102,241,0.08)'}
            strokeWidth="7" />
          {/* Fill */}
          <circle cx="48" cy="48" r={r} fill="none"
            stroke="url(#ring-grad)"
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={circ}
            transform="rotate(-90 48 48)"
            style={{
              animation: 'db-ring-fill .9s cubic-bezier(.4,0,.2,1) both',
              animationDelay: `${delay + 0.3}s`,
              '--ring-offset': dash,
            }}
            className="db-ring-circle"
          />
          <defs>
            <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1"/>
              <stop offset="100%" stopColor="#a855f7"/>
            </linearGradient>
          </defs>
        </svg>
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontSize: '1.3rem', fontWeight: 900, color: textC, lineHeight: 1 }}>{pct}%</span>
        </div>
      </div>

      {/* Text */}
      <div>
        <div style={{ fontSize: '1rem', fontWeight: 700, color: textC, marginBottom: 4 }}>
          Overall Completion
        </div>
        <div style={{ fontSize: '.82rem', color: subC }}>
          {done} of {total} tasks completed
        </div>
        <div style={{
          marginTop: 12, display: 'flex', gap: 12, flexWrap: 'wrap',
        }}>
          {[
            { c: '#6366f1', label: 'Completed' },
            { c: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)', label: 'Remaining' },
          ].map(({ c, label }) => (
            <div key={label} style={{ display:'flex', alignItems:'center', gap:6 }}>
              <div style={{ width:8, height:8, borderRadius:'50%', background:c, flexShrink:0 }}/>
              <span style={{ fontSize:'.75rem', color:subC }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────── Quick action card ─────────────────────────────────── */
function QuickActionCard({ isDark, delay = 0 }) {
  const textC = isDark ? '#fff' : '#1e1b4b';
  const subC  = isDark ? 'rgba(255,255,255,0.45)' : '#6b7280';

  return (
    <div style={{
      background: 'linear-gradient(135deg,#6366f1 0%,#8b5cf6 50%,#a855f7 100%)',
      borderRadius: 18,
      padding: '22px 24px',
      position: 'relative',
      overflow: 'hidden',
      animation: 'db-card-in .6s cubic-bezier(.16,1,.3,1) both',
      animationDelay: `${delay}s`,
      opacity: 0,
      boxShadow: '0 8px 28px rgba(99,102,241,.45)',
    }}>
      {/* Mesh overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 80% 60% at 80% 20%,rgba(255,255,255,.12),transparent)',
        pointerEvents: 'none',
      }} />
      {/* Floating orb inside card */}
      <div style={{
        position: 'absolute', width: 100, height: 100,
        background: 'rgba(255,255,255,.07)',
        borderRadius: '50%', bottom: -20, right: -20,
        animation: 'db-float1 5s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute', width: 60, height: 60,
        background: 'rgba(255,255,255,.05)',
        borderRadius: '50%', top: 10, right: 60,
        animation: 'db-float2 4s ease-in-out infinite',
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
          <div style={{
            width:32, height:32,
            background:'rgba(255,255,255,.2)',
            borderRadius:10,
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            <IconTarget c="#fff" />
          </div>
          <span style={{ color:'rgba(255,255,255,.85)', fontSize:'.75rem', fontWeight:600, letterSpacing:'.5px', textTransform:'uppercase' }}>
            Quick Action
          </span>
        </div>
        <h5 style={{ color:'#fff', fontWeight:800, margin:'0 0 6px', fontSize:'1.05rem' }}>
          Create a new project
        </h5>
        <p style={{ color:'rgba(255,255,255,.65)', margin:'0 0 16px', fontSize:'.82rem', lineHeight:1.5 }}>
          Start organising your work into projects and tasks.
        </p>
        <Link to="/projects" style={{
          display:'inline-flex', alignItems:'center', gap:7,
          background:'rgba(255,255,255,.15)',
          border:'1px solid rgba(255,255,255,.25)',
          borderRadius:10, padding:'8px 16px',
          color:'#fff', textDecoration:'none',
          fontSize:'.83rem', fontWeight:700,
          transition:'background .2s',
          backdropFilter:'blur(8px)',
        }}
        className="db-qa-link"
        >
          <IconPlus c="#fff" /> New Project
        </Link>
      </div>
    </div>
  );
}

/* ──────────────────── Activity indicator row ────────────────────────────── */
function ActivityRow({ label, value, max, colour, isDark, delay = 0 }) {
  const pct  = max > 0 ? Math.round((value / max) * 100) : 0;
  const txtC = isDark ? 'rgba(255,255,255,0.75)' : '#374151';
  const subC = isDark ? 'rgba(255,255,255,0.35)' : '#9ca3af';
  const trk  = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)';

  return (
    <div style={{
      animation: 'db-fadein .5s ease both',
      animationDelay: `${delay}s`,
      opacity: 0,
      marginBottom: 14,
    }}>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
        <span style={{ fontSize:'.82rem', fontWeight:600, color:txtC }}>{label}</span>
        <span style={{ fontSize:'.8rem', color:subC }}>{value}</span>
      </div>
      <div style={{ height:6, background:trk, borderRadius:6, overflow:'hidden' }}>
        <div style={{
          height:'100%', background:colour, borderRadius:6,
          width:'0%',
          animation:'db-bar-fill .9s cubic-bezier(.4,0,.2,1) both',
          animationDelay:`${delay + 0.2}s`,
          '--target-width':`${pct}%`,
        }} className="db-progress-fill" />
      </div>
    </div>
  );
}

/* ─────────────────────── Main page ─────────────────────────────────────── */
export default function DashboardPage() {
  const { user }           = useAuth();
  const { isDark }         = useTheme();
  const [stats, setStats]  = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]  = useState('');

  useEffect(() => {
    (async () => {
      setLoading(true);
      try   { const d = await getDashboardStats(); setStats(d); }
      catch (err) { setError(err.response?.data?.message || 'Failed to load dashboard.'); }
      finally { setLoading(false); }
    })();
  }, []);

  const firstName = user?.fullName?.split(' ')[0] || 'there';
  const headingC  = isDark ? '#ffffff' : '#1e1b4b';
  const subC      = isDark ? 'rgba(255,255,255,0.45)' : '#6b7280';
  const bg2       = isDark ? '#1a1a35' : '#ffffff';
  const bdr2      = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(99,102,241,0.1)';

  return (
    <>
      {/* ── Global keyframes + utility classes ── */}
      <style>{`
        @keyframes db-card-in  { from{opacity:0;transform:translateY(20px) scale(.97)} to{opacity:1;transform:none} }
        @keyframes db-fadein   { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes db-line-expand { from{transform:scaleX(0)} to{transform:scaleX(1)} }
        @keyframes db-spin     { to{transform:rotate(360deg)} }
        @keyframes db-float1   { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-8px,12px)} }
        @keyframes db-float2   { 0%,100%{transform:translate(0,0)} 50%{transform:translate(10px,-8px)} }
        @keyframes db-float3   { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-15px,10px) scale(1.05)} }
        @keyframes db-bar-fill { from{width:0%} to{width:var(--target-width)} }
        @keyframes db-ring-fill{ from{stroke-dashoffset:${2 * Math.PI * 38}} to{stroke-dashoffset:var(--ring-offset)} }
        @keyframes db-icon-pulse{ 0%,100%{box-shadow:0 0 10px var(--glow,rgba(99,102,241,.2))} 50%{box-shadow:0 0 22px var(--glow,rgba(99,102,241,.45))} }
        @keyframes db-orb-drift1{ 0%,100%{transform:translate(0,0)} 50%{transform:translate(40px,30px)} }
        @keyframes db-orb-drift2{ 0%,100%{transform:translate(0,0)} 50%{transform:translate(-30px,-40px)} }
        @keyframes db-orb-drift3{ 0%,100%{transform:translate(0,0)} 50%{transform:translate(20px,-25px)} }
        @keyframes db-twinkle  { 0%,100%{opacity:.15;transform:scale(1)} 50%{opacity:.8;transform:scale(2)} }
        @keyframes db-header-in{ from{opacity:0;transform:translateX(-20px)} to{opacity:1;transform:translateX(0)} }

        /* Background orbs */
        .db-orb{position:absolute;border-radius:50%;filter:blur(80px);pointer-events:none;}
        .db-orb1{width:400px;height:400px;background:rgba(99,102,241,.18);top:-80px;left:-80px;animation:db-orb-drift1 14s ease-in-out infinite;}
        .db-orb2{width:300px;height:300px;background:rgba(168,85,247,.15);bottom:-60px;right:-60px;animation:db-orb-drift2 11s ease-in-out infinite;}
        .db-orb3{width:200px;height:200px;background:rgba(59,130,246,.12);top:40%;left:55%;animation:db-orb-drift3 9s ease-in-out infinite;}

        /* Card hover effects */
        .db-stat-card:hover { transform:translateY(-4px) scale(1.01) !important; box-shadow:0 14px 36px rgba(99,102,241,.22) !important; }
        .db-stat-card:hover .db-arrow { transform:translateX(3px) !important; }
        .db-stat-card:hover .db-shimmer { animation:db-shimmer-sweep .6s ease forwards !important; }
        @keyframes db-shimmer-sweep{
          from{transform:translateX(-100%) skewX(-15deg);}
          to  {transform:translateX(300%)  skewX(-15deg);}
        }

        /* Shimmer overlay on each card */
        .db-shimmer{
          position:absolute;top:0;left:0;bottom:0;width:50%;
          background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,.08) 50%,transparent 60%);
          transform:translateX(-100%) skewX(-15deg);
          pointer-events:none;
        }

        /* Quick action link hover */
        .db-qa-link:hover{background:rgba(255,255,255,.25) !important;}

        /* Empty state button */
        .db-empty-btn{
          display:inline-flex;align-items:center;gap:8px;
          background:linear-gradient(135deg,#6366f1,#8b5cf6);
          border:none;border-radius:12px;color:#fff;
          font-size:.9rem;font-weight:700;
          padding:12px 24px;cursor:pointer;text-decoration:none;
          box-shadow:0 4px 18px rgba(99,102,241,.4);
          transition:transform .2s,box-shadow .2s;
          position:relative;overflow:hidden;
        }
        .db-empty-btn::after{
          content:'';position:absolute;inset:0;
          background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,.15) 50%,transparent 60%);
          transform:translateX(-100%);transition:transform .5s;
        }
        .db-empty-btn:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(99,102,241,.55);color:#fff;}
        .db-empty-btn:hover::after{transform:translateX(100%);}

        /* Twinkling dots (dark mode) */
        .db-dot{position:fixed;width:3px;height:3px;border-radius:50%;background:rgba(255,255,255,.5);pointer-events:none;z-index:0;}
        .db-dot:nth-child(1){top:12%;left:18%;animation:db-twinkle 3.2s ease-in-out infinite;}
        .db-dot:nth-child(2){top:35%;left:82%;animation:db-twinkle 4.1s ease-in-out infinite .6s;}
        .db-dot:nth-child(3){top:67%;left:25%;animation:db-twinkle 3.6s ease-in-out infinite 1.2s;}
        .db-dot:nth-child(4){top:78%;left:70%;animation:db-twinkle 5.0s ease-in-out infinite 0.3s;}
        .db-dot:nth-child(5){top:22%;left:60%;animation:db-twinkle 4.4s ease-in-out infinite 1.8s;}
        .db-dot:nth-child(6){top:55%;left:92%;animation:db-twinkle 3.8s ease-in-out infinite 0.9s;}

        /* ── Responsive ── */
        @media(max-width:768px){
          .db-stat-grid{ grid-template-columns: repeat(2, 1fr) !important; gap:12px !important; }
          .db-insights-grid{ grid-template-columns: 1fr !important; gap:12px !important; }
        }
        @media(max-width:480px){
          .db-stat-grid{ grid-template-columns: 1fr 1fr !important; gap:10px !important; }
          .db-insights-grid{ grid-template-columns: 1fr !important; }
          .db-header-title{ font-size:1.2rem !important; }
          .db-header-sub{ font-size:.8rem !important; }
          .db-header-badge{ display:none !important; }
          .db-stat-number{ font-size:1.6rem !important; }
        }
        @media(max-width:360px){
          .db-stat-grid{ grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Ambient background (dark only) */}
      <BackgroundOrbs isDark={isDark} />
      {isDark && [1,2,3,4,5,6].map(i => <div key={i} className="db-dot" />)}

      {/* ── Page content (above orbs) ── */}
      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* ── Header ── */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 12,
          marginBottom: 32,
          animation: 'db-header-in .6s ease both',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {/* Animated logo badge */}
            <div style={{
              width: 52, height: 52,
              background: 'linear-gradient(135deg,#6366f1,#a855f7)',
              borderRadius: 15,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 0 0 rgba(99,102,241,.4)',
              animation: 'db-icon-pulse 3s ease-in-out infinite',
              flexShrink: 0,
            }}>
              <IconTrendingUp c="#fff" />
            </div>
            <div>
              <h4 className="db-header-title" style={{
                color: headingC, fontWeight: 800, fontSize: '1.5rem',
                margin: 0, letterSpacing: '-.4px',
                transition: 'color .3s',
              }}>
                Welcome back, {firstName} 👋
              </h4>
              <p className="db-header-sub" style={{ color: subC, margin: 0, fontSize: '.875rem', transition: 'color .3s' }}>
                Here&apos;s your workspace overview for today.
              </p>
            </div>
          </div>

          {/* Live badge */}
          <div className="db-header-badge" style={{
            display: 'flex', alignItems: 'center', gap: 7,
            background: isDark ? 'rgba(16,185,129,.12)' : 'rgba(16,185,129,.08)',
            border: `1px solid ${isDark ? 'rgba(16,185,129,.25)' : 'rgba(16,185,129,.2)'}`,
            borderRadius: 50, padding: '6px 14px',
            animation: 'db-fadein .5s ease both .3s', opacity: 0,
          }}>
            <div style={{
              width: 7, height: 7, borderRadius: '50%',
              background: '#10b981',
              animation: 'db-icon-pulse 2s ease-in-out infinite',
              boxShadow: '0 0 6px rgba(16,185,129,.6)',
            }} />
            <span style={{ fontSize: '.75rem', fontWeight: 700, color: '#10b981', letterSpacing: '.3px' }}>
              LIVE
            </span>
          </div>
        </div>

        {/* ── Error ── */}
        {error && (
          <div style={{
            background: isDark ? 'rgba(248,113,113,0.1)' : '#fef2f2',
            border: `1px solid ${isDark ? 'rgba(248,113,113,0.25)' : '#fca5a5'}`,
            borderRadius: 12, padding: '12px 16px',
            color: isDark ? '#f87171' : '#dc2626',
            fontSize: '.875rem', marginBottom: 20,
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            {error}
          </div>
        )}

        {/* ── Loading ── */}
        {loading && (
          <div style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '80px 0', gap: 16,
          }}>
            <div style={{ position: 'relative', width: 56, height: 56 }}>
              {/* Outer ring */}
              <svg viewBox="0 0 56 56" width="56" height="56" style={{ position:'absolute', inset:0 }}>
                <circle cx="28" cy="28" r="24" fill="none"
                  stroke={isDark ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.1)'}
                  strokeWidth="4"/>
                <circle cx="28" cy="28" r="24" fill="none"
                  stroke="url(#load-grad)" strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray="40 110"
                  transform="rotate(-90 28 28)"
                  style={{ animation: 'db-spin .8s linear infinite' }}
                />
                <defs>
                  <linearGradient id="load-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366f1"/>
                    <stop offset="100%" stopColor="#a855f7"/>
                  </linearGradient>
                </defs>
              </svg>
              {/* Inner dot */}
              <div style={{
                position:'absolute', inset:0,
                display:'flex', alignItems:'center', justifyContent:'center',
              }}>
                <div style={{
                  width:10, height:10, borderRadius:'50%',
                  background:'linear-gradient(135deg,#6366f1,#a855f7)',
                  boxShadow:'0 0 10px rgba(99,102,241,.5)',
                  animation:'db-icon-pulse 1s ease-in-out infinite',
                }}/>
              </div>
            </div>
            <span style={{ color: subC, fontSize: '.875rem', fontWeight:500 }}>Loading your dashboard…</span>
          </div>
        )}

        {/* ── Stats ── */}
        {!loading && stats && (
          <>
            {/* ── Project stat cards ── */}
            <SectionLabel text="Projects" isDark={isDark} delay={0} />
            <div className="db-stat-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill,minmax(210px,1fr))',
              gap: 16, marginBottom: 28,
            }}>
              <StatCard label="Total Projects"    value={stats.totalProjects}      palette="indigo"  Icon={IconFolder}      to="/projects"                    delay={.1}  isDark={isDark} total={stats.totalProjects} />
              <StatCard label="Not Started"        value={stats.projectsNotStarted} palette="slate"   Icon={IconPause}       to="/projects?status=NOT_STARTED" delay={.2}  isDark={isDark} total={stats.totalProjects} />
              <StatCard label="In Progress"        value={stats.projectsInProgress} palette="amber"   Icon={IconClock}       to="/projects?status=IN_PROGRESS" delay={.3}  isDark={isDark} total={stats.totalProjects} />
              <StatCard label="Completed"          value={stats.projectsCompleted}  palette="emerald" Icon={IconCheckCircle} to="/projects?status=COMPLETED"   delay={.4}  isDark={isDark} total={stats.totalProjects} />
            </div>

            {/* ── Task stat cards ── */}
            <SectionLabel text="Tasks" isDark={isDark} delay={.45} />
            <div className="db-stat-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill,minmax(210px,1fr))',
              gap: 16, marginBottom: 28,
            }}>
              <StatCard label="Total Tasks"    value={stats.totalTasks}      palette="sky"    Icon={IconList}        delay={.5}  isDark={isDark} total={stats.totalTasks} />
              <StatCard label="Pending"        value={stats.pendingTasks}    palette="rose"   Icon={IconClock}       delay={.6}  isDark={isDark} total={stats.totalTasks} />
              <StatCard label="In Progress"    value={stats.inProgressTasks} palette="violet" Icon={IconTrendingUp}  delay={.7}  isDark={isDark} total={stats.totalTasks} />
              <StatCard label="Completed"      value={stats.completedTasks}  palette="teal"   Icon={IconCheckCircle} delay={.8}  isDark={isDark} total={stats.totalTasks} />
            </div>

            {/* ── Bottom row: ring + activity + quick action ── */}
            <SectionLabel text="Insights" isDark={isDark} delay={.85} />
            <div className="db-insights-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))',
              gap: 16, marginBottom: 28,
            }}>
              {/* Completion ring */}
              <CompletionRing
                done={stats.completedTasks}
                total={stats.totalTasks}
                isDark={isDark}
                delay={.9}
              />

              {/* Task breakdown */}
              <div style={{
                background: bg2,
                border: `1px solid ${bdr2}`,
                borderRadius: 18,
                padding: '22px 24px',
                animation: 'db-card-in .6s cubic-bezier(.16,1,.3,1) both',
                animationDelay: '.95s', opacity: 0,
                boxShadow: isDark ? '0 4px 24px rgba(0,0,0,.4)' : '0 4px 24px rgba(99,102,241,.08)',
                position: 'relative', overflow: 'hidden',
              }}>
                <div className="db-shimmer" />
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:18 }}>
                  <div style={{
                    width:32, height:32,
                    background:'rgba(99,102,241,.15)', borderRadius:9,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    boxShadow:'0 0 10px rgba(99,102,241,.3)',
                  }}>
                    <IconActivity c="#818cf8" />
                  </div>
                  <span style={{ fontSize:'.85rem', fontWeight:700, color: isDark ? 'rgba(255,255,255,0.8)' : '#1e1b4b' }}>
                    Task Breakdown
                  </span>
                </div>
                <ActivityRow label="Completed"   value={stats.completedTasks}  max={stats.totalTasks} colour="linear-gradient(90deg,#10b981,#34d399)" isDark={isDark} delay={1.0} />
                <ActivityRow label="In Progress" value={stats.inProgressTasks} max={stats.totalTasks} colour="linear-gradient(90deg,#f59e0b,#fbbf24)" isDark={isDark} delay={1.1} />
                <ActivityRow label="Pending"     value={stats.pendingTasks}    max={stats.totalTasks} colour="linear-gradient(90deg,#f43f5e,#fb7185)"  isDark={isDark} delay={1.2} />
              </div>

              {/* Quick action card */}
              <QuickActionCard isDark={isDark} delay={1.0} />
            </div>

            {/* ── Empty state ── */}
            {stats.totalProjects === 0 && (
              <div style={{
                textAlign: 'center', padding: '56px 24px',
                background: bg2,
                border: `1px solid ${bdr2}`,
                borderRadius: 20,
                animation: 'db-card-in .6s ease both 1.1s', opacity: 0,
                boxShadow: isDark ? '0 4px 24px rgba(0,0,0,.35)' : '0 4px 24px rgba(99,102,241,.08)',
              }}>
                <div style={{
                  width: 72, height: 72,
                  background: 'linear-gradient(135deg,#6366f1,#a855f7)',
                  borderRadius: 20, margin: '0 auto 20px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 0 30px rgba(99,102,241,.5)',
                  animation: 'db-icon-pulse 3s ease-in-out infinite',
                }}>
                  <IconFolder c="#fff" />
                </div>
                <h5 style={{ color: headingC, fontWeight: 800, marginBottom: 8, fontSize: '1.15rem' }}>
                  No projects yet
                </h5>
                <p style={{ color: subC, marginBottom: 28, fontSize: '.9rem', maxWidth: 320, margin: '0 auto 28px' }}>
                  Create your first project and start managing your tasks with clarity.
                </p>
                <Link to="/projects" className="db-empty-btn">
                  <IconPlus c="#fff" /> Create your first project
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
