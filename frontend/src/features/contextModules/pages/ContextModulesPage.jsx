import React from 'react';
import JobScamAnalyzer from '../components/JobScamAnalyzer';
import FamilyAlertGenerator from '../components/FamilyAlertGenerator';
import styles from './ContextModulesPage.module.css';

const ContextModulesPage = () => {
  return (
    <div className={styles.container} id="modules">
      <div className={styles.sectionHeader}>
        <h2><i className="fa-solid fa-layer-group" style={{ color: 'var(--accent-gold)' }}></i> Multi-Target Context Modules</h2>
        <p>Modul analitik khusus untuk segmentasi target kejahatan digital di Indonesia.</p>
      </div>

      <div className={styles.grid}>
        <JobScamAnalyzer />
        <FamilyAlertGenerator />
      </div>
    </div>
  );
};

export default ContextModulesPage;