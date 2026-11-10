import React, { useState } from 'react';
import ActionPicker from '../components/ActionPicker';
import MultipleChoice from '../components/MultipleChoice';
import scenariosData from '../data/scenarios.json';
import styles from './SimulatorPage.module.css';

const SimulatorPage = () => {
  // Untuk saat ini kita ambil skenario pertama dari file JSON (bisa diperluas jadi pilihan list skenario nanti)
  const [activeScenario] = useState(scenariosData[0]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const activeStep = activeScenario.steps[currentStepIndex];

  // Penanganan saat jawaban dikirim dari komponen anak
  const handleAnswerComplete = (isCorrect, feedback) => {
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
    setFeedbackMessage(feedback);

    // Beri jeda sejenak untuk menampilkan feedback sebelum lanjut ke step berikutnya
    setTimeout(() => {
      setFeedbackMessage('');
      if (currentStepIndex + 1 < activeScenario.steps.length) {
        setCurrentStepIndex((prev) => prev + 1);
      } else {
        setIsCompleted(true);
      }
    }, 2000);
  };

  // Tombol untuk mengulang simulasi
  const handleRestart = () => {
    setCurrentStepIndex(0);
    setScore(0);
    setIsCompleted(false);
    setFeedbackMessage('');
  };

  return (
    <div className={styles.simulatorContainer}>
      <div className={styles.simulatorHeader}>
        <h2>🛡️ Lab Simulasi Keamanan: {activeScenario.title}</h2>
        <p>{activeScenario.description}</p>
      </div>

      {!isCompleted ? (
        <div className={styles.simulatorCard}>
          <div className={styles.progressInfo}>
            <span>Langkah {currentStepIndex + 1} dari {activeScenario.steps.length}</span>
            <span>Skor Sementara: {score}</span>
          </div>

          {/* Render Komponen Interaktif Berdasarkan Tipe Step */}
          {activeStep.type === 'ACTION_PICKER' && (
            <ActionPicker data={activeStep} onComplete={handleAnswerComplete} />
          )}

          {activeStep.type === 'MULTIPLE_CHOICE' && (
            <MultipleChoice data={activeStep} onComplete={handleAnswerComplete} />
          )}

          {/* Banner Feedback Interaktif */}
          {feedbackMessage && (
            <div className={styles.feedbackBanner}>
              <p>{feedbackMessage}</p>
            </div>
          )}
        </div>
      ) : (
        /* Tampilan Hasil Akhir / Selesai */
        <div className={styles.resultCard}>
          <h3>🎉 Simulasi Selesai!</h3>
          <p>Terima kasih telah menyelesaikan modul latihan keamanan siber ini.</p>
          <div className={styles.scoreBox}>
            Skor Akhir Anda: <strong>{score} / {activeScenario.steps.length}</strong>
          </div>
          <button className={styles.restartBtn} onClick={handleRestart}>
            Ulangi Simulasi
          </button>
        </div>
      )}
    </div>
  );
};

export default SimulatorPage;