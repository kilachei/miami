import { useState, useEffect } from "react";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Squad", href: "#squad" },
  { label: "Contact", href: "#contact" },
];

const Crest = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
    <path d="M18 2L31 8L31 21C31 28.5 18 34 18 34C18 34 5 28.5 5 21L5 8Z" fill="#CC0000" stroke="#0047FF" strokeWidth="0.8" />
    <path d="M18 8L26 12L26 20C26 24 18 27.5 18 27.5C18 27.5 10 24 10 20L10 12Z" fill="#0A0A0A" />
    <text x="18" y="22" textAnchor="middle" fontFamily="'Bebas Neue', serif" fontSize="9" fill="#0047FF" letterSpacing="0.5">MSC</text>
  </svg>
);

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("#home");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (href) => {
    setActiveLink(href);
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap');

        .sharks-nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          background: #0A0A0A;
          transition: box-shadow 0.3s ease;
          font-family: 'DM Sans', sans-serif;
        }
        .sharks-nav.scrolled {
          box-shadow: 0 1px 24px rgba(0,0,0,0.35);
        }
        .nav-inner {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 1.5rem;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .nav-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          cursor: pointer;
        }
        .nav-brand-text {
          display: flex;
          flex-direction: column;
          line-height: 1.1;
        }
        .nav-brand-name {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 19px;
          letter-spacing: 1.5px;
          color: #ffffff;
        }
        .nav-brand-sub {
          font-size: 10px;
          color: rgba(255,255,255,0.4);
          letter-spacing: 1px;
          text-transform: uppercase;
          font-weight: 400;
        }
        .nav-links-desktop {
          display: flex;
          align-items: center;
          gap: 2rem;
        }
        .nav-link {
          background: none;
          border: none;
          color: rgba(255,255,255,0.6);
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          cursor: pointer;
          padding: 6px 0;
          position: relative;
          font-family: 'DM Sans', sans-serif;
          transition: color 0.2s;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 1.5px;
          background: #0047FF;
          transform: scaleX(0);
          transition: transform 0.25s ease;
          border-radius: 1px;
        }
        .nav-link:hover,
        .nav-link.active {
          color: #ffffff;
        }
        .nav-link.active::after,
        .nav-link:hover::after {
          transform: scaleX(1);
        }
        .nav-cta {
          background: #CC0000;
          color: #ffffff;
          border: none;
          padding: 8px 20px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.5px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: background 0.2s, transform 0.1s;
          margin-left: 1rem;
        }
        .nav-cta:hover { background: #990000; }
        .nav-cta:active { transform: scale(0.97); }
        .nav-hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 6px;
        }
        .hamburger-bar {
          width: 22px;
          height: 1.5px;
          background: #fff;
          border-radius: 2px;
          transition: transform 0.25s, opacity 0.2s;
        }
        .nav-hamburger.open .hamburger-bar:nth-child(1) {
          transform: translateY(6.5px) rotate(45deg);
        }
        .nav-hamburger.open .hamburger-bar:nth-child(2) {
          opacity: 0;
        }
        .nav-hamburger.open .hamburger-bar:nth-child(3) {
          transform: translateY(-6.5px) rotate(-45deg);
        }
        .nav-mobile-menu {
          background: #031f3c;
          border-top: 0.5px solid rgba(255,255,255,0.08);
          overflow: hidden;
          max-height: 0;
          transition: max-height 0.3s ease;
        }
        .nav-mobile-menu.open {
          max-height: 280px;
        }
        .nav-mobile-links {
          display: flex;
          flex-direction: column;
          padding: 0.75rem 1.5rem 1.25rem;
          gap: 0.1rem;
        }
        .nav-mobile-link {
          background: none;
          border: none;
          color: rgba(255,255,255,0.65);
          font-size: 15px;
          font-weight: 400;
          text-align: left;
          padding: 10px 0;
          border-bottom: 0.5px solid rgba(255,255,255,0.07);
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: color 0.2s;
        }
        .nav-mobile-link:last-child { border-bottom: none; }
        .nav-mobile-link:hover,
        .nav-mobile-link.active { color: #0047FF; }
        .nav-mobile-cta {
          background: #CC0000;
          color: #fff;
          border: none;
          border-radius: 6px;
          padding: 10px 20px;
          margin-top: 0.75rem;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          width: 100%;
        }

        @media (max-width: 680px) {
          .nav-links-desktop { display: none; }
          .nav-hamburger { display: flex; }
        }
      `}</style>

      <nav className={`sharks-nav${scrolled ? " scrolled" : ""}`} role="navigation" aria-label="Main navigation">
        <div className="nav-inner">
          {/* Brand */}
          <div className="nav-brand" onClick={() => handleNavClick("#home")} role="button" tabIndex={0}>
            <Crest />
            <div className="nav-brand-text">
              <span className="nav-brand-name">Miami Sharks FC</span>
              <span className="nav-brand-sub">Sotik · Bomet County</span>
            </div>
          </div>

          {/* Desktop links */}
          <div className="nav-links-desktop" role="list">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                className={`nav-link${activeLink === link.href ? " active" : ""}`}
                onClick={() => handleNavClick(link.href)}
                role="listitem"
              >
                {link.label}
              </button>
            ))}
            <button className="nav-cta" onClick={() => handleNavClick("#contact")}>
              Join the Club
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className={`nav-hamburger${menuOpen ? " open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            <span className="hamburger-bar" />
            <span className="hamburger-bar" />
            <span className="hamburger-bar" />
          </button>
        </div>

        {/* Mobile menu */}
        <div className={`nav-mobile-menu${menuOpen ? " open" : ""}`} aria-hidden={!menuOpen}>
          <div className="nav-mobile-links">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                className={`nav-mobile-link${activeLink === link.href ? " active" : ""}`}
                onClick={() => handleNavClick(link.href)}
              >
                {link.label}
              </button>
            ))}
            <button className="nav-mobile-cta" onClick={() => handleNavClick("#contact")}>
              Join the Club
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}