import { useEffect, useRef, useState } from "react";

const POSITIONS = ["All", "Goalkeeper", "Defender", "Midfielder", "Forward"];

const SQUAD = [
  { number: 1,  name: "Enock",   position: "Goalkeeper", role: "GK" },
  { number: 2,  name: "Doku",    position: "Defender",   role: "RB" },
  { number: 3,  name: "Caleb",   position: "Defender",   role: "LB" },
  { number: 4,  name: "Noah",    position: "Defender",   role: "CB" },
  { number: 5,  name: "Pulisic", position: "Defender",   role: "CB" },
  { number: 6,  name: "Ken",     position: "Midfielder",  role: "DM" },
  { number: 7,  name: "Mike",    position: "Midfielder",  role: "RM" },
  { number: 8,  name: "Cheruu",  position: "Midfielder",  role: "CM" },
  { number: 9,  name: "Koros",   position: "Forward",    role: "ST" },
  { number: 10, name: "Giddy",   position: "Midfielder",  role: "AM" },
  { number: 11, name: "Msanii",  position: "Forward",    role: "LW" },
];

const STAFF = [
  {
    name: "Lameck",
    role: "Head Coach",
    initials: "LA",
    description: "Leading the Sharks from the touchline — tactics, discipline, and vision.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    ),
    accent: "#CC0000",
    accentBg: "#2a0000",
    badge: "HC",
  },
  {
    name: "Amos",
    role: "Assistant Coach",
    initials: "AM",
    description: "Supporting the first team with training sessions, analysis, and player development.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4"/>
        <path d="M4 20c0-4 3.58-7 8-7s8 3 8 7"/>
      </svg>
    ),
    accent: "#0047FF",
    accentBg: "#00102a",
    badge: "AC",
  },
];

const POSITION_COLORS = {
  Goalkeeper: { bg: "#fff0f0", border: "#CC0000", text: "#880000", dot: "#CC0000" },
  Defender:   { bg: "#1a1a1a", border: "#444444", text: "#cccccc", dot: "#888888" },
  Midfielder: { bg: "#E8F0FF", border: "#0047FF", text: "#003399", dot: "#0047FF" },
  Forward:    { bg: "#fff0f0", border: "#CC0000", text: "#880000", dot: "#CC0000" },
};

function getInitials(name) {
  if (name === "Your Name") return "?";
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

function useInView(threshold = 0.1) {
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

function PlayerCard({ player, index, visible }) {
  const colors = POSITION_COLORS[player.position];
  const initials = getInitials(player.name);
  const isPlaceholder = player.name === "Your Name";

  return (
    <div
      className="player-card"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(22px)",
        transitionDelay: `${(index % 6) * 0.07}s`,
      }}
      aria-label={`${player.name}, ${player.position}, number ${player.number}`}
    >
      <div className="player-number">{player.number}</div>
      <div
        className="player-avatar"
        style={{
          background: colors.bg,
          border: `2px solid ${colors.border}`,
          color: colors.text,
        }}
      >
        {initials}
      </div>
      <div className="player-name" style={{ opacity: isPlaceholder ? 0.35 : 1 }}>
        {player.name}
      </div>
      <div
        className="player-pos-pill"
        style={{
          background: colors.bg,
          border: `0.5px solid ${colors.border}`,
          color: colors.text,
        }}
      >
        <span className="pos-dot" style={{ background: colors.dot }} aria-hidden="true" />
        {player.role} · {player.position}
      </div>
    </div>
  );
}

function StaffCard({ member, index, visible }) {
  return (
    <div
      className="staff-card"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(22px)",
        transitionDelay: `${index * 0.12}s`,
        borderColor: visible ? member.accent + "33" : "rgba(255,255,255,0.08)",
      }}
      aria-label={`${member.name}, ${member.role}`}
    >
      {/* Top accent bar */}
      <div className="staff-accent-bar" style={{ background: member.accent }} />

      <div className="staff-card-inner">
        {/* Avatar */}
        <div
          className="staff-avatar"
          style={{
            background: member.accentBg,
            border: `2px solid ${member.accent}`,
            color: member.accent,
          }}
        >
          {member.initials}
        </div>

        {/* Info */}
        <div className="staff-info">
          <div className="staff-badge-row">
            <span
              className="staff-badge"
              style={{ background: member.accent + "22", color: member.accent, border: `0.5px solid ${member.accent}55` }}
            >
              {member.badge}
            </span>
            <span className="staff-role" style={{ color: member.accent }}>{member.role}</span>
          </div>
          <div className="staff-name">{member.name}</div>
          <p className="staff-desc">{member.description}</p>
        </div>
      </div>
    </div>
  );
}

