import React from 'react';
import styles from './ReportHeader.module.css';

const ReportHeader = ({ onOpenModal }) => {
  return (
    <div className={styles.headerFlex}>
      <div>
        <h2>🛡️ Guardiola Community Shield</h2>
        <p>Pusat transparansi ancaman siber berbasis laporan kolektif masyarakat secara real-time.</p>
      </div>
      <button className={styles.reportBtn} onClick={onOpenModal}>
        <i className="fa-solid fa-triangle-exclamation"></i> Laporkan Tautan / Scam
      </button>
    </div>
  );
};

export default ReportHeader;