import React from 'react';

const ClientCard = ({ client, onClick }) => {
  const statusStyle = client.active 
    ? { ...styles.status, ...styles.active }
    : { ...styles.status, ...styles.inactive };

  return (
    <div style={styles.card} onClick={() => onClick(client)}>
      <h3 style={styles.title}>{client.name}</h3>
      <p style={styles.description}>{client.description}</p>
      <span style={statusStyle}>
        {client.active ? 'Actif' : 'Inactif'}
      </span>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: 'white',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '1.5rem',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    },
  },
  title: {
    margin: '0 0 0.5rem 0',
    color: '#2c3e50',
  },
  description: {
    margin: '0 0 1rem 0',
    color: '#666',
  },
  status: {
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    fontSize: '0.875rem',
    fontWeight: 'bold',
  },
  active: {
    backgroundColor: '#d4edda',
    color: '#155724',
  },
  inactive: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
  },
};

export default ClientCard;
