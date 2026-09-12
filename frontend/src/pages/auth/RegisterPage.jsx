import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register as apiRegister } from '../../services/authService.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { toast } from '../../components/common/Toast.jsx';

/* ── SVG Icons ───────────────────────────────────────────────────────────── */
const IconLogo = () => (
  <svg viewBox="0 0 24 24" fill="none" width="36" height="36" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 17.5h7M17.5 14v7"/>
  </svg>
);
const IconUser = ({ c }) => (
  <svg viewBox="0 0 24 24" fill="none" width="18" height="18" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const IconEmail = ({ c }) => (
  <svg viewBox="0 0 24 24" fill="none" width="18" height="18" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/>
  </svg>
);
const IconLock = ({ c }) => (
  <svg viewBox="0 0 24 24" fill="none" width="18" height="18" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
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
const IconCheck = ({ c }) => (
  <svg viewBox="0 0 24 24" fill="none" width="14" height="14" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}>
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IconUserPlus = () => (
  <svg viewBox="0 0 24 24" fill="none" width="18" height="18" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>
  </svg>
);
const IconTarget = () => (
  <svg viewBox="0 0 24 24" fill="none" width="18" height="18" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
  </svg>
);
const IconTrendingUp = () => (
  <svg viewBox="0 0 24 24" fill="none" width="18" height="18" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
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

const getStrength = (pw) => {
  if (!pw) return 0;
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
};
const SMETA = [
  { label:'Weak',   colour:'#f87171' },
  { label:'Fair',   colour:'#fbbf24' },
  { label:'Good',   colour:'#34d399' },
  { label:'Strong', colour:'#6366f1' },
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { isDark, toggle } = useTheme();

  const [form, setForm]         = useState({ fullName:'', email:'', password:'', confirmPassword:'' });
  const [errors, setErrors]     = useState({});
  const [loading, setLoading]   = useState(false);
  const [showPw, setShowPw]     = useState(false);
  const [showCf, setShowCf]     = useState(false);
  const [focused, setFocused]   = useState('');

  const validate = () => {
    const e = {};
    if (!form.fullName.trim())  e.fullName = 'Full name is required.';
    if (!form.email.trim())     e.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email.';
    if (!form.password)         e.password = 'Password is required.';
    else if (form.password.length < 8) e.password = 'Minimum 8 characters.';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match.';
    setErrors(e);
    if (Object.keys(e).length > 0) {
      const first = Object.values(e)[0];
      toast.error(first);
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
      const { fullName, email, password } = form;
      const data = await apiRegister({ fullName, email, password });
      login(data.user);
      toast.success('Account created! Welcome to ProjectFlow.');
      navigate('/', { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const strength = getStrength(form.password);
  const meta = strength > 0 ? SMETA[strength - 1] : null;

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
    termsText:'rgba(255,255,255,0.3)', termsLink:'#818cf8',
    toggleBg:'rgba(255,255,255,0.07)', toggleBorder:'rgba(255,255,255,0.1)', toggleColor:'rgba(255,255,255,0.65)',
    strengthBg:'rgba(255,255,255,0.07)',
  } : {
    bg:'#eef2ff', rightBg:'#eef2ff',
    cardBg:'#ffffff', cardBorder:'rgba(99,102,241,0.15)', cardShadow:'0 25px 60px rgba(99,102,241,0.15)',
    heading:'#1e1b4b', subtext:'#6b7280', label:'#374151',
    inputBg:'#f9fafb', inputBorder:'#e5e7eb',
    inputColor:'#111827', inputPH:'#9ca3af',
    iconColor:'#c4b5fd', iconHover:'#6366f1',
    errorText:'#dc2626', errorBg:'#fef2f2', errorBorder:'#fca5a5',
    footerText:'#6b7280', footerLink:'#6366f1',
    termsText:'#9ca3af', termsLink:'#6366f1',
    toggleBg:'rgba(99,102,241,0.08)', toggleBorder:'rgba(99,102,241,0.15)', toggleColor:'#6366f1',
    strengthBg:'#e5e7eb',
  };

  const ic = (f) => focused === f ? '#6366f1' : t.iconColor;

  return (
    <>
      <style>{`
        .ar-root *{box-sizing:border-box;margin:0;padding:0;}
        .ar-root{min-height:100vh;display:flex;background:${t.bg};transition:background .4s;}

        /* Left panel */
        .ar-left{display:none;flex:1;background:linear-gradient(135deg,#0d0d1f 0%,#111130 45%,#0a1628 100%);position:relative;overflow:hidden;align-items:center;justify-content:center;flex-direction:column;padding:60px;}
        @media(min-width:1024px){.ar-left{display:flex;}}
        .ar-mesh{position:absolute;inset:0;background:radial-gradient(ellipse 60% 50% at 20% 30%,rgba(99,102,241,.3) 0%,transparent 60%),radial-gradient(ellipse 50% 40% at 80% 70%,rgba(168,85,247,.25) 0%,transparent 60%),radial-gradient(ellipse 40% 60% at 50% 10%,rgba(59,130,246,.15) 0%,transparent 60%);animation:ar-mesh-shift 12s ease-in-out infinite alternate;}
        @keyframes ar-mesh-shift{0%{filter:hue-rotate(0deg) brightness(1);}50%{filter:hue-rotate(15deg) brightness(1.05);}100%{filter:hue-rotate(-10deg) brightness(.95);}}
        .ar-orb{position:absolute;border-radius:50%;filter:blur(70px);pointer-events:none;}
        .ar-orb1{width:340px;height:340px;background:rgba(99,102,241,.35);top:5%;left:-5%;animation:ar-float1 8s ease-in-out infinite;}
        .ar-orb2{width:260px;height:260px;background:rgba(168,85,247,.3);bottom:5%;right:-5%;animation:ar-float2 10s ease-in-out infinite;}
        .ar-orb3{width:180px;height:180px;background:rgba(59,130,246,.25);top:50%;left:50%;animation:ar-float3 7s ease-in-out infinite;}
        @keyframes ar-float1{0%,100%{transform:translate(0,0);}50%{transform:translate(30px,25px);}}
        @keyframes ar-float2{0%,100%{transform:translate(0,0);}50%{transform:translate(-25px,-20px);}}
        @keyframes ar-float3{0%,100%{transform:translate(-50%,-50%);}50%{transform:translate(-50%,-50%) scale(1.15);}}
        .ar-particle{position:absolute;width:4px;height:4px;border-radius:50%;background:rgba(255,255,255,.4);pointer-events:none;}
        .ar-particle:nth-child(1){top:12%;left:12%;animation:ar-twinkle 3s ease-in-out infinite;}
        .ar-particle:nth-child(2){top:42%;left:82%;animation:ar-twinkle 4s ease-in-out infinite .5s;}
        .ar-particle:nth-child(3){top:68%;left:22%;animation:ar-twinkle 3.5s ease-in-out infinite 1s;}
        .ar-particle:nth-child(4){top:82%;left:62%;animation:ar-twinkle 5s ease-in-out infinite 1.5s;}
        .ar-particle:nth-child(5){top:22%;left:52%;animation:ar-twinkle 4s ease-in-out infinite 2s;}
        @keyframes ar-twinkle{0%,100%{opacity:.2;transform:scale(1);}50%{opacity:1;transform:scale(2.2);}}

        .ar-brand{position:relative;z-index:2;text-align:center;animation:ar-fadein .9s ease both;}
        .ar-logo{width:76px;height:76px;background:linear-gradient(135deg,#6366f1,#a855f7);border-radius:22px;display:flex;align-items:center;justify-content:center;margin:0 auto 24px;animation:ar-pulse-logo 3s ease-in-out infinite;}
        @keyframes ar-pulse-logo{0%,100%{box-shadow:0 0 30px rgba(99,102,241,.4);}50%{box-shadow:0 0 50px rgba(99,102,241,.7),0 0 20px 8px rgba(99,102,241,.1);}}
        .ar-brand h1{color:#fff;font-size:2.1rem;font-weight:800;letter-spacing:-.5px;margin-bottom:12px;}
        .ar-brand p{color:rgba(255,255,255,.5);font-size:.95rem;line-height:1.7;max-width:300px;margin:0 auto;}

        .ar-steps{position:relative;z-index:2;margin-top:44px;display:flex;flex-direction:column;gap:0;width:100%;max-width:340px;}
        .ar-step{display:flex;align-items:flex-start;gap:16px;padding:0 0 26px 0;position:relative;opacity:0;animation:ar-slidein .6s ease forwards;}
        .ar-step:nth-child(1){animation-delay:.3s;}
        .ar-step:nth-child(2){animation-delay:.5s;}
        .ar-step:nth-child(3){animation-delay:.7s;}
        .ar-step:not(:last-child)::after{content:'';position:absolute;left:17px;top:38px;bottom:0;width:2px;background:linear-gradient(to bottom,rgba(99,102,241,.5),transparent);}
        .ar-step-num{width:36px;height:36px;flex-shrink:0;background:linear-gradient(135deg,#6366f1,#a855f7);border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 0 14px rgba(99,102,241,.4);}
        .ar-step-text strong{display:block;color:#fff;font-size:.88rem;margin-bottom:3px;}
        .ar-step-text span{color:rgba(255,255,255,.45);font-size:.8rem;}

        /* Right */
        .ar-right{flex:1;display:flex;align-items:center;justify-content:center;padding:40px 24px;background:${t.rightBg};overflow-y:auto;transition:background .4s;}
        .ar-card{
          width:100%;max-width:460px;
          background:${t.cardBg};border:1px solid ${t.cardBorder};
          border-radius:24px;padding:40px;
          box-shadow:${t.cardShadow};
          transition:background .4s,border-color .4s;
          animation:ar-card-in .7s cubic-bezier(.16,1,.3,1) both;
          position:relative;overflow:hidden;
        }
        .ar-card::before{content:'';position:absolute;top:0;left:-100%;width:60%;height:2px;background:linear-gradient(90deg,transparent,rgba(99,102,241,.8),transparent);animation:ar-shimmer-line 3s ease-in-out infinite 1.2s;}
        @keyframes ar-shimmer-line{0%{left:-60%;}100%{left:160%;}}
        @keyframes ar-card-in{from{opacity:0;transform:translateY(32px) scale(.97);}to{opacity:1;transform:none;}}

        .ar-toggle{display:inline-flex;align-items:center;gap:7px;background:${t.toggleBg};border:1px solid ${t.toggleBorder};border-radius:50px;padding:7px 14px;cursor:pointer;color:${t.toggleColor};font-size:.8rem;font-weight:600;transition:all .25s;flex-shrink:0;}
        .ar-toggle:hover{transform:scale(1.05);opacity:.85;}

        .ar-header{margin-bottom:24px;}
        .ar-header-row{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:6px;}
        .ar-header-row h2{color:${t.heading};font-size:1.75rem;font-weight:800;letter-spacing:-.4px;animation:ar-fadein .5s ease both .2s;opacity:0;}
        .ar-header p{color:${t.subtext};font-size:.88rem;animation:ar-fadein .5s ease both .35s;opacity:0;}
        @keyframes ar-fadein{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}
        @keyframes ar-slidein{from{opacity:0;transform:translateX(-18px);}to{opacity:1;transform:translateX(0);}}

        .ar-field{margin-bottom:16px;animation:ar-fadein .5s ease both;opacity:0;}
        .ar-label{display:block;color:${t.label};font-size:.78rem;font-weight:600;margin-bottom:6px;letter-spacing:.4px;text-transform:uppercase;transition:color .3s;}
        .ar-wrap{position:relative;}
        .ar-input{
          width:100%;background:${t.inputBg};border:1.5px solid ${t.inputBorder};
          border-radius:12px;padding:12px 46px 12px 14px;
          color:${t.inputColor};font-size:.9rem;outline:none;
          transition:border-color .2s,box-shadow .2s,background .3s,transform .15s;
          box-sizing:border-box;
        }
        .ar-input::placeholder{color:${t.inputPH};}
        .ar-input:focus{border-color:#6366f1;background:${isDark ? 'rgba(99,102,241,0.07)' : '#f0f1ff'};box-shadow:0 0 0 3.5px rgba(99,102,241,.18);transform:translateY(-1px);}
        .ar-input.err{border-color:#f87171;box-shadow:0 0 0 3px rgba(248,113,113,.15);}
        .ar-icon-btn{position:absolute;right:12px;top:50%;transform:translateY(-50%);color:${t.iconColor};cursor:pointer;background:none;border:none;padding:5px;display:flex;align-items:center;border-radius:8px;transition:color .2s,transform .2s;}
        .ar-icon-btn:hover{color:${t.iconHover};transform:translateY(-50%) scale(1.15);}
        .ar-icon-static{position:absolute;right:12px;top:50%;transform:translateY(-50%);pointer-events:none;display:flex;transition:color .2s;}
        .ar-err-msg{color:${t.errorText};font-size:.78rem;margin-top:5px;display:flex;align-items:center;gap:5px;animation:ar-shake .35s ease;}
        @keyframes ar-shake{0%,100%{transform:translateX(0);}25%{transform:translateX(-5px);}75%{transform:translateX(5px);}}
        .ar-api-err{background:${t.errorBg};border:1px solid ${t.errorBorder};border-radius:12px;padding:12px 16px;color:${t.errorText};font-size:.85rem;margin-bottom:18px;display:flex;align-items:center;gap:10px;animation:ar-fadein .3s ease;}

        .ar-row{display:flex;gap:14px;}
        .ar-row .ar-field{flex:1;min-width:0;}

        .ar-strength-bar{margin-top:6px;height:3px;border-radius:4px;background:${t.strengthBg};overflow:hidden;}
        .ar-strength-fill{height:100%;border-radius:4px;transition:width .4s cubic-bezier(.4,0,.2,1),background .3s;}
        .ar-strength-label{font-size:.75rem;margin-top:4px;font-weight:600;display:flex;align-items:center;gap:4px;transition:color .3s;}

        .ar-terms{font-size:.78rem;color:${t.termsText};margin-top:12px;text-align:center;line-height:1.6;}
        .ar-terms a{color:${t.termsLink};text-decoration:none;}
        .ar-terms a:hover{text-decoration:underline;}

        .ar-btn{
          width:100%;padding:13px;
          background:linear-gradient(135deg,#6366f1 0%,#8b5cf6 50%,#6366f1 100%);
          background-size:200% 100%;
          border:none;border-radius:14px;
          color:#fff;font-size:.95rem;font-weight:700;letter-spacing:.3px;
          cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;
          transition:background-position .4s,box-shadow .25s,transform .15s,opacity .2s;
          box-shadow:0 5px 24px rgba(99,102,241,.4);margin-top:8px;
          animation:ar-fadein .5s ease both;position:relative;overflow:hidden;
        }
        .ar-btn::after{content:'';position:absolute;inset:0;background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,.15) 50%,transparent 60%);transform:translateX(-100%);transition:transform .5s ease;}
        .ar-btn:hover:not(:disabled){background-position:100% 0;box-shadow:0 8px 32px rgba(99,102,241,.55);transform:translateY(-2px);}
        .ar-btn:hover:not(:disabled)::after{transform:translateX(100%);}
        .ar-btn:active:not(:disabled){transform:translateY(0) scale(.98);}
        .ar-btn:disabled{opacity:.55;cursor:not-allowed;}

        .ar-footer{text-align:center;margin-top:20px;color:${t.footerText};font-size:.85rem;animation:ar-fadein .5s ease both;}
        .ar-footer a{color:${t.footerLink};text-decoration:none;font-weight:700;position:relative;}
        .ar-footer a::after{content:'';position:absolute;bottom:-2px;left:0;width:0;height:1.5px;background:${t.footerLink};transition:width .25s;}
        .ar-footer a:hover::after{width:100%;}

        .ar-spin{display:inline-block;width:17px;height:17px;flex-shrink:0;border:2.5px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:ar-spin .65s linear infinite;}
        @keyframes ar-spin{to{transform:rotate(360deg);}}

        /* ── Responsive ── */
        @media(max-width:1023px){
          .ar-right{ padding:32px 16px; }
        }
        @media(max-width:599px){
          .ar-right{ padding:20px 12px; align-items:flex-start; }
          .ar-card{ padding:26px 18px; border-radius:18px; max-width:100%; }
          .ar-header-row h2{ font-size:1.4rem; }
          .ar-header p{ font-size:.83rem; }
          .ar-input{ padding:11px 44px 11px 13px; font-size:.88rem; }
          .ar-row{ flex-direction:column; gap:0; }
          .ar-btn{ padding:12px; font-size:.9rem; }
          .ar-toggle{ padding:6px 11px; font-size:.75rem; }
          .ar-footer{ font-size:.82rem; }
          .ar-terms{ font-size:.75rem; }
        }
        @media(max-width:380px){
          .ar-card{ padding:20px 12px; }
          .ar-header-row h2{ font-size:1.2rem; }
        }
      `}</style>

      <div className="ar-root">
        {/* Left panel */}
        <div className="ar-left">
          <div className="ar-mesh"/>
          <div className="ar-orb ar-orb1"/><div className="ar-orb ar-orb2"/><div className="ar-orb ar-orb3"/>
          {[1,2,3,4,5].map(i => <div key={i} className="ar-particle"/>)}

          <div className="ar-brand">
            <div className="ar-logo"><IconLogo/></div>
            <h1>ProjectFlow</h1>
            <p>Get started in minutes. No credit card required.</p>
          </div>

          <div className="ar-steps">
            {[
              { icon:<IconUserPlus/>, title:'Create your account',      sub:'Quick sign-up, completely free' },
              { icon:<IconTarget/>,   title:'Set up your first project', sub:'Add tasks, priorities and deadlines' },
              { icon:<IconTrendingUp/>, title:'Track your progress',    sub:'Real-time dashboard keeps you on top' },
            ].map(({ icon, title, sub }) => (
              <div className="ar-step" key={title}>
                <div className="ar-step-num">{icon}</div>
                <div className="ar-step-text"><strong>{title}</strong><span>{sub}</span></div>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div className="ar-right">
          <div className="ar-card">
            <div className="ar-header">
              <div className="ar-header-row">
                <h2>Create an account</h2>
                <button className="ar-toggle" onClick={toggle} aria-label="Toggle theme">
                  {isDark ? <IconSun c={t.toggleColor}/> : <IconMoon c={t.toggleColor}/>}
                  {isDark ? 'Light' : 'Dark'}
                </button>
              </div>
              <p>Join thousands of teams managing work better</p>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              {/* Full name */}
              <div className="ar-field" style={{animationDelay:'.35s'}}>
                <label className="ar-label" htmlFor="fullName">Full Name</label>
                <div className="ar-wrap">
                  <input id="fullName" type="text" name="fullName"
                    className={`ar-input${errors.fullName ? ' err' : ''}`}
                    value={form.fullName} onChange={handleChange}
                    onFocus={() => setFocused('fullName')} onBlur={() => setFocused('')}
                    placeholder="Jane Smith" autoComplete="name" disabled={loading}/>
                  <span className="ar-icon-static" style={{color: ic('fullName')}} aria-hidden="true">
                    <IconUser c={ic('fullName')}/>
                  </span>
                </div>
                {errors.fullName && <div className="ar-err-msg"><IconAlert/> {errors.fullName}</div>}
              </div>

              {/* Email */}
              <div className="ar-field" style={{animationDelay:'.48s'}}>
                <label className="ar-label" htmlFor="email">Email Address</label>
                <div className="ar-wrap">
                  <input id="email" type="email" name="email"
                    className={`ar-input${errors.email ? ' err' : ''}`}
                    value={form.email} onChange={handleChange}
                    onFocus={() => setFocused('email')} onBlur={() => setFocused('')}
                    placeholder="you@example.com" autoComplete="email" disabled={loading}/>
                  <span className="ar-icon-static" style={{color: ic('email')}} aria-hidden="true">
                    <IconEmail c={ic('email')}/>
                  </span>
                </div>
                {errors.email && <div className="ar-err-msg"><IconAlert/> {errors.email}</div>}
              </div>

              {/* Password row */}
              <div className="ar-row">
                <div className="ar-field" style={{animationDelay:'.61s'}}>
                  <label className="ar-label" htmlFor="password">Password</label>
                  <div className="ar-wrap">
                    <input id="password" type={showPw ? 'text' : 'password'} name="password"
                      className={`ar-input${errors.password ? ' err' : ''}`}
                      value={form.password} onChange={handleChange}
                      onFocus={() => setFocused('password')} onBlur={() => setFocused('')}
                      placeholder="Min. 8 chars" autoComplete="new-password" disabled={loading}/>
                    <button type="button" className="ar-icon-btn"
                      onClick={() => setShowPw(v => !v)} aria-label={showPw ? 'Hide' : 'Show'}>
                      {showPw ? <IconEyeClosed c={ic('password')}/> : <IconEyeOpen c={ic('password')}/>}
                    </button>
                  </div>
                  {form.password && meta && (
                    <>
                      <div className="ar-strength-bar">
                        <div className="ar-strength-fill"
                          style={{width:`${(strength/4)*100}%`, background:meta.colour}}/>
                      </div>
                      <div className="ar-strength-label" style={{color:meta.colour}}>
                        {strength === 4 && <IconCheck c={meta.colour}/>} {meta.label}
                      </div>
                    </>
                  )}
                  {errors.password && <div className="ar-err-msg"><IconAlert/> {errors.password}</div>}
                </div>

                <div className="ar-field" style={{animationDelay:'.74s'}}>
                  <label className="ar-label" htmlFor="confirmPassword">Confirm</label>
                  <div className="ar-wrap">
                    <input id="confirmPassword" type={showCf ? 'text' : 'password'} name="confirmPassword"
                      className={`ar-input${errors.confirmPassword ? ' err' : ''}`}
                      value={form.confirmPassword} onChange={handleChange}
                      onFocus={() => setFocused('confirm')} onBlur={() => setFocused('')}
                      placeholder="Re-enter" autoComplete="new-password" disabled={loading}/>
                    <button type="button" className="ar-icon-btn"
                      onClick={() => setShowCf(v => !v)} aria-label={showCf ? 'Hide' : 'Show'}>
                      {showCf ? <IconEyeClosed c={ic('confirm')}/> : <IconEyeOpen c={ic('confirm')}/>}
                    </button>
                  </div>
                  {errors.confirmPassword && <div className="ar-err-msg"><IconAlert/> {errors.confirmPassword}</div>}
                </div>
              </div>

              <button type="submit" className="ar-btn" disabled={loading}
                style={{animationDelay:'.87s'}}>
                {loading
                  ? <><span className="ar-spin"/> Creating account…</>
                  : <><IconLock c="#fff"/> Create Account →</>}
              </button>

              <p className="ar-terms" style={{animationDelay:'1s'}}>
                By registering you agree to our <a href="#">Terms</a> and <a href="#">Privacy Policy</a>
              </p>
            </form>

            <div className="ar-footer" style={{animationDelay:'1.05s'}}>
              Already have an account? <Link to="/login">Sign in here</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
