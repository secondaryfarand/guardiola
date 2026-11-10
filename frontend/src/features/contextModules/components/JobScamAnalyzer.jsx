import React, { useState } from 'react';
import styles from './JobScamAnalyzer.module.css';

const JobScamAnalyzer = () => {
  const [companyName, setCompanyName] = useState('');
  const [jobOfferText, setJobOfferText] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleJobScan = (e) => {
    e.preventDefault();
    if (!jobOfferText.trim()) return;

    setLoading(true);
    setTimeout(() => {
      const lower = jobOfferText.toLowerCase();
      let riskScore = 20;
      const flags = [];

      if (lower.includes('biaya') || lower.includes('deposit') || lower.includes('training fee')) {
        riskScore += 50;
        flags.push('Meminta pungutan biaya administrasi atau deposit di awal (Ciri utama penipuan kerja).');
      }
      if (lower.includes('whatsapp') || lower.includes('hrd via wa')) {
        riskScore += 30;
        flags.push('Proses rekrutmen tidak resmi hanya melalui nomor seluler pribadi/WhatsApp.');
      }
      if (lower.includes('gaji besar') || lower.includes('tanpa pengalaman') || lower.includes('10 juta')) {
        riskScore += 25;
        flags.push('Iming-iming gaji fantastis untuk kriteria pekerjaan yang sangat longgar.');
      }

      riskScore = Math.min(riskScore, 100);
      const riskLevel = riskScore >= 70 ? 'Critical' : riskScore >= 40 ? 'Medium' : 'Low';

      setAnalysisResult({
        companyName: companyName || 'Perusahaan Anonim',
        riskScore,
        riskLevel,
        flags
      });
      setLoading(false);
    }, 600);
  };

  return (
    <div className={styles.moduleCard}>
      <div className={styles.headerTitle}>
        <i className="fa-solid fa-briefcase"></i>
        <h3>JobScam Analyzer (Modul Lowongan Kerja Palsu)</h3>
      </div>
      <p className={styles.subtitle}>
        Masukkan detail penawaran kerja atau pesan interview yang Anda terima untuk mendeteksi modus rekrutmen penipuan.
      </p>

      <form onSubmit={handleJobScan} className={styles.form}>
        <div className={styles.inputGroup}>
          <label><i className="fa-solid fa-building"></i> Nama Perusahaan / Instansi</label>
          <input
            type="text"
            className={styles.inputField}
            placeholder="Contoh: PT Sukses Berkah Mandiri"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
        </div>

        <div className={styles.inputGroup}>
          <label><i className="fa-solid fa-file-lines"></i> Teks Tawaran / Pesan Rekrutmen</label>
          <textarea
            className={styles.textareaField}
            rows="3"
            placeholder="Contoh: Anda diterima sebagai staff admin. Silakan transfer biaya seragam sebesar 300rb ke rekening..."
            value={jobOfferText}
            onChange={(e) => setJobOfferText(e.target.value)}
          ></textarea>
        </div>

        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-magnifying-glass-chart"></i>}
          {loading ? 'Menganalisis Lowongan...' : 'Analisis Lowongan Kerja'}
        </button>
      </form>

      {analysisResult && (
        <div className={styles.resultBox} data-level={analysisResult.riskLevel}>
          <div className={styles.resultHeader}>
            <h4>Hasil Evaluasi: {analysisResult.companyName}</h4>
            <span className={styles.riskBadge}>{analysisResult.riskLevel} Risk ({analysisResult.riskScore}%)</span>
          </div>
          <ul>
            {analysisResult.flags.length > 0 ? (
              analysisResult.flags.map((flag, idx) => (
                <li key={idx}><i className="fa-solid fa-triangle-exclamation"></i> {flag}</li>
              ))
            ) : (
              <li><i className="fa-solid fa-circle-check"></i> Tidak ditemukan indikasi penipuan rekrutmen yang mencolok.</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default JobScamAnalyzer;