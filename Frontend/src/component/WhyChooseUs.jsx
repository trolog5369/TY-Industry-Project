import React, { useEffect, useRef, useState } from 'react';
import { Wrench, Users, Clock, Settings } from 'lucide-react';

const PILLARS = [
  {
    icon: Wrench,
    title: 'Best Services',
    body: 'End-to-end manufacturing support with technically qualified engineers monitoring every unit.',
  },
  {
    icon: Users,
    title: 'Customer Satisfaction',
    body: 'Our clients include leading OEMs across automotive and construction sectors.',
  },
  {
    icon: Clock,
    title: 'On-Time Deliveries',
    body: 'Reliable dispatch schedules with real-time inventory management.',
  },
  {
    icon: Settings,
    title: 'On-Demand Manufacturing',
    body: 'Custom precision components manufactured to exact client specifications.',
  },
];

const WhyChooseUs = () => {
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
            }, idx * 120);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    const cards = el.querySelectorAll('.wcu-card');
    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="wcu-section">
      <div className="wcu-inner">
        {/* Section header */}
        <div className="wcu-header">
          <span className="wcu-pill">WHY CHOOSE US</span>
          <h2 className="wcu-heading">
            Built on Precision. Driven by Trust.
          </h2>
        </div>

        {/* 2×2 pillar grid */}
        <div className="wcu-grid" ref={gridRef}>
          {PILLARS.map((pillar, i) => {
            const Icon = pillar.icon;
            const isVisible = visibleCards.has(i);

            return (
              <div
                key={pillar.title}
                className="wcu-card"
                data-idx={i}
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
                  transition: 'opacity 0.5s ease, transform 0.5s ease',
                }}
              >
                <div className="wcu-icon-wrap">
                  <Icon size={24} strokeWidth={1.8} />
                </div>
                <h3 className="wcu-title">{pillar.title}</h3>
                <p className="wcu-body">{pillar.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
