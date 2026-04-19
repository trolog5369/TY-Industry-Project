import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const STATS = [
  { value: 50, suffix: '+', label: 'Products Manufactured' },
  { value: 200, suffix: '+', label: 'Happy Customers' },
  { value: 20, suffix: '+', label: 'Years Experience' },
  { value: 100, suffix: '+', label: 'Skilled Employees' },
];

/* ── Animated counter hook ── */
const useCountUp = (target, duration = 1800, start = false) => {
  const [count, setCount] = useState(0);
  const hasRun = useRef(false);

  useEffect(() => {
    if (!start || hasRun.current) return;
    hasRun.current = true;

    let raf;
    const t0 = performance.now();

    const tick = (now) => {
      const elapsed = now - t0;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));

      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, target, duration]);

  return count;
};

/* ── Single stat card ── */
const StatCard = ({ value, suffix, label, inView, delay }) => {
  const [delayPassed, setDelayPassed] = useState(false);

  useEffect(() => {
    if (!inView) return;
    const id = setTimeout(() => setDelayPassed(true), delay);
    return () => clearTimeout(id);
  }, [inView, delay]);

  const count = useCountUp(value, 1800, delayPassed);

  return (
    <div
      className="as-card"
      style={{
        opacity: delayPassed ? 1 : 0,
        transform: delayPassed ? 'translateY(0)' : 'translateY(16px)',
        transition: 'opacity 0.5s ease, transform 0.5s ease',
      }}
    >
      <span className="as-number">
        {count}
        {suffix}
      </span>
      <span className="as-label">{label}</span>
    </div>
  );
};

/* ── Main component ── */
const AboutStats = () => {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="as-section" ref={sectionRef}>
      {/* Background glow */}
      <div className="as-bg-glow" />

      <div className="as-grid">
        {/* LEFT — 2×2 stat grid */}
        <div className="as-stats">
          {STATS.map((stat, i) => (
            <StatCard
              key={stat.label}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              inView={inView}
              delay={i * 150}
            />
          ))}
        </div>

        {/* RIGHT — brand statement */}
        <div
          className="as-brand"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateX(0)' : 'translateX(24px)',
            transition: 'opacity 0.7s ease 0.3s, transform 0.7s ease 0.3s',
          }}
        >
          <span className="as-eyebrow">WHO WE ARE</span>

          <h2 className="as-heading">
            Precision Engineering.
            <br />
            Trusted by Industry Leaders.
          </h2>

          <p className="as-body">
            We are manufacturers of precision machined components for the
            Automobile industry, Construction Equipment, and various other
            sectors including Tractors, Fuel Lines, and Hydraulic Systems. ISO
            1461 certified by A.I.T.F.
          </p>

          <button
            className="as-btn"
            onClick={() => navigate('/about')}
            type="button"
          >
            About Us →
          </button>
        </div>
      </div>
    </section>
  );
};

export default AboutStats;
