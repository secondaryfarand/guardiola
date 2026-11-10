import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './EdukasiFeed.module.css';

export default function EdukasiFeed() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchArticles = async () => {
        try {
            const response = await fetch('/api/v1/articles');
            
            if (!response.ok) {
            throw new Error('Gagal mengambil data dari server');
            }

            const result = await response.json();
            
            if (result.success) {
            setArticles(result.data);
            }
        } catch (err) {
            console.error('Error fetching articles:', err);
            setError('Gagal memuat data edukasi dari server.');
        } finally {
            setLoading(false);
        }
        };

        fetchArticles();
    }, []);

  return (
    <div className={styles.feedContainer}>
      <header className={styles.feedHeader}>
        <div className={styles.headerTitleWrapper}>
          <i className="fa-solid fa-books" style={{ fontSize: '1.5rem', color: '#0C6038' }}></i>
          <h1>Pusat Edukasi & Literasi Keamanan</h1>
        </div>
        <p>Jelajahi modul pencegahan dan panduan navigasi dari ancaman digital deception.</p>
      </header>

      {loading ? (
        <div className={styles.loadingState}>Memuat modul edukasi...</div>
      ) : (
        <div className={styles.feedList}>
          {articles.map((art) => (
            <article 
              key={art._id} 
              className={styles.feedCard}
              onClick={() => navigate(`/edukasi/${art.slug}`)}
            >
              <div className={styles.cardMeta}>
                <span className={styles.categoryBadge}>{art.category}</span>
                <span className={styles.dateText}>
                {art.createdAt ? (
                    new Date(art.createdAt).toLocaleDateString('id-ID', { 
                    day: 'numeric', 
                    month: 'short', 
                    year: 'numeric' 
                    })
                ) : (
                    'Tanggal tidak tersedia'
                )}
                </span>
              </div>

              <h2 className={styles.cardTitle}>{art.title}</h2>
              <p className={styles.cardSummary}>{art.summary}</p>

              {art.thumbnail?.url && (
                <div className={styles.thumbnailWrapper}>
                  <img src={art.thumbnail.url} alt={art.title} />
                </div>
              )}

              <div className={styles.cardFooter}>
                <div className={styles.statItem}>
                  <i className="fa-regular fa-heart"></i>
                  <span>{art.likes} Suka</span>
                </div>
                <div className={styles.statItem}>
                  <i className="fa-regular fa-comment"></i>
                  <span>{art.comments.length} Komentar</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}