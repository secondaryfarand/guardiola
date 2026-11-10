import React from 'react';
import styles from './ReportStats.module.css';

const ReportStats = () => {
  return (
    <div className={styles.statsGrid}>
      <div className={styles.statCard}>
        <h3>1,420+</h3>
        <p>Total Laporan Komunitas</p>
      </div>
      <div className={styles.statCard}>
        <h3>98.4%</h3>
        <p>Akurasi Verifikasi Heuristik</p>
      </div>
      <div className={styles.statCard}>
        <h3>380 Tautan</h3>
        <p>Berhasil Diblokir Otomatis</p>
      </div>
    </div>
  );
};

export default ReportStats;