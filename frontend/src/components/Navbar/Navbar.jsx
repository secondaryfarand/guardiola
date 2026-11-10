import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/auth');
  };

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <nav className={styles.navbar}>
      <div className={styles.brand} onClick={() => navigate('/')}>
        {/* <i className="fa-solid fa-shield-halved" style={{ color: 'var(--accent-gold)' }}></i> */}
        <span>Guardiola</span>
      </div>

      <button className={styles.mobileToggle} onClick={toggleMenu} aria-label="Toggle Menu">
        <i className={`fa-solid ${isMobileMenuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
      </button>

      <div className={`${styles.navLinks} ${isMobileMenuOpen ? styles.navLinksActive : ''}`}>
        <Link 
          to="/" 
          className={`${styles.navLink} ${location.pathname === '/' ? styles.active : ''}`}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <i className="fa-solid fa-magnifying-glass"></i> Inspector
        </Link>
        <Link 
          to="/community" 
          className={`${styles.navLink} ${location.pathname === '/community' ? styles.active : ''}`}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <i className="fa-solid fa-users-rectangle"></i> Community
        </Link>
        <a 
          href="/edukasi" 
          className={styles.navLink}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <i className="fa-solid fa-book"></i> Edukasi
        </a>
        <Link 
          to="/simulator" 
          className={`${styles.navLink} ${location.pathname === '/simulator' ? styles.active : ''}`}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <i className="fa-solid fa-graduation-cap"></i> Lab
        </Link>
        <Link 
          to="/reverse" 
          className={`${styles.navLink} ${location.pathname.startsWith('/reverse') ? styles.active : ''}`}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <i className="fa-solid fa-shield-cat"></i> Reverse Lab
        </Link>

        <div className={styles.authSection}>
          {user ? (
            <div className={styles.userProfile}>
              <span className={styles.userName}>{user.username || 'User'}</span>
              <button onClick={handleLogout} className={styles.logoutBtn} title="Keluar">
                <i className="fa-solid fa-right-from-bracket"></i>
              </button>
            </div>
          ) : (
            <Link to="/auth" className={styles.loginBtn} onClick={() => setIsMobileMenuOpen(false)}>
              Masuk
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}