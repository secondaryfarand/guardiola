import React, { useState } from 'react';
import styles from './ReverseChatSimulator.module.css';

export default function ReverseChatSimulator({ scenario, onFinishSimulation }) {
  const [messages, setMessages] = useState([
    {
      sender: 'system',
      text: scenario.initialMessage || 'Halo, ada apa ya? Saya sedang sibuk bekerja.'
    }
  ]);
  
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [attemptCount, setAttemptCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isChatEnded, setIsChatEnded] = useState(false);
  const [simulationResult, setSimulationResult] = useState(null);

  const templates = scenario.templates || [
    "URGENT: Token m-banking Anda terblokir jika tidak konfirmasi sekarang!",
    "Halo Bpk/Ibu, ini dari pihak bank pusat, mohon kerjasamanya segera.",
    "Kak tolongin saya transfer sebentar dong, dompet saya ketinggalan di taksi."
  ];

  const handleSendMessage = async (textToSend) => {
    if (!textToSend.trim() || loading || isChatEnded) return;

    const newMessages = [...messages, { sender: 'user', text: textToSend }];
    setMessages(newMessages);
    setCustomMessage('');
    setLoading(true);
    const nextAttempt = attemptCount + 1;
    setAttemptCount(nextAttempt);

    try {
      // Panggil endpoint backend Express Anda yang sudah terhubung ke helper AI Gemini
      const res = await fetch('/api/v1/reverse/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          chatHistory: messages,
          scenarioData: scenario 
        })
      });

      const data = await res.json();

      if (data.success) {
        const updatedMessages = [...newMessages, { sender: 'system', text: data.reply }];
        setMessages(updatedMessages);

        // Jika sudah mencapai 3-4 kali interaksi, akhiri sesi dan berikan evaluasi
        if (nextAttempt >= 3) {
          const isSuccessfulScam = nextAttempt >= 3; // Logika evaluasi sederhana atau berdasarkan respons AI
          const resultData = {
            success: isSuccessfulScam,
            score: isSuccessfulScam ? 100 : 50,
            feedbackTitle: "Sesi Simulasi AI Selesai",
            feedbackDesc: "Anda telah menguji taktik manipulasi psikologis secara langsung berhadapan dengan target simulasi berbasis kecerdasan buatan (Gemini)."
          };
          setIsChatEnded(true);
          setSimulationResult(resultData);
        }
      } else {
        setMessages([...newMessages, { sender: 'system', text: "[Sistem: Gagal memproses respons AI]" }]);
      }
    } catch (err) {
      console.error("Gagal terhubung ke server backend AI:", err);
      setMessages([...newMessages, { sender: 'system', text: "[Sistem: Koneksi ke server terputus]" }]);
    } finally {
      setLoading(false);
    }
  };

  const handleProceedToScore = () => {
    if (onFinishSimulation) {
      onFinishSimulation(simulationResult);
    }
  };

  return (
    <div className={styles.chatWrapper}>
      <div className={styles.chatHeader}>
        <div className={styles.targetInfo}>
          <div className={styles.avatar}>T</div>
          <div>
            <h4>{scenario.targetName || 'Target Simulasi (AI Roleplay)'}</h4>
            <span className={styles.statusOnline}>● Status: Online (AI Active)</span>
          </div>
        </div>
        <div className={styles.attemptBadge}>Interaksi ke-{attemptCount}</div>
      </div>

      <div className={styles.chatBody}>
        {messages.map((msg, index) => (
          <div key={index} className={`${styles.messageRow} ${msg.sender === 'user' ? styles.rowUser : styles.rowSystem}`}>
            <div className={`${styles.bubble} ${msg.sender === 'user' ? styles.bubbleUser : styles.bubbleSystem}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && <div className={styles.loadingIndicator}>Target sedang mengetik respons...</div>}
      </div>

      {!isChatEnded ? (
        <div className={styles.chatFooter}>
          <div className={styles.templateSelector}>
            <span className={styles.labelTemplate}>Pilih Template Taktik Psikologis:</span>
            <select 
              className={styles.selectDropdown}
              onChange={(e) => {
                setSelectedTemplate(e.target.value);
                setCustomMessage(e.target.value);
              }}
              value={selectedTemplate}
              disabled={loading}
            >
              <option value="">-- Pilih atau edit template di bawah --</option>
              {templates.map((tpl, i) => (
                <option key={i} value={tpl}>{tpl}</option>
              ))}
            </select>
          </div>

          <div className={styles.inputGroup}>
            <input 
              type="text" 
              className={styles.textInput}
              placeholder="Ketik atau sesuaikan pesan manipulatif Anda..."
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(customMessage)}
              disabled={loading}
            />
            <button 
              className={styles.sendBtn}
              onClick={() => handleSendMessage(customMessage)}
              disabled={loading}
            >
              <i className="fa-solid fa-paper-plane"></i> Kirim
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.feedbackCard}>
          <h3>{simulationResult.feedbackTitle}</h3>
          <p>{simulationResult.feedbackDesc}</p>
          <div className={styles.scoreHighlight}>
            Skor Diperoleh: <strong>{simulationResult.score} Poin</strong>
          </div>
          <div>
            <button 
              className={styles.restartChatBtn}
              onClick={handleProceedToScore}
            >
              Lihat Rangkuman Hasil Akhir <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}