import { useEffect, useRef, useState } from "react";

const POSITIONS = ["All", "Goalkeeper", "Defender", "Midfielder", "Forward"];

const SQUAD = [
  { number: 1,  name: "Enock",   position: "Goalkeeper", role: "GK", photo: null },
  { number: 2,  name: "Doku",    position: "Defender",   role: "RB", photo: null },
  { number: 3,  name: "Caleb",   position: "Defender",   role: "LB", photo: null },
  { number: 4,  name: "Noah",    position: "Defender",   role: "CB", photo: "/players/ken.jpg" },
  { number: 5,  name: "Pulisic", position: "Defender",   role: "CB", photo: "/players/pulisic.jpg" },
  { number: 6,  name: "Ken",     position: "Midfielder",  role: "DM", photo: "/players/cheruu.jpg" },
  { number: 7,  name: "Mike",    position: "Midfielder",  role: "RM", photo: "/players/koros.jpg" },
  { number: 8,  name: "Cheruu",  position: "Midfielder",  role: "CM", photo: "/players/amos.jpg" },
  { number: 9,  name: "Koros",   position: "Forward",    role: "ST", photo: "/players/mike.jpg" },
  { number: 10, name: "Giddy",   position: "Midfielder",  role: "AM", photo: "/players/msanii.jpg" },
  { number: 11, name: "Msanii",  position: "Forward",    role: "LW", photo: "/players/giddy.jpg" },
];

const STAFF = [
  {
    name: "Lameck",
    role: "Head Coach",
    photo: "/players/noah.jpg",
    initials: "LA",
    description: "Leading the Sharks from the touchline — tactics, discipline, and vision.",
    accent: "#CC0000",
    accentBg: "#2a0000",
    badge: "HC",
  },
  {
    name: "Amos",
    role: "Assistant Coach",
    photo: "/players/assis.jpg",
    initials: "AM",
    description: "Supporting the first team with training sessions, analysis, and player development.",
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

/* ── Profile Modal ── */
function ProfileModal({ item, type, onClose }) {
  const isPlayer = type === "player";
  const colors = isPlayer ? POSITION_COLORS[item.position] : null;
  const [imgError, setImgError] = useState(false);
  const accentColor = isPlayer
    ? (item.position === "Midfielder" ? "#0047FF" : "#CC0000")
    : item.accent;

  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <>
      <style>{`
        .modal-backdrop {
          position: fixed; inset: 0; z-index: 1000;
          background: rgba(0,0,0,0.75);
          display: flex; align-items: flex-end;
          justify-content: center;
          animation: fadeInBackdrop 0.2s ease;
        }
        @keyframes fadeInBackdrop { from { opacity: 0; } to { opacity: 1; } }
        .modal-sheet {
          background: #111111;
          border-radius: 20px 20px 0 0;
          width: 100%; max-width: 480px;
          padding: 0 0 2.5rem;
          overflow: hidden;
          animation: slideUp 0.3s cubic-bezier(0.32,0.72,0,1);
          position: relative;
        }
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        .modal-accent-bar { height: 4px; width: 100%; }
        .modal-handle {
          width: 36px; height: 4px; border-radius: 2px;
          background: rgba(255,255,255,0.2);
          margin: 14px auto 20px;
        }
        .modal-close {
          position: absolute; top: 18px; right: 18px;
          background: rgba(255,255,255,0.08);
          border: 0.5px solid rgba(255,255,255,0.15);
          color: rgba(255,255,255,0.6);
          width: 30px; height: 30px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; font-size: 15px;
          transition: background 0.15s, color 0.15s;
          font-family: 'DM Sans', sans-serif;
        }
        .modal-close:hover { background: rgba(255,255,255,0.14); color: #fff; }
        .modal-body { padding: 0 1.75rem; }
        .modal-avatar-wrap {
          display: flex; flex-direction: column;
          align-items: center; margin-bottom: 1.5rem;
        }
        .modal-avatar {
          width: 110px; height: 110px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 32px; letter-spacing: 2px;
          overflow: hidden; margin-bottom: 16px;
        }
        .modal-avatar-photo { background: #1a1a1a; }
        .modal-avatar-img {
          width: 100%; height: 100%;
          object-fit: cover; object-position: center top;
        }
        .modal-number-badge {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 11px; letter-spacing: 2px;
          color: rgba(255,255,255,0.35);
          background: rgba(255,255,255,0.07);
          border: 0.5px solid rgba(255,255,255,0.1);
          padding: 3px 10px; border-radius: 20px;
        }
        .modal-name {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 36px; letter-spacing: 2px;
          color: #ffffff; text-align: center;
          line-height: 1; margin: 10px 0 6px;
        }
        .modal-pos-pill {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 5px 14px; border-radius: 14px;
          font-size: 12px; font-weight: 500; letter-spacing: 0.3px;
        }
        .modal-pos-dot { width: 6px; height: 6px; border-radius: 50%; }
        .modal-divider {
          width: 100%; height: 0.5px;
          background: rgba(255,255,255,0.08);
          margin: 1.5rem 0;
        }
        .modal-stats {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .modal-stat-card {
          background: rgba(255,255,255,0.04);
          border: 0.5px solid rgba(255,255,255,0.08);
          border-radius: 12px; padding: 0.9rem 1rem;
        }
        .modal-stat-label {
          font-size: 10px; font-weight: 500;
          text-transform: uppercase; letter-spacing: 1.5px;
          color: rgba(255,255,255,0.35); margin-bottom: 4px;
        }
        .modal-stat-value {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 20px; letter-spacing: 1px; color: #ffffff;
        }
        .modal-desc {
          font-size: 13px; color: rgba(255,255,255,0.45);
          font-weight: 300; line-height: 1.7;
          text-align: center; margin-top: 1.25rem;
        }
        .modal-staff-role {
          font-size: 11px; font-weight: 500;
          text-transform: uppercase; letter-spacing: 2px;
          text-align: center; margin-bottom: 6px;
        }
      `}</style>

      <div
        className="modal-backdrop"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        role="dialog"
        aria-modal="true"
        aria-label={`${item.name} profile`}
      >
        <div className="modal-sheet">
          <div className="modal-accent-bar" style={{ background: accentColor }} />
          <div className="modal-handle" />
          <button className="modal-close" onClick={onClose} aria-label="Close">×</button>

          <div className="modal-body">
            <div className="modal-avatar-wrap">
              {/* Number badge — players only */}
              {isPlayer && (
                <div className="modal-number-badge">#{item.number}</div>
              )}

              {/* Avatar */}
              {item.photo && !imgError ? (
                <div
                  className="modal-avatar modal-avatar-photo"
                  style={{ border: `3px solid ${accentColor}`, marginTop: isPlayer ? 10 : 0 }}
                >
                  <img
                    src={item.photo}
                    alt={item.name}
                    className="modal-avatar-img"
                    onError={() => setImgError(true)}
                  />
                </div>
              ) : (
                <div
                  className="modal-avatar"
                  style={{
                    background: isPlayer ? colors.bg : item.accentBg,
                    border: `3px solid ${accentColor}`,
                    color: isPlayer ? colors.text : accentColor,
                    marginTop: isPlayer ? 10 : 0,
                  }}
                >
                  {isPlayer ? getInitials(item.name) : item.initials}
                </div>
              )}
            </div>

            {/* Staff role label */}
            {!isPlayer && (
              <p className="modal-staff-role" style={{ color: accentColor }}>{item.role}</p>
            )}

            <h2 className="modal-name">{item.name}</h2>

            {/* Position pill — players */}
            {isPlayer && (
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "0.25rem" }}>
                <div
                  className="modal-pos-pill"
                  style={{
                    background: colors.bg,
                    border: `0.5px solid ${colors.border}`,
                    color: colors.text,
                  }}
                >
                  <span className="modal-pos-dot" style={{ background: colors.dot }} />
                  {item.role} · {item.position}
                </div>
              </div>
            )}

            <div className="modal-divider" />

            {/* Stats grid */}
            {isPlayer ? (
              <div className="modal-stats">
                <div className="modal-stat-card">
                  <div className="modal-stat-label">Squad Number</div>
                  <div className="modal-stat-value" style={{ color: accentColor }}>#{item.number}</div>
                </div>
                <div className="modal-stat-card">
                  <div className="modal-stat-label">Position</div>
                  <div className="modal-stat-value">{item.role}</div>
                </div>
                <div className="modal-stat-card" style={{ gridColumn: "1 / -1" }}>
                  <div className="modal-stat-label">Department</div>
                  <div className="modal-stat-value">{item.position}</div>
                </div>
              </div>
            ) : (
              <div className="modal-stats">
                <div className="modal-stat-card" style={{ gridColumn: "1 / -1" }}>
                  <div className="modal-stat-label">Role</div>
                  <div className="modal-stat-value" style={{ color: accentColor }}>{item.role}</div>
                </div>
              </div>
            )}

            {/* Staff description */}
            {!isPlayer && <p className="modal-desc">{item.description}</p>}
          </div>
        </div>
      </div>
    </>
  );
}

/* ── Player Card ── */
function PlayerCard({ player, index, visible, onClick }) {
  const colors = POSITION_COLORS[player.position];
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className="player-card"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(22px)",
        transitionDelay: `${(index % 6) * 0.07}s`,
        cursor: "pointer",
      }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onClick(); }}
      aria-label={`View ${player.name}'s profile`}
    >
      <div className="player-number">{player.number}</div>

      {player.photo && !imgError ? (
        <div
          className="player-avatar player-avatar-photo"
          style={{ border: `2px solid ${colors.border}` }}
        >
          <img
            src={player.photo}
            alt={player.name}
            className="player-photo-img"
            onError={() => setImgError(true)}
          />
        </div>
      ) : (
        <div
          className="player-avatar"
          style={{
            background: colors.bg,
            border: `2px solid ${colors.border}`,
            color: colors.text,
          }}
        >
          {getInitials(player.name)}
        </div>
      )}

      <div className="player-name">{player.name}</div>
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

      {/* View hint */}
      <div className="player-view-hint">View</div>
    </div>
  );
}

/* ── Staff Card ── */
function StaffCard({ member, index, visible, onClick }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className="staff-card"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(22px)",
        transitionDelay: `${index * 0.12}s`,
        borderColor: visible ? member.accent + "33" : "rgba(255,255,255,0.08)",
        cursor: "pointer",
      }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onClick(); }}
      aria-label={`View ${member.name}'s profile`}
    >
      <div className="staff-accent-bar" style={{ background: member.accent }} />

      <div className="staff-card-inner">
        {member.photo && !imgError ? (
          <div
            className="staff-avatar staff-avatar-photo"
            style={{ border: `2px solid ${member.accent}` }}
          >
            <img
              src={member.photo}
              alt={member.name}
              className="staff-photo-img"
              onError={() => setImgError(true)}
            />
          </div>
        ) : (
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
        )}

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

