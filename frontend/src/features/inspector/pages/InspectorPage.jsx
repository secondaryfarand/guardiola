import React, { useState, useEffect } from 'react';
import InspectorForm from '../components/InspectorForm';
import InterstitialWarning from '../../warningGateway/components/InterstitialWarning';
import styles from './InspectorPage.module.css';

const InspectorPage = () => {
  const [scanResult, setScanResult] = useState(null);
  const [showAlertGateway, setShowAlertGateway] = useState(false);
  const [initialInput, setInitialInput] = useState('');

  // Menangkap parameter URL dari ekstensi
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const inspectTarget = params.get('inspect');
    if (inspectTarget) {
      setInitialInput(inspectTarget);
    }
  }, []);

  // Fungsi yang dipanggil ketika InspectorForm selesai memindai dari backend
  const handleScanResult = (data) => {
    setScanResult(data);
    
    // 🔥 OTOMATIS MUNCULKAN GATEWAY / HASIL PENUH:
    // Jika data dari backend diterima, langsung tentukan apakah perlu memunculkan warning gateway
    // Anda bisa mengatur kondisi ini: apakah semua hasil langsung dimunculkan, atau khusus yang skornya di atas batas tertentu
    if (data.riskLevel === 'High' || data.riskLevel === 'Critical' || data.riskLevel === 'Medium' || data.riskLevel === 'Low') {
      // Jika ingin agar setiap hasil redirect langsung memunculkan modal/tampilan penuh:
      setShowAlertGateway(true); 
    }
  };

  return (
    <div className={styles.container} id="inspector">
      <div className={styles.heroSection}>
        <h1 className={styles.title}>
          <i className="fa-solid fa-shield-cat" style={{ color: 'var(--accent-gold)' }}></i> The Trust Trap
        </h1>
        <p className={styles.tagline}>
          Digital Deception & Risk Navigation System — Melindungi Anda dari ancaman siber secara otomatis.
        </p>
      </div>

      <InspectorForm initialInput={initialInput} onResult={handleScanResult} />

      {scanResult && !showAlertGateway && (
        <div className={styles.resultContainer}>
          <div className={`${styles.resultCard} ${styles[scanResult.riskLevel.toLowerCase()]}`}>
            <div className={styles.resultHeader}>
              <h3>
                <i className="fa-solid fa-triangle-exclamation"></i> Hasil Analisis Keamanan
              </h3>
              <span className={styles.badge} data-level={scanResult.riskLevel}>
                {scanResult.riskLevel} Risk ({scanResult.riskScore}%)
              </span>
            </div>

            <button 
              className={styles.testWarningBtn} 
              onClick={() => setShowAlertGateway(true)}
            >
              <i className="fa-solid fa-eye"></i> Tampilkan Interstitial Warning Gateway
            </button>
          </div>
        </div>
      )}

      {showAlertGateway && scanResult && (
        <InterstitialWarning 
          threatData={scanResult}
          onCancel={() => {
            setShowAlertGateway(false);
            window.location.href = 'http://localhost:5173'; // Kembali ke halaman utama
          }}
          onProceedRisk={() => {
            const originalUrl = scanResult.inputData;
            setShowAlertGateway(false);
            window.location.href = originalUrl; // Lanjut ke situs tujuan jika memaksa
          }}
        />
      )}
    </div>
  );
};

export default InspectorPage;