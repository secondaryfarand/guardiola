import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AuthPage.module.css';

export default function AuthPage() {
  const navigate = useNavigate();
  const [isLoginMode, setIsLoginMode] = useState(true);

  // Form states
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Feedback states
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    const endpoint = isLoginMode ? '/api/v1/auth/login' : '/api/v1/auth/register';
    const payload = isLoginMode ? { email, password } : { username, email, password };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccessMsg(data.message);
        
        // Simpan data user ke localStorage (sederhana)
        localStorage.setItem('user', JSON.stringify(data.data));

        setTimeout(() => {
          // Arahkan ke halaman utama reverse setelah berhasil login/register
          navigate('/reverse');
        }, 1200);
      } else {
        setErrorMsg(data.message || 'Terjadi kesalahan.');
      }
    } catch (err) {
      console.error('Auth error:', err);
      setErrorMsg('Gagal terhubung ke server backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.brandHeader}>
          <i className="fa-solid fa-shield-halved" style={{ fontSize: '2rem', color: '#0C6038' }}></i>
          <h2>Guardiola Security Lab</h2>
          <p>{isLoginMode ? 'Masuk untuk melanjutkan simulasi siber' : 'Daftar akun baru untuk mulai berlatih'}</p>
        </div>

        {errorMsg && <div className={styles.alertError}>{errorMsg}</div>}
        {successMsg && <div className={styles.alertSuccess}>{successMsg}</div>}

        <form onSubmit={handleSubmit} className={styles.authForm}>
          {!isLoginMode && (
            <div className={styles.inputGroup}>
              <label>Username</label>
              <input 
                type="text" 
                placeholder="Masukkan username unik..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required={!isLoginMode}
              />
            </div>
          )}

          <div className={styles.inputGroup}>
            <label>Email</label>
            <input 
              type="email" 
              placeholder="nama@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Password</label>
            <input 
              type="password" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Memproses...' : (isLoginMode ? 'Masuk' : 'Daftar Akun')}
          </button>
        </form>

        <div className={styles.toggleMode}>
          <p>
            {isLoginMode ? 'Belum punya akun?' : 'Sudah punya akun?'}
            <button 
              type="button" 
              onClick={() => {
                setIsLoginMode(!isLoginMode);
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className={styles.toggleBtn}
            >
              {isLoginMode ? ' Daftar di sini' : ' Masuk'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}