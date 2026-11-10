// import React, { useState } from 'react';
// import styles from './InspectorForm.module.css';

// const InspectorForm = ({ initialInput = '', onResult  }) => {
//   const [inputData, setInputData] = useState('');
//   const [inputType, setInputType] = useState('url');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   React.useEffect(() => {
//     if (initialInput) {
//       setInputData(initialInput);
//       setInputType(initialInput.includes('http') || initialInput.includes('www.') ? 'url' : 'text');
//     }
//   }, [initialInput]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!inputData.trim()) {
//       setError('Harap masukkan tautan atau teks yang ingin diperiksa.');
//       return;
//     }
//     setError('');
//     setLoading(true);

//     try {
//       const response = await fetch('http://localhost:5000/api/v1/inspector/scan', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ inputData, inputType }),
//       });

//       const data = await response.json();
//       if (data.status === 'success') {
//         onResult(data.data);
//       } else {
//         setError(data.message || 'Terjadi kesalahan pada sistem.');
//       }
//     } catch (err) {
//       setError('Gagal terhubung ke server backend. Pastikan server Express aktif.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className={styles.inspectorCard}>
//       <div className={styles.headerTitle}>
//         <i className="fa-solid fa-satellite-dish"></i>
//         <h2>Universal URL & Text Inspector</h2>
//       </div>
//       <p className={styles.subtitle}>
//         Tempelkan tautan, pesan giveaway, atau chat mencurigakan di bawah untuk mendeteksi potensi ancaman secara instan.
//       </p>

//       <form onSubmit={handleSubmit} className={styles.form}>
//         <div className={styles.typeSelector}>
//           <button
//             type="button"
//             className={`${styles.typeBtn} ${inputType === 'url' ? styles.active : ''}`}
//             onClick={() => setInputType('url')}
//           >
//             <i className="fa-solid fa-link"></i> URL / Tautan
//           </button>
//           <button
//             type="button"
//             className={`${styles.typeBtn} ${inputType === 'text' ? styles.active : ''}`}
//             onClick={() => setInputType('text')}
//           >
//             <i className="fa-solid fa-message"></i> Pesan Teks / Chat
//           </button>
//         </div>

//         <div className={styles.inputGroup}>
//           <textarea
//             className={styles.textarea}
//             rows="4"
//             placeholder={
//               inputType === 'url'
//                 ? 'Contoh: https://bit.ly/menang-hadiah-palsu'
//                 : 'Contoh: SELAMAT ANDA MENANG! Hadiah tunai 50 juta, segera klaim dalam 1x24 jam...'
//             }
//             value={inputData}
//             onChange={(e) => setInputData(e.target.value)}
//           ></textarea>
//         </div>

//         {error && (
//           <div className={styles.errorAlert}>
//             <i className="fa-solid fa-triangle-exclamation"></i> {error}
//           </div>
//         )}

