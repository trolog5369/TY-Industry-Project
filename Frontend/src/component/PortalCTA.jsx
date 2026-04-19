import React from 'react';
import { useNavigate } from 'react-router-dom';
import sparkVideo from '../assets/videos/Spark_explosion_from_202604190126.mp4';

const PortalCTA = () => {
  const navigate = useNavigate();

  return (
    <section className="pcta-section">
      {/* ── Background video ── */}
      <video
        className="pcta-bg-video"
        src={sparkVideo}
        autoPlay
        loop
        muted
        playsInline
      />

      {/* ── Dark overlay ── */}
      <div className="pcta-overlay" />

      {/* ── Grid pattern ── */}
      <div className="pcta-grid-pattern" />

      {/* ── Content ── */}
      <div className="pcta-content">
        <span className="pcta-pill">INVENTORY MANAGEMENT PORTAL</span>

        <h2 className="pcta-heading">
          Manage Your Components. Smarter.
        </h2>

        <p className="pcta-sub">
          Real-time tracking, B2B invoicing, supplier management and analytics
          — all in one platform.
        </p>

        <div className="pcta-btns">
          <button
            className="pcta-btn-filled"
            onClick={() => navigate('/login')}
            type="button"
          >
            Access Portal
          </button>
          <button className="pcta-btn-ghost" type="button">
            Watch Demo
          </button>
        </div>
      </div>
    </section>
  );
};

export default PortalCTA;
