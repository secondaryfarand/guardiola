import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ReverseHub.module.css';

export default function ReverseHub() {
  const navigate = useNavigate();
  const [scenarios, setScenarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data dari endpoint backend MongoDB yang baru
    fetch('/api/v1/reverse/')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setScenarios(data.data);
        } else {
          setError('Gagal memuat data skenario dari database.');
        }
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        setError('Terjadi kesalahan koneksi ke server backend.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className={styles.hubContainer}>
        <p className={styles.loadingText}>Memuat skenario Reverse dari database MongoDB...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.hubContainer}>
        <p className={styles.errorText}>{error}</p>
      </div>
    );
  }

  return (
    <div className={styles.hubContainer}>
      <header className={styles.hubHeader}>
        <div className={styles.titleWrapper}>
          <i className="fa-solid fa-shield-halved" style={{ fontSize: '1.75rem', color: '#0C6038' }}></i>
          <h1>Guardiola Lab: Modul Reverse Simulation</h1>
        </div>
        <p>
          Pahami pola pikir dan taktik manipulasi penipu untuk memperkuat sistem pertahanan Anda. 
          Pilih skenario di bawah ini untuk memulai latihan strategi mitigasi interaktif.
        </p>
      </header>

      <div className={styles.warningBanner}>
        <i className="fa-solid fa-triangle-exclamation"></i>
        <span>Peringatan Etika: Modul ini murni untuk edukasi kesadaran siber di dalam ekosistem Guardiola.</span>
      </div>

      <div className={styles.scenarioGrid}>
        {scenarios.map((item) => (
          <div key={item.id} className={styles.scenarioCard}>
            <div className={styles.cardHeader}>
              <span className={styles.categoryBadge}>{item.category}</span>
              <span className={styles.difficultyBadge}>{item.difficulty || 'Interaktif'}</span>
            </div>

            <h3 className={styles.scenarioTitle}>{item.title}</h3>
            <p className={styles.scenarioDesc}>{item.description}</p>

            <button 
              className={styles.startBtn}
              onClick={() => navigate(`/reverse/${item.id}`)}
            >
              <i className="fa-solid fa-play"></i> Mulai Skenario Reverse
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}


// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import styles from './ReverseHub.module.css';

// export default function ReverseHub() {
//   const navigate = useNavigate();

//   const scenarios = [
//     {
//       id: 'phishing-email',
//       title: 'Kampanye Phishing Email & Credential Harvester',
//       category: 'Phishing',
//       difficulty: 'Menengah',
//       description: 'Pelajari bagaimana pelaku menyusun umpan email palsu yang meyakinkan untuk memanen kredensial login korban.',
//       path: '/reverse/phishing-email'
//     },
//     {
//       id: 'social-engineering-chat-1',
//       title: 'Manipulasi Psikologis via Chat (Social Engineering)',
//       category: 'Impersonation',
//       difficulty: 'Mahir',
//       description: 'Simulasikan percakapan persuasif untuk menguji bagaimana penipu memanfaatkan urgensi dan kepanikan.',
//       path: '/reverse/social-engineering-chat'
//     },
//     {
//       id: 'fake-job-portal',
//       title: 'Jebakan Lowongan Kerja Fiktif & Akomodasi Palsu',
//       category: 'JobScam',
//       difficulty: 'Pemula',
//       description: 'Pahami cara kerja sindikat penipuan rekrutmen dalam menjerat pencari kerja melalui biaya administrasi palsu.',
//       path: '/reverse/fake-job-portal'
//     },
//       {
//     "id": "social-engineering-chat",
//     "title": "Manipulasi Psikologis via Chat (Social Engineering)",
//     "category": "Impersonation",
//     "type": "CHAT_SIMULATION",
//     "description": "Simulasikan percakapan persuasif untuk menguji bagaimana penipu memanfaatkan urgensi dan kepanikan melalui aplikasi pesan.",
//     "targetName": "Bpk. Budi (Karyawan Bagian Keuangan)",
//     "initialMessage": "Halo, ini dengan Budi dari bagian keuangan. Ada yang bisa saya bantu terkait pesan Anda sebelumnya?",
//     "templates": [
//         "URGENT: Token m-banking perusahaan Anda terblokir sistem pusat jika tidak konfirmasi sekarang!",
//         "Halo Pak Budi, saya rekan direktur. Tolong transfer dana kilat ke rekening ini sekarang, sedang rapat darurat.",
//         "Selamat siang, paket dokumen rahasia perusahaan tertahan di ekspedisi, mohon segera transfer biaya administrasi."
//     ],
//     path: '/reverse/chat'
//   }
//   ];

//   return (
//     <div className={styles.hubContainer}>
//       <header className={styles.hubHeader}>
//         <div className={styles.titleWrapper}>
//           <i className="fa-solid fa-shield-halved" style={{ fontSize: '1.75rem', color: '#0C6038' }}></i>
//           <h1>Guardiola Lab: Modul Reverse Simulation</h1>
//         </div>
//         <p>
//           Pahami pola pikir dan taktik manipulasi penipu untuk memperkuat sistem pertahanan Anda. 
//           Semakin efektif strategi simulasi yang Anda pelajari, semakin tinggi skor pemahaman Anda.
//         </p>
//       </header>

//       <div className={styles.warningBanner}>
//         <i className="fa-solid fa-triangle-exclamation"></i>
//         <span>Peringatan Etika: Modul ini murni untuk edukasi kesadaran siber dan mitigasi ancaman di dalam ekosistem Guardiola.</span>
//       </div>

//       <div className={styles.scenarioGrid}>
//         {scenarios.map((item) => (
//           <div key={item.id} className={styles.scenarioCard}>
//             <div className={styles.cardHeader}>
//               <span className={styles.categoryBadge}>{item.category}</span>
//               <span className={styles.difficultyBadge}>{item.difficulty}</span>
//             </div>

//             <h3 className={styles.scenarioTitle}>{item.title}</h3>
//             <p className={styles.scenarioDesc}>{item.description}</p>

//             <button 
//               className={styles.startBtn}
//               onClick={() => navigate(item.path)}
//             >
//               <i className="fa-solid fa-play"></i> Mulai Skenario Reverse
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }