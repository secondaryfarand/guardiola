import React from 'react';
import styles from './ReportFilters.module.css';

const ReportFilters = ({ searchTerm, setSearchTerm, selectedCategory, setSelectedCategory }) => {
  const categories = ['All', 'Fake Giveaway / Phishing', 'Job Scam', 'Fake Wallet Voucher'];

  return (
    <div className={styles.filterSection}>
      <div className={styles.searchBox}>
        <i className="fa-solid fa-magnifying-glass"></i>
        <input 
          type="text" 
          placeholder="Cari berdasarkan URL atau deskripsi scam..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className={styles.categoryFilters}>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`${styles.filterChip} ${selectedCategory === cat ? styles.activeChip : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ReportFilters;