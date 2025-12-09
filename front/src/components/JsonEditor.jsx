import React, { useState } from 'react';
import styles from './JsonEditor.module.css';

/**
 * Éditeur JSON avancé avec visualisation hiérarchique
 */
export function JsonEditor({ data, onChange, disabled = false }) {
  const [expandedKeys, setExpandedKeys] = useState(new Set());
  const [editingKey, setEditingKey] = useState(null);
  const [editValue, setEditValue] = useState('');

  const toggleExpanded = (key) => {
    const newExpanded = new Set(expandedKeys);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedKeys(newExpanded);
  };

  const startEdit = (key, value) => {
    setEditingKey(key);
    setEditValue(typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value));
  };

  const saveEdit = (key) => {
    try {
      let newValue;
      try {
        newValue = JSON.parse(editValue);
      } catch {
        newValue = editValue;
      }

      const newData = { ...data, [key]: newValue };
      onChange({ target: { name: '__json__', value: newData } });
      setEditingKey(null);
    } catch (err) {
      alert('Erreur lors de la sauvegarde: ' + err.message);
    }
  };

  const deleteKey = (key) => {
    if (window.confirm(`Supprimer la clé "${key}" ?`)) {
      const newData = { ...data };
      delete newData[key];
      onChange({ target: { name: '__json__', value: newData } });
    }
  };

  const addNewKey = () => {
    const newKey = prompt('Nouvelle clé:');
    if (newKey) {
      const newData = { ...data, [newKey]: '' };
      onChange({ target: { name: '__json__', value: newData } });
    }
  };

  const renderValue = (value) => {
    if (value === null) return 'null';
    if (typeof value === 'boolean') return value ? 'true' : 'false';
    if (typeof value === 'object') {
      if (Array.isArray(value)) return `[${value.length} items]`;
      return `{${Object.keys(value).length} keys}`;
    }
    return String(value).substring(0, 50);
  };

  return (
    <div className={styles.editor}>
      <div className={styles.toolbar}>
        <button
          onClick={addNewKey}
          disabled={disabled}
          className={styles.addButton}
        >
          + Ajouter une clé
        </button>
      </div>

      <div className={styles.tree}>
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className={styles.node}>
            <div className={styles.nodeHeader}>
              {typeof value === 'object' && (
                <button
                  className={styles.toggleBtn}
                  onClick={() => toggleExpanded(key)}
                  disabled={disabled}
                >
                  {expandedKeys.has(key) ? '▼' : '▶'}
                </button>
              )}
              {!expandedKeys.has(key) && typeof value === 'object' && (
                <span className={styles.placeholder} />
              )}

              {editingKey === key ? (
                <div className={styles.editContainer}>
                  <textarea
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    disabled={disabled}
                    className={styles.editInput}
                  />
                  <div className={styles.editButtons}>
                    <button
                      onClick={() => saveEdit(key)}
                      className={styles.saveBtn}
                      disabled={disabled}
                    >
                      ✓
                    </button>
                    <button
                      onClick={() => setEditingKey(null)}
                      className={styles.cancelBtn}
                      disabled={disabled}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <span className={styles.key}>{key}:</span>
                  <span className={styles.value}>{renderValue(value)}</span>
                  <button
                    onClick={() => startEdit(key, value)}
                    disabled={disabled}
                    className={styles.editBtn}
                  >
                    ✎
                  </button>
                  <button
                    onClick={() => deleteKey(key)}
                    disabled={disabled}
                    className={styles.deleteBtn}
                  >
                    ✕
                  </button>
                </>
              )}
            </div>

            {expandedKeys.has(key) && typeof value === 'object' && (
              <div className={styles.nodeContent}>
                {Array.isArray(value) ? (
                  <ul className={styles.arrayList}>
                    {value.map((item, idx) => (
                      <li key={idx} className={styles.arrayItem}>
                        {renderValue(item)}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className={styles.objectContent}>
                    {Object.entries(value).map(([k, v]) => (
                      <div key={k} className={styles.field}>
                        <span className={styles.key}>{k}:</span>
                        <span className={styles.value}>{renderValue(v)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
