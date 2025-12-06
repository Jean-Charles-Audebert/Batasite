import React from 'react';

const Header = ({ clientName }) => {
  return (
    <header style={styles.header}>
      <div style={styles.container}>
        <h1 style={styles.title}>{clientName || 'Batasite'}</h1>
        <nav style={styles.nav}>
          <a href="/" style={styles.link}>Accueil</a>
          <a href="/about" style={styles.link}>À propos</a>
          <a href="/contact" style={styles.link}>Contact</a>
        </nav>
      </div>
    </header>
  );
};

const styles = {
  header: {
    backgroundColor: '#2c3e50',
    color: 'white',
    padding: '1rem 0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    margin: 0,
    fontSize: '1.5rem',
  },
  nav: {
    display: 'flex',
    gap: '1.5rem',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '1rem',
  },
};

export default Header;
