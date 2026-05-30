import { useEffect, useRef, useState } from "react";

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

const CONTACT_DETAILS = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
        <circle cx="12" cy="9" r="2.5"/>
      </svg>
    ),
    label: "Location",
    value: "Sotik, Bomet County",
    sub: "Kenya",
    href: "https://maps.google.com/?q=Sotik,Bomet,Kenya",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.01 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.16 6.16l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
      </svg>
    ),
    label: "WhatsApp",
    value: "+254 700 000 000",
    sub: "Message us anytime",
    href: "https://wa.me/254700000000",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
    label: "Email",
    value: "info@miamisharksfc.co.ke",
    sub: "We'll reply within 24 hours",
    href: "mailto:info@miamisharksfc.co.ke",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
    label: "Training Days",
    value: "Tue, Thu & Sat",
    sub: "Sotik Stadium · 6:00 AM",
    href: null,
  },
];

const INITIAL_FORM = { name: "", email: "", phone: "", message: "" };

export default function Contact() {
  const [headerRef, headerInView] = useInView(0.1);
  const [cardsRef, cardsInView] = useInView(0.1);
  const [formRef, formInView] = useInView(0.1);

  const [form, setForm] = useState(INITIAL_FORM);
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.message) return;
    setStatus("sending");
    // Simulate send — wire up to a real backend (EmailJS, Formspree, etc.)
    setTimeout(() => setStatus("sent"), 1400);
  };

  const handleReset = () => {
    setForm(INITIAL_FORM);
    setStatus("idle");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap');

        .contact-section {
          background: #f8f9fb;
          padding: 6rem 1.5rem;
          font-family: 'DM Sans', sans-serif;
        }
        .contact-inner {
          max-width: 900px;
          margin: 0 auto;
        }

        /* Header */
        .contact-header {
          max-width: 520px;
          margin-bottom: 3rem;
          opacity: 0;
          transform: translateY(22px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .contact-header.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .contact-tag {
          font-size: 11px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 2.5px;
          color: #CC0000;
          margin-bottom: 0.5rem;
        }
        .contact-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(34px, 6vw, 50px);
          letter-spacing: 2px;
          color: #0A0A0A;
          line-height: 1.05;
          margin-bottom: 0.85rem;
        }
        .contact-divider {
          width: 36px;
          height: 3px;
          background: #CC0000;
          border-radius: 2px;
          margin-bottom: 1rem;
        }
        .contact-lead {
          font-size: 15px;
          color: #64748b;
          line-height: 1.75;
          font-weight: 300;
        }

        /* Cards grid */
        .contact-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
          gap: 14px;
          margin-bottom: 2.5rem;
        }
        .contact-card {
          background: #ffffff;
          border: 0.5px solid #e2e8f0;
          border-radius: 14px;
          padding: 1.4rem 1.25rem;
          text-decoration: none;
          display: block;
          opacity: 0;
          transform: translateY(18px);
          transition: opacity 0.5s ease, transform 0.5s ease,
                      border-color 0.2s, box-shadow 0.2s;
        }
        .contact-card.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .contact-card:nth-child(1) { transition-delay: 0s; }
        .contact-card:nth-child(2) { transition-delay: 0.09s; }
        .contact-card:nth-child(3) { transition-delay: 0.18s; }
        .contact-card:nth-child(4) { transition-delay: 0.27s; }
        .contact-card:hover {
          border-color: #6699FF;
          box-shadow: 0 4px 18px rgba(29,158,117,0.09);
        }
        .contact-card-icon {
          width: 38px;
          height: 38px;
          background: #E8F0FF;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #CC0000;
          margin-bottom: 12px;
        }
        .contact-card-label {
          font-size: 11px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: #94a3b8;
          margin-bottom: 4px;
        }
        .contact-card-value {
          font-size: 14px;
          font-weight: 500;
          color: #0A0A0A;
          margin-bottom: 2px;
          line-height: 1.4;
        }
        .contact-card-sub {
          font-size: 12px;
          color: #94a3b8;
          font-weight: 300;
        }

        /* Form */
        .contact-form-wrap {
          background: #ffffff;
          border: 0.5px solid #e2e8f0;
          border-radius: 16px;
          padding: 2rem;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .contact-form-wrap.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .form-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 24px;
          letter-spacing: 1.5px;
          color: #0A0A0A;
          margin-bottom: 0.3rem;
        }
        .form-subtitle {
          font-size: 13.5px;
          color: #94a3b8;
          font-weight: 300;
          margin-bottom: 1.75rem;
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 12px;
        }
        .form-field {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        .form-field.full { grid-column: 1 / -1; }
        .form-label {
          font-size: 12px;
          font-weight: 500;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.8px;
        }
        .form-input,
        .form-textarea {
          background: #f8f9fb;
          border: 0.5px solid #e2e8f0;
          border-radius: 8px;
          padding: 11px 14px;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          color: #1e293b;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
          width: 100%;
          box-sizing: border-box;
        }
        .form-input:focus,
        .form-textarea:focus {
          border-color: #CC0000;
          background: #ffffff;
        }
        .form-textarea {
          resize: vertical;
          min-height: 110px;
          line-height: 1.6;
        }
        .form-submit {
          width: 100%;
          background: #0A0A0A;
          color: #ffffff;
          border: none;
          border-radius: 8px;
          padding: 13px;
          font-size: 14.5px;
          font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          margin-top: 4px;
          letter-spacing: 0.3px;
          transition: background 0.2s, transform 0.1s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .form-submit:hover:not(:disabled) { background: #990000; }
        .form-submit:active:not(:disabled) { transform: scale(0.98); }
        .form-submit:disabled { opacity: 0.6; cursor: not-allowed; }

        /* Spinner */
        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Success state */
        .form-success {
          text-align: center;
          padding: 2.5rem 1rem;
        }
        .success-icon {
          width: 52px;
          height: 52px;
          background: #E8F0FF;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
        }
        .success-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 26px;
          letter-spacing: 1.5px;
          color: #0A0A0A;
          margin-bottom: 0.5rem;
        }
        .success-body {
          font-size: 14px;
          color: #64748b;
          font-weight: 300;
          margin-bottom: 1.5rem;
          line-height: 1.6;
        }
        .btn-reset {
          background: none;
          border: 0.5px solid #e2e8f0;
          border-radius: 7px;
          padding: 9px 22px;
          font-size: 13px;
          color: #64748b;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: border-color 0.2s, color 0.2s;
        }
        .btn-reset:hover { border-color: #CC0000; color: #CC0000; }

        /* Footer strip */
        .contact-footer-strip {
          margin-top: 2.5rem;
          padding-top: 2rem;
          border-top: 0.5px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .footer-club {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .footer-crest {
          width: 32px;
          height: 32px;
        }
        .footer-name {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 16px;
          letter-spacing: 1px;
          color: #0A0A0A;
        }
        .footer-tagline {
          font-size: 12px;
          color: #94a3b8;
          font-weight: 300;
        }
        .footer-copy {
          font-size: 12px;
          color: #cbd5e1;
        }

        @media (max-width: 560px) {
          .contact-section { padding: 4rem 1.25rem; }
          .form-row { grid-template-columns: 1fr; }
          .contact-form-wrap { padding: 1.5rem 1.25rem; }
        }
      `}</style>

      <section className="contact-section" id="contact" aria-label="Contact Miami Sharks FC">
        <div className="contact-inner">

          {/* Header */}
          <div ref={headerRef} className={`contact-header${headerInView ? " visible" : ""}`}>
            <p className="contact-tag">Find Us</p>
            <h2 className="contact-title">Contact &amp; Location</h2>
            <div className="contact-divider" />
            <p className="contact-lead">
              Want to join the squad, sponsor the club, or just say hello?
              We'd love to hear from you. Find us in Sotik or drop us a message below.
            </p>
          </div>

          {/* Info cards */}
          <div ref={cardsRef} className="contact-cards" role="list">
            {CONTACT_DETAILS.map((item) => {
              const Tag = item.href ? "a" : "div";
              return (
                <Tag
                  key={item.label}
                  className={`contact-card${cardsInView ? " visible" : ""}`}
                  href={item.href || undefined}
                  target={item.href?.startsWith("http") ? "_blank" : undefined}
                  rel={item.href?.startsWith("http") ? "noopener noreferrer" : undefined}
                  role="listitem"
                >
                  <div className="contact-card-icon">{item.icon}</div>
                  <div className="contact-card-label">{item.label}</div>
                  <div className="contact-card-value">{item.value}</div>
                  <div className="contact-card-sub">{item.sub}</div>
                </Tag>
              );
            })}
          </div>

          {/* Form */}
          <div ref={formRef} className={`contact-form-wrap${formInView ? " visible" : ""}`}>
            {status === "sent" ? (
              <div className="form-success">
                <div className="success-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#CC0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <div className="success-title">Message Sent!</div>
                <p className="success-body">
                  Thanks for reaching out. We'll get back to you within 24 hours.
                  See you on the pitch!
                </p>
                <button className="btn-reset" onClick={handleReset}>Send another message</button>
              </div>
            ) : (
              <>
                <div className="form-title">Send a Message</div>
                <p className="form-subtitle">We read every message — join the club, ask about fixtures, or just say hello.</p>
                <form onSubmit={handleSubmit} noValidate>
                  <div className="form-row">
                    <div className="form-field">
                      <label className="form-label" htmlFor="name">Your Name *</label>
                      <input
                        className="form-input"
                        id="name"
                        name="name"
                        type="text"
                        placeholder="e.g. Brian Kiprotich"
                        value={form.name}
                        onChange={handleChange}
                        required
                        autoComplete="name"
                      />
                    </div>
                    <div className="form-field">
                      <label className="form-label" htmlFor="email">Email</label>
                      <input
                        className="form-input"
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={handleChange}
                        autoComplete="email"
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-field full">
                      <label className="form-label" htmlFor="phone">Phone / WhatsApp</label>
                      <input
                        className="form-input"
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+254 7XX XXX XXX"
                        value={form.phone}
                        onChange={handleChange}
                        autoComplete="tel"
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-field full">
                      <label className="form-label" htmlFor="message">Message *</label>
                      <textarea
                        className="form-textarea"
                        id="message"
                        name="message"
                        placeholder="Tell us why you're reaching out — join the squad, sponsorship, fixtures..."
                        value={form.message}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <button
                    className="form-submit"
                    type="submit"
                    disabled={status === "sending" || !form.name || !form.message}
                  >
                    {status === "sending" ? (
                      <><span className="spinner" />Sending...</>
                    ) : (
                      "Send Message"
                    )}
                  </button>
                </form>
              </>
            )}
          </div>

          {/* Footer strip */}
          <div className="contact-footer-strip">
            <div className="footer-club">
              <svg className="footer-crest" viewBox="0 0 36 36" fill="none" aria-hidden="true">
                <path d="M18 2L31 8L31 21C31 28.5 18 34 18 34C18 34 5 28.5 5 21L5 8Z" fill="#CC0000" stroke="#0047FF" strokeWidth="0.8"/>
                <path d="M18 8L26 12L26 20C26 24 18 27.5 18 27.5C18 27.5 10 24 10 20L10 12Z" fill="#0A0A0A"/>
                <text x="18" y="22" textAnchor="middle" fontFamily="'Bebas Neue', serif" fontSize="9" fill="#0047FF" letterSpacing="0.5">MSC</text>
              </svg>
              <div>
                <div className="footer-name">Miami Sharks FC</div>
                <div className="footer-tagline">Sotik · Bomet County · Kenya</div>
              </div>
            </div>
            <div className="footer-copy">© {new Date().getFullYear()} Miami Sharks FC. All rights reserved.</div>
          </div>

        </div>
      </section>
    </>
  );
}