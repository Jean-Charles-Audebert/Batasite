import React, { useEffect } from 'react';
import '../../index.css'; // Charger les styles publics depuis /front/index.css

/**
 * ContentPreviewStyled - Aperçu complet avec styles depuis index.css
 * Applique tous les styles de la page publique directement
 */
export default function ContentPreviewStyled({ content = {} }) {
  const { page = {}, hero = {}, sections = [], footer = {} } = content;

  useEffect(() => {
    // Charger Font Awesome si pas déjà chargé
    if (!window.fontAwesomeLoaded) {
      const script = document.createElement('script');
      script.src = 'https://kit.fontawesome.com/92832a1930.js';
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
      window.fontAwesomeLoaded = true;
    }
  }, []);

  // Helper pour extraire du texte
  function getText(value) {
    if (!value && value !== "") return null;
    if (typeof value === "string") return value || null;
    if (typeof value === "object") {
      if (value.visible === false) return null;
      return value.text ?? null;
    }
    return null;
  }

  return (
    <div style={{
      fontFamily: page.fontFamily || 'Lithos, sans-serif',
      fontWeight: page.fontWeight || 900,
      background: page.background?.value || '#ffffff'
    }}>
      {/* Debug: Show if content is empty */}
      {(!sections || sections.length === 0) && !hero.video && (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>
          <p>Aucun contenu à afficher</p>
          <pre style={{ fontSize: '0.8rem', textAlign: 'left', background: '#f5f5f5', padding: '1rem', overflow: 'auto' }}>
            {JSON.stringify(content, null, 2).substring(0, 500)}
          </pre>
        </div>
      )}
      {/* HERO */}
      {hero && (
        <section id="hero" className="hero" role="banner" aria-label="section d'accueil">
          {/* Video */}
          {hero.video?.src && hero.video?.visible !== false && (
            <video
              className="hero-video"
              autoPlay
              muted
              loop
              aria-hidden="true"
              playsInline
            >
              <source src={hero.video.src} type="video/mp4" />
            </video>
          )}

          <div className="hero-content">
            {/* Nav links */}
            {hero.navLinks?.items && hero.navLinks?.visible !== false && (
              <nav className="hero-nav" aria-label="Liens rapides">
                {hero.navLinks.items.map((item, i) => {
                  if (!item || item.visible === false) return null;
                  const text = getText(item.text ?? item.label);
                  if (!text) return null;
                  return (
                    <a key={item.id ?? i} className="nav_link" href={item.href ?? '#'}>
                      {text}
                    </a>
                  );
                })}
              </nav>
            )}

            {/* Social links */}
            {hero.socialLinks?.items && hero.socialLinks?.visible !== false && (
              <nav className="hero-social" aria-label="Réseaux sociaux">
                {hero.socialLinks.items.map((social, i) => {
                  if (!social || social.visible === false) return null;
                  return (
                    <a
                      key={social.id ?? i}
                      className="social_link"
                      href={social.href ?? '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                    >
                      {social.icon && <i className={social.icon} aria-hidden="true" />}
                      {!social.icon && social.label}
                    </a>
                  );
                })}
              </nav>
            )}
          </div>
        </section>
      )}

      {/* SECTIONS */}
      {sections.map((section, idx) => {
        if (!section || section.visible === false) return null;

        const titleText = getText(section.title);

        switch (section.type) {
          case 'presentation':
            return (
              <section
                key={section.id ?? idx}
                id={section.id}
                className="presentation"
                role="region"
                aria-label={section.title || 'presentation'}
              >
                <div className="presentation-img">
                  {section.image?.src && (
                    <img src={section.image.src} alt={section.image.alt || ''} />
                  )}
                </div>
                <div className="presentation-text">
                  {titleText && <h2>{titleText}</h2>}
                  {Array.isArray(section.text) &&
                    section.text.map((p, i) => {
                      const txt = getText(p);
                      return txt ? <p key={i}>{txt}</p> : null;
                    })}
                  {typeof section.content === 'string' && section.content && (
                    <p>{section.content}</p>
                  )}
                </div>
              </section>
            );

          case 'separator':
            return (
              <section
                key={section.id ?? idx}
                className="separator"
                role="presentation"
                aria-hidden="true"
              >
                {section.media?.type === 'image' && section.media?.src && (
                  <img src={section.media.src} alt={section.media.alt || ''} />
                )}
                {section.media?.type === 'video' && section.media?.src && (
                  <video autoPlay muted loop>
                    <source src={section.media.src} type="video/mp4" />
                  </video>
                )}
              </section>
            );

          case 'events':
            return (
              <section
                key={section.id ?? idx}
                id={section.id}
                className="agenda"
                role="region"
                aria-label={section.title || 'events'}
              >
                {titleText && <h2>{titleText}</h2>}
                <div className="cards-container">
                  {Array.isArray(section.events) &&
                    section.events.map((event, i) => {
                      if (!event || event.visible === false) return null;
                      return (
                        <div key={event.id ?? i} className="card">
                          {event.image && <img src={event.image} alt={event.title || ''} />}
                          {event.title && <h3>{event.title}</h3>}
                          {event.description && <p>{event.description}</p>}
                        </div>
                      );
                    })}
                </div>
              </section>
            );

          case 'mundo': {
            const mundoContent = typeof section.content === 'string'
              ? { text: [section.content] }
              : section.content || {};
            return (
              <section
                key={section.id ?? idx}
                id={section.id}
                className="mundo"
                role="region"
                aria-label={section.title || 'mundo'}
                style={{
                  padding: '3rem 2rem',
                  backgroundColor: section.style?.['background-color'] || 'transparent',
                  color: section.style?.color || '#000',
                  ...section.style
                }}
              >
                <div
                  className="section-container"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(12, 1fr)',
                    gap: '2rem'
                  }}
                >
                  {mundoContent.media && mundoContent.media.src && (
                    <div
                      className="media"
                      style={{
                        gridColumn: 'span 6'
                      }}
                    >
                      {mundoContent.media.type === 'video' && (
                        <video autoPlay muted loop style={{ width: '100%' }}>
                          <source src={mundoContent.media.src} type="video/mp4" />
                        </video>
                      )}
                      {mundoContent.media.type === 'image' && (
                        <img
                          src={mundoContent.media.src}
                          alt={mundoContent.media.alt || ''}
                          style={{ width: '100%', display: 'block' }}
                        />
                      )}
                    </div>
                  )}
                  <div
                    className="content"
                    style={{
                      gridColumn: 'span 6',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1.4rem'
                    }}
                  >
                    {titleText && <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{titleText}</h2>}
                    {Array.isArray(mundoContent.text) &&
                      mundoContent.text.map((t, i) => {
                        const txt = getText(t);
                        return txt ? <p key={i}>{txt}</p> : null;
                      })}
                  </div>
                </div>
              </section>
            );
          }

          case 'gallery':
            return (
              <section
                key={section.id ?? idx}
                id={section.id}
                className="gallery"
                role="region"
                aria-label={section.title || 'gallery'}
              >
                {titleText && <h2>{titleText}</h2>}
                {Array.isArray(section.images) && section.images.length > 0 && (
                  <div className="photos">
                    {section.images.map((img, i) => {
                      if (!img || img.visible === false) return null;
                      return (
                        <a
                          key={img.id ?? i}
                          href={img.link || img.src}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img src={img.src} alt={img.alt || ''} />
                        </a>
                      );
                    })}
                  </div>
                )}
                {Array.isArray(section.videos) && section.videos.length > 0 && (
                  <div className="videos">
                    {section.videos.map((v, i) => {
                      if (!v || v.visible === false) return null;
                      const iframeSrc = v.src.includes('youtube.com') || v.src.includes('youtu.be')
                        ? v.src
                        : `https://www.youtube.com/embed/${v.src}`;
                      return (
                        <iframe
                          key={v.id ?? i}
                          src={iframeSrc}
                          title={v.title || 'YouTube video'}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />
                      );
                    })}
                  </div>
                )}
              </section>
            );

          default:
            return null;
        }
      })}

      {/* FOOTER */}
      {footer && (
        <footer
          id="footer"
          role="contentinfo"
          style={{
            backgroundImage: footer.style?.['background-image']?.replace('url(', '').replace(')', '') || 'url(/public/footer.png)',
            backgroundRepeat: footer.style?.['background-repeat'] || 'no-repeat',
            backgroundSize: footer.style?.['background-size'] || 'cover',
            backgroundPosition: footer.style?.['background-position'] || 'center',
            color: footer.style?.color || '#fff',
            padding: footer.style?.padding || '4rem 2rem 2rem 2rem',
            marginTop: footer.style?.['margin-top'] || '-25rem',
            height: footer.style?.height || '400px',
            position: footer.style?.position || 'relative',
            zIndex: footer.style?.['z-index'] || 10,
            ...footer.style
          }}
        >
          <div
            className="container"
            style={{
              display: footer.position?.display || 'flex',
              justifyContent: footer.position?.['justify-content'] || 'space-around',
              alignItems: footer.position?.['align-items'] || 'center',
              gap: '1.5rem',
              flexWrap: 'wrap',
              position: 'absolute',
              bottom: '2rem',
              left: 0,
              right: 0,
              width: '100%',
              padding: '0 2rem',
              boxSizing: 'border-box'
            }}
          >
            {/* Nav Links */}
            {footer.navLinks?.items && footer.navLinks?.visible !== false && (
              <nav
                className="footer-nav"
                aria-label="Footer navigation"
                style={{
                  display: footer.navLinks.style?.display || 'flex',
                  gap: footer.navLinks.style?.gap || '1.5rem',
                  fontSize: '0.85rem',
                  ...footer.navLinks.style
                }}
              >
                {footer.navLinks.items.map((item, i) => {
                  if (!item || item.visible === false) return null;
                  const text = getText(item.text ?? item.label);
                  if (!text) return null;
                  return (
                    <a
                      key={item.id ?? i}
                      href={item.href ?? '#'}
                      className="nav_link"
                      style={{ color: '#fff', textDecoration: 'none' }}
                    >
                      {text}
                    </a>
                  );
                })}
              </nav>
            )}

            {/* Contact Button */}
            {footer.contact && footer.contact.visible !== false && (
              <button
                className="btn-contact-modal"
                aria-label={footer.contact.label}
                style={{
                  backgroundColor: footer.contact.style?.['background-color'] || '#e01c1c',
                  color: footer.contact.style?.color || '#fff',
                  padding: footer.contact.style?.padding || '0.5rem 1rem',
                  borderRadius: footer.contact.style?.['border-radius'] || '4px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: 'bold',
                  ...footer.contact.style
                }}
              >
                {getText(footer.contact.text ?? footer.contact.label)}
              </button>
            )}

            {/* Social Links */}
            {footer.socialLinks?.items && footer.socialLinks?.visible !== false && (
              <nav
                className="footer-social"
                aria-label="Footer social media"
                style={{
                  display: footer.socialLinks.style?.display || 'flex',
                  gap: footer.socialLinks.style?.gap || '1rem',
                  fontSize: footer.socialLinks.style?.['font-size'] || '1rem',
                  ...footer.socialLinks.style
                }}
              >
                {footer.socialLinks.items.map((social, i) => {
                  if (!social || social.visible === false) return null;
                  return (
                    <a
                      key={social.id ?? i}
                      href={social.href ?? '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      style={{
                        color: social.style?.color || '#fff',
                        fontSize: social.style?.['font-size'] || '1.5rem',
                        ...social.style
                      }}
                    >
                      {social.icon && <i className={social.icon} aria-hidden="true" />}
                    </a>
                  );
                })}
              </nav>
            )}
          </div>

          {/* Copyright */}
          {footer.copyright && (
            <div
              className="footer-copyright"
              style={{
                textAlign: 'center',
                fontSize: footer.copyright.style?.['font-size'] || '0.7rem',
                color: footer.copyright.style?.color || '#999',
                position: 'absolute',
                bottom: '0.3rem',
                left: 0,
                right: 0,
                ...footer.copyright.style
              }}
              dangerouslySetInnerHTML={{ __html: footer.copyright.text || '' }}
            />
          )}
        </footer>
      )}
    </div>
  );
}
