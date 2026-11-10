import React, { useEffect, useState } from 'react';
import styles from './Toast.module.css';

const Toast = ({ message, type = 'success' }) => {
  const [visible, setVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    if (!message) {
      setVisible(false);
      return;
    }

    setVisible(true);
    setIsLeaving(false);

    const fadeTimer = setTimeout(() => {
      setIsLeaving(true);
    }, 2500);

    const removeTimer = setTimeout(() => {
      setVisible(false);
    }, 2800);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [message]);

  if (!visible) return null;

  return (
    <div className={`${styles.toastContainer} ${isLeaving ? styles.leave : ''}`}>
      <i className="fa-solid fa-circle-check"></i>
      <span>{message}</span>
    </div>
  );
};

export default Toast;