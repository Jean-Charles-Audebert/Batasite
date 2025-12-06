import React from 'react';

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <p style={styles.text}>
          © {new Date().getFullYear()} Batasite. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: '#34495e',
    color: 'white',
    padding: '2rem 0',
    marginTop: 'auto',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
    textAlign: 'center',
  },
  text: {
    margin: 0,
  },
};

export default Footer;
