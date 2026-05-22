import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const ParticleCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animFrameId;
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;

    const particles = Array.from({ length: 120 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.5 + 0.3,
      alpha: Math.random() * 0.6 + 0.2,
      speed: Math.random() * 0.15 + 0.05,
      twinkle: Math.random() * Math.PI * 2,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const now = Date.now() / 1000;
      particles.forEach(p => {
        const twinkled = p.alpha + Math.sin(now * 1.5 + p.twinkle) * 0.2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 220, 255, ${Math.max(0, Math.min(1, twinkled))})`;
        ctx.fill();
        p.y -= p.speed;
        if (p.y < -2) { p.y = H + 2; p.x = Math.random() * W; }
      });
      animFrameId = requestAnimationFrame(draw);
    };

    draw();

    const onResize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(animFrameId); window.removeEventListener('resize', onResize); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}
    />
  );
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  .skycast-root * { box-sizing: border-box; margin: 0; padding: 0; }

  .skycast-root {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px 20px;
    background: radial-gradient(ellipse at 60% 0%, #0d2a4a 0%, #080f1e 55%, #020408 100%);
    position: relative;
    overflow: hidden;
    font-family: 'DM Sans', sans-serif;
  }

  .skycast-horizon {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 220px;
    background: linear-gradient(to top, rgba(14, 165, 233, 0.07) 0%, transparent 100%);
    pointer-events: none;
    z-index: 0;
  }

  .skycast-aurora {
    position: absolute;
    top: -200px; left: -200px; right: -200px;
    height: 600px;
    background: conic-gradient(from 200deg at 50% 50%,
      transparent 0deg, rgba(56,189,248,0.04) 40deg,
      rgba(99,102,241,0.06) 80deg, transparent 120deg,
      rgba(14,165,233,0.03) 200deg, transparent 240deg);
    pointer-events: none;
    z-index: 0;
    animation: auroraRotate 18s linear infinite;
  }

  @keyframes auroraRotate {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }

  .skycast-card {
    position: relative;
    z-index: 1;
    max-width: 760px;
    width: 100%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    animation: cardFadeUp 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  @keyframes cardFadeUp {
    from { opacity: 0; transform: translateY(36px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .skycast-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(56, 189, 248, 0.1);
    border: 1px solid rgba(56, 189, 248, 0.25);
    color: #7dd3fc;
    font-family: 'DM Sans', sans-serif;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    padding: 7px 18px;
    border-radius: 100px;
    margin-bottom: 32px;
    animation: cardFadeUp 0.9s 0.15s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  .skycast-eyebrow-dot {
    width: 6px; height: 6px;
    background: #38bdf8;
    border-radius: 50%;
    box-shadow: 0 0 8px rgba(56,189,248,0.9);
    animation: pulse 2.4s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.4; transform: scale(0.7); }
  }

  .skycast-logo-wrap {
    margin-bottom: 40px;
    animation: cardFadeUp 0.9s 0.2s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  .skycast-logo-icon {
    width: 72px; height: 72px;
    border-radius: 20px;
    background: linear-gradient(135deg, rgba(56,189,248,0.2) 0%, rgba(99,102,241,0.2) 100%);
    border: 1px solid rgba(56,189,248,0.3);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto;
  }

  .skycast-headline {
    font-family: 'Syne', sans-serif;
    font-size: clamp(56px, 8vw, 96px);
    font-weight: 800;
    line-height: 0.95;
    letter-spacing: -3px;
    color: #fff;
    margin-bottom: 10px;
    animation: cardFadeUp 0.9s 0.25s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  .skycast-headline-accent {
    background: linear-gradient(90deg, #38bdf8 0%, #818cf8 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    display: block;
  }

  .skycast-sub {
    font-size: 19px;
    font-weight: 300;
    color: rgba(148, 183, 220, 0.85);
    line-height: 1.6;
    max-width: 500px;
    margin: 28px auto 44px;
    animation: cardFadeUp 0.9s 0.35s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  .skycast-stats {
    display: flex;
    gap: 1px;
    border: 1px solid rgba(56,189,248,0.15);
    border-radius: 16px;
    overflow: hidden;
    margin-bottom: 44px;
    background: rgba(56,189,248,0.05);
    width: 100%;
    max-width: 520px;
    animation: cardFadeUp 0.9s 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  .skycast-stat {
    flex: 1;
    padding: 18px 12px;
    background: rgba(8, 20, 40, 0.6);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }

  .skycast-stat:not(:last-child) {
    border-right: 1px solid rgba(56,189,248,0.12);
  }

  .skycast-stat-val {
    font-family: 'Syne', sans-serif;
    font-size: 26px;
    font-weight: 700;
    color: #e0f2fe;
    letter-spacing: -1px;
  }

  .skycast-stat-label {
    font-size: 11px;
    font-weight: 400;
    color: rgba(148, 183, 220, 0.55);
    letter-spacing: 1.2px;
    text-transform: uppercase;
  }

  .skycast-actions {
    display: flex;
    gap: 14px;
    justify-content: center;
    flex-wrap: wrap;
    animation: cardFadeUp 0.9s 0.48s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  .skycast-btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    font-weight: 500;
    color: #0c1a2e;
    background: linear-gradient(135deg, #38bdf8 0%, #818cf8 100%);
    padding: 15px 36px;
    border-radius: 100px;
    text-decoration: none;
    letter-spacing: 0.2px;
    transition: transform 0.18s ease, box-shadow 0.18s ease, filter 0.18s ease;
    box-shadow: 0 0 0 1px rgba(56,189,248,0.4), 0 8px 32px rgba(56, 189, 248, 0.25);
  }

  .skycast-btn-primary:hover {
    transform: translateY(-2px) scale(1.02);
    filter: brightness(1.08);
    box-shadow: 0 0 0 1px rgba(56,189,248,0.6), 0 16px 40px rgba(56, 189, 248, 0.35);
  }

  .skycast-btn-secondary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    font-weight: 400;
    color: rgba(148, 183, 220, 0.85);
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(56,189,248,0.18);
    padding: 15px 30px;
    border-radius: 100px;
    text-decoration: none;
    transition: background 0.18s ease, color 0.18s ease, border-color 0.18s ease;
  }

  .skycast-btn-secondary:hover {
    background: rgba(56,189,248,0.08);
    border-color: rgba(56,189,248,0.35);
    color: #e0f2fe;
  }

  .skycast-footer-tags {
    display: flex;
    gap: 20px;
    justify-content: center;
    margin-top: 52px;
    flex-wrap: wrap;
    animation: cardFadeUp 0.9s 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  .skycast-tag {
    font-size: 12px;
    color: rgba(148, 183, 220, 0.45);
    letter-spacing: 0.5px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .skycast-tag::before {
    content: '';
    width: 4px; height: 4px;
    border-radius: 50%;
    background: rgba(56,189,248,0.4);
    display: block;
  }
`;

const Landing = () => {
  return (
    <>
      <style>{styles}</style>
      <div className="skycast-root">
        <ParticleCanvas />
        <div className="skycast-aurora" />
        <div className="skycast-horizon" />

        <div className="skycast-card">
          <div className="skycast-eyebrow">
            <span className="skycast-eyebrow-dot" />
            Live sensor active
          </div>

          <div className="skycast-logo-wrap">
            <div className="skycast-logo-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 32, height: 32 }}>
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
          </div>

          <h1 className="skycast-headline">
            Sky<span className="skycast-headline-accent">Cast</span>
          </h1>

          <p className="skycast-sub">
            Real-time environment monitoring and air quality analytics — powered by ESP32 sensor nodes and delivered with clarity.
          </p>

          <div className="skycast-stats">
            <div className="skycast-stat">
              <span className="skycast-stat-val">AQI</span>
              <span className="skycast-stat-label">Air Quality</span>
            </div>
            <div className="skycast-stat">
              <span className="skycast-stat-val">ESP32</span>
              <span className="skycast-stat-label">IoT Node</span>
            </div>
            <div className="skycast-stat">
              <span className="skycast-stat-val">Live</span>
              <span className="skycast-stat-label">Real-Time</span>
            </div>
            <div className="skycast-stat">
              <span className="skycast-stat-val">24/7</span>
              <span className="skycast-stat-label">Monitoring</span>
            </div>
          </div>

          <div className="skycast-actions">
            <Link to="/dashboard" className="skycast-btn-primary">
              Enter Dashboard
              <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 16, height: 16 }}>
                <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
              </svg>
            </Link>
            <Link to="/about" className="skycast-btn-secondary">
              Learn more
            </Link>
          </div>

          <div className="skycast-footer-tags">
            <span className="skycast-tag">Climate sensing</span>
            <span className="skycast-tag">Particulate matter</span>
            <span className="skycast-tag">Smart analytics</span>
            <span className="skycast-tag">Open IoT</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Landing;