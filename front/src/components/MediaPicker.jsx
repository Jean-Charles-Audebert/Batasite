import React, { useRef, useState } from 'react';
import styles from './MediaPicker.module.css';

function MediaPicker({ label, value, onChange, type = 'both' }) {
  const fileInputRef = useRef(null);
  const [inputMethod, setInputMethod] = useState('url');

  // Normaliser la valeur (peut être une chaîne ou un objet)
  const stringValue = typeof value === 'string' ? value : (value?.src || '');

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onChange(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlSubmit = (e) => {
    const url = e.target.value;
    if (url.trim()) {
      onChange(url);
      e.target.value = '';
    }
  };

  return (
    <div className={styles.container}>
      {label && <label>{label}</label>}
      
      <div className={styles.content}>
        {stringValue && (
          <div className={styles.preview}>
            {stringValue.includes('youtu') ? (
              <div className={styles.youtubeIcon}>🎥</div>
            ) : stringValue.includes('data:') ? (
              <div className={styles.uploadedIcon}>📤</div>
            ) : (
              <div className={styles.urlIcon}>🔗</div>
            )}
            <span className={styles.truncated}>{stringValue.substring(0, 40)}</span>
          </div>
        )}

        <div className={styles.methods}>
          <button
            type="button"
            className={`${styles.methodBtn} ${inputMethod === 'url' ? styles.active : ''}`}
            onClick={() => setInputMethod('url')}
          >
            🔗 URL
          </button>
          <button
            type="button"
            className={`${styles.methodBtn} ${inputMethod === 'upload' ? styles.active : ''}`}
            onClick={() => setInputMethod('upload')}
          >
            📤 Télécharger
          </button>
          {type === 'youtube' && (
            <button
              type="button"
              className={`${styles.methodBtn} ${inputMethod === 'youtube' ? styles.active : ''}`}
              onClick={() => setInputMethod('youtube')}
            >
              🎥 YouTube
            </button>
          )}
        </div>

        {inputMethod === 'url' && (
          <input
            type="text"
            placeholder="Coller l'URL..."
            defaultValue={stringValue && !stringValue.includes('data:') ? stringValue : ''}
            onBlur={(e) => handleUrlSubmit(e)}
            onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit(e)}
            className={styles.input}
          />
        )}

        {inputMethod === 'upload' && (
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            onChange={handleFileSelect}
            className={styles.fileInput}
          />
        )}

        {inputMethod === 'youtube' && (
          <input
            type="text"
            placeholder="Lien YouTube..."
            defaultValue={stringValue && stringValue.includes('youtu') ? stringValue : ''}
            onBlur={(e) => handleUrlSubmit(e)}
            onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit(e)}
            className={styles.input}
          />
        )}

        {stringValue && (
          <button
            type="button"
            className={styles.clearBtn}
            onClick={() => onChange('')}
          >
            ✕ Effacer
          </button>
        )}
      </div>
    </div>
  );
}

export default MediaPicker;
