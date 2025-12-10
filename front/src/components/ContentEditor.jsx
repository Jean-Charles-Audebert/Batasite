import React, { useState } from 'react';
import styles from './ContentEditor.module.css';
import ColorPicker from './ColorPicker';
import MediaPicker from './MediaPicker';

// Force HMR update

export function ContentEditor({ content = {}, onChange, error = null }) {
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const updateContent = (path, value) => {
    const newContent = JSON.parse(JSON.stringify(content));
    const keys = path.split('.');
    let current = newContent;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) current[keys[i]] = {};
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    onChange(newContent);
  };

  const reorderArray = (path, fromIdx, toIdx) => {
    const newContent = JSON.parse(JSON.stringify(content));
    const keys = path.split('.');
    let current = newContent;
    for (let i = 0; i < keys.length; i++) {
      current = current[keys[i]];
    }
    const [moved] = current.splice(fromIdx, 1);
    current.splice(toIdx, 0, moved);
    onChange(newContent);
  };

  return (
    <div className={styles.editor}>
      {error && <div className={styles.error}>{error}</div>}

      {/* PAGE METADATA */}
      <details open={expandedSections.page}>
        <summary onClick={() => toggleSection('page')} className={styles.sectionTitle}>
          ⚙️ Paramètres de page
        </summary>
        <div className={styles.sectionContent}>
          <div className={styles.field}>
            <label>Titre de la page</label>
            <input
              type="text"
              value={content.page?.title || ''}
              onChange={(e) => updateContent('page.title', e.target.value)}
            />
          </div>

          <ColorPicker
            label="Couleur de fond"
            value={content.page?.background?.value || '#ffffff'}
            onChange={(color) => updateContent('page.background.value', color)}
          />

          <MediaPicker
            label="Image/Vidéo de fond"
            value={content.page?.background?.media || ''}
            onChange={(url) => updateContent('page.background.media', url)}
            type="both"
          />

          <MediaPicker
            label="Favicon"
            value={content.page?.favicon || ''}
            onChange={(url) => updateContent('page.favicon', url)}
            type="image"
          />

          <div className={styles.field}>
            <label>Border radius (défaut: 0)</label>
            <input
              type="text"
              placeholder="ex: 8px"
              value={content.page?.borderRadius || '0'}
              onChange={(e) => updateContent('page.borderRadius', e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label>Shadow (défaut: 0)</label>
            <input
              type="text"
              placeholder="ex: 0 4px 6px rgba(0,0,0,0.1)"
              value={content.page?.shadow || '0'}
              onChange={(e) => updateContent('page.shadow', e.target.value)}
            />
          </div>
        </div>
      </details>

      {/* HERO */}
      <details open={expandedSections.hero}>
        <summary onClick={() => toggleSection('hero')} className={styles.sectionTitle}>
          🎬 Héro
        </summary>
        <div className={styles.sectionContent}>
          <MediaPicker
            label="Image/Vidéo de fond"
            value={content.hero?.video?.src || ''}
            onChange={(url) => updateContent('hero.video.src', url)}
            type="both"
          />

          <div className={styles.subSection}>
            <h4>🎨 Logo</h4>
            <MediaPicker
              label="Fichier du logo"
              value={content.hero?.logo?.src || ''}
              onChange={(url) => updateContent('hero.logo.src', url)}
              type="image"
            />
            <div className={styles.field}>
              <input
                type="checkbox"
                id="logo-visible"
                checked={content.hero?.logo?.visible !== false}
                onChange={(e) => updateContent('hero.logo.visible', e.target.checked)}
              />
              <label htmlFor="logo-visible">Visible</label>
            </div>
            <div className={styles.field}>
              <label>Taille (px)</label>
              <input
                type="number"
                value={content.hero?.logo?.size || 100}
                onChange={(e) => updateContent('hero.logo.size', parseInt(e.target.value))}
              />
            </div>
            <div className={styles.field}>
              <label>Position (1=gauche, 6=centre, 12=droite)</label>
              <select
                value={content.hero?.logo?.position || 6}
                onChange={(e) => updateContent('hero.logo.position', parseInt(e.target.value))}
              >
                <option value={1}>Gauche</option>
                <option value={6}>Centré</option>
                <option value={12}>Droite</option>
              </select>
            </div>
          </div>

          <div className={styles.subSection}>
            <h4>📝 Titre</h4>
            <div className={styles.field}>
              <label>Texte du titre</label>
              <input
                type="text"
                value={content.hero?.title?.text || ''}
                onChange={(e) => updateContent('hero.title.text', e.target.value)}
              />
            </div>
            <div className={styles.field}>
              <input
                type="checkbox"
                id="title-visible"
                checked={content.hero?.title?.visible !== false}
                onChange={(e) => updateContent('hero.title.visible', e.target.checked)}
              />
              <label htmlFor="title-visible">Visible</label>
            </div>
            <div className={styles.field}>
              <label>Taille (px)</label>
              <input
                type="number"
                value={content.hero?.title?.size || 48}
                onChange={(e) => updateContent('hero.title.size', parseInt(e.target.value))}
              />
            </div>
            <ColorPicker
              label="Couleur du texte"
              value={content.hero?.title?.color || '#ffffff'}
              onChange={(color) => updateContent('hero.title.color', color)}
            />
            <ColorPicker
              label="Couleur de fond"
              value={content.hero?.title?.backgroundColor || 'transparent'}
              onChange={(color) => updateContent('hero.title.backgroundColor', color)}
            />
            <div className={styles.field}>
              <label>Position (1=gauche, 6=centre, 12=droite)</label>
              <select
                value={content.hero?.title?.position || 6}
                onChange={(e) => updateContent('hero.title.position', parseInt(e.target.value))}
              >
                <option value={1}>Gauche</option>
                <option value={6}>Centré</option>
                <option value={12}>Droite</option>
              </select>
            </div>
          </div>

          <div className={styles.subSection}>
            <h4>🔗 Liens de navigation</h4>
            <div className={styles.field}>
              <input
                type="checkbox"
                id="navlinks-visible"
                checked={content.hero?.navLinks?.visible !== false}
                onChange={(e) => updateContent('hero.navLinks.visible', e.target.checked)}
              />
              <label htmlFor="navlinks-visible">Visible</label>
            </div>
            <div className={styles.field}>
              <label>Position depuis le bas (px)</label>
              <input
                type="number"
                value={content.hero?.navLinks?.bottomOffset || 20}
                onChange={(e) => updateContent('hero.navLinks.bottomOffset', parseInt(e.target.value))}
              />
            </div>
            {content.hero?.navLinks?.items?.map((item, i) => (
              <div key={i} className={styles.item}>
                <strong>Lien {i + 1}</strong>
                <input
                  type="text"
                  placeholder="Texte du lien"
                  value={item.text || ''}
                  onChange={(e) => updateContent(`hero.navLinks.items.${i}.text`, e.target.value)}
                />
                <select
                  value={item.href || ''}
                  onChange={(e) => updateContent(`hero.navLinks.items.${i}.href`, e.target.value)}
                >
                  <option value="">-- Sélectionner une cible --</option>
                  <option value="#presentation">Présentation</option>
                  <option value="#events">Événements</option>
                  <option value="#mundo">Mundo</option>
                  <option value="#gallery">Galerie</option>
                </select>
              </div>
            ))}
          </div>

          <div className={styles.subSection}>
            <h4>📱 Réseaux sociaux</h4>
            <div className={styles.field}>
              <input
                type="checkbox"
                id="social-visible"
                checked={content.hero?.socialLinks?.visible !== false}
                onChange={(e) => updateContent('hero.socialLinks.visible', e.target.checked)}
              />
              <label htmlFor="social-visible">Visible</label>
            </div>
            <div className={styles.field}>
              <label>Position depuis le bas (px)</label>
              <input
                type="number"
                value={content.hero?.socialLinks?.bottomOffset || 20}
                onChange={(e) => updateContent('hero.socialLinks.bottomOffset', parseInt(e.target.value))}
              />
            </div>
          </div>
        </div>
      </details>

      {/* SECTIONS */}
      {content.sections?.map((section, sectionIdx) => {
        const sectionKey = `section-${sectionIdx}`;

        if (section.type === 'presentation') {
          return (
            <details key={sectionIdx} open={expandedSections[sectionKey]}>
              <summary onClick={() => toggleSection(sectionKey)} className={styles.sectionTitle}>
                📝 Présentation
              </summary>
              <div className={styles.sectionContent}>
                <div className={styles.subSection}>
                  <h4>🎬 Média</h4>
                  <MediaPicker
                    label="Image/Vidéo"
                    value={section.image?.src || ''}
                    onChange={(url) => updateContent(`sections.${sectionIdx}.image.src`, url)}
                    type="both"
                  />
                  <div className={styles.field}>
                    <label>Taille (px)</label>
                    <input
                      type="number"
                      value={section.imageSize || 400}
                      onChange={(e) => updateContent(`sections.${sectionIdx}.imageSize`, parseInt(e.target.value))}
                    />
                  </div>
                  <div className={styles.field}>
                    <label>Border radius</label>
                    <input
                      type="text"
                      placeholder="ex: 8px"
                      value={section.imageBorderRadius || '0'}
                      onChange={(e) => updateContent(`sections.${sectionIdx}.imageBorderRadius`, e.target.value)}
                    />
                  </div>
                  <div className={styles.field}>
                    <label>Shadow</label>
                    <input
                      type="text"
                      placeholder="ex: 0 4px 6px rgba(0,0,0,0.1)"
                      value={section.imageShadow || '0'}
                      onChange={(e) => updateContent(`sections.${sectionIdx}.imageShadow`, e.target.value)}
                    />
                  </div>
                </div>

                <div className={styles.subSection}>
                  <h4>📝 Titre</h4>
                  <input
                    type="text"
                    value={section.title || ''}
                    onChange={(e) => updateContent(`sections.${sectionIdx}.title`, e.target.value)}
                  />
                  <div className={styles.field}>
                    <label>Taille (px)</label>
                    <input
                      type="number"
                      value={section.titleSize || 32}
                      onChange={(e) => updateContent(`sections.${sectionIdx}.titleSize`, parseInt(e.target.value))}
                    />
                  </div>
                  <ColorPicker
                    label="Couleur"
                    value={section.titleColor || '#333'}
                    onChange={(color) => updateContent(`sections.${sectionIdx}.titleColor`, color)}
                  />
                  <ColorPicker
                    label="Couleur de fond"
                    value={section.titleBackgroundColor || 'transparent'}
                    onChange={(color) => updateContent(`sections.${sectionIdx}.titleBackgroundColor`, color)}
                  />
                </div>

                <div className={styles.subSection}>
                  <h4>📖 Textes</h4>
                  <div className={styles.field}>
                    <label>Taille (px)</label>
                    <input
                      type="number"
                      value={section.textSize || 16}
                      onChange={(e) => updateContent(`sections.${sectionIdx}.textSize`, parseInt(e.target.value))}
                    />
                  </div>
                  <ColorPicker
                    label="Couleur du texte"
                    value={section.textColor || '#666'}
                    onChange={(color) => updateContent(`sections.${sectionIdx}.textColor`, color)}
                  />
                  <ColorPicker
                    label="Couleur de fond"
                    value={section.textBackgroundColor || 'transparent'}
                    onChange={(color) => updateContent(`sections.${sectionIdx}.textBackgroundColor`, color)}
                  />
                  <div className={styles.field}>
                    <label>Border radius</label>
                    <input
                      type="text"
                      placeholder="ex: 0"
                      value={section.textBorderRadius || '0'}
                      onChange={(e) => updateContent(`sections.${sectionIdx}.textBorderRadius`, e.target.value)}
                    />
                  </div>
                  <div className={styles.field}>
                    <label>Shadow</label>
                    <input
                      type="text"
                      placeholder="ex: 0"
                      value={section.textShadow || '0'}
                      onChange={(e) => updateContent(`sections.${sectionIdx}.textShadow`, e.target.value)}
                    />
                  </div>
                  <div className={styles.field}>
                    <label>Tous les paragraphes (un par ligne)</label>
                    <textarea
                      value={(section.paragraphs || section.text || []).join('\n')}
                      onChange={(e) => {
                        const paragraphs = e.target.value.split('\n').filter(p => p.trim());
                        updateContent(`sections.${sectionIdx}.${section.paragraphs ? 'paragraphs' : 'text'}`, paragraphs);
                      }}
                      style={{ minHeight: '150px' }}
                    />
                  </div>
                </div>
              </div>
            </details>
          );
        }

        if (section.type === 'separator') {
          return (
            <details key={sectionIdx} open={expandedSections[sectionKey]}>
              <summary onClick={() => toggleSection(sectionKey)} className={styles.sectionTitle}>
                ➖ Séparateur {sectionIdx}
              </summary>
              <div className={styles.sectionContent}>
                <MediaPicker
                  label="Image/Vidéo"
                  value={section.media?.src || ''}
                  onChange={(url) => updateContent(`sections.${sectionIdx}.media.src`, url)}
                  type="both"
                />
                <div className={styles.field}>
                  <label>Décalage vertical (px, négatif pour chevaucher)</label>
                  <input
                    type="number"
                    value={section.verticalOffset || -50}
                    onChange={(e) => updateContent(`sections.${sectionIdx}.verticalOffset`, parseInt(e.target.value))}
                  />
                </div>
              </div>
            </details>
          );
        }

        if (section.type === 'events') {
          return (
            <details key={sectionIdx} open={expandedSections[sectionKey]}>
              <summary onClick={() => toggleSection(sectionKey)} className={styles.sectionTitle}>
                📅 Événements
              </summary>
              <div className={styles.sectionContent}>
                {section.events?.map((event, eventIdx) => (
                  <div key={eventIdx} className={styles.subSection}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4>📌 Événement {eventIdx + 1}</h4>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {eventIdx > 0 && (
                          <button
                            type="button"
                            onClick={() => reorderArray(`sections.${sectionIdx}.events`, eventIdx, eventIdx - 1)}
                            className={styles.moveBtn}
                            title="Monter"
                          >
                            ⬆️
                          </button>
                        )}
                        {eventIdx < section.events.length - 1 && (
                          <button
                            type="button"
                            onClick={() => reorderArray(`sections.${sectionIdx}.events`, eventIdx, eventIdx + 1)}
                            className={styles.moveBtn}
                            title="Descendre"
                          >
                            ⬇️
                          </button>
                        )}
                      </div>
                    </div>

                    <MediaPicker
                      label="Image"
                      value={event.image || ''}
                      onChange={(url) => updateContent(`sections.${sectionIdx}.events.${eventIdx}.image`, url)}
                      type="image"
                    />

                    <div className={styles.field}>
                      <label>Titre</label>
                      <input
                        type="text"
                        value={event.title || ''}
                        onChange={(e) => updateContent(`sections.${sectionIdx}.events.${eventIdx}.title`, e.target.value)}
                      />
                    </div>

                    <div className={styles.field}>
                      <label>Description</label>
                      <textarea
                        value={event.description || ''}
                        onChange={(e) => updateContent(`sections.${sectionIdx}.events.${eventIdx}.description`, e.target.value)}
                      />
                    </div>

                    <div className={styles.field}>
                      <input
                        type="checkbox"
                        id={`event-visible-${eventIdx}`}
                        checked={event.visible !== false}
                        onChange={(e) => updateContent(`sections.${sectionIdx}.events.${eventIdx}.visible`, e.target.checked)}
                      />
                      <label htmlFor={`event-visible-${eventIdx}`}>Visible</label>
                    </div>
                  </div>
                ))}
              </div>
            </details>
          );
        }

        if (section.type === 'mundo') {
          return (
            <details key={sectionIdx} open={expandedSections[sectionKey]}>
              <summary onClick={() => toggleSection(sectionKey)} className={styles.sectionTitle}>
                🌍 Mundo
              </summary>
              <div className={styles.sectionContent}>
                <MediaPicker
                  label="Image/Vidéo"
                  value={section.content?.media?.src || ''}
                  onChange={(url) => updateContent(`sections.${sectionIdx}.content.media.src`, url)}
                  type="both"
                />

                <div className={styles.field}>
                  <label>Titre</label>
                  <input
                    type="text"
                    value={section.title || ''}
                    onChange={(e) => updateContent(`sections.${sectionIdx}.title`, e.target.value)}
                  />
                </div>
                <div className={styles.field}>
                  <label>Taille du titre (px)</label>
                  <input
                    type="number"
                    value={section.titleSize || 32}
                    onChange={(e) => updateContent(`sections.${sectionIdx}.titleSize`, parseInt(e.target.value))}
                  />
                </div>
                <ColorPicker
                  label="Couleur du titre"
                  value={section.titleColor || '#333'}
                  onChange={(color) => updateContent(`sections.${sectionIdx}.titleColor`, color)}
                />
                <ColorPicker
                  label="Couleur de fond du titre"
                  value={section.titleBackgroundColor || 'transparent'}
                  onChange={(color) => updateContent(`sections.${sectionIdx}.titleBackgroundColor`, color)}
                />

                <div className={styles.subSection}>
                  <h4>📖 Textes</h4>
                  <div className={styles.field}>
                    <label>Taille (px)</label>
                    <input
                      type="number"
                      value={section.textSize || 16}
                      onChange={(e) => updateContent(`sections.${sectionIdx}.textSize`, parseInt(e.target.value))}
                    />
                  </div>
                  <ColorPicker
                    label="Couleur du texte"
                    value={section.textColor || '#666'}
                    onChange={(color) => updateContent(`sections.${sectionIdx}.textColor`, color)}
                  />
                  <ColorPicker
                    label="Couleur de fond"
                    value={section.textBackgroundColor || 'transparent'}
                    onChange={(color) => updateContent(`sections.${sectionIdx}.textBackgroundColor`, color)}
                  />
                  <div className={styles.field}>
                    <label>Border radius</label>
                    <input
                      type="text"
                      placeholder="ex: 0"
                      value={section.textBorderRadius || '0'}
                      onChange={(e) => updateContent(`sections.${sectionIdx}.textBorderRadius`, e.target.value)}
                    />
                  </div>
                  <div className={styles.field}>
                    <label>Shadow</label>
                    <input
                      type="text"
                      placeholder="ex: 0"
                      value={section.textShadow || '0'}
                      onChange={(e) => updateContent(`sections.${sectionIdx}.textShadow`, e.target.value)}
                    />
                  </div>
                  <div className={styles.field}>
                    <label>Tous les paragraphes (un par ligne)</label>
                    <textarea
                      value={(section.content?.text || []).join('\n')}
                      onChange={(e) => {
                        const text = e.target.value.split('\n').filter(p => p.trim());
                        updateContent(`sections.${sectionIdx}.content.text`, text);
                      }}
                      style={{ minHeight: '150px' }}
                    />
                  </div>
                </div>
              </div>
            </details>
          );
        }

        if (section.type === 'gallery') {
          return (
            <details key={sectionIdx} open={expandedSections[sectionKey]}>
              <summary onClick={() => toggleSection(sectionKey)} className={styles.sectionTitle}>
                🖼️ Galerie
              </summary>
              <div className={styles.sectionContent}>
                <div className={styles.subSection}>
                  <h4>🖼️ Photos (6)</h4>
                  {section.images?.map((img, i) => (
                    <div key={i} className={styles.item}>
                      <strong>Photo {i + 1}</strong>
                      <MediaPicker
                        label="Image"
                        value={img.src || ''}
                        onChange={(url) => updateContent(`sections.${sectionIdx}.images.${i}.src`, url)}
                        type="image"
                      />
                      <div className={styles.field}>
                        <label>Alt text</label>
                        <input
                          type="text"
                          value={img.alt || ''}
                          onChange={(e) => updateContent(`sections.${sectionIdx}.images.${i}.alt`, e.target.value)}
                        />
                      </div>
                      <div className={styles.field}>
                        <label>Border radius</label>
                        <input
                          type="text"
                          placeholder="ex: 0"
                          value={img.borderRadius || '0'}
                          onChange={(e) => updateContent(`sections.${sectionIdx}.images.${i}.borderRadius`, e.target.value)}
                        />
                      </div>
                      <div className={styles.field}>
                        <label>Shadow</label>
                        <input
                          type="text"
                          placeholder="ex: 0"
                          value={img.shadow || '0'}
                          onChange={(e) => updateContent(`sections.${sectionIdx}.images.${i}.shadow`, e.target.value)}
                        />
                      </div>
                      <div className={styles.field}>
                        <input
                          type="checkbox"
                          id={`img-visible-${i}`}
                          checked={img.visible !== false}
                          onChange={(e) => updateContent(`sections.${sectionIdx}.images.${i}.visible`, e.target.checked)}
                        />
                        <label htmlFor={`img-visible-${i}`}>Visible</label>
                      </div>
                    </div>
                  ))}
                </div>

                <div className={styles.subSection}>
                  <h4>🎥 Vidéos YouTube</h4>
                  {section.videos?.map((video, i) => (
                    <div key={i} className={styles.item}>
                      <strong>Vidéo {i + 1}</strong>
                      <MediaPicker
                        label="Lien YouTube"
                        value={video.src || ''}
                        onChange={(url) => updateContent(`sections.${sectionIdx}.videos.${i}.src`, url)}
                        type="youtube"
                      />
                      <div className={styles.field}>
                        <label>Titre</label>
                        <input
                          type="text"
                          value={video.title || ''}
                          onChange={(e) => updateContent(`sections.${sectionIdx}.videos.${i}.title`, e.target.value)}
                        />
                      </div>
                      <div className={styles.field}>
                        <input
                          type="checkbox"
                          id={`video-visible-${i}`}
                          checked={video.visible !== false}
                          onChange={(e) => updateContent(`sections.${sectionIdx}.videos.${i}.visible`, e.target.checked)}
                        />
                        <label htmlFor={`video-visible-${i}`}>Visible</label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </details>
          );
        }

        return null;
      })}

      
      <details open={expandedSections.footer}>
        <summary onClick={() => toggleSection('footer')} className={styles.sectionTitle}>
          📋 Footer
        </summary>
        <div className={styles.sectionContent}>
          <div className={styles.field}>
            <input
              type="checkbox"
              id="footer-nav-visible"
              checked={content.footer?.navLinks?.visible !== false}
              onChange={(e) => updateContent('footer.navLinks.visible', e.target.checked)}
            />
            <label htmlFor="footer-nav-visible">Liens de navigation visibles</label>
          </div>

          <div className={styles.field}>
            <input
              type="checkbox"
              id="footer-social-visible"
              checked={content.footer?.socialLinks?.visible !== false}
              onChange={(e) => updateContent('footer.socialLinks.visible', e.target.checked)}
            />
            <label htmlFor="footer-social-visible">Réseaux sociaux visibles</label>
          </div>
        </div>
      </details>
    </div>
  );
}

export default ContentEditor;
