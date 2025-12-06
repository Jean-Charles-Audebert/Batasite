import { useState, useEffect } from 'react';
import './App.css';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import ClientCard from './components/clients/ClientCard';
import ContentItem from './components/clients/ContentItem';
import { api } from './services/api';

function App() {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setLoading(true);
      const data = await api.getClients();
      setClients(data);
      setError(null);
    } catch (err) {
      setError('Impossible de charger les clients. Assurez-vous que le backend est en cours d\'exécution.');
      console.error('Error loading clients:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClientClick = async (client) => {
    setSelectedClient(client);
    try {
      const data = await api.getContentByClient(client.id);
      setContent(data);
    } catch (err) {
      console.error('Error loading content:', err);
    }
  };

  const handleBackToClients = () => {
    setSelectedClient(null);
    setContent([]);
  };

  return (
    <div style={styles.app}>
      <Header clientName={selectedClient?.name} />
      
      <main style={styles.main}>
        <div style={styles.container}>
          {loading ? (
            <p style={styles.message}>Chargement...</p>
          ) : error ? (
            <div style={styles.error}>
              <p>{error}</p>
              <p style={styles.hint}>
                Pour démarrer le backend: <code>cd backend && npm run dev</code>
              </p>
            </div>
          ) : selectedClient ? (
            <div>
              <button onClick={handleBackToClients} style={styles.backButton}>
                ← Retour aux clients
              </button>
              <h2 style={styles.heading}>Contenu de {selectedClient.name}</h2>
              {content.length === 0 ? (
                <p style={styles.message}>Aucun contenu disponible pour ce client.</p>
              ) : (
                content.map((item) => (
                  <ContentItem key={item.id} content={item} />
                ))
              )}
            </div>
          ) : (
            <div>
              <h2 style={styles.heading}>Nos Clients</h2>
              {clients.length === 0 ? (
                <p style={styles.message}>Aucun client trouvé. Lancez le seed: <code>npm run seed</code></p>
              ) : (
                <div style={styles.grid}>
                  {clients.map((client) => (
                    <ClientCard
                      key={client.id}
                      client={client}
                      onClick={handleClientClick}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

const styles = {
  app: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f5f5f5',
  },
  main: {
    flex: 1,
    padding: '2rem 0',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
  },
  heading: {
    color: '#2c3e50',
    marginBottom: '2rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem',
  },
  message: {
    textAlign: 'center',
    color: '#666',
    fontSize: '1.125rem',
  },
  error: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '1rem',
    borderRadius: '4px',
    border: '1px solid #f5c6cb',
  },
  hint: {
    marginTop: '0.5rem',
    fontSize: '0.875rem',
  },
  backButton: {
    backgroundColor: '#2c3e50',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    marginBottom: '1.5rem',
  },
};

export default App;