//         <button type="submit" className={styles.submitBtn} disabled={loading}>
//           {loading ? (
//             <>
//               <i className="fa-solid fa-spinner fa-spin"></i> Memindai Ancaman...
//             </>
//           ) : (
//             <>
//               <i className="fa-solid fa-shield-virus"></i> Analisis Risiko Sekarang
//             </>
//           )}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default InspectorForm;

  import React, { useState, useEffect } from 'react';
  import { createWorker } from 'tesseract.js';
  import styles from './InspectorForm.module.css';

  const InspectorForm = ({ initialInput = '', onResult }) => {
    const [activeTab, setActiveTab] = useState('url'); // 'url', 'text', atau 'ocr'
    
    // Inisialisasi state langsung dengan initialInput jika ada (untuk fitur redirect ekstensi)
    const [urlInput, setUrlInput] = useState(initialInput);
    const [textInput, setTextInput] = useState('');
    const [extractedUrl, setExtractedUrl] = useState('');
    
    const [loading, setLoading] = useState(false);
    const [ocrLoading, setOcrLoading] = useState(false);
    const [ocrProgress, setOcrProgress] = useState(0);
    const [error, setError] = useState('');

    // 🌟 REGEX YANG LEBIH CERDAS & KUAT: Mendeteksi http, https, www, atau domain ber-TLD
    const extractUrlFromString = (text) => {
      if (!text) return '';
      const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9][-a-zA-Z0-9]*\.[a-zA-Z]{2,}(?:\/[^\s]*)?)/i;
      const match = text.match(urlRegex);
      if (match) {
        // Bersihkan tanda baca di akhir URL (seperti titik, koma, atau tanda kurung)
        return match[0].replace(/[.,;:!?)]+$/, '');
      }
      return '';
    };

    // Penanganan saat teks chat diubah atau hasil OCR masuk
    const handleTextChange = (text) => {
      setTextInput(text);
      const foundUrl = extractUrlFromString(text);
      setExtractedUrl(foundUrl);
      
      // 🌟 SINKRONISASI OTOMATIS: Jika ditemukan URL, langsung isi juga state urlInput
      if (foundUrl) {
        setUrlInput(foundUrl);
      }
    };
    // Fungsi pemrosesan OCR dengan Tesseract.js
    const processImageFile = async (file) => {
      if (!file || !file.type.startsWith('image/')) {
        setError('Harap unggah file gambar yang valid.');
        return;
      }

      setError('');
      setOcrLoading(true);
      setOcrProgress(0);

      try {
        const worker = await createWorker(['ind', 'eng']);
        setOcrProgress(30);
        const ret = await worker.recognize(file);
        setOcrProgress(90);

        const recognizedText = ret.data.text;
        await worker.terminate();

        // Masukkan teks ke textInput dan ekstrak URL-nya secara otomatis
        handleTextChange(recognizedText);
        setOcrProgress(100);
      } catch (err) {
        console.error("OCR Error:", err);
        setError('Gagal membaca teks dari gambar. Pastikan gambar jelas.');
      } finally {
        setOcrLoading(false);
      }
    };

    // Mencegah perilaku default browser saat file diseret (drag & drop)
    const handleDragOver = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        processImageFile(files[0]);
      }
    };

    const handleFileInputChange = (e) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        processImageFile(files[0]);
      }
    };

    // Sinkronisasi reaktif jika parameter initialInput berubah / masuk dari ekstensi
    const runScanForUrl = async (urlToScan) => {
      if (!urlToScan.trim()) return;

      setError('');
      setLoading(true);

      try {
        const response = await fetch('http://localhost:5000/api/v1/inspector/scan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            inputData: urlToScan,
            inputType: 'url',
            extractedUrl: urlToScan
          }),
        });

        const result = await response.json();
        if (result.status === 'success') {
          onResult(result.data); // Langsung kirim hasil ke komponen parent untuk menampilkan skor!
        } else {
          setError(result.message || 'Terjadi kesalahan pada sistem.');
        }
      } catch (err) {
        setError('Gagal terhubung ke server backend.');
      } finally {
        setLoading(false);
      }
    };

  // 🌟 SINKRONISASI & AUTO-SCAN: Menangkap parameter ?inspect= dari ekstensi Guardiola
    useEffect(() => {
      // Cek apakah ada parameter ?inspect= di URL browser
      const params = new URLSearchParams(window.location.search);
      const redirectUrl = params.get('inspect');

      if (redirectUrl) {
        setUrlInput(redirectUrl);
        setActiveTab('url');
        // Otomatis jalankan pemindaian agar skor langsung muncul!
        runScanForUrl(redirectUrl);
      } else if (initialInput) {
        setUrlInput(initialInput);
        setActiveTab('url');
      }
    }, [initialInput]);

    const executeScan = async (e) => {
      e.preventDefault();

      let finalInputData = '';
      let finalExtractedUrl = '';

      if (activeTab === 'url') {
        finalInputData = urlInput;
        finalExtractedUrl = urlInput;
      } else {
        finalInputData = textInput;
        finalExtractedUrl = extractedUrl;
      }

      if (!finalInputData.trim()) {
        setError('Harap masukkan data atau teks yang ingin diperiksa.');
        return;
      }

      // Panggil fungsi pemindaian
      runScanForUrl(finalInputData);
    };

    return (
      <div className={styles.inspectorCard}>
        <div className={styles.headerTitle}>
          <i className="fa-solid fa-radar"></i>
          <h2>Universal URL & Text Inspector</h2>
        </div>
        <p className={styles.subtitle}>
          Analisis ganda berbasis AI: Deteksi psikologis chat & karakteristik tautan (Mendukung OCR Screenshot).
        </p>

        {/* Tab Selector */}
        <div className={styles.typeSelector}>
          <button
            type="button"
            className={`${styles.typeBtn} ${activeTab === 'url' ? styles.active : ''}`}
            onClick={() => { setActiveTab('url'); setError(''); }}
          >
            <i className="fa-solid fa-link"></i> URL / Tautan
          </button>
          <button
            type="button"
            className={`${styles.typeBtn} ${activeTab === 'text' ? styles.active : ''}`}
            onClick={() => { setActiveTab('text'); setError(''); }}
          >
            <i className="fa-solid fa-message"></i> Pesan Teks / Chat
          </button>
          <button
            type="button"
            className={`${styles.typeBtn} ${activeTab === 'ocr' ? styles.active : ''}`}
            onClick={() => { setActiveTab('ocr'); setError(''); }}
          >
            <i className="fa-solid fa-file-image"></i> Upload Screenshot (OCR)
          </button>
        </div>

        <form onSubmit={executeScan} className={styles.form}>
          <div className={styles.inputGroup}>
            
            {/* 1. TAB URL: Input satu baris yang langsung terikat dengan urlInput */}
            {activeTab === 'url' && (
              <input
                type="text"
                className={styles.singleInput}
                placeholder="Masukkan tautan (contoh: https://contoh.com)..."
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
              />
            )}

            {/* 2. TAB TEKS CHAT */}
            {activeTab === 'text' && (
              <textarea
                className={styles.textarea}
                rows="5"
                placeholder="Tempel (paste) isi pesan WhatsApp atau chat mencurigakan di sini..."
                value={textInput}
                onChange={(e) => handleTextChange(e.target.value)}
              ></textarea>
            )}

            {/* 3. TAB OCR SCREENSHOT */}
            {activeTab === 'ocr' && (
              <div className={styles.ocrUploadContainer}>
                <label 
                  className={styles.ocrDropzone}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <i className="fa-solid fa-cloud-arrow-up fa-2x" style={{ color: 'var(--accent-gold)' }}></i>
                  <span>{ocrLoading ? `Memproses OCR (${ocrProgress}%)...` : 'Seret & letakkan screenshot di sini, atau klik untuk memilih file'}</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileInputChange} 
                    disabled={ocrLoading}
                    style={{ display: 'none' }} 
                  />
                </label>

                <textarea
                  className={styles.textarea}
                  rows="4"
                  placeholder="Hasil teks dari gambar akan muncul di sini secara otomatis..."
                  value={textInput}
                  onChange={(e) => handleTextChange(e.target.value)}
                ></textarea>
              </div>
            )}
          </div>

          {/* 🌟 FIELD DINAMIS URL TERPISAH: Otomatis muncul jika teks/OCR mendeteksi URL */}
          {activeTab !== 'url' && extractedUrl && (
            <div className={styles.dynamicUrlGroup}>
              <label className={styles.dynamicLabel}>
                <i className="fa-solid fa-globe" style={{ color: 'var(--accent-gold)' }}></i> Tautan Berhasil Dipisahkan dari Teks:
              </label>
              <input
                type="text"
                className={styles.extractedInput}
                value={extractedUrl}
                onChange={(e) => setExtractedUrl(e.target.value)}
                placeholder="URL terdeteksi..."
              />
              <small className={styles.hintText}>Tautan ini akan dianalisis karakteristik infrastrukturnya secara terpisah.</small>
            </div>
          )}

          {error && (
            <div className={styles.errorAlert}>
              <i className="fa-solid fa-triangle-exclamation"></i> {error}
            </div>
          )}

          <button type="submit" className={styles.submitBtn} disabled={loading || ocrLoading}>
            {loading ? (
              <>
                <i className="fa-solid fa-spinner fa-spin"></i> Menjalankan Analisis Ganda...
              </>
            ) : (
              <>
                <i className="fa-solid fa-shield-virus"></i> Analisis Risiko Sekarang
              </>
            )}
          </button>
        </form>
      </div>
    );
  };

  export default InspectorForm;