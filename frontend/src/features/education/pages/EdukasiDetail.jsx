import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './EdukasiDetail.module.css';

export default function EdukasiDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false); 
  const [newComment, setNewComment] = useState({ name: '', comment: '' });

  useEffect(() => {
    const fetchArticleDetail = async () => {
      try {
        const response = await fetch(`/api/v1/articles/${slug}`);
        
        if (!response.ok) {
          throw new Error('Artikel tidak ditemukan');
        }

        const result = await response.json();
        if (result.success) {
          setArticle(result.data);
        }
      } catch (err) {
        console.error('Gagal memuat detail artikel:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticleDetail();
  }, [slug]);

  const handleLikeToggle = async () => {
    const nextIsLiked = !isLiked;

    try {
      const response = await fetch(`http://localhost:5000/api/v1/articles/${article._id}/like`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ increment: nextIsLiked }),
      });

      if (!response.ok) throw new Error('Gagal memperbarui status like');

      const result = await response.json();

      if (result.success) {
        setArticle(prev => ({ ...prev, likes: result.likes }));
        setIsLiked(nextIsLiked);

        const likedArticles = JSON.parse(localStorage.getItem('liked_articles') || '{}');
        if (nextIsLiked) {
          likedArticles[article._id] = true;
        } else {
          delete likedArticles[article._id];
        }
        localStorage.setItem('liked_articles', JSON.stringify(likedArticles));
      }
    } catch (err) {
      console.error('Gagal memproses like/unlike:', err);
    }
  };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.name || !newComment.comment) return;

        try {
        const response = await fetch(`/api/v1/articles/${article._id}/comments`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(newComment),
        });

        if (!response.ok) {
            throw new Error('Gagal mengirim komentar');
        }

        const result = await response.json();

        if (result.success) {
            setArticle(prev => ({
            ...prev,
            comments: [...prev.comments, result.data]
            }));
            
            // Reset form input
            setNewComment({ name: '', comment: '' });
        }
        } catch (err) {
        console.error('Gagal mengirim komentar ke database:', err);
        alert('Terjadi kesalahan saat mengirim komentar.');
        }
    };
  if (loading) return <div className={styles.loadingState}>Memuat modul artikel...</div>;
  if (!article) return <div className={styles.notFound}>Artikel tidak ditemukan.</div>;

  return (
    <div className={styles.detailContainer}>
      <button onClick={() => navigate('/edukasi')} className={styles.backButton}>
        <i className="fa-solid fa-arrow-left"></i> Kembali ke Feed
      </button>

      <div className={styles.articleHeader}>
        <span className={styles.categoryBadge}>{article.category}</span>
        <h1 className={styles.articleTitle}>{article.title}</h1>
        <div className={styles.authorMeta}>
          <span>Oleh {article.author}</span>
          <span>•</span>
          <span>{new Date(article.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
        </div>
      </div>

      <div className={styles.contentBody}>
        {article.contentBlocks.map((block, index) => {
          switch (block.type) {
            case 'header1': return <h2 key={index} className={styles.h1}>{block.value}</h2>;
            case 'header2': return <h3 key={index} className={styles.h2}>{block.value}</h3>;
            case 'header3': return <h4 key={index} className={styles.h3}>{block.value}</h4>;
            case 'paragraph': return <p key={index} className={styles.paragraph}>{block.value}</p>;
            case 'image': return (
              <figure key={index} className={styles.imageFigure}>
                <img src={block.url} alt={block.value} />
                {block.value && <figcaption>{block.value}</figcaption>}
              </figure>
            );
            case 'warning_box': return (
              <div key={index} className={styles.warningBox}>
                <i className="fa-solid fa-triangle-exclamation"></i>
                <div>{block.value}</div>
              </div>
            );
            default: return null;
          }
        })}
      </div>

      <div className={styles.interactionSection}>
        <button 
          onClick={handleLikeToggle} 
          className={styles.likeButton}
          style={isLiked ? { 
            backgroundColor: '#fff0f3', 
            borderColor: '#ff4d4f', 
            color: '#ff4d4f' 
          } : { 
            backgroundColor: '#f8f9fa', 
            borderColor: '#ddd', 
            color: '#333' 
          }}
        >
          <i className={isLiked ? "fa-solid fa-heart" : "fa-regular fa-heart"} style={{ color: '#ff4d4f' }}></i> 
          {isLiked ? 'Disukai' : 'Sukai Artikel'} ({article.likes})
        </button>
      </div>

      <section className={styles.commentsSection}>
        <h3>Komentar & Diskusi ({article.comments?.length || 0})</h3>
        
        <form onSubmit={handleCommentSubmit} className={styles.commentForm}>
          <input 
            type="text" 
            placeholder="Nama Anda" 
            value={newComment.name} 
            onChange={(e) => setNewComment({ ...newComment, name: e.target.value })}
            required 
          />
          <textarea 
            placeholder="Tulis tanggapan atau pertanyaan..." 
            value={newComment.comment} 
            onChange={(e) => setNewComment({ ...newComment, comment: e.target.value })}
            rows="3"
            required 
          />
          <button type="submit">Kirim Komentar</button>
        </form>

        <div className={styles.commentsList}>
          {article.comments?.map((c) => (
            <div key={c._id} className={styles.commentItem}>
              <div className={styles.commentHeader}>
                <strong>{c.name}</strong>
                <span>{new Date(c.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
              </div>
              <p>{c.comment}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}