export default function Squad() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [headerRef, headerInView] = useInView(0.1);
  const [gridRef, gridInView] = useInView(0.05);
  const [staffRef, staffInView] = useInView(0.1);

  const filtered =
    activeFilter === "All"
      ? SQUAD
      : SQUAD.filter((p) => p.position === activeFilter);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap');

        .squad-section {
          background: #0A0A0A;
          padding: 6rem 1.5rem;
          font-family: 'DM Sans', sans-serif;
        }
        .squad-inner {
          max-width: 900px;
          margin: 0 auto;
        }

        /* Header */
        .squad-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1.5rem;
          margin-bottom: 2.5rem;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .squad-header.visible { opacity: 1; transform: translateY(0); }
        .squad-tag {
          font-size: 11px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 2.5px;
          color: #0047FF;
          margin-bottom: 0.5rem;
        }
        .squad-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(32px, 6vw, 50px);
          letter-spacing: 2px;
          color: #ffffff;
          line-height: 1;
          margin-bottom: 0.5rem;
        }
        .squad-count {
          font-size: 13px;
          color: rgba(255,255,255,0.35);
          font-weight: 300;
        }
        .squad-count span { color: #0047FF; font-weight: 500; }

        /* Filters */
        .squad-filters { display: flex; gap: 8px; flex-wrap: wrap; }
        .filter-btn {
          background: rgba(255,255,255,0.06);
          border: 0.5px solid rgba(255,255,255,0.12);
          color: rgba(255,255,255,0.55);
          padding: 7px 16px;
          border-radius: 20px;
          font-size: 12.5px;
          font-weight: 400;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.3px;
          transition: background 0.2s, color 0.2s, border-color 0.2s;
        }
        .filter-btn:hover { background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.85); }
        .filter-btn.active { background: #CC0000; border-color: #CC0000; color: #ffffff; }

        /* Divider */
        .squad-divider {
          width: 36px; height: 2px;
          background: #0047FF; border-radius: 2px;
          margin-bottom: 2.5rem;
          opacity: 0;
          transition: opacity 0.4s 0.2s ease;
        }
        .squad-divider.visible { opacity: 1; }

        /* Player Grid */
        .squad-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(148px, 1fr));
          gap: 14px;
        }

        /* Player Card */
        .player-card {
          background: rgba(255,255,255,0.04);
          border: 0.5px solid rgba(255,255,255,0.09);
          border-radius: 14px;
          padding: 1.4rem 1rem 1.1rem;
          text-align: center;
          position: relative;
          transition: opacity 0.5s ease, transform 0.5s ease,
                      background 0.2s, border-color 0.2s;
          cursor: default;
        }
        .player-card:hover {
          background: rgba(255,255,255,0.07);
          border-color: rgba(93,202,165,0.3);
        }
        .player-number {
          position: absolute; top: 10px; right: 12px;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 15px; letter-spacing: 0.5px;
          color: rgba(255,255,255,0.2);
        }
        .player-avatar {
          width: 56px; height: 56px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 12px;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 18px; letter-spacing: 1px;
        }
        .player-name {
          font-size: 13.5px; font-weight: 500;
          color: #ffffff; margin-bottom: 8px;
          line-height: 1.3; min-height: 18px;
        }
        .player-pos-pill {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 4px 10px; border-radius: 12px;
          font-size: 11px; font-weight: 500; letter-spacing: 0.2px;
        }
        .pos-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }

        /* ── Coaching Staff ── */
        .staff-section-header {
          margin-top: 3.5rem;
          margin-bottom: 1.5rem;
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .staff-section-header.visible { opacity: 1; transform: translateY(0); }
        .staff-section-label {
          font-size: 11px; font-weight: 500;
          text-transform: uppercase; letter-spacing: 2.5px;
          color: #CC0000; margin-bottom: 0.4rem;
        }
        .staff-section-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(24px, 4vw, 34px);
          letter-spacing: 2px; color: #ffffff; line-height: 1;
        }
        .staff-divider {
          width: 36px; height: 2px;
          background: #CC0000; border-radius: 2px;
          margin-top: 0.75rem;
        }

        .staff-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 16px;
        }

        .staff-card {
          background: rgba(255,255,255,0.04);
          border: 0.5px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          overflow: hidden;
          position: relative;
          transition: opacity 0.5s ease, transform 0.5s ease,
                      background 0.2s, border-color 0.3s;
          cursor: default;
        }
        .staff-card:hover { background: rgba(255,255,255,0.06); }

        .staff-accent-bar { height: 3px; width: 100%; }

        .staff-card-inner {
          display: flex; align-items: flex-start;
          gap: 1.1rem; padding: 1.4rem 1.4rem 1.5rem;
        }

        .staff-avatar {
          width: 58px; height: 58px; border-radius: 50%; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 19px; letter-spacing: 1px;
        }

        .staff-info { flex: 1; min-width: 0; }

        .staff-badge-row {
          display: flex; align-items: center; gap: 8px;
          margin-bottom: 4px;
        }
        .staff-badge {
          font-size: 10px; font-weight: 600; letter-spacing: 1px;
          padding: 2px 7px; border-radius: 5px;
          font-family: 'Bebas Neue', sans-serif;
        }
        .staff-role {
          font-size: 11px; font-weight: 500;
          text-transform: uppercase; letter-spacing: 1.5px;
        }
        .staff-name {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 22px; letter-spacing: 1.5px;
          color: #ffffff; line-height: 1.1;
          margin-bottom: 6px;
        }
        .staff-desc {
          font-size: 12.5px; color: rgba(255,255,255,0.38);
          font-weight: 300; line-height: 1.65; margin: 0;
        }

        /* Legend */
        .squad-legend {
          display: flex; flex-wrap: wrap; gap: 1rem;
          margin-top: 2.5rem; padding-top: 2rem;
          border-top: 0.5px solid rgba(255,255,255,0.08);
        }
        .legend-item {
          display: flex; align-items: center; gap: 6px;
          font-size: 12px; color: rgba(255,255,255,0.4);
        }
        .legend-dot { width: 8px; height: 8px; border-radius: 50%; }

        @media (max-width: 560px) {
          .squad-section { padding: 4rem 1.25rem; }
          .squad-header { align-items: flex-start; flex-direction: column; }
          .squad-grid { grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 10px; }
          .staff-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <section className="squad-section" id="squad" aria-label="Miami Sharks FC squad">
        <div className="squad-inner">

          {/* Header */}
          <div ref={headerRef} className={`squad-header${headerInView ? " visible" : ""}`}>
            <div className="squad-header-left">
              <p className="squad-tag">The Team</p>
              <h2 className="squad-title">Meet the Sharks</h2>
              <p className="squad-count">
                <span>{filtered.length}</span> player{filtered.length !== 1 ? "s" : ""}{" "}
                {activeFilter !== "All" ? `· ${activeFilter}` : "in the squad"}
              </p>
            </div>
            <div className="squad-filters" role="group" aria-label="Filter by position">
              {POSITIONS.map((pos) => (
                <button
                  key={pos}
                  className={`filter-btn${activeFilter === pos ? " active" : ""}`}
                  onClick={() => setActiveFilter(pos)}
                  aria-pressed={activeFilter === pos}
                >
                  {pos}
                </button>
              ))}
            </div>
          </div>

          <div className={`squad-divider${headerInView ? " visible" : ""}`} />

          {/* Player Grid */}
          <div ref={gridRef} className="squad-grid" role="list">
            {filtered.map((player, i) => (
              <PlayerCard
                key={player.number}
                player={player}
                index={i}
                visible={gridInView}
              />
            ))}
          </div>

          {/* Legend */}
          <div className="squad-legend" aria-label="Position colour legend">
            {Object.entries(POSITION_COLORS).map(([pos, colors]) => (
              <div className="legend-item" key={pos}>
                <span className="legend-dot" style={{ background: colors.dot }} aria-hidden="true" />
                {pos}
              </div>
            ))}
          </div>

          {/* ── Coaching Staff ── */}
          <div
            ref={staffRef}
            className={`staff-section-header${staffInView ? " visible" : ""}`}
          >
            <p className="staff-section-label">Coaching Staff</p>
            <h3 className="staff-section-title">The Dugout</h3>
            <div className="staff-divider" />
          </div>

          <div className="staff-grid" role="list">
            {STAFF.map((member, i) => (
              <StaffCard
                key={member.name}
                member={member}
                index={i}
                visible={staffInView}
              />
            ))}
          </div>

        </div>
      </section>
    </>
  );
}