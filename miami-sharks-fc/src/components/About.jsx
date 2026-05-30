import { useEffect, useRef, useState } from "react";

const PILLARS = [
  {
    icon: "⚽",
    title: "Compete",
    text: "We pursue excellence in every match, pushing ourselves to perform at the highest level in Bomet County and beyond.",
  },
  {
    icon: "🤝",
    title: "Community",
    text: "Rooted in Sotik, we are more than a football club — we are a family that uplifts and represents our community.",
  },
  {
    icon: "🌱",
    title: "Develop",
    text: "We identify and grow local talent from the ground up, giving young players in Bomet a pathway to shine.",
  },
  {
    icon: "❤️",
    title: "Passion",
    text: "Football is our culture, our pride, and our language. We play with heart in every training session and every fixture.",
  },
];

const MILESTONES = [
  { year: "2024", event: "Club founded in Sotik, Bomet County" },
  { year: "2024", event: "First squad assembled — 11 founding players" },
  { year: "2025", event: "First competitive fixtures in the county league" },
  { year: "Future", event: "Growing the squad and competing at regional level" },
];

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

export default function About() {
  const [sectionRef, sectionInView] = useInView(0.1);
  const [pillarsRef, pillarsInView] = useInView(0.1);
  const [timelineRef, timelineInView] = useInView(0.1);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap');

        .about-section {
          background: #f8f9fb;
          padding: 6rem 1.5rem;
          font-family: 'DM Sans', sans-serif;
        }

        .about-inner {
          max-width: 860px;
          margin: 0 auto;
        }

        /* Header */
        .about-header {
          max-width: 580px;
          margin-bottom: 4rem;
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.65s ease, transform 0.65s ease;
        }
        .about-header.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .about-tag {
          font-size: 11px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 2.5px;
          color: #CC0000;
          margin-bottom: 0.6rem;
        }
        .about-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(36px, 6vw, 52px);
          letter-spacing: 2px;
          color: #0A0A0A;
          line-height: 1.05;
          margin-bottom: 1rem;
        }
        .about-divider {
          width: 36px;
          height: 3px;
          background: #CC0000;
          border-radius: 2px;
          margin-bottom: 1.25rem;
        }
        .about-lead {
          font-size: 16px;
          color: #4a5568;
          line-height: 1.8;
          font-weight: 300;
          margin-bottom: 0.85rem;
        }

        /* Pillars grid */
        .pillars-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 16px;
          margin-bottom: 5rem;
        }
        .pillar-card {
          background: #ffffff;
          border: 0.5px solid #e2e8f0;
          border-radius: 12px;
          padding: 1.5rem 1.25rem;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.5s ease, transform 0.5s ease, border-color 0.2s, box-shadow 0.2s;
        }
        .pillar-card.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .pillar-card:hover {
          border-color: #6699FF;
          box-shadow: 0 4px 20px rgba(29,158,117,0.08);
        }
        .pillar-card:nth-child(1) { transition-delay: 0s; }
        .pillar-card:nth-child(2) { transition-delay: 0.1s; }
        .pillar-card:nth-child(3) { transition-delay: 0.2s; }
        .pillar-card:nth-child(4) { transition-delay: 0.3s; }

        .pillar-emoji {
          font-size: 26px;
          margin-bottom: 10px;
          display: block;
          line-height: 1;
        }
        .pillar-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 20px;
          letter-spacing: 1px;
          color: #0A0A0A;
          margin-bottom: 6px;
        }
        .pillar-text {
          font-size: 13.5px;
          color: #64748b;
          line-height: 1.65;
          font-weight: 300;
        }

        /* Timeline */
        .timeline-header {
          margin-bottom: 2rem;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.55s ease, transform 0.55s ease;
        }
        .timeline-header.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .timeline-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 32px;
          letter-spacing: 2px;
          color: #0A0A0A;
          margin-bottom: 4px;
        }

        .timeline {
          position: relative;
          padding-left: 2rem;
        }
        .timeline::before {
          content: '';
          position: absolute;
          left: 7px;
          top: 6px;
          bottom: 6px;
          width: 1.5px;
          background: linear-gradient(to bottom, #CC0000, #6699FF88);
        }
        .timeline-item {
          position: relative;
          padding-bottom: 1.75rem;
          opacity: 0;
          transform: translateX(-16px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        .timeline-item.visible {
          opacity: 1;
          transform: translateX(0);
        }
        .timeline-item:nth-child(1) { transition-delay: 0s; }
        .timeline-item:nth-child(2) { transition-delay: 0.12s; }
        .timeline-item:nth-child(3) { transition-delay: 0.24s; }
        .timeline-item:nth-child(4) { transition-delay: 0.36s; }
        .timeline-item:last-child { padding-bottom: 0; }

        .timeline-dot {
          position: absolute;
          left: -1.85rem;
          top: 5px;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #CC0000;
          border: 2px solid #ffffff;
          box-shadow: 0 0 0 1.5px #CC0000;
        }
        .timeline-item:last-child .timeline-dot {
          background: #6699FF;
          box-shadow: 0 0 0 1.5px #6699FF;
        }
        .timeline-year {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 13px;
          letter-spacing: 1.5px;
          color: #CC0000;
          margin-bottom: 2px;
          text-transform: uppercase;
        }
        .timeline-item:last-child .timeline-year {
          color: #6699FF;
        }
        .timeline-event {
          font-size: 14.5px;
          color: #334155;
          font-weight: 400;
          line-height: 1.5;
        }

        /* Club colours strip */
        .colours-strip {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 3rem;
          padding-top: 2.5rem;
          border-top: 0.5px solid #e2e8f0;
        }
        .colours-label {
          font-size: 11px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: #94a3b8;
        }
        .colour-swatch {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 1.5px solid rgba(0,0,0,0.08);
        }
        .colour-name {
          font-size: 12px;
          color: #64748b;
        }
        .colour-pair {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        @media (max-width: 600px) {
          .about-section { padding: 4rem 1.25rem; }
          .pillars-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 380px) {
          .pillars-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <section className="about-section" id="about" aria-label="About Miami Sharks FC">
        <div className="about-inner">

          {/* Header */}
          <div ref={sectionRef} className={`about-header${sectionInView ? " visible" : ""}`}>
            <p className="about-tag">Who we are</p>
            <h2 className="about-title">Built from the<br />Community Up</h2>
            <div className="about-divider" />
            <p className="about-lead">
              Miami Sharks FC is more than a football club — we are a family rooted
              in Sotik, Bomet County. From our local training grounds to the county
              league, we play with heart, discipline, and community spirit.
            </p>
            <p className="about-lead">
              Our mission is to develop local talent, foster team values, and bring
              competitive football to the Bomet region while representing our
              community with honour on and off the pitch.
            </p>
          </div>

          {/* Pillars */}
          <div ref={pillarsRef} className="pillars-grid" aria-label="Club values">
            {PILLARS.map((p) => (
              <div key={p.title} className={`pillar-card${pillarsInView ? " visible" : ""}`}>
                <span className="pillar-emoji" aria-hidden="true">{p.icon}</span>
                <div className="pillar-title">{p.title}</div>
                <p className="pillar-text">{p.text}</p>
              </div>
            ))}
          </div>

          {/* Timeline */}
          <div ref={timelineRef}>
            <div className={`timeline-header${timelineInView ? " visible" : ""}`}>
              <p className="about-tag">Our story</p>
              <h3 className="timeline-title">Club Timeline</h3>
            </div>
            <div className="timeline" role="list">
              {MILESTONES.map((m) => (
                <div
                  key={m.event}
                  className={`timeline-item${timelineInView ? " visible" : ""}`}
                  role="listitem"
                >
                  <span className="timeline-dot" aria-hidden="true" />
                  <div className="timeline-year">{m.year}</div>
                  <div className="timeline-event">{m.event}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Colours strip */}
          <div className="colours-strip" aria-label="Club colours">
            <span className="colours-label">Club colours</span>
            <div className="colour-pair">
              <span className="colour-swatch" style={{ background: "#CC0000" }} />
              <span className="colour-name">Red</span>
            </div>
            <div className="colour-pair">
              <span className="colour-swatch" style={{ background: "#0A0A0A" }} />
              <span className="colour-name">Black</span>
            </div>
            <div className="colour-pair">
              <span className="colour-swatch" style={{ background: "#0047FF" }} />
              <span className="colour-name">Blue</span>
            </div>
            <div className="colour-pair">
              <span className="colour-swatch" style={{ background: "#ffffff", border: "1.5px solid #e2e8f0" }} />
              <span className="colour-name">White</span>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}