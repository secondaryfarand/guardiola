import React from 'react';
import ReportConfirmButton from './ReportConfirmButton';
import styles from './ReportCard.module.css';

const ReportCard = ({ item, onSelectDetail, onConfirmThreat }) => {
  return (
    <div className={styles.feedCard}>
      <div className={styles.cardHeader}>
        <span className={`${styles.badge} ${styles[item.riskLevel.toLowerCase()]}`}>
          {item.riskLevel} Risk
        </span>
        <span className={styles.categoryTag}>{item.category}</span>
        <span className={styles.timeText}>{item.lastReported}</span>
      </div>

      <div className={styles.targetUrl}>
        <code>{item.target}</code>
      </div>

      <p className={styles.desc}>{item.description}</p>

      <div className={styles.cardFooter}>
        <span className={styles.reportCountInfo}>
          <i className="fa-solid fa-users"></i> Dilaporkan oleh <strong>{item.reportedCount} pengguna</strong>
        </span>

        {/* Tombol Konfirmasi Ancaman & Tombol Detail */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <ReportConfirmButton 
            reportId={item.id}
            initialCount={item.reportedCount}
            initialStatus={item.status}
            onConfirm={onConfirmThreat}
          />
          <button 
            className={styles.detailBtn}
            onClick={() => onSelectDetail(item)}
          >
            <i className="fa-solid fa-circle-info"></i> Detail
          </button>
        </div>
      </div>

      {item.reportedCount >= 10 || item.status === 'Verified Global Threat' ? (
        <div className={styles.verifiedGlobalBanner}>
          <i className="fa-solid fa-shield-cat"></i> Status: Terverifikasi sebagai Ancaman Global Otomatis ({item.reportedCount} Konfirmasi)
        </div>
      ) : null}
    </div>
  );
};

export default ReportCard;