import React, { useEffect, useRef, useState } from 'react';
import cncImage from '../assets/cnc_machining.png';
import precisionImage from '../assets/precision_components.png';
import qualityImage from '../assets/quality_control.png';
import steelBoltVideo from '../assets/videos/Steel_bolt_component_202604190116.mp4';

const FACILITIES = [
  {
    image: cncImage,
    category: 'Machining',
    title: 'CNC Machining',
    desc: 'State-of-the-art 5-Axis Centers',
  },
  {
    image: precisionImage,
    category: 'Assembly',
    title: 'Precision Assembly',
    desc: 'High accuracy mechanical parts',
  },
  {
    image: qualityImage,
    category: 'Quality',
    title: 'Quality Control',
    desc: 'A.I.T.F. Certified validation',
  },
];

const FacilitiesSection = () => {
  const gridRef = useRef(null);
  const [visibleCards, setVisibleCards] = useState(new Set());

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.dataset.idx);
            setTimeout(() => {
              setVisibleCards((prev) => new Set(prev).add(idx));
            }, idx * 150);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    const cards = el.querySelectorAll('.fs-card');
    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="fs-section">
      {/* ── Background video ── */}
      <video
        className="fs-bg-video"
        src={steelBoltVideo}
        autoPlay
        loop
        muted
        playsInline
      />

      {/* ── Dark overlay ── */}
      <div className="fs-overlay" />

      {/* ── Content ── */}
      <div className="fs-content">
        {/* Section header */}
        <div className="fs-header">
          <span className="fs-pill">OUR FACILITIES</span>
          <h2 className="fs-heading">State-of-the-Art Manufacturing</h2>
          <p className="fs-subtext">
            Advanced machinery, strict quality control, ISO certified processes.
          </p>
        </div>

        {/* Facility cards */}
        <div className="fs-grid" ref={gridRef}>
          {FACILITIES.map((facility, i) => {
            const isVisible = visibleCards.has(i);

            return (
              <div
                key={facility.title}
                className="fs-card"
                data-idx={i}
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                  transition: 'opacity 0.5s ease, transform 0.5s ease',
                }}
              >
                {/* Card image */}
                <img
                  src={facility.image}
                  alt={facility.title}
                  className="fs-card-img"
                />

                {/* Card overlay content */}
                <div className="fs-card-overlay">
                  <span className="fs-card-cat">{facility.category}</span>
                  <h3 className="fs-card-title">{facility.title}</h3>
                  <p className="fs-card-desc">{facility.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FacilitiesSection;
