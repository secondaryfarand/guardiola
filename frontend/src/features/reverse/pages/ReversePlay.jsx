import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ActionPicker from '../../simulator/components/ActionPicker';
import MultipleChoice from '../components/MultipleChoice';
import ReverseChatSimulator from '../components/ReverseChatSimulator';
import styles from './ReversePlay.module.css';


export default function ReversePlay() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [activeScenario, setActiveScenario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  useEffect(() => {
    // Fetch detail skenario spesifik dari backend berdasarkan ID / slug
    fetch(`/api/v1/reverse/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setActiveScenario(data.data);
        } else {
          setError('Skenario tidak ditemukan di database.');
        }
      })
      .catch((err) => {
        console.error('Fetch detail error:', err);
        setError('Gagal terhubung ke server.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  const activeStep = activeScenario?.steps && activeScenario.steps.length > 0 
    ? activeScenario.steps[currentStepIndex] 
    : null;

  const handleAnswerComplete = (isCorrect, feedback, pointsEarned = 1) => {
    if (isCorrect) {
      setScore((prev) => prev + pointsEarned);
    }
    setFeedbackMessage(feedback);

    setTimeout(() => {
      setFeedbackMessage('');
      if (activeScenario.steps && currentStepIndex + 1 < activeScenario.steps.length) {
        setCurrentStepIndex((prev) => prev + 1);
      } else {
        setIsCompleted(true);
      }
    }, 2000);
  };

  const handleChatFinish = (result) => {
    if (result && result.success) {
      setScore((prev) => prev + result.score);
    }
    setTimeout(() => {
      setIsCompleted(true);
    }, 1500);
  };

  const handleRestart = () => {
    setCurrentStepIndex(0);
    setScore(0);
    setIsCompleted(false);
    setFeedbackMessage('');
  };

  if (loading) {
    return (
      <div className={styles.simulatorContainer}>
        <p className={styles.loadingText}>Memuat modul latihan dari database...</p>
      </div>
    );
  }

  if (error || !activeScenario) {
    return (
      <div className={styles.simulatorContainer}>
        <div className={styles.resultCard}>
          <h3>Skenario Tidak Ditemukan</h3>
          <p>{error || 'Modul simulasi yang Anda tuju tidak tersedia.'}</p>
          <button className={styles.menuBtn} onClick={() => navigate('/reverse')}>
            Kembali ke Menu Reverse
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.simulatorContainer}>
      <button onClick={() => navigate('/reverse')} className={styles.backButton}>
        <i className="fa-solid fa-arrow-left"></i> Kembali ke Menu Reverse Guardiola
      </button>

      <div className={styles.simulatorHeader}>
        <h2>{activeScenario.title}</h2>
        <p>{activeScenario.description}</p>
      </div>

      {!isCompleted ? (
        <div className={styles.simulatorCard}>
          <div className={styles.progressInfo}>
            <span>
              {activeScenario.type === 'CHAT_SIMULATION' 
                ? 'Mode Latihan: Live AI Chat Simulasi' 
                : `Langkah ${currentStepIndex + 1} dari ${activeScenario.steps?.length || 1}`}
            </span>
            <span>Akumulasi Skor: {score}</span>
          </div>

          {activeScenario.type === 'CHAT_SIMULATION' ? (
            <ReverseChatSimulator 
              scenario={activeScenario} 
              onFinishSimulation={handleChatFinish} 
            />
          ) : (
            <>
              {activeStep?.type === 'ACTION_PICKER' && (
                <ActionPicker data={activeStep} onComplete={handleAnswerComplete} />
              )}

              {activeStep?.type === 'MULTIPLE_CHOICE' && (
                <MultipleChoice data={activeStep} onComplete={handleAnswerComplete} />
              )}
            </>
          )}

          {feedbackMessage && (
            <div className={styles.feedbackBanner}>
              <p>{feedbackMessage}</p>
            </div>
          )}
        </div>
      ) : (
        <div className={styles.resultCard}>
          <h3>Simulasi Selesai</h3>
          <p>Anda telah menyelesaikan modul latihan Reverse Guardiola.</p>
          <div className={styles.scoreBox}>
            Total Skor Efektivitas Strategi: <strong>{score} Poin</strong>
          </div>
          <div className={styles.actionButtonGroup}>
            <button className={styles.restartBtn} onClick={handleRestart}>
              Ulangi Skenario
            </button>
            <button className={styles.menuBtn} onClick={() => navigate('/reverse')}>
              Pilih Menu Lain
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// import React, { useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import ActionPicker from '../../simulator/components/ActionPicker';
// import ReverseChatSimulator from '../components/ReverseChatSimulator'; 
// import MultipleChoice from '../components/MultipleChoice';
// import scenariosData from '../data/scenarios.json';
// import styles from './ReversePlay.module.css';


// export default function ReversePlay() {
//   const { slug } = useParams();
//   const navigate = useNavigate();

//   const activeScenario = scenariosData.find(s => s.id === slug) || scenariosData[0];
  
//   const [currentStepIndex, setCurrentStepIndex] = useState(0);
//   const [score, setScore] = useState(0);
//   const [isCompleted, setIsCompleted] = useState(false);
//   const [feedbackMessage, setFeedbackMessage] = useState('');

//   const activeStep = activeScenario?.steps ? activeScenario.steps[currentStepIndex] : null;

//   const handleAnswerComplete = (isCorrect, feedback, pointsEarned = 1) => {
//     if (isCorrect) {
//       setScore((prev) => prev + pointsEarned);
//     }
//     setFeedbackMessage(feedback);

//     setTimeout(() => {
//       setFeedbackMessage('');
//       if (currentStepIndex + 1 < activeScenario.steps.length) {
//         setCurrentStepIndex((prev) => prev + 1);
//       } else {
//         setIsCompleted(true);
//       }
//     }, 2000);
//   };

//   // Handler khusus saat simulasi chat selesai dijalankan oleh user
//   const handleChatFinish = (result) => {
//     if (result.success) {
//       setScore((prev) => prev + result.score);
//     }
//     // Langsung tandai simulasi selesai setelah chat interaktif beres
//     setTimeout(() => {
//       setIsCompleted(true);
//     }, 1500);
//   };

//   const handleRestart = () => {
//     setCurrentStepIndex(0);
//     setScore(0);
//     setIsCompleted(false);
//     setFeedbackMessage('');
//   };

//   if (!activeScenario) {
//     return (
//       <div className={styles.simulatorContainer}>
//         <div className={styles.resultCard}>
//           <h3>Skenario Tidak Ditemukan</h3>
//           <p>Modul simulasi yang Anda tuju tidak tersedia.</p>
//           <button className={styles.menuBtn} onClick={() => navigate('/reverse')}>
//             Kembali ke Menu Reverse
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className={styles.simulatorContainer}>
//       <button onClick={() => navigate('/reverse')} className={styles.backButton}>
//         <i className="fa-solid fa-arrow-left"></i> Kembali ke Menu Reverse Guardiola
//       </button>

//       <div className={styles.simulatorHeader}>
//         <h2>{activeScenario.title}</h2>
//         <p>{activeScenario.description}</p>
//       </div>

//       {!isCompleted ? (
//         <div className={styles.simulatorCard}>
//           <div className={styles.progressInfo}>
//             <span>
//               {activeScenario.type === 'CHAT_SIMULATION' 
//                 ? 'Mode Latihan: Live Chat Manipulasi' 
//                 : `Langkah ${currentStepIndex + 1} dari ${activeScenario.steps?.length || 1}`}
//             </span>
//             <span>Akumulasi Skor: {score}</span>
//           </div>

//           {/* Render Kondisional Berdasarkan Tipe Skenario atau Step */}
//           {activeScenario.type === 'CHAT_SIMULATION' ? (
//             <ReverseChatSimulator 
//               scenario={activeScenario} 
//               onFinishSimulation={handleChatFinish} 
//             />
//           ) : (
//             <>
//               {activeStep?.type === 'ACTION_PICKER' && (
//                 <ActionPicker data={activeStep} onComplete={handleAnswerComplete} />
//               )}

//               {activeStep?.type === 'MULTIPLE_CHOICE' && (
//                 <MultipleChoice data={activeStep} onComplete={handleAnswerComplete} />
//               )}
//             </>
//           )}

//           {feedbackMessage && (
//             <div className={styles.feedbackBanner}>
//               <p>{feedbackMessage}</p>
//             </div>
//           )}
//         </div>
//       ) : (
//         <div className={styles.resultCard}>
//           <h3>Simulasi Selesai</h3>
//           <p>Anda telah menyelesaikan modul latihan Reverse Guardiola.</p>
//           <div className={styles.scoreBox}>
//             Total Skor Efektivitas Strategi: <strong>{score} Poin</strong>
//           </div>
//           <div className={styles.actionButtonGroup}>
//             <button className={styles.restartBtn} onClick={handleRestart}>
//               Ulangi Skenario
//             </button>
//             <button className={styles.menuBtn} onClick={() => navigate('/reverse')}>
//               Pilih Menu Lain
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }