const STATS = [
  { value: "2024", label: "Founded" },
  { value: "11", label: "First Squad" },
  { value: "Sotik", label: "Home Ground" },
  { value: "Bomet", label: "County" },
];

const SharkIcon = () => (
  <svg width="120" height="120" viewBox="0 0 120 120" fill="none" aria-hidden="true">
    <path d="M18 2L102 8L102 72C102 96 60 116 60 116C60 116 18 96 18 72Z" fill="#CC0000" stroke="#0047FF" strokeWidth="1.2" />
    <path d="M60 18L88 30L88 62C88 76 60 90 60 90C60 90 32 76 32 62L32 30Z" fill="#0A0A0A" />
    <text x="60" y="68" textAnchor="middle" fontFamily="'Bebas Neue', serif" fontSize="28" fill="#0047FF" letterSpacing="2">MSC</text>
    <text x="60" y="46" textAnchor="middle" fontFamily="'Bebas Neue', serif" fontSize="10" fill="rgba(255,255,255,0.5)" letterSpacing="1">MIAMI</text>
  </svg>
);

export default function Hero() {
  const handleScroll = (href) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap');

        .hero-section {
          min-height: 100vh;
          background: #0A0A0A;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 100px 1.5rem 4rem;
          position: relative;
          overflow: hidden;
          font-family: 'DM Sans', sans-serif;
          text-align: center;
        }

        .hero-bg-circle {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
        }
        .hero-bg-circle-1 {
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(29,158,117,0.12) 0%, transparent 70%);
          top: -100px;
          right: -150px;
        }
        .hero-bg-circle-2 {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(93,202,165,0.07) 0%, transparent 70%);
          bottom: 0;
          left: -100px;
        }

        .hero-crest {
          margin-bottom: 2rem;
          animation: crestDrop 0.7s cubic-bezier(0.22,1,0.36,1) both;
        }
        @keyframes crestDrop {
          from { opacity: 0; transform: translateY(-20px) scale(0.9); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(93,202,165,0.12);
          border: 0.5px solid rgba(93,202,165,0.35);
          color: #0047FF;
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 1.2px;
          margin-bottom: 1.75rem;
          animation: fadeUp 0.6s 0.15s ease both;
        }
        .hero-badge-dot {
          width: 6px;
          height: 6px;
          background: #0047FF;
          border-radius: 50%;
          animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse {
          0%,100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.4; transform: scale(0.85); }
        }

        .hero-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(64px, 12vw, 100px);
          line-height: 0.92;
          letter-spacing: 4px;
          color: #ffffff;
          margin-bottom: 0.5rem;
          animation: fadeUp 0.6s 0.25s ease both;
        }
        .hero-title-accent {
          color: #0047FF;
          display: block;
        }

        .hero-subtitle {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(14px, 3vw, 18px);
          letter-spacing: 5px;
          color: rgba(255,255,255,0.35);
          margin-bottom: 1.25rem;
          text-transform: uppercase;
          animation: fadeUp 0.6s 0.35s ease both;
        }

        .hero-desc {
          max-width: 460px;
          margin: 0 auto 2.5rem;
          font-size: 16px;
          color: rgba(255,255,255,0.55);
          line-height: 1.75;
          font-weight: 300;
          animation: fadeUp 0.6s 0.45s ease both;
        }

        .hero-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
          animation: fadeUp 0.6s 0.55s ease both;
          margin-bottom: 4rem;
        }

        .btn-hero-primary {
          background: #CC0000;
          color: #ffffff;
          border: none;
          padding: 14px 32px;
          border-radius: 7px;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.3px;
          transition: background 0.2s, transform 0.1s;
        }
        .btn-hero-primary:hover  { background: #990000; }
        .btn-hero-primary:active { transform: scale(0.97); }

        .btn-hero-outline {
          background: transparent;
          color: rgba(255,255,255,0.75);
          border: 0.5px solid rgba(255,255,255,0.25);
          padding: 14px 32px;
          border-radius: 7px;
          font-size: 15px;
          font-weight: 400;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: border-color 0.2s, color 0.2s, transform 0.1s;
        }
        .btn-hero-outline:hover  { border-color: #0047FF; color: #0047FF; }
        .btn-hero-outline:active { transform: scale(0.97); }

        .hero-stats {
          display: flex;
          justify-content: center;
          gap: clamp(1.5rem, 5vw, 3.5rem);
          padding-top: 2.5rem;
          border-top: 0.5px solid rgba(255,255,255,0.08);
          width: 100%;
          max-width: 600px;
          animation: fadeUp 0.6s 0.65s ease both;
        }
        .hero-stat {}
        .hero-stat-value {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(28px, 5vw, 38px);
          color: #0047FF;
          letter-spacing: 1px;
          line-height: 1;
          margin-bottom: 5px;
        }
        .hero-stat-label {
          font-size: 11px;
          color: rgba(255,255,255,0.35);
          text-transform: uppercase;
          letter-spacing: 1.2px;
          font-weight: 400;
        }

        .hero-scroll-hint {
          position: absolute;
          bottom: 28px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          color: rgba(255,255,255,0.25);
          font-size: 11px;
          letter-spacing: 1px;
          text-transform: uppercase;
          animation: fadeUp 0.6s 0.9s ease both;
          cursor: pointer;
        }
        .scroll-arrow {
          width: 18px;
          height: 18px;
          border-right: 1px solid rgba(255,255,255,0.25);
          border-bottom: 1px solid rgba(255,255,255,0.25);
          transform: rotate(45deg);
          animation: scrollBounce 1.8s ease-in-out infinite;
        }
        @keyframes scrollBounce {
          0%,100% { transform: rotate(45deg) translateY(0); opacity: 0.4; }
          50%      { transform: rotate(45deg) translateY(5px); opacity: 1; }
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 480px) {
          .hero-actions { flex-direction: column; align-items: center; }
          .btn-hero-primary, .btn-hero-outline { width: 100%; max-width: 280px; }
          .hero-stats { gap: 1.25rem; }
        }
      `}</style>

      <section className="hero-section" id="home" aria-label="Hero — Miami Sharks FC">
        {/* Background decorative circles */}
        <div className="hero-bg-circle hero-bg-circle-1" aria-hidden="true" />
        <div className="hero-bg-circle hero-bg-circle-2" aria-hidden="true" />

        {/* Crest */}
        <div className="hero-crest">
          <SharkIcon />
        </div>

        {/* Badge */}
        <div className="hero-badge">
          <span className="hero-badge-dot" />
          Sotik · Bomet County · Kenya
        </div>

        {/* Title */}
        <h1 className="hero-title">
          Miami
          <span className="hero-title-accent">Sharks FC</span>
        </h1>

        {/* Subtitle */}
        <p className="hero-subtitle">Est. in the heart of the Rift Valley</p>

        {/* Description */}
        <p className="hero-desc">
          Representing Sotik with pride, passion, and purpose —
          united by the beautiful game.
        </p>

        {/* CTA buttons */}
        <div className="hero-actions">
          <button className="btn-hero-primary" onClick={() => handleScroll("#squad")}>
            Meet the Squad
          </button>
          <button className="btn-hero-outline" onClick={() => handleScroll("#contact")}>
            Get in Touch
          </button>
        </div>

        {/* Stats bar */}
        <div className="hero-stats" role="list" aria-label="Club statistics">
          {STATS.map((stat) => (
            <div className="hero-stat" key={stat.label} role="listitem">
              <div className="hero-stat-value">{stat.value}</div>
              <div className="hero-stat-label">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Scroll hint */}
        <div
          className="hero-scroll-hint"
          onClick={() => handleScroll("#about")}
          role="button"
          tabIndex={0}
          aria-label="Scroll down"
        >
          <span className="scroll-arrow" />
        </div>
      </section>
    </>
  );
}