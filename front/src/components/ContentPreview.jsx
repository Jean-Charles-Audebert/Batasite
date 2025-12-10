import React, { useEffect, useRef } from 'react';
import ContentPreviewStyled from './ContentPreviewStyled';

/**
 * ContentPreview - Affiche la page publique avec le contenu JSON rendu
 * 
 * Props:
 * - content: JSON du contenu
 */

export default function ContentPreview({ content = {} }) {
  return (
    <div style={{ width: '100%', height: '100%', overflow: 'auto', backgroundColor: '#fff' }}>
      <ContentPreviewStyled content={content} />
    </div>
  );
}
