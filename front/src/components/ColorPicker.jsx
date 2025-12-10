import React from 'react';
import styles from './ColorPicker.module.css';

function ColorPicker({ label, value, onChange }) {
  return (
    <div className={styles.container}>
      {label && <label>{label}</label>}
      <input
        type="color"
        value={value || '#ffffff'}
        onChange={(e) => onChange(e.target.value)}
        className={styles.colorInput}
        title={value || '#ffffff'}
      />
      <span className={styles.value}>{value || '#ffffff'}</span>
    </div>
  );
}

export default ColorPicker;
