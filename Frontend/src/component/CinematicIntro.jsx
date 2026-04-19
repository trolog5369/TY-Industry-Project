import React, { useState, useEffect, useRef, useCallback } from 'react';
import logoSrc from '../assets/logo/avadhoot-logo.png';

/**
 * CinematicIntro — Minimal, elegant logo reveal overlay.
 *
 * Stage 1 (0–1.5s):    Logo scales in with radial glow pulse
 * Stage 2 (1.5–2.5s):  Tagline fades in below logo, holds
 * Stage 3 (2.5–3.2s):  Entire overlay fades out → unmount
 *
 * Props:
 *   onComplete() — called when the sequence finishes (or user skips)
 */

const STAGE = {
  LOGO_REVEAL: 1,
  TAGLINE: 2,
  EXIT: 3,
};

const CinematicIntro = ({ onComplete }) => {
  const [stage, setStage] = useState(STAGE.LOGO_REVEAL);
  const [showSkip, setShowSkip] = useState(false);
  const timersRef = useRef([]);
  const onCompleteRef = useRef(onComplete);

  // Keep the ref in sync without re-triggering effects
  onCompleteRef.current = onComplete;

  /* ── Helper: safe setTimeout ── */
  const schedule = useCallback((fn, ms) => {
    const id = setTimeout(fn, ms);
    timersRef.current.push(id);
    return id;
  }, []);

  /* ── Clear all pending timers ── */
  const clearAll = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  /* ── Auto-advance timeline (runs once) ── */
  useEffect(() => {
    // Show skip button after 1s
    schedule(() => setShowSkip(true), 1000);

    // Stage 2: tagline at 1.5s
    schedule(() => setStage(STAGE.TAGLINE), 1500);

    // Stage 3: exit at 2.5s
    schedule(() => setStage(STAGE.EXIT), 2500);

    // Unmount at 3.2s (0.6s fade + 0.1s buffer)
    schedule(() => onCompleteRef.current(), 3200);

    return () => clearAll();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Skip handler: jump to exit immediately ── */
  const handleSkip = useCallback(() => {
    if (stage === STAGE.EXIT) return;
    clearAll();
    setStage(STAGE.EXIT);
    schedule(() => onCompleteRef.current(), 700);
  }, [stage, clearAll, schedule]);

  return (
    <div
      className="ci-overlay"
      style={{
        opacity: stage === STAGE.EXIT ? 0 : 1,
        transition: 'opacity 0.6s ease-out',
      }}
      aria-label="Cinematic intro"
    >
      {/* ── Radial glow behind logo ── */}
      <div className="ci-glow" />

      {/* ── Logo ── */}
      <img
        src={logoSrc}
        alt="Avadhoot Auto Components"
        className="ci-logo"
      />

      {/* ── Tagline ── */}
      <p
        className="ci-tagline"
        style={{
          opacity: stage >= STAGE.TAGLINE ? 1 : 0,
          transform: stage >= STAGE.TAGLINE ? 'translateY(0)' : 'translateY(8px)',
        }}
      >
        AVADHOOT AUTO COMPONENTS
      </p>

      {/* ── Skip Button ── */}
      {showSkip && stage !== STAGE.EXIT && (
        <button
          className="ci-skip"
          onClick={handleSkip}
          type="button"
        >
          Skip →
        </button>
      )}
    </div>
  );
};

export default CinematicIntro;
