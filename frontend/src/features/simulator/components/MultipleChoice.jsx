import React, { useState } from 'react';
import styles from './SimulatorComponent.module.css';

const MultipleChoice = ({ data, onComplete }) => {
  const [selected, setSelected] = useState(null);

  const handleSubmit = () => {
    if (selected === null) return;
    const isCorrect = selected === data.correctAnswer;
    onComplete(isCorrect, isCorrect ? 'Jawaban Anda benar!' : 'Jawaban Anda kurang tepat.');
  };

  return (
    <div className={styles.stepWrapper}>
      <h3 className={styles.promptText}>{data.prompt}</h3>
      <div className={styles.optionsList}>
        {data.options.map((opt, idx) => (
          <label 
            key={idx} 
            className={`${styles.radioLabel} ${selected === idx ? styles.selected : ''}`}
          >
            <input
              type="radio"
              name="mcq"
              checked={selected === idx}
              onChange={() => setSelected(idx)}
            />
            <span>{opt}</span>
          </label>
        ))}
      </div>
      <button 
        className={styles.submitBtn} 
        onClick={handleSubmit}
        disabled={selected === null}
      >
        Kirim Jawaban
      </button>
    </div>
  );
};

export default MultipleChoice;