import React, { useState, useEffect } from 'react';
import ContentPreviewStyled from './ContentPreviewStyled';
import styles from './ContentPreview.module.css';

/**
 * Page de preview du contenu (à être utilisée dans une iframe)
 * Écoute les messages postMessage et affiche le contenu
 */
export default function ContentPreviewPage() {
  const [content, setContent] = useState({});

  useEffect(() => {
    // Écouter les messages de la fenêtre parente
    const handleMessage = (event) => {
      // Vérifier l'origine pour la sécurité
      if (event.origin !== window.location.origin) {
        return;
      }

      if (event.data?.type === 'UPDATE_CONTENT') {
        setContent(event.data.content || {});
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div className={styles.previewContainer}>
      <ContentPreviewStyled content={content} />
    </div>
  );
}
