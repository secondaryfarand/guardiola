import React, { useState } from 'react';
import styles from './InterstitialWarning.module.css';

const InterstitialWarning = ({ threatData, onCancel, onProceedRisk }) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  if (!threatData) return null;

  return (
    <div className={styles.gatewayOverlay}>
      <div className={styles.gatewayCard}>
        <div className={styles.warningHeader}>
          <i className="fa-solid fa-triangle-exclamation"></i>
          <h2>PERINGATAN KEAMANAN KRITIS!</h2>
        </div>
        
        <p className={styles.warningSubtitle}>
          Sistem <strong>The Trust Trap</strong> mendeteksi bahwa tautan atau konten yang ingin Anda akses memiliki tingkat ancaman tinggi dan berpotensi membahayakan data pribadi Anda.
        </p>

        <div className={styles.targetInfoBox}>
          <span className={styles.label}>Target Terdeteksi:</span>
          <code className={styles.targetText}>{threatData.inputData}</code>
          <div className={styles.riskBadge} data-level={threatData.riskLevel}>
            {threatData.riskLevel} Risk ({threatData.riskScore}%)
          </div>
        </div>

        <div className={styles.redFlagsSection}>
          <h4><i className="fa-solid fa-list-check"></i> Alasan Bahaya (Red Flags):</h4>
          <ul>
            {threatData.redFlags && threatData.redFlags.map((flag, idx) => (
              <li key={idx}>
                <i className="fa-solid fa-ban"></i> {flag}
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.actionButtons}>
          <button className={styles.safeBtn} onClick={onCancel}>
            <i className="fa-solid fa-shield-halved"></i> Batalkan & Amankan Diri
          </button>
          <button className={styles.dangerBtn} onClick={() => setShowConfirmModal(true)}>
            <i className="fa-solid fa-triangle-exclamation"></i> Lanjut dengan Risiko Sendiri
          </button>
        </div>
      </div>

      {showConfirmModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalCard}>
            <i className="fa-solid fa-skull-crossbones modalIcon"></i>
            <h3>Konfirmasi Akses Berisiko Tinggi</h3>
            <p>
              Anda memilih mengabaikan peringatan keamanan nasional. Tindakan ini dapat mengakibatkan pencurian akun, penipuan finansial, atau infeksi malware. Lanjutkan?
            </p>
            <div className={styles.modalActions}>
              <button className={styles.modalCancelBtn} onClick={() => setShowConfirmModal(false)}>
                Kembali ke Zona Aman
              </button>
              <button className={styles.modalProceedBtn} onClick={onProceedRisk}>
                Ya, Saya Paham Risikonya
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterstitialWarning;