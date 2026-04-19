import React from 'react';
import { useNavigate } from 'react-router-dom';

import heroVideo from '../assets/videos/Machined_banjo_bolt_202604190120.mp4';
import TrustBar from './TrustBar';
import AboutStats from './AboutStats';
import ProductsShowcase from './ProductsShowcase';
import FacilitiesSection from './FacilitiesSection';
import WhyChooseUs from './WhyChooseUs';
import PortalCTA from './PortalCTA';
import Footer from './footer';

const HomePage = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleSignup = () => {
    navigate("/signup");
  };

  return (
    <div className="min-h-screen overflow-hidden" style={{ background: '#080C14' }}>

      {/* ═══ HERO SECTION — Video Background ═══ */}
      <section className="hero-section relative min-h-screen flex items-center justify-center overflow-hidden">

        {/* ── Fullscreen video background ── */}
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src={heroVideo}
          autoPlay
          muted
          playsInline
          loop
          style={{ zIndex: 0 }}
        />

        {/* ── Dark overlay ── */}
        <div
          className="absolute inset-0"
          style={{ background: 'rgba(8,12,20,0.65)', zIndex: 1 }}
        />

        {/* ── Radial gradient overlay ── */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(14,165,233,0.06), transparent)',
            zIndex: 2,
          }}
        />

        {/* ── Hero Content ── */}
        <div className="relative z-10 flex flex-col items-center text-center px-6 py-32">

          {/* Pill Badge */}
          <span className="hero-badge inline-block mb-8">
            ISO 1461 CERTIFIED · PUNE, INDIA
          </span>

          {/* Headline */}
          <h1 className="hero-h1 max-w-5xl mb-6">
            PRECISION MACHINED<br />COMPONENTS
          </h1>

          {/* Sub-headline */}
          <p className="hero-sub max-w-[600px] mb-10">
            Serving the Automotive, Construction &amp; Hydraulic industries
            with uncompromising precision since 2004.
          </p>

          {/* CTA Buttons */}
          <div className="hero-btns flex flex-col sm:flex-row gap-4">
            <button className="hero-btn-primary" onClick={handleLogin}>
              Explore Portal
            </button>
            <button className="hero-btn-ghost" onClick={() => navigate('/productlist')}>
              Our Products
            </button>
          </div>
        </div>

        {/* ── Animated Chevron ── */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hero-chevron">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>

        {/* ── Bottom gradient line ── */}
        <div className="absolute bottom-0 left-0 w-full h-px z-10" style={{
          background: 'linear-gradient(90deg, transparent, rgba(14,165,233,0.2) 50%, transparent)'
        }} />
      </section>

      {/* ═══ TRUST BAR ═══ */}
      <TrustBar />

      {/* ═══ ABOUT / STATS ═══ */}
      <AboutStats />

      {/* ═══ PRODUCTS SHOWCASE ═══ */}
      <ProductsShowcase />

      {/* ═══ FACILITIES ═══ */}
      <FacilitiesSection />

      {/* ═══ WHY CHOOSE US ═══ */}
      <WhyChooseUs />

      {/* ═══ PORTAL CTA ═══ */}
      <PortalCTA />



      {/* ═══ CTA SECTION ═══ */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden" style={{ background: '#080C14' }}>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full mix-blend-overlay filter blur-3xl opacity-10"
               style={{ background: '#0EA5E9' }}></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full mix-blend-overlay filter blur-3xl opacity-5"
               style={{ background: '#0EA5E9' }}></div>
        </div>

        {/* Top border line */}
        <div className="absolute top-0 left-0 w-full h-px"
             style={{ background: 'linear-gradient(90deg, transparent, rgba(14,165,233,0.3) 50%, transparent)' }}></div>

        <div className="relative max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Partner with Avadhoot Auto Components
          </h2>
          <p className="text-xl max-w-2xl mx-auto mb-10" style={{ color: '#94A3B8' }}>
            We undertake manufacture of any type of precision components as required by our valued customers.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={handleSignup}
              className="btn-explore"
            >
              Start Free Trial
            </button>
            <button className="btn-ghost">
              Schedule a Demo
            </button>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <Footer />
    </div>
  );
};

export default HomePage;