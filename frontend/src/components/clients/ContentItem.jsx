import React from 'react';

const ContentItem = ({ content }) => {
  return (
    <div style={styles.container}>
      <h3 style={styles.title}>{content.title}</h3>
      <span style={styles.type}>{content.content_type}</span>
      {content.body && <p style={styles.body}>{content.body}</p>}
      {content.media_url && (
        <div style={styles.media}>
          {content.content_type === 'image' ? (
            <img src={content.media_url} alt={content.title} style={styles.image} />
          ) : (
            <a href={content.media_url} target="_blank" rel="noopener noreferrer">
              Voir le média
            </a>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: 'white',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '1.5rem',
    marginBottom: '1rem',
  },
  title: {
    margin: '0 0 0.5rem 0',
    color: '#2c3e50',
  },
  type: {
    display: 'inline-block',
    padding: '0.25rem 0.75rem',
    backgroundColor: '#e9ecef',
    borderRadius: '12px',
    fontSize: '0.875rem',
    marginBottom: '1rem',
  },
  body: {
    color: '#666',
    lineHeight: '1.6',
  },
  media: {
    marginTop: '1rem',
  },
  image: {
    maxWidth: '100%',
    height: 'auto',
    borderRadius: '4px',
  },
};

export default ContentItem;
