import React, { useState, useEffect } from 'react';
import { runApiTests } from '../__tests__/api.test';
import styles from './TestRunner.module.css';

/**
 * Composant pour exécuter et afficher les tests
 * À utiliser uniquement en développement
 */
export function TestRunner() {
  const [results, setResults] = useState(null);
  const [running, setRunning] = useState(false);

  const handleRunTests = async () => {
    setRunning(true);
    try {
      const result = await runApiTests();
      setResults(result);
    } catch (error) {
      console.error('Test execution error:', error);
      setResults({ error: error.message, passed: 0, failed: 1, total: 1 });
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Test Runner</h2>
        <button 
          onClick={handleRunTests}
          disabled={running}
          className={styles.button}
        >
          {running ? 'Exécution...' : 'Exécuter les tests'}
        </button>
      </div>

      {results && (
        <div className={`${styles.results} ${results.failed > 0 ? styles.failed : styles.passed}`}>
          <p>
            <strong>Total:</strong> {results.total} | 
            <strong> Réussis:</strong> {results.passed} | 
            <strong> Échoués:</strong> {results.failed}
          </p>
          {results.error && (
            <p className={styles.error}>Erreur: {results.error}</p>
          )}
        </div>
      )}
    </div>
  );
}
