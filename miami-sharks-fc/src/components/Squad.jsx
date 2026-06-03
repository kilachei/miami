import { useEffect, useRef, useState, useCallback } from "react";

// ─────────────────────────────────────────
//  SUPABASE CONFIG
// ─────────────────────────────────────────
const SUPABASE_URL = 'https://mahmndpjrrgpbxmkqllz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1haG1uZHBqcnJncGJ4bWtxbGx6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0NTMxNTcsImV4cCI6MjA5NjAyOTE1N30.40gyWWuKlmEYG4ZYmIkE0HsH_Mls4wk56mIkc_yZJpU';

async function fetchMembers() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/members?order=created_at.asc`, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
    }
  });
  if (!res.ok) throw new Error('Failed to fetch members');
  return res.json();
}

// ─────────────────────────────────────────
//  CONSTANTS
// ─────────────────────────────────────────
const POSITIONS = ["All", "Goalkeeper", "Defender", "Midfielder", "Forward"];

const POSITION_MAP = {
  goalkeeper: "Goalkeeper", keeper: "Goalkeeper", goalie: "Goalkeeper",
  defender: "Defender", back: "Defender", cb: "Defender", rb: "Defender", lb: "Defender",
  midfielder: "Midfielder", mid: "Midfielder", cm: "Midfielder", dm: "Midfielder", am: "Midfielder",
  forward: "Forward", striker: "Forward", winger: "Forward", attacker: "Forward", st: "Forward", lw: "Forward", rw: "Forward",
};

function normalizePosition(pos) {
  if (!pos) return "Midfielder";
  const lower = pos.toLowerCase();
  for (const [key, val] of Object.entries(POSITION_MAP)) {
    if (lower.includes(key)) return val;
  }
  return "Midfielder";
}

const POSITION_COLORS = {
  Goalkeeper: { bg: "#1a0000", border: "#CC0000", text: "#ff6b6b", dot: "#CC0000", glow: "rgba(204,0,0,0.25)" },
  Defender:   { bg: "#0d0d0d", border: "#555",    text: "#aaaaaa", dot: "#777",    glow: "rgba(100,100,100,0.15)" },
  Midfielder: { bg: "#000d1a", border: "#0047FF", text: "#6fa3ff", dot: "#0047FF", glow: "rgba(0,71,255,0.22)" },
  Forward:    { bg: "#1a0000", border: "#CC0000", text: "#ff6b6b", dot: "#CC0000", glow: "rgba(204,0,0,0.25)" },
};

const STAFF_ACCENTS = [
  { color: "#CC0000", bg: "#2a0000" },
  { color: "#0047FF", bg: "#00102a" },
  { color: "#00c896", bg: "#001a12" },
  { color: "#ff8800", bg: "#1a0c00" },
];

// ─────────────────────────────────────────
//  UTILS
// ─────────────────────────────────────────
function getInitials(name) {
  return (name || "?").split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

function calcAge(dob) {
  if (!dob) return null;
  const d = new Date(dob), now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  if (now.getMonth() - d.getMonth() < 0 || (now.getMonth() === d.getMonth() && now.getDate() < d.getDate())) age--;
  return age > 0 && age < 80 ? age : null;
}

function useInView() {
  const ref = useRef(null);
  return [ref, true]; // always visible — no scroll-trigger needed
}

// ─────────────────────────────────────────
//  TRANSFORM RAW SUPABASE ROW → UI SHAPE
// ─────────────────────────────────────────
function transformMembers(raw) {
  const squad = raw
    .filter((m) => m.role === "player")
    .map((m) => ({
      id: m.id,
      number: parseInt((m.number || "0").replace(/[^0-9]/g, "")) || 0,
      name: [m.fname, m.lname].filter(Boolean).join(" "),
      position: normalizePosition(m.position),
      roleShort: m.position || "Player",
      nationality: m.nationality || "",
      dob: m.dob || "",
      bio: m.bio || "",
      photo: m.photo || null,
    }));

  const staff = raw
    .filter((m) => m.role === "coach" || m.role === "staff")
    .map((m, i) => ({
      id: m.id,
      name: [m.fname, m.lname].filter(Boolean).join(" "),
      role: m.position || "Staff",
      roleType: m.role,
      nationality: m.nationality || "",
      bio: m.bio || "",
      photo: m.photo || null,
      initials: ((m.fname || "?")[0] + (m.lname || "")[0]).toUpperCase(),
      accentIndex: i % STAFF_ACCENTS.length,
    }));

  return { squad, staff };
}

// ─────────────────────────────────────────
//  PROFILE MODAL
// ─────────────────────────────────────────
function ProfileModal({ item, type, onClose, accentColor }) {
  const isPlayer = type === "player";
  const colors = isPlayer ? POSITION_COLORS[item.position] : null;
  const [imgError, setImgError] = useState(false);
  const accent = accentColor || (isPlayer
    ? (item.position === "Midfielder" ? "#0047FF" : "#CC0000")
    : STAFF_ACCENTS[item.accentIndex]?.color || "#CC0000");

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [onClose]);

  const age = calcAge(item.dob);

  return (
    <div
      style={{
        position:"fixed",inset:0,zIndex:1000,
        background:"rgba(0,0,0,0.8)",
        display:"flex",alignItems:"flex-end",justifyContent:"center",
        animation:"fadeInBd 0.2s ease",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog" aria-modal="true" aria-label={`${item.name} profile`}
    >
      <div style={{
        background:"#111",borderRadius:"20px 20px 0 0",
        width:"100%",maxWidth:460,paddingBottom:"2.5rem",
        overflow:"hidden",animation:"slideUp 0.3s cubic-bezier(0.32,0.72,0,1)",
        position:"relative",
      }}>
        <div style={{ height:4, background: accent, width:"100%" }} />
        <div style={{ width:36,height:4,borderRadius:2,background:"rgba(255,255,255,0.15)",margin:"14px auto 20px" }} />
        <button onClick={onClose} aria-label="Close" style={{
          position:"absolute",top:18,right:18,
          background:"rgba(255,255,255,0.07)",border:"0.5px solid rgba(255,255,255,0.12)",
          color:"rgba(255,255,255,0.55)",width:30,height:30,borderRadius:"50%",
          display:"flex",alignItems:"center",justifyContent:"center",
          cursor:"pointer",fontSize:16,fontFamily:"inherit",
        }}>×</button>

        <div style={{ padding:"0 1.75rem" }}>
          <div style={{ display:"flex",flexDirection:"column",alignItems:"center",marginBottom:"1.4rem" }}>
            {isPlayer && (
              <div style={{
                fontFamily:"'Bebas Neue',sans-serif",fontSize:11,letterSpacing:"2px",
                color:"rgba(255,255,255,0.35)",background:"rgba(255,255,255,0.07)",
                border:"0.5px solid rgba(255,255,255,0.1)",
                padding:"3px 10px",borderRadius:20,marginBottom:10,
              }}>#{item.number}</div>
            )}
            <div style={{
              width:100,height:100,borderRadius:"50%",overflow:"hidden",
              border:`3px solid ${accent}`,
              display:"flex",alignItems:"center",justifyContent:"center",
              background: isPlayer
                ? (item.photo && !imgError ? colors.bg : colors.border)
                : (STAFF_ACCENTS[item.accentIndex]?.color || accent),
              fontFamily:"'Bebas Neue',sans-serif",fontSize:28,letterSpacing:2,
              color:"#fff",
              boxShadow: `0 0 28px ${accent}44`,
              marginBottom:14,
            }}>
              {item.photo && !imgError
                ? <img src={item.photo} alt={item.name} onError={()=>setImgError(true)} style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center top"}} />
                : getInitials(item.name)
              }
            </div>
          </div>

          {!isPlayer && (
            <p style={{ textAlign:"center",fontSize:10,fontWeight:500,textTransform:"uppercase",letterSpacing:"2px",color:accent,marginBottom:4 }}>{item.role}</p>
          )}
          <h2 style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:34,letterSpacing:"2px",color:"#fff",textAlign:"center",lineHeight:1,margin:"0 0 10px" }}>{item.name}</h2>

          {isPlayer && (
            <div style={{ display:"flex",justifyContent:"center",marginBottom:4 }}>
              <div style={{
                display:"inline-flex",alignItems:"center",gap:6,
                padding:"4px 13px",borderRadius:14,
                background:colors.bg,border:`0.5px solid ${colors.border}`,color:colors.text,
                fontSize:12,fontWeight:500,
              }}>
                <span style={{ width:6,height:6,borderRadius:"50%",background:colors.dot,flexShrink:0 }} />
                {item.roleShort} · {item.position}
              </div>
            </div>
          )}

          <div style={{ height:"0.5px",background:"rgba(255,255,255,0.08)",margin:"1.4rem 0" }} />

          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>
            {isPlayer && (
              <>
                <div style={{ background:"rgba(255,255,255,0.04)",border:"0.5px solid rgba(255,255,255,0.08)",borderRadius:12,padding:"0.85rem 1rem" }}>
                  <div style={{ fontSize:10,fontWeight:500,textTransform:"uppercase",letterSpacing:"1.5px",color:"rgba(255,255,255,0.3)",marginBottom:4 }}>Number</div>
                  <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:22,letterSpacing:1,color:accent }}>#{item.number}</div>
                </div>
                <div style={{ background:"rgba(255,255,255,0.04)",border:"0.5px solid rgba(255,255,255,0.08)",borderRadius:12,padding:"0.85rem 1rem" }}>
                  <div style={{ fontSize:10,fontWeight:500,textTransform:"uppercase",letterSpacing:"1.5px",color:"rgba(255,255,255,0.3)",marginBottom:4 }}>Position</div>
                  <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:22,letterSpacing:1,color:"#fff" }}>{item.roleShort}</div>
                </div>
                {item.nationality && (
                  <div style={{ background:"rgba(255,255,255,0.04)",border:"0.5px solid rgba(255,255,255,0.08)",borderRadius:12,padding:"0.85rem 1rem" }}>
                    <div style={{ fontSize:10,fontWeight:500,textTransform:"uppercase",letterSpacing:"1.5px",color:"rgba(255,255,255,0.3)",marginBottom:4 }}>Nationality</div>
                    <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:18,letterSpacing:1,color:"#fff" }}>{item.nationality}</div>
                  </div>
                )}
                {age && (
                  <div style={{ background:"rgba(255,255,255,0.04)",border:"0.5px solid rgba(255,255,255,0.08)",borderRadius:12,padding:"0.85rem 1rem" }}>
                    <div style={{ fontSize:10,fontWeight:500,textTransform:"uppercase",letterSpacing:"1.5px",color:"rgba(255,255,255,0.3)",marginBottom:4 }}>Age</div>
                    <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:22,letterSpacing:1,color:"#fff" }}>{age}</div>
                  </div>
                )}
              </>
            )}
            {!isPlayer && (
              <>
                <div style={{ background:"rgba(255,255,255,0.04)",border:"0.5px solid rgba(255,255,255,0.08)",borderRadius:12,padding:"0.85rem 1rem",gridColumn:"1/-1" }}>
                  <div style={{ fontSize:10,fontWeight:500,textTransform:"uppercase",letterSpacing:"1.5px",color:"rgba(255,255,255,0.3)",marginBottom:4 }}>Role</div>
                  <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:22,letterSpacing:1,color:accent }}>{item.role}</div>
                </div>
                {item.nationality && (
                  <div style={{ background:"rgba(255,255,255,0.04)",border:"0.5px solid rgba(255,255,255,0.08)",borderRadius:12,padding:"0.85rem 1rem" }}>
                    <div style={{ fontSize:10,fontWeight:500,textTransform:"uppercase",letterSpacing:"1.5px",color:"rgba(255,255,255,0.3)",marginBottom:4 }}>Nationality</div>
                    <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:18,letterSpacing:1,color:"#fff" }}>{item.nationality}</div>
                  </div>
                )}
              </>
            )}
          </div>

          {item.bio && (
            <p style={{ fontSize:13,color:"rgba(255,255,255,0.4)",fontWeight:300,lineHeight:1.7,textAlign:"center",marginTop:"1.2rem" }}>{item.bio}</p>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeInBd { from{opacity:0} to{opacity:1} }
        @keyframes slideUp { from{transform:translateY(100%);opacity:0} to{transform:translateY(0);opacity:1} }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────
//  PLAYER CARD
// ─────────────────────────────────────────
function PlayerCard({ player, index, visible, onClick }) {
  const colors = POSITION_COLORS[player.position] || POSITION_COLORS.Midfielder;
  const [imgError, setImgError] = useState(false);

  return (
    <div
      onClick={onClick}
      role="button" tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onClick(); }}
      aria-label={`View ${player.name}'s profile`}
      style={{
        background:"rgba(255,255,255,0.035)",
        border:"0.5px solid rgba(255,255,255,0.08)",
        borderRadius:14,padding:"1.3rem 1rem 1rem",
        textAlign:"center",position:"relative",cursor:"pointer",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition:`opacity 0.5s ease ${(index%6)*0.065}s, transform 0.5s ease ${(index%6)*0.065}s`,
      }}
      onMouseEnter={e=>{
        e.currentTarget.style.background="rgba(255,255,255,0.07)";
        e.currentTarget.style.borderColor=colors.border+"66";
        e.currentTarget.style.boxShadow=`0 4px 24px ${colors.glow}`;
      }}
      onMouseLeave={e=>{
        e.currentTarget.style.background="rgba(255,255,255,0.035)";
        e.currentTarget.style.borderColor="rgba(255,255,255,0.08)";
        e.currentTarget.style.boxShadow="none";
      }}
    >
      <div style={{ position:"absolute",top:10,right:12,fontFamily:"'Bebas Neue',sans-serif",fontSize:14,letterSpacing:"0.5px",color:"rgba(255,255,255,0.2)" }}>
        {player.number || "—"}
      </div>

      <div style={{
        width:62,height:62,borderRadius:"50%",margin:"0 auto 11px",overflow:"hidden",
        display:"flex",alignItems:"center",justifyContent:"center",
        background: player.photo && !imgError ? colors.bg : colors.border,
        border:`2px solid ${colors.border}`,
        fontFamily:"'Bebas Neue',sans-serif",fontSize:17,letterSpacing:1,
        color:"#fff",
      }}>
        {player.photo && !imgError
          ? <img src={player.photo} alt={player.name} onError={()=>setImgError(true)} style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center top"}} />
          : getInitials(player.name)
        }
      </div>

      <div style={{ fontSize:13,fontWeight:500,color:"#fff",marginBottom:8,lineHeight:1.3 }}>{player.name}</div>
      <div style={{
        display:"inline-flex",alignItems:"center",gap:5,
        padding:"3px 9px",borderRadius:12,
        background:colors.bg,border:`0.5px solid ${colors.border}`,color:colors.text,
        fontSize:11,fontWeight:500,
      }}>
        <span style={{ width:5,height:5,borderRadius:"50%",background:colors.dot,flexShrink:0 }} />
        {player.roleShort}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
