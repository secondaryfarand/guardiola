import React, { useState } from 'react';
import styles from './FamilyAlertGenerator.module.css';

const FamilyAlertGenerator = () => {
  const [scamTopic, setScamTopic] = useState('Hadiah undian palsu');
  const [generatedMessage, setGeneratedMessage] = useState('');

  const handleGenerate = () => {
    const msg = `Halo Ayah/Ibu/Keluarga tercinta,\n\nMohon waspada terhadap pesan atau link tentang "${scamTopic}". Berdasarkan sistem keamanan The Trust Trap, ini adalah modus penipuan untuk mencuri data atau uang.\n\nTolong JANGAN klik tautan tersebut, jangan berikan kode OTP, dan abaikan pesannya ya! Hubungi anak/keluarga jika ragu.\n\nSalam sayang, tetap aman ya!`;
    setGeneratedMessage(msg);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedMessage);
    alert('Pesan peringatan berhasil disalin! Silakan kirimkan melalui WhatsApp keluarga.');
  };

  return (
    <div className={styles.moduleCard}>
      <div className={styles.headerTitle}>
        <i className="fa-solid fa-users"></i>
        <h3>Senior-Friendly Family Alert Generator</h3>
      </div>
      <p className={styles.subtitle}>
        Buat pesan peringatan yang ramah, sopan, dan mudah dipahami oleh orang tua atau anggota keluarga senior di WhatsApp.
      </p>

      <div className={styles.form}>
        <div className={styles.inputGroup}>
          <label><i className="fa-solid fa-triangle-exclamation"></i> Pilih Topik Penipuan yang Ditemukan</label>
          <select 
            className={styles.selectField}
            value={scamTopic}
            onChange={(e) => setScamTopic(e.target.value)}
          >
            <option value="Hadiah undian palsu / Giveaway">Hadiah Undian Palsu / Giveaway</option>
            <option value="Lowongan kerja berbayar / Job Scam">Lowongan Kerja Berbayar / Job Scam</option>
            <option value="Tautan tagihan / verifikasi bank palsu">Tautan Tagihan / Verifikasi Bank Palsu</option>
            <option value="Pesan darurat mengaku anggota keluarga">Pesan Darurat Mengaku Anggota Keluarga</option>
          </select>
        </div>

        <button type="button" className={styles.submitBtn} onClick={handleGenerate}>
          <i className="fa-solid fa-wand-magic-sparkles"></i> Buat Pesan Peringatan Keluarga
        </button>
      </div>

      {generatedMessage && (
        <div className={styles.previewBox}>
          <h4><i className="fa-solid fa-message"></i> Template Pesan WhatsApp untuk Keluarga:</h4>
          <pre className={styles.messageBox}>{generatedMessage}</pre>
          <button type="button" className={styles.copyBtn} onClick={handleCopy}>
            <i className="fa-solid fa-copy"></i> Salin Pesan untuk WhatsApp
          </button>
        </div>
      )}
    </div>
  );
};

export default FamilyAlertGenerator;