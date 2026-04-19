import React, { useEffect, useRef, useState } from 'react';
import {
  CircleDot,   // Banjo Bolts
  Plug,        // Adaptors
  Droplets,    // Grease Nipples
  Cable,       // Connectors
  Fuel,        // Fuel Line Components
  Cylinder,    // Precision Shafts & King Pins
} from 'lucide-react';

const PRODUCTS = [
  {
    icon: CircleDot,
    name: 'Banjo Bolts',
    desc: 'High-pressure hydraulic line fittings',
    material: 'EN8 Steel',
  },
  {
    icon: Plug,
    name: 'Adaptors',
    desc: 'Thread-conversion precision adapters',
    material: 'SS 316',
  },
  {
    icon: Droplets,
    name: 'Grease Nipples',
    desc: 'Lubrication system access points',
    material: 'Mild Steel',
  },
  {
    icon: Cable,
    name: 'Connectors',
    desc: 'Fluid & pneumatic coupling components',
    material: 'Brass',
  },
  {
    icon: Fuel,
    name: 'Fuel Line Components',
    desc: 'Automotive fuel delivery parts',
    material: 'EN8 Steel',
  },
  {
    icon: Cylinder,
    name: 'Precision Shafts & King Pins',
    desc: 'Heavy-duty axle & steering components',
    material: 'EN8 Steel',
  },
];

const ProductsShowcase = () => {
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
            // Stagger by index
            setTimeout(() => {
              setVisibleCards((prev) => new Set(prev).add(idx));
            }, idx * 100);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    const cards = el.querySelectorAll('.ps-card');
    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="ps-section">
      {/* Background accents */}
      <div className="ps-bg-glow ps-bg-glow--left" />
      <div className="ps-bg-glow ps-bg-glow--right" />

      {/* Section header */}
      <div className="ps-header">
        <span className="ps-pill">OUR PRODUCTS</span>
        <h2 className="ps-heading">Engineered for Every Industry</h2>
        <p className="ps-subtext">
          From banjo bolts to hydraulic connectors — precision at every thread.
        </p>
      </div>

      {/* Product cards grid */}
      <div className="ps-grid" ref={gridRef}>
        {PRODUCTS.map((product, i) => {
          const Icon = product.icon;
          const isVisible = visibleCards.has(i);

          return (
            <div
              key={product.name}
              className="ps-card"
              data-idx={i}
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                transition: 'opacity 0.5s ease, transform 0.5s ease',
              }}
            >
              {/* Icon */}
              <div className="ps-icon-wrap">
                <Icon size={28} strokeWidth={1.6} />
              </div>

              {/* Text */}
              <h3 className="ps-name">{product.name}</h3>
              <p className="ps-desc">{product.desc}</p>

              {/* Material tag */}
              <span className="ps-material">{product.material}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ProductsShowcase;
