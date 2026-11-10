import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import InspectorPage from './features/inspector/pages/InspectorPage';
import ContextModulesPage from './features/contextModules/pages/ContextModulesPage';
import CommunityReports from './features/community/pages/CommunityReports'; 
import SimulatorPage from './features/simulator/pages/SimulatorPage'; 

import styles from './App.module.css';
import EdukasiFeed from './features/education/pages/EdukasiFeed';
import EdukasiDetail from './features/education/pages/EdukasiDetail';
import ReverseHub from './features/reverse/pages/ReverseHub';
import ReversePlay from './features/reverse/pages/ReversePlay';
import AuthPage from './features/auth/pages/AuthPage';

function App() {
  return (
    <Router>
      <div className={styles.appContainer}>
        <Navbar />
        <main>
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            {/* Route Halaman Utama (Inspector + Context Modules) */}
            <Route path="/" element={
              <>
                <InspectorPage />
                <ContextModulesPage />
              </>
            } />

            {/* Route Halaman Pelaporan Komunitas */}
            <Route path="/community" element={
              <CommunityReports onOpenReportModal={() => {
                // Di sini kamu bisa trigger state modal jika ingin dibuka langsung dari halaman
                console.log("Buka modal laporan");
              }} />
            } />

            <Route path="/simulator" element={<SimulatorPage />} />

            <Route path="/edukasi" element={<EdukasiFeed />} />
            <Route path="/edukasi/:slug" element={<EdukasiDetail />} />
            <Route path="/reverse" element={<ReverseHub />} />
            {/* <Route path="/reverse/:scenarioId" element={<ReversePlay />} /> */}
            <Route path="/reverse/:slug" element={<ReversePlay />} />
          </Routes>
        </main>
        <footer className={styles.footer}>
          <p><i className="fa-regular fa-copyright"></i> 2026 Guardiola. National Cyber Security Competition Project.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;