//  STAFF CARD
// ─────────────────────────────────────────
function StaffCard({ member, index, visible, onClick }) {
  const [imgError, setImgError] = useState(false);
  const acc = STAFF_ACCENTS[member.accentIndex] || STAFF_ACCENTS[0];

  return (
    <div
      onClick={onClick}
      role="button" tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onClick(); }}
      aria-label={`View ${member.name}'s profile`}
      style={{
        background:"rgba(255,255,255,0.035)",
        border:`0.5px solid ${visible ? acc.color+"33" : "rgba(255,255,255,0.08)"}`,
        borderRadius:16,overflow:"hidden",cursor:"pointer",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition:`opacity 0.5s ease ${index*0.12}s, transform 0.5s ease ${index*0.12}s, border-color 0.3s`,
      }}
      onMouseEnter={e=>{ e.currentTarget.style.background="rgba(255,255,255,0.07)"; e.currentTarget.style.borderColor=acc.color+"66"; }}
      onMouseLeave={e=>{ e.currentTarget.style.background="rgba(255,255,255,0.035)"; e.currentTarget.style.borderColor=acc.color+"33"; }}
    >
      <div style={{ height:3,background:acc.color,width:"100%" }} />
      <div style={{ display:"flex",alignItems:"flex-start",gap:"1.1rem",padding:"1.3rem 1.3rem 1.4rem" }}>
        <div style={{
          width:68,height:68,borderRadius:"50%",flexShrink:0,overflow:"hidden",
          display:"flex",alignItems:"center",justifyContent:"center",
          background:acc.bg,border:`2px solid ${acc.color}`,
          fontFamily:"'Bebas Neue',sans-serif",fontSize:18,letterSpacing:1,color:acc.color,
        }}>
          {member.photo && !imgError
            ? <img src={member.photo} alt={member.name} onError={()=>setImgError(true)} style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center top"}} />
            : member.initials
          }
        </div>
        <div style={{ flex:1,minWidth:0 }}>
          <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:4 }}>
            <span style={{
              fontSize:10,fontWeight:600,letterSpacing:"1px",padding:"2px 7px",borderRadius:5,
              fontFamily:"'Bebas Neue',sans-serif",
              background:acc.color+"22",color:acc.color,border:`0.5px solid ${acc.color}55`,
            }}>{member.role.slice(0,2).toUpperCase()}</span>
            <span style={{ fontSize:11,fontWeight:500,textTransform:"uppercase",letterSpacing:"1.5px",color:acc.color }}>
              {member.roleType === "staff" ? "Staff" : "Coach"}
            </span>
          </div>
          <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:22,letterSpacing:"1.5px",color:"#fff",lineHeight:1.1,marginBottom:5 }}>{member.name}</div>
          <p style={{ fontSize:12,color:"rgba(255,255,255,0.35)",fontWeight:300,lineHeight:1.65,margin:0 }}>
            {member.bio || member.role}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
