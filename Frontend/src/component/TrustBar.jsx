import React from 'react';

const ITEMS = [
  'ISO 1461 Certified',
  'Banjo Bolts',
  'Adaptors',
  'Grease Nipples',
  'Connectors',
  'Fuel Line Components',
  'Precision Shafts',
  'King Pins',
  'Boom Pins',
  'Hydraulic Systems',
  'Automotive Grade',
  'Construction Equipment',
  '20+ Years Experience',
  'Pune, India',
];

const TrustBar = () => {
  /* Build a single run of items with diamond separators */
  const run = ITEMS.map((item, i) => (
    <span key={i} className="trust-item">
      {item}
      <span className="trust-diamond">&#x25C6;</span>
    </span>
  ));

  return (
    <div className="trust-bar">
      <div className="trust-track">
        {/* Two identical runs for seamless loop */}
        <div className="trust-run">{run}</div>
        <div className="trust-run" aria-hidden="true">{run}</div>
      </div>
    </div>
  );
};

export default TrustBar;
