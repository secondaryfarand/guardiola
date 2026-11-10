import React from 'react';
import styles from './ContributorBadge.module.css';

const ContributorBadge = ({ userReportsCount }) => {
  return (
    <div className={styles.badgeWrapper}>
      <div className={styles.iconBox}>
        <i className="fa-solid fa-shield-halved"></i>
      </div>
      <div className={styles.badgeInfo}>
        <span className={styles.roleTitle}>Status Anda: Cyber Guardian (Level 1)</span>
        <span className={styles.subText}>
          Kontribusi Aktif: <strong>{userReportsCount} Laporan Diverifikasi</strong>
        </span>
      </div>
    </div>
  );
};

export default ContributorBadge;