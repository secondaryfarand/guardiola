import React from 'react';
import styles from './SimulatorComponent.module.css';

const ActionPicker = ({ data, onComplete }) => {
  return (
    <div className={styles.stepWrapper}>
      <h3 className={styles.promptText}>{data.prompt}</h3>
      <div className={styles.optionsGrid}>
        {data.options.map((opt, idx) => (
          <button
            key={idx}
            className={styles.optionCard}
            onClick={() => onComplete(opt.isCorrect, opt.feedback)}
          >
            {opt.text}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ActionPicker;