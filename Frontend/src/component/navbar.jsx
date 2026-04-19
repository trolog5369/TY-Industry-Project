import { useLocation, useNavigate } from 'react-router-dom';
import { FiHome, FiFileText, FiPackage, FiUsers, FiUser, FiTruck, FiPieChart, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { useState, useEffect, useRef } from 'react';
import logoSrc from '../assets/logo/avadhoot-logo.png';

const Navbar = ({ isAuthenticated, setIsAuthenticated }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef(null);

  /* ── Scroll listener: toggle glass bg after 50px ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── Close mobile menu on route change ── */
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setMobileMenuOpen(false);
    navigate('/');
  };

  /* ── Authenticated nav links ── */
  const authLinks = [
    { to: '/dashboard',        icon: <FiHome size={16} />,    text: 'Dashboard' },
    { to: '/billgenerator',    icon: <FiFileText size={16} />, text: 'Invoices' },
    { to: '/inventorymanager', icon: <FiPackage size={16} />,  text: 'Inventory' },
    { to: '/customeraccount',  icon: <FiUsers size={16} />,    text: 'Clients' },
    { to: '/supplierdata',     icon: <FiTruck size={16} />,    text: 'Suppliers' },
  ];

  /* ── Check active ── */
  const isActive = (path) =>
    location.pathname === path ||
    (path === '/dashboard' && location.pathname === '/home');

  return (
    <nav
      ref={navRef}
      className={`an-nav ${scrolled || isAuthenticated ? 'an-nav--solid' : ''}`}
    >
      <div className="an-nav__inner">

        {/* ═══ LEFT — Logo + Wordmark ═══ */}
        <div
          className="an-nav__brand"
          onClick={() => navigate(isAuthenticated ? '/dashboard' : '/')}
        >
          <img src={logoSrc} alt="Avadhoot" className="an-nav__logo" />
          <div className="an-nav__wordmark">
            <span className="an-nav__wordmark-primary">AVADHOOT</span>
            <span className="an-nav__wordmark-accent">COMPONENTS</span>
          </div>
        </div>

        {/* ═══ CENTER / RIGHT — Desktop Nav ═══ */}
        <div className="an-nav__desktop">
          {isAuthenticated ? (
            <>
              {/* App nav links */}
              <div className="an-nav__links">
                {authLinks.map(({ to, icon, text }) => (
                  <button
                    key={to}
                    onClick={() => navigate(to)}
                    className={`an-nav__link ${isActive(to) ? 'an-nav__link--active' : ''}`}
                  >
                    {icon}
                    <span>{text}</span>
                  </button>
                ))}
              </div>

              {/* Divider */}
              <div className="an-nav__divider" />

              {/* Profile + Logout */}
              <div className="an-nav__actions">
                <button
                  onClick={() => navigate('/profile')}
                  className={`an-nav__link ${isActive('/profile') ? 'an-nav__link--active' : ''}`}
                >
                  <FiUser size={16} />
                  <span>Profile</span>
                </button>
                <button onClick={handleLogout} className="an-nav__logout">
                  <FiLogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Public nav links */}
              <button
                onClick={() => navigate('/')}
                className={`an-nav__link ${
                  location.pathname === '/' || location.pathname === '/HomePage'
                    ? 'an-nav__link--active'
                    : ''
                }`}
              >
                Home
              </button>
              <button
                onClick={() => navigate('/about')}
                className={`an-nav__link ${location.pathname === '/about' ? 'an-nav__link--active' : ''}`}
              >
                About
              </button>

              {/* Portal Login CTA */}
              <button
                onClick={() => navigate('/login')}
                className="an-nav__cta"
              >
                Portal Login
              </button>
            </>
          )}
        </div>

        {/* ═══ Mobile hamburger ═══ */}
        <button
          className="an-nav__hamburger"
          onClick={() => setMobileMenuOpen(prev => !prev)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      {/* ═══ Mobile Dropdown ═══ */}
      <div
        className="an-nav__mobile"
        style={{
          maxHeight: mobileMenuOpen ? '520px' : '0',
          opacity: mobileMenuOpen ? 1 : 0,
        }}
      >
        <div className="an-nav__mobile-inner">
          {isAuthenticated ? (
            <>
              {authLinks.map(({ to, icon, text }) => (
                <button
                  key={to}
                  onClick={() => navigate(to)}
                  className={`an-nav__mobile-link ${isActive(to) ? 'an-nav__mobile-link--active' : ''}`}
                >
                  {icon}
                  {text}
                </button>
              ))}
              <button
                onClick={() => navigate('/profile')}
                className={`an-nav__mobile-link ${isActive('/profile') ? 'an-nav__mobile-link--active' : ''}`}
              >
                <FiUser size={16} />
                Profile
              </button>
              <div className="an-nav__mobile-divider" />
              <button onClick={handleLogout} className="an-nav__mobile-logout">
                <FiLogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/')}
                className={`an-nav__mobile-link ${
                  location.pathname === '/' || location.pathname === '/HomePage'
                    ? 'an-nav__mobile-link--active'
                    : ''
                }`}
              >
                <FiHome size={16} />
                Home
              </button>
              <button
                onClick={() => navigate('/about')}
                className={`an-nav__mobile-link ${location.pathname === '/about' ? 'an-nav__mobile-link--active' : ''}`}
              >
                <FiPieChart size={16} />
                About
              </button>
              <div className="an-nav__mobile-divider" />
              <button
                onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}
                className="an-nav__mobile-cta"
              >
                Portal Login
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;