import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext.jsx';
import Navbar from '../components/layout/Navbar.jsx';
import Sidebar from '../components/layout/Sidebar.jsx';

/* Hook to track window width */
function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return width;
}

export default function MainLayout() {
  const { isDark } = useTheme();
  const location   = useLocation();
  const width      = useWindowWidth();

  const isMobile   = width < 768;
  const isTablet   = width >= 768 && width < 1024;
  const isDesktop  = width >= 1024;

  /* Mobile drawer open/close */
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* Close drawer on route change */
  useEffect(() => { setSidebarOpen(false); }, [location.pathname]);

  /* Close drawer if resized to tablet/desktop */
  useEffect(() => { if (!isMobile) setSidebarOpen(false); }, [isMobile]);

  /* Prevent body scroll when drawer open */
  useEffect(() => {
    document.body.style.overflow = (isMobile && sidebarOpen) ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobile, sidebarOpen]);

  const mainBg = isDark ? '#0a0a14' : '#f0f4ff';

  return (
    <div style={{ display:'flex', flexDirection:'column', minHeight:'100vh', background:mainBg, transition:'background .3s' }}>
      <Navbar
        onMenuClick={() => setSidebarOpen(o => !o)}
        showMenuBtn={isMobile}
      />
      <div style={{ display:'flex', flex:1, position:'relative' }}>
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          isCollapsed={isTablet}
        />
        <main style={{
          flex: 1,
          padding: isMobile ? '20px 14px' : isTablet ? '28px 20px' : '32px 28px',
          background: mainBg,
          transition: 'background .3s, padding .3s',
          minHeight: '100%',
          overflowY: 'auto',
          /* Prevent content hiding behind fixed drawer on mobile */
          marginLeft: isMobile ? 0 : undefined,
        }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
