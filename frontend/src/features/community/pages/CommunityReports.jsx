import React, { useState, useEffect } from 'react';
import AlertBanner from '../components/AlertBanner';
import ReportHeader from '../components/ReportHeader';
import ReportStats from '../components/ReportStats';
import ContributorBadge from '../components/ContributorBadge';
import ReportFilters from '../components/ReportFilters';
import ReportCard from '../components/ReportCard';
import ReportForm from '../components/ReportForm';
import ReportDetailModal from '../components/ReportDetailModal';
import Toast from '../components/Toast'; 
import styles from './CommunityReports.module.css';

const CommunityReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [toastMessage, setToastMessage] = useState('');
  const [userContributionCount, setUserContributionCount] = useState(2);

  // --- BASE URL API DINAMIS (Support Local & Vercel Production) ---
  // Jika VITE_API_URL diset di environment Vercel, gunakan itu. Jika tidak, fallback ke localhost.
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  // --- 1. AMBIL DATA DARI BACKEND (MENGGUNAKAN API DINAMIS) ---
  const fetchReports = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/community`);
      const result = await response.json();
      
      if (result.success) {
        setReports(result.data);
      }
    } catch (error) {
      console.error('Gagal memuat data laporan dari server:', error);
      triggerToast('Gagal terhubung ke database server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleAddNewReport = (newReportData) => {
    setReports((prevReports) => {
      const existingIndex = prevReports.findIndex(
        (item) => item._id === newReportData._id || item.target === newReportData.target
      );

      if (existingIndex !== -1) {
        const updatedReports = [...prevReports];
        updatedReports[existingIndex] = newReportData;
        return updatedReports;
      } else {
        return [newReportData, ...prevReports]; 
      }
    });

    setUserContributionCount((prev) => prev + 1);
    triggerToast('Laporan berhasil dikirim ke jaringan global Guardiola!');
  };
  const handleConfirmThreat = async (reportId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/community/${reportId}/confirm`, {
        method: 'PATCH',
      });
      const result = await response.json();

      if (result.success) {
        setReports((prevReports) =>
          prevReports.map((item) => (item.reportId === reportId ? result.data : item))
        );
        setUserContributionCount((prev) => prev + 1);
        triggerToast('Konfirmasi ancaman berhasil dicatat! Terima kasih.');
      }
    } catch (error) {
      console.error('Gagal mengonfirmasi ancaman:', error);
      triggerToast('Gagal memproses konfirmasi ke server.');
    }
  };

  const filteredReports = reports.filter((item) => {
    const matchesSearch = item.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className={styles.container}>
      <AlertBanner />
      <ReportHeader onOpenModal={() => setIsModalOpen(true)} />
      <ReportStats />
      
      <ContributorBadge userReportsCount={userContributionCount} />
      <ReportFilters 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
        selectedCategory={selectedCategory} 
        setSelectedCategory={setSelectedCategory} 
      />

      <div className={styles.feedSection}>
        <h3>🚨 Laporan Ancaman Terbaru dari Komunitas ({filteredReports.length})</h3>
        
        {loading ? (
          <div className={styles.emptyState}>
            <i className="fa-solid fa-spinner fa-spin"></i>
            <p>Memuat data keamanan dari database server...</p>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className={styles.emptyState}>
            <i className="fa-solid fa-circle-exclamation"></i>
            <p>Tidak ada laporan ancaman yang cocok dengan pencarian atau filter kamu.</p>
          </div>
        ) : (
          <div className={styles.feedList}>
            {filteredReports.map((item, index) => (
              <ReportCard 
                key={item._id || item.reportId || index} 
                item={{ ...item, id: item.reportId }} 
                onSelectDetail={(report) => setSelectedReport(report)} 
                onConfirmThreat={handleConfirmThreat}
              />
            ))}
          </div>
        )}
      </div>

      <ReportForm 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onReportSubmit={handleAddNewReport} 
      />

      <ReportDetailModal 
        report={selectedReport} 
        onClose={() => setSelectedReport(null)} 
      />
      <Toast message={toastMessage} />
    </div>
  );
};

export default CommunityReports;