//  EMPTY STATE
// ─────────────────────────────────────────
function EmptyState({ label }) {
  return (
    <div style={{ gridColumn:"1/-1",textAlign:"center",padding:"48px 20px",color:"rgba(255,255,255,0.15)",fontSize:13 }}>
      <div style={{ fontSize:36,marginBottom:10,opacity:0.3 }}>⚽</div>
      No {label} added yet.
    </div>
  );
}

// ─────────────────────────────────────────
//  MAIN EXPORT
// ─────────────────────────────────────────
export default function Squad() {
  const [squad, setSquad] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [headerRef, headerInView] = useInView();
  const [gridRef, gridInView] = useInView();
  const [staffRef, staffInView] = useInView();

  // Load from Supabase on mount
  useEffect(() => {
    fetchMembers()
      .then((raw) => {
        const { squad, staff } = transformMembers(raw);
        setSquad(squad);
        setStaff(staff);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Settings from localStorage (team name, accent color)
  const settings = JSON.parse(localStorage.getItem('ta_settings') || '{}');
  const accent = settings.accent || "#2f81f7";
  const teamName = settings.teamName || "The Team";

  const filtered = activeFilter === "All" ? squad : squad.filter((p) => p.position === activeFilter);

  const openModal = useCallback((item, type) => { setSelectedItem(item); setSelectedType(type); }, []);
  const closeModal = useCallback(() => { setSelectedItem(null); setSelectedType(null); }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap');
        .squad-section * { box-sizing: border-box; }
        .squad-section button { font-family: 'DM Sans', sans-serif; }
        .filter-btn { transition: background 0.18s, color 0.18s, border-color 0.18s; }
        .filter-btn:hover:not(.active) { background: rgba(255,255,255,0.09) !important; color: rgba(255,255,255,0.85) !important; }
        @media (max-width: 560px) {
          .squad-grid { grid-template-columns: repeat(auto-fill, minmax(130px,1fr)) !important; gap: 10px !important; }
          .staff-grid { grid-template-columns: 1fr !important; }
          .squad-section { padding: 4rem 1.25rem !important; }
          .squad-header-wrap { flex-direction: column !important; align-items: flex-start !important; }
        }
      `}</style>

      <section
        className="squad-section"
        id="squad"
        aria-label={`${teamName} squad`}
        style={{ background:"#0A0A0A", padding:"6rem 1.5rem", fontFamily:"'DM Sans',sans-serif" }}
      >
        <div style={{ maxWidth:900, margin:"0 auto" }}>

          {/* Header */}
          <div
            ref={headerRef}
            className="squad-header-wrap"
            style={{
              display:"flex",alignItems:"flex-end",justifyContent:"space-between",
              flexWrap:"wrap",gap:"1.5rem",marginBottom:"2rem",
              opacity: headerInView ? 1 : 0,
              transform: headerInView ? "translateY(0)" : "translateY(20px)",
              transition:"opacity 0.6s ease, transform 0.6s ease",
            }}
          >
            <div>
              <p style={{ fontSize:11,fontWeight:500,textTransform:"uppercase",letterSpacing:"2.5px",color:accent,marginBottom:"0.4rem" }}>
                The Team
              </p>
              <h2 style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(32px,6vw,50px)",letterSpacing:"2px",color:"#fff",lineHeight:1,marginBottom:"0.4rem" }}>
                {teamName === "The Team" ? "Meet the Squad" : teamName}
              </h2>
              <p style={{ fontSize:13,color:"rgba(255,255,255,0.3)",fontWeight:300 }}>
                <span style={{ color:accent,fontWeight:500 }}>{filtered.length}</span>{" "}
                player{filtered.length !== 1 ? "s" : ""}{activeFilter !== "All" ? ` · ${activeFilter}` : " in the squad"}
              </p>
            </div>
            <div style={{ display:"flex",gap:8,flexWrap:"wrap" }} role="group" aria-label="Filter by position">
              {POSITIONS.map((pos) => (
                <button
                  key={pos}
                  className={`filter-btn${activeFilter === pos ? " active" : ""}`}
                  onClick={() => setActiveFilter(pos)}
                  aria-pressed={activeFilter === pos}
                  style={{
                    background: activeFilter === pos ? "#CC0000" : "rgba(255,255,255,0.06)",
                    border: `0.5px solid ${activeFilter === pos ? "#CC0000" : "rgba(255,255,255,0.12)"}`,
                    color: activeFilter === pos ? "#fff" : "rgba(255,255,255,0.5)",
                    padding:"6px 16px",borderRadius:20,
                    fontSize:12,fontWeight:400,cursor:"pointer",letterSpacing:"0.3px",
                  }}
                >
                  {pos}
                </button>
              ))}
            </div>
          </div>

          <div style={{
            width:36,height:2,background:accent,borderRadius:2,marginBottom:"2.2rem",
            opacity: headerInView ? 1 : 0,
            transition:"opacity 0.4s 0.2s ease",
          }} />

          {/* Loading / Error */}
          {loading && (
            <div style={{ textAlign:"center",padding:"48px",color:"rgba(255,255,255,0.3)",fontSize:13 }}>
              Loading squad…
            </div>
          )}
          {error && (
            <div style={{ textAlign:"center",padding:"48px",color:"#f85149",fontSize:13 }}>
              Failed to load squad: {error}
            </div>
          )}

          {/* Players grid */}
          {!loading && !error && (
            <div
              ref={gridRef}
              className="squad-grid"
              style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(148px,1fr))",gap:14 }}
              role="list"
            >
              {filtered.length === 0
                ? <EmptyState label="players" />
                : filtered.map((player, i) => (
                  <PlayerCard
                    key={player.id}
                    player={player}
                    index={i}
                    visible={gridInView}
                    onClick={() => openModal(player, "player")}
                  />
                ))
              }
            </div>
          )}

          {/* Legend */}
          {!loading && squad.length > 0 && (
            <div style={{
              display:"flex",flexWrap:"wrap",gap:"1rem",
              marginTop:"2rem",paddingTop:"1.75rem",
              borderTop:"0.5px solid rgba(255,255,255,0.07)",
            }}>
              {Object.entries(POSITION_COLORS).map(([pos, c]) => (
                <div key={pos} style={{ display:"flex",alignItems:"center",gap:6,fontSize:12,color:"rgba(255,255,255,0.35)" }}>
                  <span style={{ width:7,height:7,borderRadius:"50%",background:c.dot,flexShrink:0 }} />
                  {pos}
                </div>
              ))}
            </div>
          )}

          {/* Staff */}
          {!loading && (
            <>
              <div
                ref={staffRef}
                style={{
                  marginTop:"3.5rem",marginBottom:"1.5rem",
                  opacity: staffInView ? 1 : 0,
                  transform: staffInView ? "translateY(0)" : "translateY(16px)",
                  transition:"opacity 0.6s ease, transform 0.6s ease",
                }}
              >
                <p style={{ fontSize:11,fontWeight:500,textTransform:"uppercase",letterSpacing:"2.5px",color:"#CC0000",marginBottom:"0.4rem" }}>Coaching Staff</p>
                <h3 style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(24px,4vw,34px)",letterSpacing:"2px",color:"#fff",lineHeight:1 }}>
                  The Dugout
                </h3>
                <div style={{ width:36,height:2,background:"#CC0000",borderRadius:2,marginTop:"0.6rem" }} />
              </div>

              <div
                className="staff-grid"
                style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:14 }}
                role="list"
              >
                {staff.length === 0
                  ? <EmptyState label="coaching staff" />
                  : staff.map((member, i) => (
                    <StaffCard
                      key={member.id}
                      member={member}
                      index={i}
                      visible={staffInView}
                      onClick={() => openModal(member, "staff")}
                    />
                  ))
                }
              </div>
            </>
          )}

        </div>
      </section>

      {/* Modal */}
      {selectedItem && (
        <ProfileModal
          item={selectedItem}
          type={selectedType}
          onClose={closeModal}
          accentColor={
            selectedType === "staff"
              ? STAFF_ACCENTS[selectedItem.accentIndex]?.color
              : undefined
          }
        />
      )}
    </>
  );
}