import React, { useState, useRef } from 'react';
import styles from './ReportForm.module.css';

const ReportForm = ({ isOpen, onClose, onReportSubmit }) => {
  const [formData, setFormData] = useState({
    target: '',
    category: 'Phishing / Fake Login',
    description: '',
  });
  const [submitting, setSubmitting] = useState(false);
  
  // Gunakan useRef untuk mengunci klik ganda secara sinkron & instan
  const isSubmittingRef = useRef(false);

  // State untuk menangani dialog konfirmasi interaktif
  const [warningState, setWarningState] = useState(null); 

  if (!isOpen) return null;

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const handleInitialSubmit = async (e) => {
    e.preventDefault();
    if (!formData.target.trim() || isSubmittingRef.current) return;

    isSubmittingRef.current = true;
    setSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/community/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target: formData.target }),
      });
      const result = await response.json();

      if (result.exists) {
        setWarningState({
          type: 'EXISTS',
          title: '⚠️ Tautan Sudah Pernah Dilaporkan!',
          message: `Tautan ini sudah terdaftar dalam sistem dan telah dikonfirmasi oleh ${result.data.reportedCount} pengguna lain. Melaporkannya lagi akan otomatis meningkatkan tingkat kepercayaan ancaman ini tanpa membuat data duplikat di database.`,
          reportData: result.data
        });
      } else {
        setWarningState({
          type: 'NEW',
          title: '🛡️ Konfirmasi Laporan Tautan Baru',
          message: 'Ini adalah tautan baru yang belum pernah dilaporkan sebelumnya di jaringan global Guardiola. Pastikan tautan ini benar-benar berbahaya atau mengandung indikasi penipuan.',
          warningNote: '⚠️ Peringatan: Jangan menyalahgunakan sistem ini atau memasukkan tautan aman (safe link) secara sengaja (iseng). Jika terbukti memberikan laporan palsu atau menuduh sembarangan, akun Anda berpotensi diblokir oleh Administrator.',
        });
      }
    } catch (error) {
      console.error('Gagal memeriksa tautan:', error);
      executeFinalSubmit();
      return;
    } finally {
      // Buka kembali kunci ref & state agar tombol konfirmasi di dialog bisa diklik
      isSubmittingRef.current = false;
      setSubmitting(false); 
    }
  };

  // Langkah 2: Eksekusi final setelah pengguna menekan tombol "Lanjutkan"
  const executeFinalSubmit = async () => {
    // Pengaman sinkron mutlak menggunakan useRef
    if (isSubmittingRef.current) {
    console.warn("⚠️ Dicegah oleh Ref! Request kedua diabaikan.");
    return; 
  }
  
  isSubmittingRef.current = true; // Langsung kunci detik itu juga
  setSubmitting(true); 

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/community`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Gagal menyimpan laporan.');
      }

      onReportSubmit(result.data);
      handleCloseAll();
    } catch (error) {
      console.error('Error submitting report:', error);
      alert(error.message);
      isSubmittingRef.current = false; // Buka kembali jika terjadi error jaringan
      setSubmitting(false); 
    } 
  };

  const handleCloseAll = () => {
    setFormData({ target: '', category: 'Phishing / Fake Login', description: '' });
    setWarningState(null);
    isSubmittingRef.current = false;
    setSubmitting(false);
    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalCard}>
        <div className={styles.modalHeader}>
          <h3>🚨 Laporkan Tautan atau Pesan Mencurigakan</h3>
          <button className={styles.closeBtn} onClick={handleCloseAll}>&times;</button>
        </div>

        {warningState ? (
          <div className={styles.warningBoxContainer}>
            <div className={styles.warningTitle}>{warningState.title}</div>
            <p className={styles.warningDesc}>{warningState.message}</p>
            {warningState.warningNote && (
              <p className={styles.strictWarning}>{warningState.warningNote}</p>
            )}

            <div className={styles.modalActions} style={{ marginTop: '1.5rem' }}>
              <button 
                type="button" 
                className={styles.cancelBtn} 
                onClick={() => setWarningState(null)}
              >
                Batalkan
              </button>
              <button 
                type="button" 
                className={styles.submitBtn} 
                onClick={() => {
                  console.log("Tombol konfirmasi diklik, status ref saat ini:", isSubmittingRef.current);
                  executeFinalSubmit();
                }}
                disabled={submitting}
              >
                {submitting ? 'Memproses...' : 'Ya, Lanjutkan Pelaporan'}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={(e) => e.preventDefault()} className={styles.form}>
            <div className={styles.inputGroup}>
              <label>Tautan / URL Berbahaya:</label>
              <input 
                type="text" 
                placeholder="Contoh: https://penipuan-palsu.xyz" 
                value={formData.target}
                onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                required 
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Kategori Ancaman:</label>
              <select 
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="Phishing / Fake Login">Phishing / Halaman Login Palsu</option>
                <option value="Fake Giveaway">Fake Giveaway / Hadiah Fiktif</option>
                <option value="Job Scam">Lowongan Kerja Palsu (Job Scam)</option>
                <option value="Judi Online / Spam">Judi Online / Spam Ilegal</option>
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label>Kronologi Singkat / Deskripsi:</label>
              <textarea 
                rows="3" 
                placeholder="Jelaskan secara singkat modus penipuannya..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              ></textarea>
            </div>

            <div className={styles.modalActions}>
              <button type="button" className={styles.cancelBtn} onClick={handleCloseAll}>Batal</button>
              <button 
                type="button" 
                className={styles.submitBtn} 
                onClick={handleInitialSubmit} 
                disabled={submitting}
              >
                {submitting ? 'Menganalisis Tautan...' : 'Periksa & Kirim Laporan'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ReportForm;