/* ── Main Export ── */
export default function Squad() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [headerRef, headerInView] = useInView(0.1);
  const [gridRef, gridInView] = useInView(0.05);
  const [staffRef, staffInView] = useInView(0.1);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedType, setSelectedType] = useState(null);

  const filtered =
    activeFilter === "All"
      ? SQUAD
      : SQUAD.filter((p) => p.position === activeFilter);

  const openModal = (item, type) => {
    setSelectedItem(item);
    setSelectedType(type);
  };
  const closeModal = () => {
    setSelectedItem(null);
    setSelectedType(null);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap');

        .squad-section {
          background: #0A0A0A;
          padding: 6rem 1.5rem;
          font-family: 'DM Sans', sans-serif;
        }
        .squad-inner { max-width: 900px; margin: 0 auto; }

        .squad-header {
          display: flex; align-items: flex-end;
          justify-content: space-between; flex-wrap: wrap;
          gap: 1.5rem; margin-bottom: 2.5rem;
          opacity: 0; transform: translateY(20px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .squad-header.visible { opacity: 1; transform: translateY(0); }
        .squad-tag {
          font-size: 11px; font-weight: 500;
          text-transform: uppercase; letter-spacing: 2.5px;
          color: #0047FF; margin-bottom: 0.5rem;
        }
        .squad-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(32px, 6vw, 50px);
          letter-spacing: 2px; color: #ffffff;
          line-height: 1; margin-bottom: 0.5rem;
        }
        .squad-count {
          font-size: 13px; color: rgba(255,255,255,0.35); font-weight: 300;
        }
        .squad-count span { color: #0047FF; font-weight: 500; }

        .squad-filters { display: flex; gap: 8px; flex-wrap: wrap; }
        .filter-btn {
          background: rgba(255,255,255,0.06);
          border: 0.5px solid rgba(255,255,255,0.12);
          color: rgba(255,255,255,0.55);
          padding: 7px 16px; border-radius: 20px;
          font-size: 12.5px; font-weight: 400;
          cursor: pointer; font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.3px;
          transition: background 0.2s, color 0.2s, border-color 0.2s;
        }
        .filter-btn:hover { background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.85); }
        .filter-btn.active { background: #CC0000; border-color: #CC0000; color: #ffffff; }

        .squad-divider {
          width: 36px; height: 2px;
          background: #0047FF; border-radius: 2px;
          margin-bottom: 2.5rem; opacity: 0;
          transition: opacity 0.4s 0.2s ease;
        }
        .squad-divider.visible { opacity: 1; }

        .squad-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(148px, 1fr));
          gap: 14px;
        }

        .player-card {
          background: rgba(255,255,255,0.04);
          border: 0.5px solid rgba(255,255,255,0.09);
          border-radius: 14px;
          padding: 1.4rem 1rem 1.1rem;
          text-align: center; position: relative;
          transition: opacity 0.5s ease, transform 0.5s ease,
                      background 0.2s, border-color 0.2s;
        }
        .player-card:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(204,0,0,0.4);
        }
        .player-card:hover .player-view-hint { opacity: 1; }
        .player-number {
          position: absolute; top: 10px; right: 12px;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 15px; letter-spacing: 0.5px;
          color: rgba(255,255,255,0.2);
        }
        .player-view-hint {
          position: absolute; bottom: 10px; right: 12px;
          font-size: 10px; font-weight: 500;
          text-transform: uppercase; letter-spacing: 1.5px;
          color: rgba(255,255,255,0.3);
          opacity: 0; transition: opacity 0.2s;
        }

        .player-avatar {
          width: 64px; height: 64px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 12px;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 18px; letter-spacing: 1px;
          overflow: hidden;
        }
        .player-avatar-photo { background: #111; }
        .player-photo-img {
          width: 100%; height: 100%;
          object-fit: cover; object-position: center top;
          display: block;
        }

        .player-name {
          font-size: 13.5px; font-weight: 500;
          color: #ffffff; margin-bottom: 8px;
          line-height: 1.3;
        }
        .player-pos-pill {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 4px 10px; border-radius: 12px;
          font-size: 11px; font-weight: 500; letter-spacing: 0.2px;
        }
        .pos-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }

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

        .staff-section-header {
          margin-top: 3.5rem; margin-bottom: 1.5rem;
          opacity: 0; transform: translateY(16px);
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
          background: #CC0000; border-radius: 2px; margin-top: 0.75rem;
        }

        .staff-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 16px;
        }

        .staff-card {
          background: rgba(255,255,255,0.04);
          border: 0.5px solid rgba(255,255,255,0.08);
          border-radius: 16px; overflow: hidden; position: relative;
          transition: opacity 0.5s ease, transform 0.5s ease,
                      background 0.2s, border-color 0.3s;
        }
        .staff-card:hover { background: rgba(255,255,255,0.07); }
        .staff-accent-bar { height: 3px; width: 100%; }

        .staff-card-inner {
          display: flex; align-items: flex-start;
          gap: 1.1rem; padding: 1.4rem 1.4rem 1.5rem;
        }

        .staff-avatar {
          width: 72px; height: 72px; border-radius: 50%; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 19px; letter-spacing: 1px;
          overflow: hidden;
        }
        .staff-avatar-photo { background: #111; }
        .staff-photo-img {
          width: 100%; height: 100%;
          object-fit: cover; object-position: center top;
          display: block;
        }

        .staff-info { flex: 1; min-width: 0; }
        .staff-badge-row {
          display: flex; align-items: center; gap: 8px; margin-bottom: 4px;
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
          color: #ffffff; line-height: 1.1; margin-bottom: 6px;
        }
        .staff-desc {
          font-size: 12.5px; color: rgba(255,255,255,0.38);
          font-weight: 300; line-height: 1.65; margin: 0;
        }

        @media (max-width: 560px) {
          .squad-section { padding: 4rem 1.25rem; }
          .squad-header { align-items: flex-start; flex-direction: column; }
          .squad-grid { grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 10px; }
          .staff-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <section className="squad-section" id="squad" aria-label="Miami Sharks FC squad">
        <div className="squad-inner">

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

          <div ref={gridRef} className="squad-grid" role="list">
            {filtered.map((player, i) => (
              <PlayerCard
                key={player.number}
                player={player}
                index={i}
                visible={gridInView}
                onClick={() => openModal(player, "player")}
              />
            ))}
          </div>

          <div className="squad-legend" aria-label="Position colour legend">
            {Object.entries(POSITION_COLORS).map(([pos, colors]) => (
              <div className="legend-item" key={pos}>
                <span className="legend-dot" style={{ background: colors.dot }} aria-hidden="true" />
                {pos}
              </div>
            ))}
          </div>

          <div ref={staffRef} className={`staff-section-header${staffInView ? " visible" : ""}`}>
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
                onClick={() => openModal(member, "staff")}
              />
            ))}
          </div>

        </div>
      </section>

      {selectedItem && (
        <ProfileModal item={selectedItem} type={selectedType} onClose={closeModal} />
      )}
    </>
  );
}