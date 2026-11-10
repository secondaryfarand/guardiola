import React, { useState } from 'react';
import styles from './MultipleChoice.module.css';

export default function MultipleChoice({ data, onComplete }) {
  const [selectedOptionId, setSelectedOptionId] = useState(null);

  const handleSelect = (option) => {
    // Pastikan yang disimpan atau diproses adalah nilai primitif / objek pilihannya
    setSelectedOptionId(option.id);
    
    // Kirim data ke parent (ReversePlay)
    onComplete(option.isCorrect, option.feedback, option.points);
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.question}>{data.question}</h3>
      <div className={styles.optionsList}>
        {data.options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => handleSelect(opt)}
            disabled={selectedOptionId !== null}
            className={`${styles.optionBtn} ${
              selectedOptionId === opt.id 
                ? (opt.isCorrect ? styles.correct : styles.incorrect) 
                : ''
            }`}
          >
            {/* PASTIKAN MENGGUNAKAN opt.text (STRING), BUKAN MERENDER {opt} LANGSUNG */}
            {opt.text}
          </button>
        ))}
      </div>
    </div>
  );
}