import React, { useState } from 'react';
import styles from './ReportDetailModal.module.css';

const ReportDetailModal = ({ report, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!report) return null;

  const handleCopyUrl = (url) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalCardLarge}>
        <div className={styles.modalHeader}>
          <div>
            <span className={`${styles.badge} ${styles[report.riskLevel.toLowerCase()]}`}>
              {report.riskLevel} Risk
            </span>
            <h3 style={{ marginTop: '0.5rem', color: '#fff' }}>Analisis Detail Laporan ({report.id})</h3>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>&times;</button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.detailRow}>
            <strong>Kategori Ancaman:</strong>
            <span>{report.category}</span>
          </div>

          <div className={styles.detailRow}>
            <strong>Target Tautan:</strong>
            <div className={styles.urlBoxModal}>
              <code>{report.target}</code>
              <button className={styles.copyBtn} onClick={() => handleCopyUrl(report.target)}>
                <i className="fa-solid fa-copy"></i> {copied ? 'Tersalin!' : 'Salin'}
              </button>
            </div>
          </div>

          <div className={styles.detailRow}>
            <strong>Infrastruktur / IP Server:</strong>
            <span style={{ fontFamily: 'monospace', color: '#38bdf8' }}>{report.ipAddress}</span>
          </div>

          <div className={styles.detailRow}>
            <strong>Status Verifikasi Sistem:</strong>
            <span className={styles.verifiedText}>{report.status}</span>
          </div>

          <div className={styles.detailRowColumn}>
            <strong>Kronologi / Deskripsi Pelapor:</strong>
            <p className={styles.boxText}>{report.description}</p>
          </div>

          <div className={styles.detailRowColumn}>
            <strong>Catatan Analisis Mesin Heuristik (Expert System):</strong>
            <p className={styles.boxTextHighlight}>{report.heuristicNotes}</p>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.closeActionBtn} onClick={onClose}>Tutup</button>
        </div>
      </div>
    </div>
  );
};

export default ReportDetailModal;