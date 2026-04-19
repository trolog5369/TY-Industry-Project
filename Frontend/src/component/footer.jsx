import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, Mail, Linkedin, Youtube } from 'lucide-react';
import logoSrc from '../assets/logo/avadhoot-logo.png';

const LINKS = [
  { label: 'Home',          href: '/' },
  { label: 'About Us',      href: '/about' },
  { label: 'Products',      href: '/productlist' },
  { label: 'Portal Login',  href: '/login' },
];

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="ft-footer">
      <div className="ft-inner">
        <div className="ft-grid">

          {/* ── Column 1 — Brand ── */}
          <div className="ft-col ft-brand">
            <div className="ft-logo-row">
              <img src={logoSrc} alt="Avadhoot Auto Components Logo" className="ft-logo-img" />
              <span className="ft-logo-text">AVADHOOT COMPONENTS</span>
            </div>
            <p className="ft-tagline">
              Precision Machined Components since 2004
            </p>
            <div className="ft-socials">
              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="ft-social-btn"
                aria-label="LinkedIn"
              >
                <Linkedin size={16} />
              </a>
              <a
                href="https://www.youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="ft-social-btn"
                aria-label="YouTube"
              >
                <Youtube size={16} />
              </a>
            </div>
          </div>

          {/* ── Column 2 — Quick Links ── */}
          <div className="ft-col">
            <h4 className="ft-col-heading">Quick Links</h4>
            <ul className="ft-links">
              {LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="ft-link"
                    onClick={(e) => {
                      if (link.href.startsWith('/')) {
                        e.preventDefault();
                        navigate(link.href);
                      }
                    }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Column 3 — Contact ── */}
          <div className="ft-col">
            <h4 className="ft-col-heading">Contact</h4>
            <ul className="ft-contact-list">
              <li className="ft-contact-item">
                <MapPin size={13} className="ft-contact-icon" />
                <span>
                  Gat No. 1635, Vrudhashram Road,<br />
                  Ramdasnagar, Chikhali, Pune‑411062
                </span>
              </li>
              <li className="ft-contact-item">
                <Phone size={13} className="ft-contact-icon" />
                <span>+91 9595008010 / +91 9070008010</span>
              </li>
              <li className="ft-contact-item">
                <Mail size={13} className="ft-contact-icon" />
                <span>info@avadhootauto.com</span>
              </li>
            </ul>
          </div>

          {/* ── Column 4 — Portal ── */}
          <div className="ft-col ft-portal-col">
            <h4 className="ft-col-heading">Access the B2B Portal</h4>
            <p className="ft-portal-text">
              Manage inventory, invoices, and supplier data.
            </p>
            <button
              id="ft-portal-login-btn"
              className="ft-portal-btn"
              onClick={() => navigate('/login')}
              type="button"
            >
              Login to Portal
            </button>
          </div>

        </div>

        {/* ── Bottom bar ── */}
        <div className="ft-bottom">
          <p className="ft-copyright">
            © 2025 Avadhoot Auto Components. All rights reserved.
          </p>
          <p className="ft-designed">Designed for precision.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;