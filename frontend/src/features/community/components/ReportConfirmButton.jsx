import React, { useState } from 'react';
import styles from './ReportConfirmButton.module.css';

const ReportConfirmButton = ({ reportId, initialCount, initialStatus, onConfirm }) => {
  const [hasConfirmed, setHasConfirmed] = useState(false);

  const handleClick = () => {
    if (hasConfirmed) return;
    setHasConfirmed(true);
    onConfirm(reportId);
  };

  return (
    <button 
      className={`${styles.confirmBtn} ${hasConfirmed ? styles.confirmed : ''}`}
      onClick={handleClick}
      disabled={hasConfirmed}
    >
      <i className="fa-solid fa-thumbs-up"></i>
      {hasConfirmed ? 'Terkonfirmasi (+1)' : 'Saya Pernah Terima Ini!'}
    </button>
  );
};

export default ReportConfirmButton;