import { useEffect, useRef, useState } from "react";

const PHOTOS = [
  { id: 1, src: "/gallery/team-1.jpg", caption: "Official Squad Photo" },
  { id: 2, src: "/gallery/team-2.jpg", caption: "Official Squad Photo" },
  { id: 3, src: "/gallery/team-3.jpg", caption: "Official Squad Photo" },
  { id: 4, src: "/gallery/team-4.jpg", caption: "Official Squad Photo" },
  { id: 5, src: "/gallery/team-5.jpg", caption: "Official Squad Photo" },
  { id: 6, src: "/gallery/team-6.jpg", caption: "Official Squad Photo" },
  { id: 7, src: "/gallery/team-7.jpg", caption: "Official Squad Photo" },
];

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

function PhotoCard({ photo, index, visible, onClick }) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  return (
    <div
      className="photo-card"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(28px) scale(0.97)",
        transitionDelay: `${(index % 4) * 0.09}s`,
      }}
      onClick={() => onClick(photo)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick(photo)}
      aria-label={`View: ${photo.caption}`}
    >
      <div className="photo-frame">
        {!loaded && !errored && <div className="photo-skeleton" />}
        {errored ? (
          <div className="photo-placeholder">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            <span>Photo not found</span>
          </div>
        ) : (
          <img
            src={photo.src}
            alt={photo.caption}
            className="photo-img"
            style={{ opacity: loaded ? 1 : 0 }}
            onLoad={() => setLoaded(true)}
            onError={() => setErrored(true)}
          />
        )}
        <div className="photo-overlay">
          <div className="photo-overlay-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              <line x1="11" y1="8" x2="11" y2="14"/>
              <line x1="8" y1="11" x2="14" y2="11"/>
            </svg>
          </div>
        </div>
      </div>
      <div className="photo-caption-bar">
        <span className="photo-tag">Official</span>
        <span className="photo-num">#{photo.id}</span>
      </div>
    </div>
  );
}

function Lightbox({ photo, onClose, onPrev, onNext, hasPrev, hasNext }) {
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && hasPrev) onPrev();
      if (e.key === "ArrowRight" && hasNext) onNext();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, onPrev, onNext, hasPrev, hasNext]);

  return (
    <div className="lightbox-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="lightbox-box" onClick={(e) => e.stopPropagation()}>
        <button className="lightbox-close" onClick={onClose} aria-label="Close">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
        {hasPrev && (
          <button className="lightbox-nav lightbox-prev" onClick={onPrev} aria-label="Previous">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
        )}
        <img src={photo.src} alt={photo.caption} className="lightbox-img" />
        {hasNext && (
          <button className="lightbox-nav lightbox-next" onClick={onNext} aria-label="Next">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        )}
        <div className="lightbox-footer">
          <span className="lightbox-tag">Official Squad Photo</span>
          <span className="lightbox-counter">{photo.id} / {PHOTOS.length}</span>
        </div>
      </div>
    </div>
  );
}

export default function Gallery() {
  const [lightboxPhoto, setLightboxPhoto] = useState(null);
  const [headerRef, headerInView] = useInView(0.1);
  const [gridRef, gridInView] = useInView(0.05);

  const lightboxIndex = lightboxPhoto ? PHOTOS.findIndex((p) => p.id === lightboxPhoto.id) : -1;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap');

        .gallery-section {
          background: #0f0f0f;
          padding: 6rem 1.5rem;
          font-family: 'DM Sans', sans-serif;
        }
        .gallery-inner { max-width: 900px; margin: 0 auto; }

        .gallery-header {
          margin-bottom: 2.5rem;
          opacity: 0; transform: translateY(20px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .gallery-header.visible { opacity: 1; transform: translateY(0); }
        .gallery-tag {
          font-size: 11px; font-weight: 500;
          text-transform: uppercase; letter-spacing: 2.5px;
          color: #CC0000; margin-bottom: 0.5rem;
        }
        .gallery-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(32px, 6vw, 50px);
          letter-spacing: 2px; color: #ffffff;
          line-height: 1; margin-bottom: 0.75rem;
        }
        .gallery-divider {
          width: 36px; height: 2px;
          background: #CC0000; border-radius: 2px;
        }

        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 14px;
        }

        .photo-card {
          border-radius: 12px; overflow: hidden;
          background: rgba(255,255,255,0.04);
          border: 0.5px solid rgba(255,255,255,0.08);
          cursor: pointer;
          transition: opacity 0.55s ease, transform 0.55s ease,
                      border-color 0.2s, box-shadow 0.2s;
        }
        .photo-card:hover {
          border-color: rgba(204,0,0,0.45);
          box-shadow: 0 8px 28px rgba(204,0,0,0.13);
        }
        .photo-card:hover .photo-overlay { opacity: 1; }
        .photo-card:hover .photo-img { transform: scale(1.04); }

        .photo-frame {
          position: relative; width: 100%; padding-top: 66%;
          overflow: hidden; background: #1a1a1a;
        }
        .photo-img {
          position: absolute; inset: 0;
          width: 100%; height: 100%; object-fit: cover;
          transition: transform 0.4s ease, opacity 0.3s ease;
        }
        .photo-skeleton {
          position: absolute; inset: 0;
          background: linear-gradient(90deg, #1a1a1a 25%, #242424 50%, #1a1a1a 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
        }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

        .photo-placeholder {
          position: absolute; inset: 0;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 8px; color: rgba(255,255,255,0.2);
          font-size: 12px; font-weight: 300;
        }
        .photo-overlay {
          position: absolute; inset: 0;
          background: rgba(204,0,0,0.5);
          display: flex; align-items: center; justify-content: center;
          opacity: 0; transition: opacity 0.25s ease;
        }
        .photo-overlay-icon {
          width: 44px; height: 44px; border-radius: 50%;
          background: rgba(255,255,255,0.15);
          border: 1.5px solid rgba(255,255,255,0.4);
          display: flex; align-items: center; justify-content: center;
        }
        .photo-caption-bar {
          display: flex; align-items: center;
          justify-content: space-between;
          padding: 10px 14px;
        }
        .photo-tag {
          font-size: 10px; font-weight: 600;
          text-transform: uppercase; letter-spacing: 1.2px;
          color: #CC0000;
        }
        .photo-num {
          font-size: 11px; color: rgba(255,255,255,0.2);
          font-weight: 300;
        }

        .lightbox-backdrop {
          position: fixed; inset: 0; z-index: 1000;
          background: rgba(0,0,0,0.93);
          display: flex; align-items: center; justify-content: center;
          padding: 1.5rem;
          animation: fadeIn 0.2s ease;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .lightbox-box {
          position: relative; max-width: 880px; width: 100%;
          background: #111;
          border: 0.5px solid rgba(255,255,255,0.1);
          border-radius: 16px; overflow: hidden;
          animation: scaleIn 0.22s ease;
        }
        @keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .lightbox-img {
          width: 100%; max-height: 72vh;
          object-fit: contain; display: block; background: #0a0a0a;
        }
        .lightbox-close {
          position: absolute; top: 12px; right: 12px; z-index: 10;
          width: 32px; height: 32px; border-radius: 50%;
          background: rgba(0,0,0,0.6);
          border: 0.5px solid rgba(255,255,255,0.15);
          color: rgba(255,255,255,0.7);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: background 0.2s;
        }
        .lightbox-close:hover { background: #CC0000; color: #fff; }
        .lightbox-nav {
          position: absolute; top: 50%; transform: translateY(-50%);
          width: 38px; height: 38px; border-radius: 50%;
          background: rgba(0,0,0,0.55);
          border: 0.5px solid rgba(255,255,255,0.15);
          color: rgba(255,255,255,0.7);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; z-index: 10;
          transition: background 0.2s;
        }
        .lightbox-nav:hover { background: #CC0000; color: #fff; }
        .lightbox-prev { left: 12px; }
        .lightbox-next { right: 12px; }
        .lightbox-footer {
          display: flex; align-items: center;
          justify-content: space-between;
          padding: 12px 18px;
          border-top: 0.5px solid rgba(255,255,255,0.08);
        }
        .lightbox-tag {
          font-size: 11px; font-weight: 600;
          text-transform: uppercase; letter-spacing: 1.2px;
          color: #CC0000;
        }
        .lightbox-counter {
          font-size: 12px; color: rgba(255,255,255,0.3);
          font-weight: 300;
        }

        @media (max-width: 560px) {
          .gallery-section { padding: 4rem 1.25rem; }
          .gallery-grid { grid-template-columns: 1fr 1fr; gap: 10px; }
        }
      `}</style>

      <section className="gallery-section" id="gallery" aria-label="Miami Sharks FC photo gallery">
        <div className="gallery-inner">

          <div ref={headerRef} className={`gallery-header${headerInView ? " visible" : ""}`}>
            <p className="gallery-tag">Club Media</p>
            <h2 className="gallery-title">Squad Photos</h2>
            <div className="gallery-divider" />
          </div>

          <div ref={gridRef} className="gallery-grid" role="list">
            {PHOTOS.map((photo, i) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                index={i}
                visible={gridInView}
                onClick={setLightboxPhoto}
              />
            ))}
          </div>

        </div>
      </section>

      {lightboxPhoto && (
        <Lightbox
          photo={lightboxPhoto}
          onClose={() => setLightboxPhoto(null)}
          onPrev={() => setLightboxPhoto(PHOTOS[lightboxIndex - 1])}
          onNext={() => setLightboxPhoto(PHOTOS[lightboxIndex + 1])}
          hasPrev={lightboxIndex > 0}
          hasNext={lightboxIndex < PHOTOS.length - 1}
        />
      )}
    </>
  );
}