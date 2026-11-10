import React, { useState } from 'react';
import styles from './AlertBanner.module.css';

const AlertBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className={styles.alertBanner}>
      <div className={styles.alertContent}>
        <div className={styles.iconPulse}>
          <i className="fa-solid fa-triangle-exclamation"></i>
        </div>
        <div className={styles.textContainer}>
          <span className={styles.alertTitle}>Peringatan Dini Keamanan Siber Hari Ini:</span>
          <p className={styles.alertText}>
            🚨 Waspada! Tren baru penipuan berkedok kurir paket dengan link APK palsu dan undian fiktif sedang marak menyerang pengguna seluler. Jangan klik tautan asing!
          </p>
        </div>
      </div>
      <button className={styles.closeAlertBtn} onClick={() => setIsVisible(false)} title="Tutup Peringatan">
        &times;
      </button>
    </div>
  );
};

export default AlertBanner;