import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { login as apiLogin } from '../../services/authService.js';
import { toast } from '../../components/common/Toast.jsx';

/* ── SVG Icons ───────────────────────────────────────────────────────────── */
const IconLogo = () => (
  <svg viewBox="0 0 24 24" fill="none" width="36" height="36" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 17.5h7M17.5 14v7"/>
  </svg>
);
const IconEmail = ({ c }) => (
  <svg viewBox="0 0 24 24" fill="none" width="18" height="18" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/>
  </svg>
);
const IconEyeOpen = ({ c }) => (
  <svg viewBox="0 0 24 24" fill="none" width="18" height="18" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);
const IconEyeClosed = ({ c }) => (
  <svg viewBox="0 0 24 24" fill="none" width="18" height="18" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);
const IconAlert = () => (
  <svg viewBox="0 0 24 24" fill="none" width="16" height="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}>
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);
const IconFolder = () => (
  <svg viewBox="0 0 24 24" fill="none" width="18" height="18" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
  </svg>
);
const IconCheckSquare = () => (
  <svg viewBox="0 0 24 24" fill="none" width="18" height="18" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
  </svg>
);
const IconBarChart = () => (
  <svg viewBox="0 0 24 24" fill="none" width="18" height="18" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
  </svg>
);
const IconSun = ({ c }) => (
  <svg viewBox="0 0 24 24" fill="none" width="18" height="18" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);
const IconMoon = ({ c }) => (
  <svg viewBox="0 0 24 24" fill="none" width="18" height="18" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);
/* ─────────────────────────────────────────────────────────────────────────── */

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { isDark, toggle } = useTheme();

  const [form, setForm]           = useState({ email: '', password: '' });
  const [errors, setErrors]       = useState({});
  const [loading, setLoading]     = useState(false);
  const [showPw, setShowPw]       = useState(false);
  const [focused, setFocused]     = useState('');

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = 'Email is required.';
    if (!form.password)     e.password = 'Password is required.';
    setErrors(e);
    if (Object.keys(e).length > 0) {
      toast.error('Please fill in all required fields.');
    }
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    setErrors(p => ({ ...p, [e.target.name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const data = await apiLogin(form);
      login(data.user);
      toast.success('Login successful! Welcome back.');
      navigate('/', { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid email or password.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  /* ── Theme tokens ── */
  const t = isDark ? {
    bg:'#0a0a14', rightBg:'#0a0a14',
    cardBg:'#13132a', cardBorder:'rgba(99,102,241,0.2)', cardShadow:'0 25px 60px rgba(0,0,0,0.6)',
    heading:'#ffffff', subtext:'rgba(255,255,255,0.45)', label:'rgba(255,255,255,0.65)',
    inputBg:'rgba(255,255,255,0.05)', inputBorder:'rgba(255,255,255,0.08)',
    inputColor:'#ffffff', inputPH:'rgba(255,255,255,0.2)',
    iconColor:'rgba(255,255,255,0.3)', iconHover:'rgba(255,255,255,0.7)',
    errorText:'#f87171', errorBg:'rgba(248,113,113,0.1)', errorBorder:'rgba(248,113,113,0.25)',
    footerText:'rgba(255,255,255,0.35)', footerLink:'#818cf8',
    toggleBg:'rgba(255,255,255,0.07)', toggleBorder:'rgba(255,255,255,0.1)', toggleColor:'rgba(255,255,255,0.65)',
  } : {
    bg:'#eef2ff', rightBg:'#eef2ff',
    cardBg:'#ffffff', cardBorder:'rgba(99,102,241,0.15)', cardShadow:'0 25px 60px rgba(99,102,241,0.15)',
    heading:'#1e1b4b', subtext:'#6b7280', label:'#374151',
    inputBg:'#f9fafb', inputBorder:'#e5e7eb',
    inputColor:'#111827', inputPH:'#9ca3af',
    iconColor:'#c4b5fd', iconHover:'#6366f1',
    errorText:'#dc2626', errorBg:'#fef2f2', errorBorder:'#fca5a5',
    footerText:'#6b7280', footerLink:'#6366f1',
    toggleBg:'rgba(99,102,241,0.08)', toggleBorder:'rgba(99,102,241,0.15)', toggleColor:'#6366f1',
  };

  const ic = focused === 'email' ? '#6366f1' : t.iconColor;
  const icPw = focused === 'password' ? '#6366f1' : t.iconColor;

  return (
    <>
      <style>{`
        /* ── Global resets for this page ── */
        .al-root *{box-sizing:border-box;margin:0;padding:0;}

        /* ── Layout ── */
        .al-root{min-height:100vh;display:flex;background:${t.bg};transition:background .4s;}

        /* ── Left panel ── */
        .al-left{
          display:none;flex:1;
          background:linear-gradient(135deg,#0d0d1f 0%,#111130 45%,#0a1628 100%);
          position:relative;overflow:hidden;
          align-items:center;justify-content:center;flex-direction:column;padding:60px;
        }
        @media(min-width:1024px){.al-left{display:flex;}}

        /* animated mesh gradient */
        .al-mesh{
          position:absolute;inset:0;
          background:
            radial-gradient(ellipse 60% 50% at 20% 30%, rgba(99,102,241,.3) 0%, transparent 60%),
            radial-gradient(ellipse 50% 40% at 80% 70%, rgba(168,85,247,.25) 0%, transparent 60%),
            radial-gradient(ellipse 40% 60% at 50% 10%, rgba(59,130,246,.15) 0%, transparent 60%);
          animation:al-mesh-shift 12s ease-in-out infinite alternate;
        }
        @keyframes al-mesh-shift{
          0%  {filter:hue-rotate(0deg)   brightness(1);}
          50% {filter:hue-rotate(15deg)  brightness(1.05);}
          100%{filter:hue-rotate(-10deg) brightness(.95);}
        }

        /* floating orbs */
        .al-orb{position:absolute;border-radius:50%;filter:blur(70px);pointer-events:none;}
        .al-orb1{width:340px;height:340px;background:rgba(99,102,241,.35);top:5%;left:-5%;animation:al-float1 8s ease-in-out infinite;}
        .al-orb2{width:260px;height:260px;background:rgba(168,85,247,.3);bottom:5%;right:-5%;animation:al-float2 10s ease-in-out infinite;}
        .al-orb3{width:180px;height:180px;background:rgba(59,130,246,.25);top:50%;left:50%;animation:al-float3 7s ease-in-out infinite;}
        @keyframes al-float1{0%,100%{transform:translate(0,0) scale(1);}50%{transform:translate(30px,25px) scale(1.08);}}
        @keyframes al-float2{0%,100%{transform:translate(0,0) scale(1);}50%{transform:translate(-25px,-20px) scale(1.06);}}
        @keyframes al-float3{0%,100%{transform:translate(-50%,-50%) scale(1);}50%{transform:translate(-50%,-50%) scale(1.15);}}

        /* particle dots */
        .al-particle{
          position:absolute;width:4px;height:4px;border-radius:50%;
          background:rgba(255,255,255,.4);pointer-events:none;
        }
        .al-particle:nth-child(1){top:15%;left:10%;animation:al-twinkle 3s ease-in-out infinite;}
        .al-particle:nth-child(2){top:40%;left:85%;animation:al-twinkle 4s ease-in-out infinite .5s;}
        .al-particle:nth-child(3){top:70%;left:25%;animation:al-twinkle 3.5s ease-in-out infinite 1s;}
        .al-particle:nth-child(4){top:85%;left:65%;animation:al-twinkle 5s ease-in-out infinite 1.5s;}
        .al-particle:nth-child(5){top:25%;left:55%;animation:al-twinkle 4s ease-in-out infinite 2s;}
        .al-particle:nth-child(6){top:60%;left:80%;animation:al-twinkle 3s ease-in-out infinite 0.8s;}
        @keyframes al-twinkle{0%,100%{opacity:.2;transform:scale(1);}50%{opacity:1;transform:scale(2);}}

        .al-brand{position:relative;z-index:2;text-align:center;animation:al-fadein .9s ease both;}
        .al-logo{
          width:76px;height:76px;
          background:linear-gradient(135deg,#6366f1,#a855f7);
          border-radius:22px;
          display:flex;align-items:center;justify-content:center;
          margin:0 auto 24px;
          box-shadow:0 0 0 0 rgba(99,102,241,.5);
          animation:al-pulse-logo 3s ease-in-out infinite;
        }
        @keyframes al-pulse-logo{
          0%,100%{box-shadow:0 0 30px rgba(99,102,241,.4),0 0 0 0 rgba(99,102,241,.2);}
          50%{box-shadow:0 0 50px rgba(99,102,241,.6),0 0 20px 8px rgba(99,102,241,.1);}
        }
        .al-brand h1{color:#fff;font-size:2.1rem;font-weight:800;letter-spacing:-.5px;margin-bottom:12px;}
        .al-brand p{color:rgba(255,255,255,.5);font-size:.95rem;line-height:1.7;max-width:300px;margin:0 auto;}

        .al-features{position:relative;z-index:2;margin-top:44px;display:flex;flex-direction:column;gap:14px;width:100%;max-width:340px;}
        .al-feat{
          display:flex;align-items:center;gap:14px;
          background:rgba(255,255,255,.05);
          border:1px solid rgba(255,255,255,.07);
          border-radius:14px;padding:14px 18px;
          backdrop-filter:blur(12px);
          opacity:0;
          animation:al-slidein .6s ease forwards;
          transition:transform .2s,background .2s;
        }
        .al-feat:hover{background:rgba(255,255,255,.09);transform:translateX(6px);}
        .al-feat:nth-child(1){animation-delay:.3s;}
        .al-feat:nth-child(2){animation-delay:.5s;}
        .al-feat:nth-child(3){animation-delay:.7s;}
        .al-feat-icon{
          width:36px;height:36px;flex-shrink:0;
          background:linear-gradient(135deg,#6366f1,#a855f7);
          border-radius:10px;display:flex;align-items:center;justify-content:center;
        }
        .al-feat span{color:rgba(255,255,255,.75);font-size:.875rem;}

        /* ── Right panel ── */
        .al-right{
          flex:1;display:flex;align-items:center;justify-content:center;
          padding:40px 24px;background:${t.rightBg};transition:background .4s;
        }

        /* Card entrance */
        .al-card{
          width:100%;max-width:440px;
          background:${t.cardBg};
          border:1px solid ${t.cardBorder};
          border-radius:24px;
          padding:40px;
          box-shadow:${t.cardShadow};
          transition:background .4s,border-color .4s,box-shadow .4s;
          animation:al-card-in .7s cubic-bezier(.16,1,.3,1) both;
          position:relative;overflow:hidden;
        }
        /* top shimmer line */
        .al-card::before{
          content:'';
          position:absolute;top:0;left:-100%;width:60%;height:2px;
          background:linear-gradient(90deg,transparent,rgba(99,102,241,.8),transparent);
          animation:al-shimmer-line 3s ease-in-out infinite 1s;
        }
        @keyframes al-shimmer-line{0%{left:-60%;}100%{left:160%;}}
        @keyframes al-card-in{
          from{opacity:0;transform:translateY(32px) scale(.97);}
          to  {opacity:1;transform:translateY(0)    scale(1);}
        }

        /* Toggle */
        .al-toggle{
          display:inline-flex;align-items:center;gap:7px;
          background:${t.toggleBg};border:1px solid ${t.toggleBorder};
          border-radius:50px;padding:7px 14px;
          cursor:pointer;color:${t.toggleColor};font-size:.8rem;font-weight:600;
          transition:all .25s;flex-shrink:0;
        }
        .al-toggle:hover{transform:scale(1.05);opacity:.85;}
        .al-toggle:active{transform:scale(.97);}

        /* Header */
        .al-header{margin-bottom:32px;}
        .al-header-row{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:6px;}
        .al-header-row h2{
          color:${t.heading};font-size:1.8rem;font-weight:800;letter-spacing:-.4px;
          animation:al-fadein .5s ease both .2s;opacity:0;
        }
        .al-header p{
          color:${t.subtext};font-size:.9rem;
          animation:al-fadein .5s ease both .35s;opacity:0;
        }
        @keyframes al-fadein{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}
        @keyframes al-slidein{from{opacity:0;transform:translateX(-18px);}to{opacity:1;transform:translateX(0);}}

        /* Fields */
        .al-field{
          margin-bottom:20px;
          animation:al-fadein .5s ease both;opacity:0;
        }
        .al-field:nth-child(1){animation-delay:.4s;}
        .al-field:nth-child(2){animation-delay:.55s;}
        .al-label{
          display:block;color:${t.label};font-size:.83rem;font-weight:600;
          margin-bottom:8px;letter-spacing:.3px;text-transform:uppercase;
          transition:color .3s;
        }
        .al-wrap{position:relative;}
        .al-input{
          width:100%;
          background:${t.inputBg};
          border:1.5px solid ${t.inputBorder};
          border-radius:12px;
          padding:13px 46px 13px 16px;
          color:${t.inputColor};font-size:.95rem;outline:none;
          transition:border-color .2s,box-shadow .2s,background .3s,transform .15s;
          box-sizing:border-box;
        }
        .al-input::placeholder{color:${t.inputPH};}
        .al-input:focus{
          border-color:#6366f1;
          background:${isDark ? 'rgba(99,102,241,0.07)' : '#f0f1ff'};
          box-shadow:0 0 0 3.5px rgba(99,102,241,.18);
          transform:translateY(-1px);
        }
        .al-input.err{border-color:#f87171;box-shadow:0 0 0 3px rgba(248,113,113,.15);}
        .al-icon-btn{
          position:absolute;right:13px;top:50%;transform:translateY(-50%);
          color:${t.iconColor};cursor:pointer;background:none;border:none;
          padding:5px;display:flex;align-items:center;border-radius:8px;
          transition:color .2s,transform .2s,background .2s;
        }
        .al-icon-btn:hover{color:${t.iconHover};transform:translateY(-50%) scale(1.15);}
        .al-icon-static{
          position:absolute;right:13px;top:50%;transform:translateY(-50%);
          pointer-events:none;display:flex;
          transition:color .2s;
        }
        .al-err-msg{
          color:${t.errorText};font-size:.8rem;margin-top:6px;
          display:flex;align-items:center;gap:5px;
          animation:al-shake .35s ease;
        }
        @keyframes al-shake{0%,100%{transform:translateX(0);}25%{transform:translateX(-5px);}75%{transform:translateX(5px);}}
        .al-api-err{
          background:${t.errorBg};border:1px solid ${t.errorBorder};
          border-radius:12px;padding:12px 16px;color:${t.errorText};font-size:.875rem;
          margin-bottom:20px;display:flex;align-items:center;gap:10px;
          animation:al-fadein .3s ease;
        }

        /* Submit button */
        .al-btn{
          width:100%;padding:14px;
          background:linear-gradient(135deg,#6366f1 0%,#8b5cf6 50%,#6366f1 100%);
          background-size:200% 100%;
          border:none;border-radius:14px;
          color:#fff;font-size:1rem;font-weight:700;letter-spacing:.3px;
          cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;
          transition:background-position .4s,box-shadow .25s,transform .15s,opacity .2s;
          box-shadow:0 5px 24px rgba(99,102,241,.4);
          margin-top:10px;
          animation:al-fadein .5s ease both .7s;opacity:0;
          position:relative;overflow:hidden;
        }
        /* ripple sweep on hover */
        .al-btn::after{
          content:'';position:absolute;inset:0;
          background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,.15) 50%,transparent 60%);
          transform:translateX(-100%);
          transition:transform .5s ease;
        }
        .al-btn:hover:not(:disabled){
          background-position:100% 0;
          box-shadow:0 8px 32px rgba(99,102,241,.55);
          transform:translateY(-2px);
        }
        .al-btn:hover:not(:disabled)::after{transform:translateX(100%);}
        .al-btn:active:not(:disabled){transform:translateY(0) scale(.98);}
        .al-btn:disabled{opacity:.55;cursor:not-allowed;}

        /* Footer */
        .al-footer{
          text-align:center;margin-top:26px;color:${t.footerText};font-size:.875rem;
          animation:al-fadein .5s ease both .85s;opacity:0;
        }
        .al-footer a{
          color:${t.footerLink};text-decoration:none;font-weight:700;
          position:relative;
        }
        .al-footer a::after{
          content:'';position:absolute;bottom:-2px;left:0;width:0;height:1.5px;
          background:${t.footerLink};transition:width .25s ease;
        }
        .al-footer a:hover::after{width:100%;}

        /* Spinner */
        .al-spin{
          display:inline-block;width:18px;height:18px;flex-shrink:0;
          border:2.5px solid rgba(255,255,255,.3);border-top-color:#fff;
          border-radius:50%;animation:al-spin .65s linear infinite;
        }
        @keyframes al-spin{to{transform:rotate(360deg);}}

        /* ── Responsive ── */
        @media(max-width:1023px){
          .al-right{ padding:32px 16px; }
        }
        @media(max-width:599px){
          .al-right{ padding:20px 12px; align-items:flex-start; }
          .al-card{ padding:28px 20px; border-radius:18px; max-width:100%; }
          .al-header-row h2{ font-size:1.45rem; }
          .al-header p{ font-size:.85rem; }
          .al-input{ padding:12px 44px 12px 14px; font-size:.9rem; }
          .al-btn{ padding:13px; font-size:.93rem; }
          .al-toggle{ padding:6px 11px; font-size:.75rem; }
          .al-footer{ font-size:.82rem; }
        }
        @media(max-width:380px){
          .al-card{ padding:22px 14px; }
          .al-header-row h2{ font-size:1.25rem; }
        }
      `}</style>

      <div className="al-root">
        {/* ── Left panel ── */}
        <div className="al-left">
          <div className="al-mesh" />
          <div className="al-orb al-orb1" />
          <div className="al-orb al-orb2" />
          <div className="al-orb al-orb3" />
          {[1,2,3,4,5,6].map(i => <div key={i} className="al-particle" />)}

          <div className="al-brand">
            <div className="al-logo"><IconLogo /></div>
            <h1>ProjectFlow</h1>
            <p>The professional workspace for teams that ship. Manage projects and tasks with clarity.</p>
          </div>

          <div className="al-features">
            {[
              { icon: <IconFolder />,      text: 'Organise projects by status and priority' },
              { icon: <IconCheckSquare />, text: 'Track tasks with real-time status updates' },
              { icon: <IconBarChart />,    text: 'Dashboard insights at a glance' },
            ].map(({ icon, text }) => (
              <div className="al-feat" key={text}>
                <div className="al-feat-icon">{icon}</div>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right panel ── */}
        <div className="al-right">
          <div className="al-card">
            <div className="al-header">
              <div className="al-header-row">
                <h2>Welcome back</h2>
                <button className="al-toggle" onClick={toggle} aria-label="Toggle theme">
                  {isDark ? <IconSun c={t.toggleColor} /> : <IconMoon c={t.toggleColor} />}
                  {isDark ? 'Light' : 'Dark'}
                </button>
              </div>
              <p>Sign in to your account to continue</p>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <div className="al-field" style={{animationDelay:'.4s'}}>
                <label className="al-label" htmlFor="email">Email address</label>
                <div className="al-wrap">
                  <input id="email" type="email" name="email"
                    className={`al-input${errors.email ? ' err' : ''}`}
                    value={form.email} onChange={handleChange}
                    onFocus={() => setFocused('email')}
                    onBlur={() => setFocused('')}
                    placeholder="you@example.com"
                    autoComplete="email" disabled={loading} />
                  <span className="al-icon-static" style={{color: ic}} aria-hidden="true">
                    <IconEmail c={ic} />
                  </span>
                </div>
                {errors.email && <div className="al-err-msg"><IconAlert /> {errors.email}</div>}
              </div>

              <div className="al-field" style={{animationDelay:'.55s'}}>
                <label className="al-label" htmlFor="password">Password</label>
                <div className="al-wrap">
                  <input id="password" type={showPw ? 'text' : 'password'} name="password"
                    className={`al-input${errors.password ? ' err' : ''}`}
                    value={form.password} onChange={handleChange}
                    onFocus={() => setFocused('password')}
                    onBlur={() => setFocused('')}
                    placeholder="Enter your password"
                    autoComplete="current-password" disabled={loading} />
                  <button type="button" className="al-icon-btn"
                    onClick={() => setShowPw(v => !v)}
                    aria-label={showPw ? 'Hide' : 'Show'}>
                    {showPw ? <IconEyeClosed c={icPw} /> : <IconEyeOpen c={icPw} />}
                  </button>
                </div>
                {errors.password && <div className="al-err-msg"><IconAlert /> {errors.password}</div>}
              </div>

              <button type="submit" className="al-btn" disabled={loading}
                style={{animationDelay:'.7s'}}>
                {loading ? <><span className="al-spin" /> Signing in…</> : 'Sign In →'}
              </button>
            </form>

            <div className="al-footer" style={{animationDelay:'.85s'}}>
              Don&apos;t have an account?{' '}
              <Link to="/register">Register</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
